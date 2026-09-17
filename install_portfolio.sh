#!/usr/bin/env bash
set -Eeuo pipefail

# Instala o portfólio em um container próprio e publica o domínio informado
# através do Nginx existente. Não reinicia a VPS nem altera outros projetos.

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly APP_NAME="viberdev-portfolio"
readonly CONTAINER_NAME="viberdev-portfolio"
readonly IMAGE_NAME="viberdev-portfolio:latest"
readonly APP_PORT="18080"
readonly NGINX_CONF="/etc/nginx/sites-available/${APP_NAME}.conf"
readonly NGINX_LINK="/etc/nginx/sites-enabled/${APP_NAME}.conf"

log() { printf '[portfolio] %s\n' "$*"; }
die() { printf '[portfolio] ERRO: %s\n' "$*" >&2; exit 1; }

[[ "${EUID}" -eq 0 ]] || die "execute como root: sudo ./install_portfolio.sh [dominio]"

DOMAIN="${1:-}"
if [[ -z "${DOMAIN}" ]]; then
  read -r -p "Domínio do portfólio (ex.: viberdev.pro): " DOMAIN
fi
DOMAIN="${DOMAIN,,}"
DOMAIN="${DOMAIN#http://}"
DOMAIN="${DOMAIN#https://}"
DOMAIN="${DOMAIN%%/*}"
[[ "${DOMAIN}" =~ ^([a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$ ]] || die "domínio inválido: ${DOMAIN}"

command -v apt-get >/dev/null 2>&1 || die "este instalador espera Ubuntu/Debian com apt-get"

if ! command -v docker >/dev/null 2>&1; then
  log "Docker não encontrado; instalando o pacote da distribuição"
  apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y docker.io
  systemctl enable --now docker
fi
docker info >/dev/null 2>&1 || die "Docker não está disponível para esta sessão"

[[ -f "${SCRIPT_DIR}/Dockerfile" ]] || die "Dockerfile não encontrado em ${SCRIPT_DIR}"
[[ -d "${SCRIPT_DIR}/dist" ]] || die "dist/ não encontrado; gere o site antes da instalação"

log "Construindo a imagem do portfólio"
docker build --pull -t "${IMAGE_NAME}" "${SCRIPT_DIR}"

if docker container inspect "${CONTAINER_NAME}" >/dev/null 2>&1; then
  managed="$(docker inspect -f '{{ index .Config.Labels "com.humberto.portfolio.managed" }}' "${CONTAINER_NAME}" 2>/dev/null || true)"
  [[ "${managed}" == "true" ]] || die "já existe um container ${CONTAINER_NAME} que não foi criado por este script"
  log "Atualizando somente o container ${CONTAINER_NAME}"
  docker rm -f "${CONTAINER_NAME}" >/dev/null
fi

log "Iniciando o container isolado em 127.0.0.1:${APP_PORT}"
docker run -d \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  --label com.humberto.portfolio.managed=true \
  --label com.humberto.portfolio.domain="${DOMAIN}" \
  --env "SITE_URL=https://${DOMAIN}" \
  -p "127.0.0.1:${APP_PORT}:80" \
  "${IMAGE_NAME}" >/dev/null

if ! command -v nginx >/dev/null 2>&1; then
  if ss -ltnH '( sport = :80 )' | grep -q .; then
    die "Nginx não está instalado e a porta 80 já está ocupada; nenhum proxy foi alterado"
  fi
  log "Nginx não encontrado; instalando o pacote da distribuição"
  apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y nginx
fi

mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
if [[ -e "${NGINX_CONF}" && ! -L "${NGINX_CONF}" ]]; then
  cp -a "${NGINX_CONF}" "${NGINX_CONF}.bak.$(date +%Y%m%d%H%M%S)"
fi

cat > "${NGINX_CONF}" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX
ln -sfn "${NGINX_CONF}" "${NGINX_LINK}"

if nginx -t; then
  systemctl reload nginx
else
  rm -f "${NGINX_LINK}"
  die "configuração Nginx rejeitada; o container continua ativo em 127.0.0.1:${APP_PORT}"
fi

if ! curl -fsS --max-time 10 "http://127.0.0.1:${APP_PORT}/health" >/dev/null; then
  die "container iniciou, mas o health check falhou"
fi

cat <<INFO

Instalação concluída.

Domínio selecionado: https://${DOMAIN}
Container: ${CONTAINER_NAME}
Porta interna: 127.0.0.1:${APP_PORT}
Configuração Nginx: ${NGINX_CONF}

Próximos passos:
1. Aponte o registro A de ${DOMAIN} para o IP desta VPS.
2. Configure HTTPS no proxy existente ou emita um certificado para ${DOMAIN}.
3. Teste: curl -I http://${DOMAIN}/health

Para atualizar depois, execute novamente este mesmo script com o domínio:
sudo ./install_portfolio.sh ${DOMAIN}
INFO

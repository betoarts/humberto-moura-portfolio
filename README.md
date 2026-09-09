# Humberto Moura Neto — Portfólio

Portfólio interativo de Humberto Moura Neto, desenvolvedor e criador de produtos digitais. Reúne aplicações de service desk, operação de restaurantes, gestão de frota, sinalização digital, automação e IA.

## Destaques

- Oito projetos com detalhes técnicos e contato contextual pelo WhatsApp.
- Simulações interativas inspiradas em AssetTrack TI, Restaurant Queue, HabitFlow e LocalTV.
- Layout responsivo, acessível e otimizado para dispositivos móveis.
- Botão de contato por WhatsApp com posicionamento seguro para telas mobile.
- Implantação pronta para EasyPanel com Docker e Nginx.

## Publicação no EasyPanel

O projeto é estático e não requer banco de dados. Configure `SITE_URL` com o domínio HTTPS público para habilitar canonical, sitemap e prévias de compartilhamento.

1. Crie uma aplicação a partir deste repositório.
2. Selecione a implantação por `Dockerfile`.
3. Configure a porta interna `80`.
4. Use `/health` como health check.
5. Vincule seu domínio e habilite HTTPS.

Veja instruções complementares em [DEPLOY_EASYPANEL.md](DEPLOY_EASYPANEL.md).

## Experiência e direção visual

Interface escura com painéis translúcidos, fundo fotográfico local com blur, animações de entrada e profundidade discreta. Seções de serviços, processo, perguntas frequentes e escolha de interesse ajudam o visitante a iniciar uma conversa sobre seu projeto.

HTML, CSS e JavaScript nativos, sem dependência de framework de animação. Respeita movimento reduzido; inclui navegação por teclado e adaptação para celular. A Apple Brasil foi consultada como referência de apresentação de produtos; não se trata de reprodução de seu código ou stack interna.

As oito capas e o retrato são locais, com variantes WebP responsivas, dimensões declaradas e carregamento sob demanda. Os cards já estão no HTML inicial. Assets com hash recebem cache longo; HTML é revalidado e comprimido pelo Nginx. Uma capa social em JPEG é usada nas prévias de compartilhamento quando `SITE_URL` está configurado.

## Tecnologias

HTML, CSS, JavaScript, Docker e Nginx.

## Execução local

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

Abra `http://localhost:3000` no navegador.

## Documentação do projeto

- [Estado atual da construção](docs/PROJECT_STATUS.md)
- [Memória técnica para continuidade](PROJECT_MEMORY.md)
- [Deploy no EasyPanel](DEPLOY_EASYPANEL.md)

## Licença

Uso pessoal e portfólio de Humberto Moura Neto.

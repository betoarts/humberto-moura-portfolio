# Estado atual da construção

Atualizado em 9 de setembro de 2026.

## Visão geral

O portfólio de Humberto Moura Neto está implementado como uma landing page estática, responsiva e orientada à conversão. A experiência apresenta serviços, projetos reais, demonstrações interativas e chamadas contextuais para o WhatsApp.

O projeto está preparado para:

- execução local com Vite;
- publicação em container Docker;
- deploy no EasyPanel com Nginx;
- indexação por mecanismos de busca após configuração do domínio público;
- compartilhamento social com imagem Open Graph própria.

## Entregas concluídas

### Identidade e experiência

- Direção visual escura com glassmorphism, iluminação azul, blur e profundidade.
- Hero comercial com retrato profissional de Humberto Moura Neto.
- Copy orientada à contratação de aplicativos, sistemas e automações.
- Animações suaves de entrada e indicador de progresso da página.
- Compatibilidade com `prefers-reduced-motion`.
- Navegação por âncoras, foco visível e estrutura semântica.
- Layout revisado em desktop e em viewport mobile de aproximadamente 390 px.
- Botão flutuante do WhatsApp mantido dentro da área segura no mobile.

### Serviços e conversão

- Blocos para sistemas de gestão, aplicativos e automação com IA.
- Mensagens de WhatsApp geradas conforme o serviço escolhido.
- Seletor de interesse na seção final de contato.
- Botões dos projetos direcionados para conversa contextual pelo WhatsApp.
- Número de contato configurado: `+55 54 99168-0204`.

### Projetos apresentados

1. AssetTrack TI — ativos, inventário, service desk, manutenção e operações de TI.
2. Manager Restaurante — ERP, PDV, mesas, comandas, KDS e estoque.
3. Restaurant Queue — fila, mesas e notificações por WhatsApp.
4. Fleet Control — frota, viagens, tarefas, mapas, relatórios e PWA.
5. LocalTV — sinalização digital, players, playlists e conteúdo em tempo real.
6. Gerador de Certificados — importação Excel, PDFs em lote e validação por QR Code.
7. HabitFlow — hábitos, streaks, XP, conquistas e coach com IA.
8. ResumeAI Studio — currículos, análise ATS, IA e acompanhamento de candidaturas.

Cada projeto possui card com resumo e tecnologias, imagem própria e modal com recursos, arquitetura, informações operacionais e CTA de WhatsApp.

### Demonstrações interativas

- AssetTrack TI: avanço de chamado entre aberto, atendimento e resolvido.
- Restaurant Queue: liberação de mesa e simulação de chamada do cliente.
- HabitFlow: conclusão de hábitos, progresso e XP fictício.
- LocalTV: troca de conteúdo e controle de overlay em uma tela simulada.

Todas as demonstrações usam dados fictícios e não alteram sistemas reais nem enviam mensagens.

### Imagens e desempenho

- Capas dos oito projetos hospedadas localmente.
- Variantes WebP responsivas de aproximadamente 640 e 1200 pixels.
- Retrato responsivo em WebP com prioridade de carregamento no hero.
- Capas carregadas sob demanda com `loading="lazy"` e `decoding="async"`.
- Dimensões declaradas para reduzir mudanças de layout durante o carregamento.
- Imagem social JPEG de 1200 × 630 pixels.
- Assets versionados com hash de conteúdo e cache longo no Nginx.
- HTML configurado para revalidação e compressão gzip.

### SEO

- Título e descrição comerciais em português do Brasil.
- Metadados Open Graph e Twitter Card.
- Dados estruturados Schema.org para pessoa, site, página e serviços.
- `robots.txt`, `sitemap.xml`, canonical e URLs sociais gerados no container.
- Geração condicionada à variável `SITE_URL`, evitando publicar domínio incorreto.
- Página 404 real e endpoint `/health` para monitoramento.

### Proteção de conteúdo

Foram adicionadas barreiras de interface contra seleção, cópia casual, menu de contexto e arraste de imagens. Essas barreiras desencorajam cópia comum, mas não substituem proteção legal nem impedem tecnicamente a captura de conteúdo entregue ao navegador.

## Arquitetura atual

```text
scripts/index.template.html ─┐
scripts/projects-data.json ──┼─> scripts/build-static.py ─> dist/index.html
scripts/projects-source.js ──┤
scripts/base.css ────────────┘

dist/assets/experience.*  -> simulações
dist/assets/studio.*      -> efeitos e comportamento visual
dist/assets/media/        -> retrato, capas e imagem social
deploy/                   -> injeção de SEO no container
Dockerfile + nginx.conf   -> produção no EasyPanel
```

## Execução local

Requisitos: Node.js e npm.

```bash
git clone https://github.com/betoarts/humberto-moura-portfolio.git
cd humberto-moura-portfolio
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

Acesse `http://localhost:3000`.

## Regeneração e testes

Após alterações nos templates, dados ou scripts-fonte:

```bash
python3 scripts/build-static.py
node tests/experience.test.cjs
python3 tests/seo.test.py
```

Estado da última validação:

- 46 verificações de experiência aprovadas.
- Testes de SEO, imagens, dados estruturados e origem de produção aprovados.
- Oito cards e oito imagens de projeto carregados na revisão local.
- Modais e CTA contextual de WhatsApp verificados.
- Ausência de rolagem horizontal confirmada em desktop e mobile.

O teste de SEO requer Pillow no ambiente Python.

## Deploy no EasyPanel

Configuração esperada:

- método de build: `Dockerfile`;
- porta interna: `80`;
- health check: `/health`;
- variável obrigatória para SEO completo: `SITE_URL=https://seu-dominio.com`;
- domínio com HTTPS habilitado.

Consulte [DEPLOY_EASYPANEL.md](../DEPLOY_EASYPANEL.md) para o procedimento completo.

## Estado do repositório

- Repositório: `betoarts/humberto-moura-portfolio`.
- Branch de produção: `main`.
- Último commit confirmado no GitHub durante esta atualização: `e3104f831b0890ef9669d3e9b6ecf5b374a25824`.
- O EasyPanel pode realizar deploy automático a cada atualização da branch, conforme a configuração da aplicação.

## Pendências externas e próximos passos

1. Confirmar `SITE_URL` no EasyPanel com o domínio definitivo.
2. Executar novo deploy e validar `/health`, `/robots.txt` e `/sitemap.xml` publicamente.
3. Cadastrar o domínio no Google Search Console e enviar o sitemap.
4. Verificar a imagem de compartilhamento no WhatsApp, LinkedIn e outras plataformas após a renovação dos caches.
5. Acompanhar Core Web Vitals e conversões reais depois que o domínio receber tráfego.
6. Atualizar esta documentação sempre que novos projetos ou demonstrações forem adicionados.

## Critério para considerar a versão pronta

A implementação do site está concluída. A versão será considerada operacional em produção quando o domínio definitivo estiver associado ao EasyPanel, `SITE_URL` estiver configurada, o deploy estiver saudável e as URLs públicas de SEO forem validadas.

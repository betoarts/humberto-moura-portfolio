# Memória técnica do projeto

Este arquivo é o ponto de retomada para futuras alterações no portfólio de Humberto Moura Neto.

## Objetivo do produto

Converter visitantes em conversas comerciais para criação de aplicativos, sistemas de gestão, automações e soluções com IA. A linguagem visual deve permanecer sofisticada, escura, tecnológica e humana, com inspiração na clareza editorial de páginas premium de produto.

## Estado atual

- Landing page estática concluída e preparada para EasyPanel.
- Oito projetos publicados; AssetTrack TI deve permanecer como projeto 01.
- Quatro demonstrações interativas: AssetTrack TI, Restaurant Queue, HabitFlow e LocalTV.
- Todos os cards abrem modais detalhados.
- CTAs de projeto usam “Falar pelo WhatsApp”; não reintroduzir botões de repositório na interface.
- WhatsApp oficial: `5554991680204`.
- Imagens dos projetos são locais e responsivas; não voltar a depender de imagens remotas do GitHub.
- SEO absoluto depende da variável de produção `SITE_URL`.

## Arquivos principais

- `scripts/index.template.html`: fonte estrutural da página.
- `scripts/projects-data.json`: informações dos oito projetos.
- `scripts/projects-source.js`: modais e comportamento dos cards.
- `scripts/base.css`: estilos-base.
- `dist/assets/experience.js` e `dist/assets/experience.css`: demonstrações.
- `dist/assets/studio.js` e `dist/assets/studio.css`: refinamentos visuais e interações.
- `scripts/build-static.py`: gera cards, HTML e arquivos versionados.
- `dist/index.html`: saída pronta para produção.
- `deploy/40-portfolio-seo.sh`: aplica URLs absolutas no início do container.
- `Dockerfile` e `nginx.conf`: execução no EasyPanel.
- `docs/PROJECT_STATUS.md`: documentação detalhada do estágio atual.

## Regras para alterações futuras

1. Editar as fontes em `scripts/` ou os arquivos-fonte não versionados em `dist/assets/`.
2. Executar `python3 scripts/build-static.py` para regenerar `dist/index.html` e assets com hash.
3. Não editar somente um asset com hash; ele será substituído na próxima geração.
4. Preservar responsividade, foco por teclado e movimento reduzido.
5. Manter o botão flutuante do WhatsApp dentro de `safe-area-inset` no mobile.
6. Manter texto e informações principais dos projetos no HTML inicial para SEO.
7. Não inventar métricas de clientes, faturamento ou resultados sem dados verificáveis.
8. Sempre validar imagens locais, modais, simulações e links do WhatsApp antes do push.

## Comandos de trabalho

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

```bash
python3 scripts/build-static.py
node tests/experience.test.cjs
python3 tests/seo.test.py
```

## Última revisão conhecida

- Data: 9 de setembro de 2026.
- Desktop revisado em aproximadamente 1363 × 936.
- Mobile revisado em aproximadamente 390 × 844.
- Oito imagens de cards carregaram corretamente após entrar na seção.
- AssetTrack TI e ResumeAI Studio tiveram seus modais testados.
- A simulação Restaurant Queue e a transição do chamado AssetTrack TI foram testadas.
- Mensagem duplicada do CTA de automação foi corrigida.
- Espaçamento textual do contador “08 aplicações no portfólio” foi corrigido.
- GitHub `main` confirmado em `e3104f831b0890ef9669d3e9b6ecf5b374a25824` antes da inclusão desta documentação.

## Próxima ação recomendada

Publicar esta documentação no GitHub e disparar/revisar o deploy no EasyPanel com o domínio definitivo configurado em `SITE_URL`.

# Deploy no EasyPanel

Este portfólio é uma aplicação estática entregue por Nginx. Não depende de banco de dados, variáveis de ambiente ou processo de build no servidor.

## Configuração sugerida

1. Crie um novo projeto e uma aplicação do tipo **App** no EasyPanel.
2. Escolha o repositório deste portfólio como fonte e mantenha a implantação por **Dockerfile**.
3. Use a porta interna **80**.
4. Em **Domains**, vincule o domínio desejado e ative HTTPS.
5. Em Health Check, use o caminho **`/health`**.

O EasyPanel detectará o `Dockerfile` na raiz. A cada push para a branch configurada, ele criará uma nova imagem e publicará a atualização.

## Recursos recomendados

- CPU: 0,1 vCPU como ponto de partida
- Memória: 128 MB
- Réplicas: 1

Como o site é estático, não são necessários volumes persistentes, banco de dados ou secrets para esta implantação.

## SEO e imagem de compartilhamento

Na aplicação do EasyPanel, adicione a variável **`SITE_URL`** com a origem HTTPS do seu domínio público (sem caminho, parâmetros ou `#`). Exemplo ilustrativo: `https://portfolio.suaempresa.com.br`. Use seu domínio real e faça um novo deploy.

Ao iniciar, o container gera no HTML:

- URL canônica, `og:url`, `og:image` e Twitter Card com endereço absoluto.
- Dados estruturados de pessoa, site, página e serviços, alinhados ao conteúdo visível.
- `/sitemap.xml` com a página inicial e nove imagens reais do portfólio.
- `/robots.txt` apontando para o sitemap.

Sem `SITE_URL`, o site continua funcionando, mas não inventa um domínio nem publica canonical/sitemap incorretos; a imagem de compartilhamento absoluta também aguarda essa configuração. O endereço privado do Sites não é usado como domínio público.

Após o deploy, confirme seu domínio no Google Search Console e envie `/sitemap.xml`. A verificação de propriedade precisa ser feita com sua conta. Indexação, posição no Google e imagem escolhida nos resultados dependem do buscador; não são garantidas pelos metadados.

A nova imagem de compartilhamento pode levar algum tempo para aparecer em conversas já existentes, devido ao cache das plataformas. Os nomes dos arquivos possuem hash de conteúdo para diferenciar novas versões.

## Desempenho e imagens

As oito capas são entregues pelo próprio container, sem requisições do visitante ao GitHub. Existem versões WebP de aproximadamente 640 e 1200 pixels para cada projeto, selecionadas pelo navegador com `srcset` e `sizes`. O modal usa a versão adequada ao tamanho de exibição.

As capas originais somavam 2.383.287 bytes. As oito versões menores somam 228.100 bytes e as maiores, 652.926 bytes. Os valores são dos arquivos, não uma medição de PageSpeed ou do tráfego de todos os visitantes. O retrato passou a ter versões de 12.682 e 40.800 bytes; a imagem de fundo usa apenas 580 bytes.

O Nginx entrega os arquivos com hash com cache de um ano, revalida o HTML e fornece compressão gzip. URLs inexistentes retornam 404 real. Os cards e suas informações principais já estão no HTML inicial.

A imagem social foi gerada para este projeto e otimizada em JPEG 1200 × 630, com 82.026 bytes. As origens das capas e os tamanhos estão em `image-manifest.json`.

## Validação local

Para regerar HTML e assets versionados após editar os arquivos fonte:

```bash
python3 scripts/build-static.py
node tests/experience.test.cjs
python3 tests/seo.test.py
```

O teste de SEO usa Pillow (`python3 -m pip install Pillow`). A geração dos arquivos estáticos usa apenas a biblioteca padrão do Python. O deploy no EasyPanel usa os arquivos `dist` já prontos e não instala Python ou Node.

Não foi possível executar Docker neste ambiente de edição; valide a imagem no deploy do EasyPanel. Os arquivos, imagens, interações e a geração de metadados por `SITE_URL` foram verificados localmente.

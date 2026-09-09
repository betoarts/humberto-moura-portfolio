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

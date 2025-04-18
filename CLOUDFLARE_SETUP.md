# Migração e Configuração do Site SAFADASSO no Cloudflare Pages

Este guia mostra como migrar seu site do GitHub Pages para o Cloudflare Pages, que oferece recursos mais avançados como funções serverless (Workers), armazenamento de dados (KV) e outras funcionalidades.

## 1. Criar uma conta no Cloudflare

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) e crie uma conta gratuita
2. Verifique seu e-mail e complete o processo de criação da conta

## 2. Configurar o Cloudflare Pages

1. No dashboard do Cloudflare, clique em "Pages" no menu lateral
2. Clique em "Connect to Git"
3. Selecione o provedor (GitHub) e autorize o Cloudflare a acessar seus repositórios
4. Selecione o repositório `safadasso.github.io`
5. Configure o build:
   - **Project name**: `safadasso` (ou o nome que preferir)
   - **Production branch**: `main`
   - **Framework preset**: None
   - **Build command**: `npx wrangler deploy`
   - **Build output directory**: Deixe como está (.)
   - **Environment variables**: Não é necessário para a configuração básica
6. Clique em "Save and Deploy"

## 3. Configurar o Cloudflare Workers (para funcionalidades avançadas)

Após o primeiro deploy, configure o Workers para permitir o uso das funções serverless:

1. No painel do seu projeto Pages, vá para "Settings" > "Functions"
2. Habilite as funções do Cloudflare Workers clicando em "Enable Functions"

## 4. Configurar o Cloudflare KV (opcional, para armazenamento de dados)

Para usar o armazenamento KV com o Worker da agenda:

1. No dashboard do Cloudflare, acesse "Workers & Pages" > "KV"
2. Clique em "Create namespace"
3. Nomeie como "AGENDA_KV" e clique em "Add"
4. Vá para seu projeto Pages > "Settings" > "Functions" > "KV namespace bindings"
5. Clique em "Add binding"
6. Configure:
   - **Variable name**: `AGENDA_KV`
   - **KV namespace**: Selecione o namespace "AGENDA_KV" que você criou
7. Clique em "Save"

## 5. Adicionar seu domínio personalizado (opcional)

Se você tiver um domínio personalizado e quiser usá-lo com o Cloudflare Pages:

1. No painel do seu projeto Pages, vá para "Custom domains"
2. Clique em "Set up a custom domain"
3. Digite seu domínio (ex: safadasso.com) e clique em "Continue"
4. Siga as instruções para configurar os registros DNS

**Nota**: Se seu domínio já estiver no Cloudflare, a configuração será automática.

## 6. Entendendo os arquivos de configuração

### wrangler.toml

Este arquivo configura como o Cloudflare Workers e Pages funcionará com seu site:

```toml
[site]
bucket = "./"
entry-point = "."

[build]
command = ""
upload.format = "directory"

[build.upload]
dir = "."

# Configuração principal necessária
name = "safadasso"
main = "functions/main.js"
compatibility_date = "2025-04-18"

# Configuração para assets estáticos
[assets]
directory = "./"

[env.production]
name = "safadasso"
route = "safadasso.com/*"

[env.development]
name = "safadasso-dev"

# Configurações de Headers
[[headers]]
for = "/*"
[headers.values]
Access-Control-Allow-Origin = "*"
Access-Control-Allow-Methods = "GET, POST, OPTIONS"
Access-Control-Allow-Headers = "Content-Type, Authorization"
```

### functions/main.js

Este é o ponto de entrada principal para o Cloudflare Workers:

```js
// Importar a função de agenda
import { onRequest as agendaHandler } from './agenda.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Rotear para funções específicas com base no caminho
    if (url.pathname.startsWith('/functions/agenda')) {
      const context = { request, env };
      return agendaHandler(context);
    }
    
    // Servir arquivos estáticos para outras rotas
    // ...resto do código
  }
};
```

### functions/agenda.js

Este arquivo é uma função serverless do Cloudflare Workers que permite gerenciar a agenda diretamente:

```js
// Função para lidar com o upload e atualização da agenda.json
export async function onRequest(context) {
  const request = context.request;
  const env = context.env;
  
  // Implementação da função
  // ...
}
```

## 7. Solucionando problemas de deployment

Se você encontrar erros durante o deployment como:

```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
```

Verifique se:

1. O arquivo `wrangler.toml` contém as configurações corretas:
   - A propriedade `main` está apontando para o arquivo principal do Worker
   - A propriedade `compatibility_date` está definida
   - A propriedade `name` está definida

2. A estrutura de pastas está correta:
   - O arquivo `functions/main.js` existe
   - O diretório `functions` contém o arquivo `agenda.js`

3. O comando de build no Cloudflare Pages está configurado para:
   - `npx wrangler deploy`

4. Se o problema persistir, tente executar manualmente no terminal:
   ```
   npm install -g wrangler
   wrangler deploy functions/main.js
   ```

## 8. Atualizando o site no futuro

Com o Cloudflare Pages configurado, você tem três opções para atualizar seu site:

### Opção 1: Atualizar via GitHub (como antes)
1. Faça alterações no repositório GitHub
2. O Cloudflare Pages detectará automaticamente e atualizará o site

### Opção 2: Usar o Editor de Agenda atualizado
1. Acesse o editor de agenda em seu site
2. Faça as alterações necessárias
3. Clique em "Salvar Agenda no Cloudflare" (nova funcionalidade)

### Opção 3: Direct Upload via Cloudflare Dashboard
1. No painel do Cloudflare Pages, vá para seu projeto
2. Clique em "Deployments" > "Deploy manually"
3. Arraste e solte os arquivos atualizados

## 9. Vantagens do Cloudflare Pages sobre o GitHub Pages

- **Funções serverless**: Permite executar código no servidor sem precisar de hospedagem própria
- **Armazenamento KV**: Banco de dados simples para armazenar dados sem precisar de backend dedicado
- **Analytics gratuito**: Estatísticas sobre visitantes do site
- **Maior velocidade**: CDN global mais rápida
- **Cache personalizado**: Mais controle sobre o caching de conteúdo
- **SSL flexível**: Configurações mais avançadas para HTTPS
- **Proteção contra DDoS**: Segurança adicional contra ataques
- **Workers de transformação**: Modificar respostas HTTP em tempo real

## 10. Recursos adicionais que você pode implementar

Com o Cloudflare Workers, você pode criar funcionalidades mais avançadas:

- Sistema de autenticação para o editor de agenda
- API para integração com outras plataformas
- Notificações automáticas para novas streams
- Estatísticas de visualização da agenda
- Formulário de contato funcional sem backend dedicado
- Geração de conteúdo dinâmico baseado nos dados da agenda

## Solução de problemas comuns

### A função de salvar agenda não funciona
- Verifique se as funções do Workers estão habilitadas
- Confirme que o namespace KV está configurado corretamente
- Verifique os logs de erro no painel do Cloudflare

### Site não atualiza após alterações
- Pode levar alguns minutos para que as mudanças sejam propagadas
- Verifique o status do deploy no painel do Cloudflare Pages
- Limpe o cache do navegador

### Erro ao acessar as funções
- Confirme que o caminho da API está correto no código JavaScript
- Verifique a estrutura de pastas do repositório
- Verifique os logs de erro no painel do Cloudflare Workers

---

Para ajuda adicional, consulte a [documentação oficial do Cloudflare Pages](https://developers.cloudflare.com/pages/). 
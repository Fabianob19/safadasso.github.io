# Guia para Hospedar o Site no GitHub Pages

Este guia vai te ajudar a criar um repositório no GitHub e configurar o GitHub Pages para hospedar seu site SAFADASSO.

## 1. Criar uma conta no GitHub (pule se já tiver)

1. Acesse [github.com](https://github.com)
2. Clique em "Sign up" e siga as instruções para criar sua conta
3. Verifique seu e-mail e complete o processo de criação da conta

## 2. Criar um novo repositório

1. Depois de fazer login, clique no ícone "+" no canto superior direito
2. Selecione "New repository"
3. Configure o repositório:
   - **Repository name**: `safadasso.github.io` (se este for seu nome de usuário) ou qualquer outro nome como `site-safadasso`
   - **Description**: "Site oficial do canal SAFADASSO"
   - **Public/Private**: Selecione "Public" (o GitHub Pages requer repositórios públicos na versão gratuita)
   - **Initialize this repository with**: Marque "Add a README file"
   - Clique em "Create repository"

## 3. Fazer upload dos arquivos

1. No seu novo repositório, clique no botão "Add file" e selecione "Upload files"
2. Arraste ou selecione todos os arquivos do site:
   - index.html
   - style.css
   - script.js
   - agenda.json
   - logo-safadasso.png (certifique-se de que é a imagem real)
   - perfil-andre.jpg (certifique-se de que é a imagem real)
   - README.md (o que acabamos de criar)
3. Escreva uma mensagem de commit como "Upload inicial do site SAFADASSO"
4. Clique em "Commit changes"

## 4. Ativar o GitHub Pages

1. No seu repositório, clique na aba "Settings" (ícone de engrenagem)
2. No menu lateral esquerdo, role para baixo e clique em "Pages"
3. Na seção "Build and deployment":
   - **Source**: Selecione "Deploy from a branch"
   - **Branch**: Selecione "main" (ou "master") e "/(root)"
   - Clique em "Save"
4. Aguarde alguns minutos (geralmente 1-2 minutos) para que o site seja publicado
5. Recarregue a página e você verá uma mensagem como "Your site is published at https://seuusuario.github.io/nome-do-repositorio/"

## 5. Verificar o site

1. Clique no link fornecido para acessar seu site publicado
2. Verifique se todas as imagens e funcionalidades estão funcionando corretamente
3. Se as imagens não aparecerem, confirme que:
   - Os nomes dos arquivos no código HTML correspondem exatamente aos nomes dos arquivos enviados
   - Os arquivos de imagem são realmente imagens (não placeholder de texto)

## 6. Configurar um domínio personalizado (opcional)

Se você tiver um domínio próprio e quiser usá-lo:

1. Na página de configurações do GitHub Pages, em "Custom domain", digite seu domínio (ex: safadasso.com)
2. Clique em "Save"
3. No seu provedor de domínio, configure os registros DNS:
   
   Para um domínio raiz (exemplo.com):
   ```
   Tipo A:
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   
   Para um subdomínio (www.exemplo.com):
   ```
   Tipo CNAME:
   seuusuario.github.io
   ```

## 7. Atualizando o site no futuro

Para fazer alterações no seu site:

1. Vá até o repositório no GitHub
2. Navegue até o arquivo que deseja editar
3. Clique no ícone de lápis (Edit)
4. Faça suas alterações
5. Escreva uma mensagem de commit descrevendo suas alterações
6. Clique em "Commit changes"

Para alterações mais complexas, você pode clonar o repositório localmente, fazer as alterações e depois enviar de volta para o GitHub.

## Solução de problemas comuns

### Imagens não aparecem
- Verifique se os arquivos foram enviados corretamente
- Confirme se os nomes dos arquivos coincidem exatamente com os referenciados no HTML
- Certifique-se de que os arquivos são realmente imagens, não arquivos de texto

### Site não atualiza após alterações
- Pode levar alguns minutos para que as mudanças sejam refletidas
- Tente limpar o cache do navegador
- Verifique na aba "Actions" do repositório se há algum erro na publicação

### Erro 404 ao acessar o site
- Verifique se a configuração do GitHub Pages está correta
- Confirme se o arquivo index.html está na raiz do repositório

---

Se precisar de ajuda adicional, consulte a [documentação oficial do GitHub Pages](https://docs.github.com/en/pages). 
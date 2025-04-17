# Como Salvar seu Site no GitHub

Este guia mostra como salvar seu site no GitHub e mantê-lo atualizado, mesmo sem o Git instalado localmente.

## 1. Criar uma conta no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em "Sign up" no canto superior direito
3. Preencha as informações solicitadas: nome de usuário, e-mail e senha
4. Siga as instruções para concluir o cadastro e verificar seu e-mail

## 2. Criar um novo repositório

1. Após fazer login, clique no botão "+" no canto superior direito e selecione "New repository"
   
   ![Novo repositório](https://raw.githubusercontent.com/safadasso/resources/main/novo-repo.jpg)

2. Preencha as informações do repositório:
   - **Nome do repositório**: `safadasso.github.io` (isso permitirá que o GitHub Pages funcione automaticamente)
   - **Descrição**: "Site oficial do canal SAFADASSO"
   - **Visibilidade**: Public (o GitHub Pages gratuito só funciona com repositórios públicos)
   - **Initialize this repository with**: Marque "Add a README file"
   
   ![Configurar repositório](https://raw.githubusercontent.com/safadasso/resources/main/config-repo.jpg)

3. Clique em "Create repository"

## 3. Fazer upload dos arquivos

1. No seu novo repositório, clique no botão "Add file" e selecione "Upload files"
   
   ![Upload de arquivos](https://raw.githubusercontent.com/safadasso/resources/main/upload-files.jpg)

2. Arraste todos os arquivos do seu site ou clique na área para selecioná-los:
   - index.html
   - style.css
   - script.js
   - agenda.json
   - logo-safadasso.png (sua logo real)
   - perfil-andre.jpg (sua foto real)
   - README.md

3. Adicione uma mensagem de commit descrevendo o que você está enviando:
   - Título: "Upload inicial do site SAFADASSO"
   - Descrição (opcional): "Adicionando todos os arquivos do site"

   ![Mensagem de commit](https://raw.githubusercontent.com/safadasso/resources/main/commit-message.jpg)

4. Clique em "Commit changes"

## 4. Ativar o GitHub Pages

1. No seu repositório, clique na aba "Settings" (ícone de engrenagem)
   
   ![Settings](https://raw.githubusercontent.com/safadasso/resources/main/settings.jpg)

2. No menu lateral esquerdo, role para baixo e clique em "Pages"
   
   ![GitHub Pages](https://raw.githubusercontent.com/safadasso/resources/main/pages.jpg)

3. Na seção "Source", selecione "Deploy from a branch"
4. Na seção "Branch", selecione "main" e "/(root)"
5. Clique em "Save"
   
   ![Configurar Pages](https://raw.githubusercontent.com/safadasso/resources/main/configure-pages.jpg)

6. Aguarde alguns minutos para que o site seja publicado
7. Recarregue a página e você verá uma mensagem com a URL do seu site

## 5. Atualizar o site quando precisar fazer alterações

Quando precisar fazer alterações no site:

### Para alterações simples:

1. Navegue até o arquivo que deseja editar no GitHub
2. Clique no ícone de lápis (Edit) no canto superior direito do arquivo
   
   ![Editar arquivo](https://raw.githubusercontent.com/safadasso/resources/main/edit-file.jpg)

3. Faça suas alterações no editor online
4. Role até o final da página e adicione uma mensagem de commit descrevendo a alteração
5. Clique em "Commit changes"

### Para alterações na agenda:

1. Navegue até o arquivo `agenda.json` no repositório
2. Clique no ícone de lápis para editar
3. Atualize os eventos da agenda e a data de atualização
4. Adicione uma mensagem de commit como "Atualização da agenda"
5. Clique em "Commit changes"

### Para substituir imagens:

1. Navegue até a imagem que deseja substituir
2. Clique no botão "Delete" (lixeira) para excluir o arquivo
3. Confirme a exclusão adicionando uma mensagem de commit
4. Volte à página principal do repositório
5. Clique em "Add file" > "Upload files"
6. Faça upload da nova imagem com o mesmo nome da antiga
7. Adicione uma mensagem de commit e confirme

## 6. Verificar seu site após as alterações

- Depois de qualquer alteração, aguarde alguns minutos para que o GitHub Pages atualize o site
- Visite sua URL (exemplo: https://safadasso.github.io) para ver as alterações
- Se necessário, pressione Ctrl+F5 para forçar a recarga da página e limpar o cache

## 7. Dicas para manter o site atualizado

- Atualize a agenda regularmente para manter seus seguidores informados
- Depois de cada transmissão importante, considere adicionar destaques ou momentos marcantes
- Mantenha os links para suas plataformas atualizados caso mude de nome de usuário
- Faça um backup dos arquivos localmente para ter uma cópia de segurança

## Solução de problemas

### Imagens não aparecem
- Verifique se os nomes dos arquivos estão corretos (distinção entre maiúsculas/minúsculas)
- Confirme se os arquivos de imagem foram enviados corretamente
- Verifique o tamanho das imagens (o GitHub tem um limite de 100MB por arquivo)

### Alterações não aparecem
- Aguarde 5-10 minutos após o commit para que as alterações sejam publicadas
- Force a recarga do navegador com Ctrl+F5
- Verifique se você commitou as alterações na branch principal (main) 
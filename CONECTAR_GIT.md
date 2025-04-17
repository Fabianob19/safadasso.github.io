# Conectando seu Site Local ao GitHub

Este guia contém os comandos exatos para conectar seu site local ao repositório GitHub e configurar o GitHub Pages.

## Passos para conectar ao GitHub

Abra o PowerShell ou CMD na pasta do seu site (F:\Site) e execute os comandos a seguir em sequência:

```
# 1. Certifique-se de estar na pasta correta
cd F:\Site

# 2. Inicializar um repositório Git (pule se já fez)
git init

# 3. Configurar seu nome de usuário e email
git config --global user.name "Fabianob19"
git config --global user.email "seu-email@exemplo.com"

# 4. Adicionar o repositório remoto (pule se já fez)
git remote add origin https://github.com/Fabianob19/safadasso.github.io.git

# 5. Adicionar todos os arquivos ao Git
git add .

# 6. Criar um commit com as alterações
git commit -m "Atualização do site SAFADASSO"

# 7. Forçar o envio para a branch main do GitHub
git push -f origin master:main
```

## Configurando o GitHub Pages

1. Acesse seu repositório no GitHub: https://github.com/Fabianob19/safadasso.github.io
2. Vá para "Settings" (configurações)
3. No menu lateral, clique em "Pages"
4. Na seção "Branch", selecione "main" e clique em "Save"
5. Aguarde alguns minutos e seu site estará disponível em https://fabianob19.github.io/safadasso.github.io/

## Fazendo Alterações Futuras

Sempre que quiser atualizar seu site, siga estes passos:

```
# 1. Faça suas alterações nos arquivos

# 2. Adicione as alterações ao Git
git add .

# 3. Crie um commit descrevendo as alterações
git commit -m "Descrição das alterações"

# 4. Envie para o GitHub
git push origin master:main
```

## Solução de Problemas Comuns

### Erro de autenticação ao fazer push

Se você receber um erro de autenticação, será necessário gerar um token de acesso pessoal:

1. Acesse GitHub → Settings → Developer settings → Personal access tokens → Generate new token
2. Dê um nome ao token, selecione pelo menos o escopo "repo" e gere o token
3. Use este token como senha quando solicitado (o nome de usuário continua sendo seu nome de usuário do GitHub)

### Erro "Updates were rejected"

Se receber um erro dizendo que as atualizações foram rejeitadas:

```
# Puxe as alterações do GitHub primeiro
git pull origin main

# Resolva quaisquer conflitos se necessário

# Depois envie suas alterações
git push origin master:main
```

### Para verificar o status do seu repositório

```
# Ver as alterações não confirmadas
git status

# Ver o histórico de commits
git log --oneline
``` 
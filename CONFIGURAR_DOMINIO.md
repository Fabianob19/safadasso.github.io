# Configurando seu Domínio Personalizado com GitHub Pages

Este guia mostra como configurar seu domínio personalizado para funcionar com seu site hospedado no GitHub Pages.

## Passo 1: Configuração no GitHub

1. Acesse seu repositório no GitHub (https://github.com/Fabianob19/safadasso.github.io)
2. Vá para "Settings" (Configurações)
3. Role para baixo até a seção "GitHub Pages"
4. No campo "Custom domain" (Domínio personalizado), digite seu domínio (por exemplo, `seudominio.com`)
5. Clique em "Save" (Salvar)
6. Marque a opção "Enforce HTTPS" quando estiver disponível (após a verificação DNS)

## Passo 2: Configuração DNS com seu Provedor de Domínio

### Para domínio principal (apex domain) como `seudominio.com`:

Configure os seguintes registros **A** apontando para os servidores IP do GitHub Pages:
- Tipo: A | Nome: @ | Valor: 185.199.108.153
- Tipo: A | Nome: @ | Valor: 185.199.109.153
- Tipo: A | Nome: @ | Valor: 185.199.110.153
- Tipo: A | Nome: @ | Valor: 185.199.111.153

### Para subdomínio como `www.seudominio.com`:

Configure um registro **CNAME**:
- Tipo: CNAME | Nome: www | Valor: seu-usuario-github.github.io

### Para verificação de domínio (opcional, mas recomendado):

Adicione um registro TXT:
- Tipo: TXT | Nome: @ | Valor: `github-pages-verification=token_fornecido_pelo_github`

## Passo 3: Aguarde a Propagação DNS

A propagação DNS pode levar de alguns minutos até 48 horas para ser concluída em todo o mundo.

## Passo 4: Verifique a Configuração

Quando a configuração estiver completa:
1. Seu site ficará disponível em seu domínio personalizado
2. O HTTPS será habilitado automaticamente pelo GitHub Pages

## Dicas adicionais

- Se você estiver usando serviços como Cloudflare, certifique-se de que o proxy esteja desativado (use DNS only) durante a configuração inicial
- Após a configuração, você pode ativar o proxy Cloudflare para obter benefícios adicionais de segurança e desempenho
- Certifique-se de renovar seu domínio antes que expire para manter seu site acessível

## Problemas comuns

- **Erro 404**: Verifique se as configurações de DNS estão corretas e se houve tempo suficiente para a propagação
- **Erro com HTTPS**: O GitHub pode levar algum tempo para emitir o certificado SSL após a verificação DNS
- **Site não disponível**: Verifique se o arquivo CNAME no repositório contém seu domínio correto

Para obter ajuda mais detalhada, consulte a [documentação oficial do GitHub Pages](https://docs.github.com/pt/pages/configuring-a-custom-domain-for-your-github-pages-site) 
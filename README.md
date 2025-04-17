# Site SAFADASSO - André Gribel

![SAFADASSO](logo-safadasso.png)

Site oficial do streamer André Gribel (SAFADASSO), reunindo todas as plataformas de streaming e redes sociais em um único local.

## Sobre o projeto

Este site foi criado para centralizar todas as plataformas de streaming e redes sociais do canal SAFADASSO. O design foi personalizado para refletir a identidade visual do canal, com um estilo moderno que combina tons de dourado, vermelho, roxo e azul.

### Recursos

- Design responsivo (adaptável a celulares, tablets e desktops)
- Seção de agenda de streams atualizada dinamicamente
- Links para todas as plataformas de streaming
- Informações sobre o streamer
- Redes sociais integradas

## Plataformas

- [Twitch](https://www.twitch.tv/safadasso)
- [YouTube](https://www.youtube.com/safadasso)
- [Kick](https://kick.com/safadasso)
- [TikTok](https://www.tiktok.com/@andregribel)
- [LivePix](https://livepix.gg/safadasso)

## Redes Sociais

- [Instagram](https://www.instagram.com/andregribel/)
- [Twitter/X](https://x.com/safadasso)
- [Discord](https://discord.gg/9gerMhMyjS)

## Como atualizar a agenda

A agenda de streams é gerenciada através do arquivo `agenda.json`. Para atualizar:

1. Edite o arquivo `agenda.json`
2. Modifique os objetos dentro do array "streams"
3. Atualize o campo "ultimaAtualizacao" com a data atual
4. Faça commit das alterações para o repositório

## Desenvolvimento local

Para testar o site localmente:

1. Clone este repositório
2. Abra o arquivo `index.html` em seu navegador
3. Para testar a funcionalidade completa incluindo a agenda JSON, use um servidor local:
   - Python 3: `python -m http.server`
   - Python 2: `python -m SimpleHTTPServer`
   - Ou use extensões como Live Server no VS Code

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- JSON para gerenciamento dinâmico da agenda

---

© 2023 SAFADASSO - André Gribel. Todos os direitos reservados. 
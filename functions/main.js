// Importar a função de agenda
import { onRequest as agendaHandler } from './agenda.js';

/**
 * Função principal que roteia requisições para os manipuladores apropriados
 * @param {*} context Contexto da requisição
 * @returns {Response} Resposta HTTP
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Configurações de CORS padrão
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    
    // Lidar com solicitações de preflight CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    
    // Rotear para funções específicas com base no caminho
    if (url.pathname === '/agenda' || url.pathname.startsWith('/functions/agenda')) {
      // Criar um contexto similar ao esperado pela função agenda
      const context = {
        request,
        env
      };
      return agendaHandler(context);
    }
    
    // Servir arquivos estáticos para qualquer outra rota
    try {
      // Tentar buscar um arquivo estático
      let path = url.pathname;
      if (path === '/' || path === '') {
        path = '/index.html';
      }
      
      // Extrair o tipo MIME do caminho
      const contentType = getContentType(path);
      
      // Tentar buscar o arquivo da pasta de assets
      const response = await fetch(new URL(path, request.url));
      
      if (response.ok) {
        // Adicionar cabeçalhos apropriados e retornar o arquivo
        const headers = new Headers(response.headers);
        headers.set('Content-Type', contentType);
        Object.entries(corsHeaders).forEach(([key, value]) => {
          headers.set(key, value);
        });
        
        return new Response(response.body, {
          status: response.status,
          headers
        });
      } else {
        // Se o arquivo não for encontrado, retornar 404
        return new Response('Not Found', {
          status: 404,
          headers: {
            'Content-Type': 'text/plain',
            ...corsHeaders
          }
        });
      }
    } catch (error) {
      // Em caso de erro, retornar 500
      return new Response(`Internal Server Error: ${error.message}`, {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
          ...corsHeaders
        }
      });
    }
  }
};

/**
 * Determina o tipo de conteúdo com base na extensão do arquivo
 */
function getContentType(path) {
  const extension = path.split('.').pop().toLowerCase();
  const mimeTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'txt': 'text/plain',
    'md': 'text/markdown'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
} 
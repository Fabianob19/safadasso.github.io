// Função para lidar com o upload e atualização da agenda.json
export async function onRequest(context) {
  const request = context.request;
  const env = context.env;
  
  // Configurar headers CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
  
  // Lidar com requisições OPTIONS (preflight CORS)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  // Manipular requisição POST (upload da agenda)
  if (request.method === "POST") {
    try {
      // Buscar o conteúdo JSON enviado
      const jsonData = await request.json();
      
      // Verificar se o JSON é válido e possui a estrutura correta
      if (!jsonData || !jsonData.streams || !Array.isArray(jsonData.streams)) {
        return new Response(
          JSON.stringify({ success: false, message: "Formato JSON inválido" }),
          { status: 400, headers: corsHeaders }
        );
      }
      
      // Ordenar as streams por data e hora
      jsonData.streams.sort((a, b) => {
        const dateA = new Date(a.data + 'T' + a.horario);
        const dateB = new Date(b.data + 'T' + b.horario);
        return dateA - dateB;
      });
      
      // Atualizar a data de atualização
      const now = new Date();
      jsonData.ultimaAtualizacao = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      
      // Salvar na KV (armazenamento do Cloudflare)
      // Nota: isso requer configuração do KV namespace no Cloudflare
      if (env.AGENDA_KV) {
        await env.AGENDA_KV.put("agenda", JSON.stringify(jsonData));
      }
      
      return new Response(
        JSON.stringify({ success: true, message: "Agenda atualizada com sucesso" }),
        { status: 200, headers: corsHeaders }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: `Erro ao processar a agenda: ${error.message}` }),
        { status: 500, headers: corsHeaders }
      );
    }
  }
  
  // Manipular requisição GET (obter a agenda)
  if (request.method === "GET") {
    try {
      let agendaData;
      
      // Tentar obter do KV se estiver configurado
      if (env.AGENDA_KV) {
        agendaData = await env.AGENDA_KV.get("agenda");
      }
      
      // Se não houver dados no KV, buscar do arquivo estático
      if (!agendaData) {
        const response = await fetch(new URL('/agenda.json', request.url));
        agendaData = await response.text();
      }
      
      return new Response(agendaData, {
        status: 200,
        headers: corsHeaders
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: `Erro ao obter a agenda: ${error.message}` }),
        { status: 500, headers: corsHeaders }
      );
    }
  }
  
  // Se o método não for suportado
  return new Response(
    JSON.stringify({ success: false, message: "Método não suportado" }),
    { status: 405, headers: corsHeaders }
  );
} 
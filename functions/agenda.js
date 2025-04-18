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
  
  // Log para ajudar no debug
  console.log(`Recebida solicitação para agenda: ${request.method} ${new URL(request.url).pathname}`);
  
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
      let jsonData;
      try {
        jsonData = await request.json();
      } catch (parseError) {
        console.error("Erro ao fazer parse do JSON:", parseError);
        return new Response(
          JSON.stringify({ success: false, message: "JSON inválido enviado" }),
          { status: 400, headers: corsHeaders }
        );
      }
      
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
        try {
          await env.AGENDA_KV.put("agenda", JSON.stringify(jsonData));
          console.log("Agenda salva no KV com sucesso");
        } catch (kvError) {
          console.error("Erro ao salvar no KV:", kvError);
          // Continuar mesmo com erro no KV
        }
      } else {
        console.log("AGENDA_KV não configurado, pulando armazenamento");
      }
      
      // Responder com sucesso
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Agenda atualizada com sucesso",
          count: jsonData.streams.length
        }),
        { status: 200, headers: corsHeaders }
      );
    } catch (error) {
      console.error("Erro ao processar agenda:", error);
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
        try {
          agendaData = await env.AGENDA_KV.get("agenda");
          console.log("Agenda obtida do KV com sucesso");
        } catch (kvError) {
          console.error("Erro ao obter do KV:", kvError);
          // Continuar mesmo com erro no KV
        }
      } else {
        console.log("AGENDA_KV não configurado, pulando leitura");
      }
      
      // Se não houver dados no KV, buscar do arquivo estático
      if (!agendaData) {
        try {
          console.log("Tentando buscar agenda.json do armazenamento estático");
          const response = await fetch(new URL('/agenda.json', request.url));
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          agendaData = await response.text();
          console.log("Agenda obtida do arquivo estático com sucesso");
        } catch (fetchError) {
          console.error("Erro ao buscar arquivo estático:", fetchError);
          // Se não conseguir buscar o arquivo, criar uma agenda vazia
          agendaData = JSON.stringify({
            streams: [],
            ultimaAtualizacao: new Date().toLocaleDateString('pt-BR')
          });
        }
      }
      
      // Verificar se é um JSON válido antes de retornar
      try {
        JSON.parse(agendaData);
      } catch (parseError) {
        console.error("Agenda recuperada não é um JSON válido:", parseError);
        // Criar uma agenda vazia se o JSON for inválido
        agendaData = JSON.stringify({
          streams: [],
          ultimaAtualizacao: new Date().toLocaleDateString('pt-BR')
        });
      }
      
      return new Response(agendaData, {
        status: 200,
        headers: corsHeaders
      });
    } catch (error) {
      console.error("Erro ao obter agenda:", error);
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
// Dados de fallback para a agenda (caso o JSON não carregue)
const agendaFallback = {
    "streams": [
        {
            "dia": "Segunda",
            "horario": "20:00 - 23:00",
            "plataforma": "twitch",
            "plataformaNome": "Twitch",
            "conteudo": "Gameplay variado"
        },
        {
            "dia": "Quarta",
            "horario": "19:00 - 22:00",
            "plataforma": "youtube",
            "plataformaNome": "YouTube",
            "conteudo": "Lives especiais"
        },
        {
            "dia": "Sexta",
            "horario": "21:00 - 00:00",
            "plataforma": "kick",
            "plataformaNome": "Kick",
            "conteudo": "Gameplay e conversas"
        }
    ],
    "ultimaAtualizacao": "23/05/2023"
};

// Esperar que o DOM seja carregado completamente
document.addEventListener('DOMContentLoaded', function() {
    // Função para atualizar o ano atual no footer
    function atualizarAno() {
        const anoAtual = new Date().getFullYear();
        const footerAno = document.querySelector('footer p');
        if (footerAno) {
            footerAno.innerHTML = footerAno.innerHTML.replace(/\d{4}/, anoAtual);
        }
    }

    // Função para adicionar efeito de destaque às plataformas
    function adicionarEfeitosPlataforma() {
        const cards = document.querySelectorAll('.platform-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                cards.forEach(c => {
                    if (c !== card) {
                        c.style.opacity = '0.7';
                    }
                });
            });
            
            card.addEventListener('mouseleave', function() {
                cards.forEach(c => {
                    c.style.opacity = '1';
                });
            });
        });
    }

    // Função para adicionar efeito de rolagem suave para links internos
    function configurarRolagemSuave() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Função para carregar e renderizar a agenda de streams
    function carregarAgenda() {
        const agendaContainer = document.getElementById('agenda-container');
        const lastUpdate = document.getElementById('last-update');
        
        if (!agendaContainer) return;
        
        // Mostrar mensagem de carregamento
        agendaContainer.innerHTML = '<p class="loading">Carregando agenda...</p>';
        
        // Tenta carregar do arquivo JSON, se falhar usa os dados de fallback
        try {
            fetch('agenda.json')
                .then(response => response.json())
                .then(data => {
                    // Atualizar data da última atualização
                    if (lastUpdate && data.ultimaAtualizacao) {
                        lastUpdate.textContent = data.ultimaAtualizacao;
                    }
                    
                    renderizarAgenda(data.streams || []);
                })
                .catch(error => {
                    console.warn('Erro ao carregar agenda do JSON, usando dados de fallback:', error);
                    // Usar dados de fallback
                    if (lastUpdate) {
                        lastUpdate.textContent = agendaFallback.ultimaAtualizacao;
                    }
                    renderizarAgenda(agendaFallback.streams);
                });
        } catch (error) {
            console.warn('Erro ao tentar fetch, usando dados de fallback:', error);
            // Usar dados de fallback diretamente
            if (lastUpdate) {
                lastUpdate.textContent = agendaFallback.ultimaAtualizacao;
            }
            renderizarAgenda(agendaFallback.streams);
        }
    }
    
    // Função para renderizar a agenda de streams
    function renderizarAgenda(streams) {
        const agendaContainer = document.getElementById('agenda-container');
        
        if (!agendaContainer) return;
        
        // Se não há itens na agenda
        if (!streams || streams.length === 0) {
            agendaContainer.innerHTML = '<p>Nenhum stream agendado no momento. Fique atento às redes sociais!</p>';
            return;
        }
        
        // Limpar conteúdo
        agendaContainer.innerHTML = '';
        
        // Criar grid para agenda
        const grid = document.createElement('div');
        grid.className = 'schedule-grid';
        
        // Adicionar cada item da agenda
        streams.forEach(stream => {
            const item = document.createElement('div');
            item.className = 'schedule-item';
            
            // Ícone baseado na plataforma
            let icone = 'fa-question';
            if (stream.plataforma === 'twitch') icone = 'fab fa-twitch';
            else if (stream.plataforma === 'youtube') icone = 'fab fa-youtube';
            else if (stream.plataforma === 'kick') icone = 'fas fa-gamepad';
            else if (stream.plataforma === 'tiktok') icone = 'fab fa-tiktok';
            
            // Estrutura do item
            item.innerHTML = `
                <div class="day">${stream.dia}</div>
                <div class="time">${stream.horario}</div>
                <div class="platform"><i class="${icone}"></i> ${stream.plataformaNome}</div>
                <div class="content">${stream.conteudo}</div>
            `;
            
            grid.appendChild(item);
        });
        
        agendaContainer.appendChild(grid);
    }

    // Chamada das funções
    atualizarAno();
    adicionarEfeitosPlataforma();
    configurarRolagemSuave();
    carregarAgenda();
}); 
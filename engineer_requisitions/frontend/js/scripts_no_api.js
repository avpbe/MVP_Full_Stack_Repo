/*
  --------------------------------------------------------------------------------------
  Variável para armazenar a lista de requisições em memória.
  Incluí alguns dados iniciais para demonstração.
  --------------------------------------------------------------------------------------
*/
let localRequests = [
    {
        nome_projeto: "Projeto Alfa",
        disciplina: "Estruturas",
        descricao: "Análise estrutural da plataforma P-76.",
        status: "Aberta"
    },
    {
        nome_projeto: "Projeto Beta",
        disciplina: "Análise de Instalação",
        descricao: "Verificação de dutos submarinos para o campo de Tupi.",
        status: "Em Andamento"
    },
    {
        nome_projeto: "Projeto Gama",
        disciplina: "Protótipos",
        descricao: "Desenvolvimento de um novo conector submarino.",
        status: "Concluída"
    }
];

/*
  --------------------------------------------------------------------------------------
  Função para renderizar a lista de requisições na tela.
  Pode receber uma lista filtrada para a funcionalidade de busca.
  --------------------------------------------------------------------------------------
*/
const renderRequests = (requests = localRequests) => {
    const requestsList = document.getElementById('requests-list');
    requestsList.innerHTML = ''; // Limpa a lista atual para evitar duplicatas
    requests.forEach(req => addRequestToCard(req));
};

/*
  --------------------------------------------------------------------------------------
  Função para criar e adicionar o card de uma requisição ao HTML.
  --------------------------------------------------------------------------------------
*/
const addRequestToCard = (req) => {
    const requestsList = document.getElementById('requests-list');
    const cardCol = document.createElement('div');
    cardCol.className = 'col-md-4 mb-4';
    cardCol.innerHTML = `
        <div class="card h-100 request-card">
            <div class="card-body">
                <button class="btn-close delete-btn" onclick="deleteRequest('${req.nome_projeto}')"></button>
                <h5 class="card-title">${req.nome_projeto}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${req.disciplina}</h6>
                <p class="card-text">${req.descricao}</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">Status: ${req.status}</small>
            </div>
        </div>
    `;
    requestsList.appendChild(cardCol);
};

/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma nova requisição ao array local.
  --------------------------------------------------------------------------------------
*/
const addRequest = (projectName, discipline, description) => {
    // Verifica se já existe uma requisição com o mesmo nome de projeto
    if (localRequests.some(req => req.nome_projeto.toLowerCase() === projectName.toLowerCase())) {
        alert(`Erro: A requisição "${projectName}" já existe.`);
        return;
    }

    const newRequest = {
        nome_projeto: projectName,
        disciplina: discipline,
        descricao: description,
        status: "Aberta" // Status padrão para novas requisições
    };

    localRequests.push(newRequest);
    alert("Requisição adicionada com sucesso!");
    renderRequests(); // Atualiza a lista na tela
};

/*
  --------------------------------------------------------------------------------------
  Função para deletar uma requisição do array local.
  --------------------------------------------------------------------------------------
*/
const deleteRequest = (projectName) => {
    if (confirm(`Tem certeza que deseja remover a requisição "${projectName}"?`)) {
        localRequests = localRequests.filter(req => req.nome_projeto !== projectName);
        alert("Requisição removida com sucesso!");
        renderRequests(); // Atualiza a lista na tela
    }
};

/*
  --------------------------------------------------------------------------------------
  Função para buscar requisições pelo nome do projeto.
  --------------------------------------------------------------------------------------
*/
const searchRequest = () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredRequests = localRequests.filter(req => req.nome_projeto.toLowerCase().includes(searchTerm));
    renderRequests(filteredRequests);
};

/*
  --------------------------------------------------------------------------------------
  Listeners de eventos
  --------------------------------------------------------------------------------------
*/
// Adiciona listener para o formulário de nova requisição
document.getElementById('new-request-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const projectName = document.getElementById('projectName').value;
    const discipline = document.getElementById('discipline').value;
    const description = document.getElementById('description').value;
    addRequest(projectName, discipline, description);
    this.reset(); // Limpa o formulário após o envio
});

// Carrega a lista inicial de requisições, pois o script já está no fim do body.
renderRequests();
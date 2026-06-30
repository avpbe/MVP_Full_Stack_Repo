/*
  ======================================================================================
  DADOS E LÓGICA PARA REQUISIÇÕES DE PROJETOS
  ======================================================================================
*/

let localRequests = [
    { nome_projeto: "Projeto Alfa", disciplina: "Estruturas", descricao: "Análise estrutural da plataforma P-76.", status: "Aberta" },
    { nome_projeto: "Projeto Beta", disciplina: "Análise de Instalação", descricao: "Verificação de dutos submarinos para o campo de Tupi.", status: "Em Andamento" },
    { nome_projeto: "Projeto Gama", disciplina: "Protótipos", descricao: "Desenvolvimento de um novo conector submarino.", status: "Concluída" }
];

const renderRequests = (requests = localRequests) => {
    const requestsList = document.getElementById('requests-list');
    requestsList.innerHTML = '';
    requests.forEach(req => addRequestToCard(req));
};

const addRequestToCard = (req) => {
    const requestsList = document.getElementById('requests-list');
    const cardCol = document.createElement('div');
    cardCol.className = 'col-md-6 mb-4'; // Ocupa metade do espaço na linha
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

const addRequest = (projectName, discipline, description) => {
    if (localRequests.some(req => req.nome_projeto.toLowerCase() === projectName.toLowerCase())) {
        alert(`Erro: A requisição "${projectName}" já existe.`);
        return;
    }
    const newRequest = { nome_projeto: projectName, disciplina: discipline, descricao: description, status: "Aberta" };
    localRequests.push(newRequest);
    alert("Requisição adicionada com sucesso!");
    renderRequests();
};

const deleteRequest = (projectName) => {
    if (confirm(`Tem certeza que deseja remover a requisição "${projectName}"?`)) {
        localRequests = localRequests.filter(req => req.nome_projeto !== projectName);
        renderRequests();
    }
};

const searchRequest = () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredRequests = localRequests.filter(req => req.nome_projeto.toLowerCase().includes(searchTerm));
    renderRequests(filteredRequests);
};

/*
  ======================================================================================
  DADOS E LÓGICA PARA CADASTRO DE ENGENHEIROS
  ======================================================================================
*/

let localEngineers = [
    { name: "João da Silva", role: "Engenheiro Sênior", discipline: "Estruturas", platformRole: "Admin" },
    { name: "Maria Oliveira", role: "Engenheira Plena", discipline: "Análise de Instalação", platformRole: "Checker" },
    { name: "Carlos Pereira", role: "Engenheiro Júnior", discipline: "Protótipos", platformRole: "Executer" }
];

const renderEngineers = (engineers = localEngineers) => {
    const engineersList = document.getElementById('engineers-list');
    engineersList.innerHTML = '';
    engineers.forEach(eng => addEngineerToList(eng));
};

const getRoleBadge = (platformRole) => {
    const roles = {
        'Admin': 'bg-danger',
        'Checker': 'bg-warning text-dark',
        'Executer': 'bg-primary'
    };
    return `<span class="badge ${roles[platformRole] || 'bg-secondary'}">${platformRole}</span>`;
};

const addEngineerToList = (eng) => {
    const engineersList = document.getElementById('engineers-list');
    const listItem = document.createElement('div');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    listItem.innerHTML = `
        <div>
            <h6 class="mb-0">${eng.name}</h6>
            <small class="text-muted">${eng.role} - ${eng.discipline}</small>
        </div>
        <div>
            ${getRoleBadge(eng.platformRole)}
            <button class="btn btn-sm btn-outline-danger ms-2" onclick="deleteEngineer('${eng.name}')">&times;</button>
        </div>
    `;
    engineersList.appendChild(listItem);
};

const addEngineer = (name, role, discipline, platformRole) => {
    if (localEngineers.some(eng => eng.name.toLowerCase() === name.toLowerCase())) {
        alert(`Erro: O engenheiro "${name}" já está cadastrado.`);
        return;
    }
    const newEngineer = { name, role, discipline, platformRole };
    localEngineers.push(newEngineer);
    alert("Engenheiro cadastrado com sucesso!");
    renderEngineers();
};

const deleteEngineer = (engineerName) => {
    if (confirm(`Tem certeza que deseja remover o engenheiro "${engineerName}"?`)) {
        localEngineers = localEngineers.filter(eng => eng.name !== engineerName);
        renderEngineers();
    }
};

/*
  ======================================================================================
  LISTENERS DE EVENTOS
  ======================================================================================
*/

// Listener para o formulário de nova requisição
document.getElementById('new-request-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const projectName = document.getElementById('projectName').value;
    const discipline = document.getElementById('discipline').value;
    const description = document.getElementById('description').value;
    addRequest(projectName, discipline, description);
    this.reset();
});

// Listener para o formulário de novo engenheiro
document.getElementById('new-engineer-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const engineerName = document.getElementById('engineerName').value;
    const engineerRole = document.getElementById('engineerRole').value;
    const engineerDiscipline = document.getElementById('engineerDiscipline').value;
    const engineerPlatformRole = document.getElementById('engineerPlatformRole').value;
    addEngineer(engineerName, engineerRole, engineerDiscipline, engineerPlatformRole);
    this.reset();
});

/*
  ======================================================================================
  INICIALIZAÇÃO DA PÁGINA
  ======================================================================================
*/

// Função para ser executada quando o DOM estiver pronto
const initializeApp = () => {
    renderRequests();
    renderEngineers();

    // Adiciona funcionalidade para os botões de colapso mudarem de texto
    const collapseElements = document.querySelectorAll('[data-bs-toggle="collapse"]');
    collapseElements.forEach(el => {
        const target = document.querySelector(el.getAttribute('data-bs-target'));
        
        target.addEventListener('show.bs.collapse', () => {
            el.textContent = 'Ocultar';
        });

        target.addEventListener('hide.bs.collapse', () => {
            el.textContent = 'Mostrar';
        });
    });
};

// Chama a inicialização da aplicação
initializeApp();
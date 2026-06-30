/*
  ======================================================================================
  ARMAZENAMENTO LOCAL SIMULADO
  Usando localStorage para que os dados persistam entre as páginas.
  ======================================================================================
*/

const getLocalData = (key, defaultValue) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
};

const setLocalData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

let localRequests = getLocalData('localRequests', [
    { nome_projeto: "Projeto Alfa", disciplina: "Estruturas", descricao: "Análise estrutural da plataforma P-76.", status: "Aberta" },
    { nome_projeto: "Projeto Beta", disciplina: "Análise de Instalação", descricao: "Verificação de dutos submarinos para o campo de Tupi.", status: "Em Andamento" }
]);

let localEngineers = getLocalData('localEngineers', [
    { name: "João da Silva", role: "Engenheiro Sênior", discipline: "Estruturas", platformRole: "Admin" },
    { name: "Maria Oliveira", role: "Engenheira Plena", discipline: "Análise de Instalação", platformRole: "Checker" }
]);

/*
  ======================================================================================
  LÓGICA PARA REQUISIÇÕES DE PROJETOS
  ======================================================================================
*/

const renderRequests = (requests = localRequests) => {
    const requestsList = document.getElementById('requests-list');
    if (!requestsList) return; // Só executa se o elemento existir na página
    requestsList.innerHTML = '';
    requests.forEach(req => addRequestToCard(req));
};

const addRequestToCard = (req) => {
    const requestsList = document.getElementById('requests-list');
    const cardCol = document.createElement('div');
    cardCol.className = 'col-md-6 mb-4';
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
    setLocalData('localRequests', localRequests); // Salva no localStorage
    alert("Requisição adicionada com sucesso!");
    renderRequests();
};

const deleteRequest = (projectName) => {
    if (confirm(`Tem certeza que deseja remover a requisição "${projectName}"?`)) {
        localRequests = localRequests.filter(req => req.nome_projeto !== projectName);
        setLocalData('localRequests', localRequests); // Salva no localStorage
        renderRequests();
    }
};

const searchRequest = () => {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    const searchTerm = searchInput.value.toLowerCase();
    const filteredRequests = localRequests.filter(req => req.nome_projeto.toLowerCase().includes(searchTerm));
    renderRequests(filteredRequests);
};

/*
  ======================================================================================
  LÓGICA PARA CADASTRO DE ENGENHEIROS
  ======================================================================================
*/

const renderEngineers = (engineers = localEngineers) => {
    const engineersList = document.getElementById('engineers-list');
    if (!engineersList) return; // Só executa se o elemento existir na página
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
    setLocalData('localEngineers', localEngineers); // Salva no localStorage
    alert("Engenheiro cadastrado com sucesso!");
    renderEngineers();
};

const deleteEngineer = (engineerName) => {
    if (confirm(`Tem certeza que deseja remover o engenheiro "${engineerName}"?`)) {
        localEngineers = localEngineers.filter(eng => eng.name !== engineerName);
        setLocalData('localEngineers', localEngineers); // Salva no localStorage
        renderEngineers();
    }
};

/*
  ======================================================================================
  INICIALIZAÇÃO E LISTENERS DE EVENTOS
  ======================================================================================
*/

const initializeApp = () => {
    // Inicializa a página de requisições se estiver nela
    const newRequestForm = document.getElementById('new-request-form');
    if (newRequestForm) {
        renderRequests();
        newRequestForm.addEventListener('submit', function (e) {
            e.preventDefault();
            addRequest(
                document.getElementById('projectName').value,
                document.getElementById('discipline').value,
                document.getElementById('description').value
            );
            this.reset();
        });
    }

    // Inicializa a página de engenheiros se estiver nela
    const newEngineerForm = document.getElementById('new-engineer-form');
    if (newEngineerForm) {
        renderEngineers();
        newEngineerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            addEngineer(
                document.getElementById('engineerName').value,
                document.getElementById('engineerRole').value,
                document.getElementById('engineerDiscipline').value,
                document.getElementById('engineerPlatformRole').value
            );
            this.reset();
        });
    }

    // Adiciona funcionalidade para os botões de colapso mudarem de texto
    const collapseElements = document.querySelectorAll('[data-bs-toggle="collapse"]');
    collapseElements.forEach(el => {
        const target = document.querySelector(el.getAttribute('data-bs-target'));
        if (!target) return;
        
        target.addEventListener('show.bs.collapse', () => { el.textContent = 'Ocultar'; });
        target.addEventListener('hide.bs.collapse', () => { el.textContent = 'Mostrar'; });
    });
};

// Chama a inicialização da aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeApp);
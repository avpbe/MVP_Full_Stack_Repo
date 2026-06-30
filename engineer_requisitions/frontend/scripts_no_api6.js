/*
  ======================================================================================
  ARMAZENAMENTO E DADOS
  ======================================================================================
*/
const getLocalData = (key, defaultValue) => JSON.parse(localStorage.getItem(key)) || defaultValue;
const setLocalData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

let localRequests = getLocalData('localRequests', [
    { nome_projeto: "Projeto Alfa", disciplina: "Estruturas", descricao: "Análise da P-76.", status: "Aberta", engineer: "João da Silva", startDate: "2024-01-15", endDate: "2024-03-20" },
    { nome_projeto: "Projeto Beta", disciplina: "Instalação", descricao: "Dutos de Tupi.", status: "Em Andamento", engineer: "Maria Oliveira", startDate: "2024-02-10", endDate: "2024-05-30" },
    { nome_projeto: "Projeto Delta", disciplina: "Estruturas", descricao: "Conectores.", status: "Aberta", engineer: "João da Silva", startDate: "2024-04-01", endDate: "2024-07-15" }
]);

let localEngineers = getLocalData('localEngineers', [
    { name: "João da Silva", role: "Engenheiro Sênior", discipline: "Estruturas", platformRole: "Admin" },
    { name: "Maria Oliveira", role: "Engenheira Plena", discipline: "Análise de Instalação", platformRole: "Checker" },
    { name: "Carlos Pereira", role: "Engenheiro Júnior", discipline: "Protótipos", platformRole: "Executer" }
]);

/*
  ======================================================================================
  FUNÇÃO PRINCIPAL DO DASHBOARD
  ======================================================================================
*/
const updateDashboard = () => {
    const selectedEngineer = document.getElementById('mainEngineerSelect').value;
    let filteredProjects;

    if (selectedEngineer === 'all') {
        filteredProjects = localRequests;
        document.getElementById('projects-title').textContent = 'Todos os Projetos';
        document.getElementById('gantt-title').textContent = 'Cronograma Geral';
    } else {
        filteredProjects = localRequests.filter(p => p.engineer === selectedEngineer);
        document.getElementById('projects-title').textContent = `Projetos de ${selectedEngineer}`;
        document.getElementById('gantt-title').textContent = `Cronograma de ${selectedEngineer}`;
    }

    renderRequests(filteredProjects);
    renderGanttChart(filteredProjects);
};

/*
  ======================================================================================
  RENDERIZAÇÃO DOS COMPONENTES
  ======================================================================================
*/

const renderRequests = (requests) => {
    const list = document.getElementById('requests-list');
    list.innerHTML = '';
    if (requests.length === 0) {
        list.innerHTML = '<p class="text-muted px-3">Nenhum projeto para exibir.</p>';
        return;
    }
    requests.forEach(req => {
        const card = document.createElement('div');
        card.className = 'col-12 mb-3'; // Uma coluna por projeto para melhor leitura
        card.innerHTML = `
            <div class="card request-card">
                <div class="card-body">
                    <button class="btn-close delete-btn" onclick="deleteRequest('${req.nome_projeto}')"></button>
                    <h6 class="card-title">${req.nome_projeto}</h6>
                    <p class="card-text mb-1"><small>${req.disciplina}</small></p>
                    <p class="card-text"><small class="text-muted">Engenheiro: ${req.engineer || 'Não atribuído'}</small></p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <small class="text-muted">Status: ${req.status}</small>
                    <small class="text-muted">${new Date(req.startDate).toLocaleDateString()} - ${new Date(req.endDate).toLocaleDateString()}</small>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
};

const renderGanttChart = (projects) => {
    const chartContainer = document.getElementById('gantt-chart');
    const timelineHeader = document.getElementById('gantt-timeline-header');
    chartContainer.innerHTML = '';
    timelineHeader.innerHTML = '';

    if (projects.length === 0) {
        chartContainer.innerHTML = `<p class="text-muted p-3">Nenhum projeto para exibir no cronograma.</p>`;
        return;
    }

    const allDates = projects.flatMap(p => [new Date(p.startDate), new Date(p.endDate)]);
    const minDate = new Date(Math.min.apply(null, allDates));
    const maxDate = new Date(Math.max.apply(null, allDates));
    minDate.setDate(1);
    maxDate.setMonth(maxDate.getMonth() + 1); maxDate.setDate(0);

    const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);

    let currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
        const monthEl = document.createElement('span');
        monthEl.textContent = currentDate.toLocaleString('pt-BR', { month: 'short' });
        timelineHeader.appendChild(monthEl);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    projects.forEach(project => {
        const projStart = new Date(project.startDate);
        const projEnd = new Date(project.endDate);
        const startOffset = (projStart - minDate) / (1000 * 60 * 60 * 24);
        const duration = (projEnd - projStart) / (1000 * 60 * 60 * 24);
        const left = (startOffset / totalDays) * 100;
        const width = (duration / totalDays) * 100;

        const row = document.createElement('div');
        row.className = 'gantt-row';
        const bar = document.createElement('div');
        bar.className = 'gantt-bar';
        bar.style.left = `${left}%`;
        bar.style.width = `${width}%`;
        bar.textContent = project.nome_projeto;
        bar.title = `${project.nome_projeto} (${projStart.toLocaleDateString()} - ${projEnd.toLocaleDateString()})`;
        row.appendChild(bar);
        chartContainer.appendChild(row);
    });
};

/*
  ======================================================================================
  AÇÕES (Adicionar, Deletar)
  ======================================================================================
*/

const addRequest = (projectName, discipline, description, engineer, startDate, endDate) => {
    if (new Date(startDate) >= new Date(endDate)) {
        return alert("Erro: A data de fim deve ser posterior à data de início.");
    }
    if (localRequests.some(req => req.nome_projeto.toLowerCase() === projectName.toLowerCase())) {
        return alert(`Erro: A requisição "${projectName}" já existe.`);
    }
    // Validação de conflito de datas
    const engineerProjects = localRequests.filter(p => p.engineer === engineer);
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
    const hasConflict = engineerProjects.some(p => {
        const existingStart = new Date(p.startDate);
        const existingEnd = new Date(p.endDate);
        return (newStart < existingEnd && newEnd > existingStart);
    });

    if (hasConflict) {
        return alert(`Erro: O engenheiro ${engineer} já está alocado em um projeto nesse período.`);
    }

    const newRequest = { nome_projeto: projectName, disciplina, description, engineer, startDate, endDate, status: "Aberta" };
    localRequests.push(newRequest);
    setLocalData('localRequests', localRequests);
    alert("Requisição adicionada com sucesso!");
    updateDashboard();
};

const deleteRequest = (projectName) => {
    if (confirm(`Tem certeza que deseja remover a requisição "${projectName}"?`)) {
        localRequests = localRequests.filter(req => req.nome_projeto !== projectName);
        setLocalData('localRequests', localRequests);
        updateDashboard();
    }
};

const addEngineer = (name, role, discipline, platformRole) => {
    if (localEngineers.some(eng => eng.name.toLowerCase() === name.toLowerCase())) {
        return alert(`Erro: O engenheiro "${name}" já está cadastrado.`);
    }
    const newEngineer = { name, role, discipline, platformRole };
    localEngineers.push(newEngineer);
    setLocalData('localEngineers', localEngineers);
    alert("Engenheiro cadastrado com sucesso!");
    populateEngineersDropdowns();
    populateEngineersDropdown('mainEngineerSelect'); // Atualiza o filtro principal também
};

/*
  ======================================================================================
  FUNÇÕES AUXILIARES E INICIALIZAÇÃO
  ======================================================================================
*/

const populateEngineersDropdown = (dropdownId) => {
    const select = document.getElementById(dropdownId);
    if (!select) return;

    const selectedValue = select.value;
    const placeholder = select.options[0];
    select.innerHTML = '';
    if (placeholder) {
        select.appendChild(placeholder);
    }

    localEngineers.forEach(eng => {
        const option = new Option(eng.name, eng.name);
        select.add(option);
    });
    select.value = selectedValue;
};

const initializeApp = () => {
    // Popula os dropdowns
    populateEngineersDropdown('mainEngineerSelect');

    // Configura o filtro principal
    document.getElementById('mainEngineerSelect').addEventListener('change', updateDashboard);

    // Configura o formulário de requisições no modal
    const newRequestForm = document.getElementById('new-request-form');
    const requestModal = new bootstrap.Modal(document.getElementById('newRequestModal'));
    const requestModalEl = document.getElementById('newRequestModal');

    // Popula o dropdown de engenheiros SOMENTE quando o modal for aberto
    requestModalEl.addEventListener('show.bs.modal', () => {
        populateEngineersDropdown('projectEngineer');
    });
    
    newRequestForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addRequest(
            document.getElementById('projectName').value,
            document.getElementById('discipline').value,
            document.getElementById('description').value,
            document.getElementById('projectEngineer').value,
            document.getElementById('startDate').value,
            document.getElementById('endDate').value
        );
        this.reset();
        requestModal.hide();
    });

    // Configura o formulário de engenheiros no modal
    const newEngineerForm = document.getElementById('new-engineer-form');
    const engineerModal = new bootstrap.Modal(document.getElementById('newEngineerModal'));
    newEngineerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addEngineer(
            document.getElementById('engineerName').value,
            document.getElementById('engineerRole').value,
            document.getElementById('engineerDiscipline').value,
            document.getElementById('engineerPlatformRole').value
        );
        this.reset();
        engineerModal.hide();
    });

    // Carrega o estado inicial do dashboard
    updateDashboard();
};

document.addEventListener('DOMContentLoaded', initializeApp);
const API_URL = 'http://127.0.0.1:5000';
let debounceTimer; // Variável para controlar o timer do debounce

/*
  ======================================================================================
  CONTROLE DE NAVEGAÇÃO DA SPA (SINGLE PAGE APPLICATION)
  ======================================================================================
*/

const showView = (viewId, headerTitle) => {
    document.querySelectorAll('.view').forEach(view => view.style.display = 'none');
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.style.display = 'block';
    const titleElement = document.getElementById('header-title');
    if (titleElement) titleElement.textContent = headerTitle;

    // Ações específicas ao mostrar uma view (pode ser expandido no futuro)
    if (viewId === 'requests-view') {
        getProjetos();
        getColaboradores();
    }
    if (viewId === 'engineers-view') {
        getColaboradores();
    }
};




/*
  ======================================================================================
  Funções para interagir com a API de PROJETOS
  ======================================================================================
*/

/**
 * Carrega os projetos da API e os exibe na tela.
 */
const getProjetos = async () => {
    try {
        const response = await fetch(`${API_URL}/projetos`);
        if (!response.ok) {
            throw new Error("Não foi possível carregar os projetos.");
        }
        const { projetos } = await response.json();
        renderProjetos(projetos);
    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        alert('Erro ao buscar projetos. Verifique o console para mais detalhes.');
    }
};

/**
 * Busca projetos na API com base em um termo de pesquisa e os exibe na tela.
 * @param {string} searchTerm - O termo para filtrar projetos por nome.
 */
const searchProjetos = async (searchTerm) => {
    // Se a busca estiver vazia, carrega todos os projetos
    if (!searchTerm.trim()) {
        getProjetos();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/projetos/busca?nome_projeto=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error("Erro na busca de projetos.");
        const { projetos } = await response.json();
        renderProjetos(projetos);
    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
    }
};

/**
 * Renderiza uma lista de projetos na interface.
 * @param {Array<object>} projetos - A lista de projetos a ser renderizada.
 */
const renderProjetos = (projetos) => {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;

    projectsList.innerHTML = ''; // Limpa a lista antes de adicionar os novos itens
    projetos.forEach(addProjetoToCard);
};

/**
 * Adiciona um card de projeto na interface.
 * @param {object} projeto - O objeto do projeto a ser exibido.
 */
const addProjetoToCard = (projeto) => {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;

    const cardCol = document.createElement('div');
    cardCol.className = 'col-md-4 mb-4';
    cardCol.innerHTML = `
        <div class="card h-100">
            <div class="card-body position-relative">
                <div class="position-absolute top-0 end-0 p-2">
                    <button class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#projectModal" onclick='openProjectModal(${JSON.stringify(projeto)})' title="Editar projeto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg>
                    </button>
                    <button class="btn btn-sm" onclick="deleteProjeto('${projeto.nome_projeto}')" title="Remover projeto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>
                    </button>
                </div>
                <h5 class="card-title">${projeto.nome_projeto}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${projeto.disciplina}</h6>
                <p class="card-text">${projeto.descricao}</p>
                <p class="card-text"><small>Colaborador: ${projeto.colaborador ? projeto.colaborador.nome : 'Não atribuído'}</small></p>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
                <small class="text-muted">${new Date(projeto.data_inicio).toLocaleDateString()} - ${new Date(projeto.data_fim).toLocaleDateString()}</small>
                ${getStatusBadge(projeto.status)}
            </div>
        </div>
    `;
    projectsList.appendChild(cardCol);
};

/**
 * Retorna um badge HTML colorido para o status do projeto.
 * @param {string} status - O status do projeto.
 */
const getStatusBadge = (status) => {
    const statusClasses = { 'Aberto': 'bg-primary', 'Em Andamento': 'bg-warning text-dark', 'Concluído': 'bg-success', 'Cancelado': 'bg-danger' };
    const badgeClass = statusClasses[status] || 'bg-secondary';
    return `<span class="badge ${badgeClass}">${status}</span>`;
}

/**
 * Deleta um projeto via API.
 * @param {string} nomeProjeto - O nome do projeto a ser deletado.
 */
const deleteProjeto = async (nomeProjeto) => {
    if (confirm(`Tem certeza que deseja remover o projeto "${nomeProjeto}"?`)) {
        try {
            const response = await fetch(`${API_URL}/projeto?nome_projeto=${encodeURIComponent(nomeProjeto)}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert("Projeto removido com sucesso!");
                getProjetos(); // Atualiza a lista
            } else {
                const errorData = await response.json();
                alert(`Erro ao remover projeto: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert("Ocorreu um erro ao tentar remover o projeto.");
        }
    }
};

/**
 * Abre e configura o modal de projeto para Adição ou Edição.
 * @param {object | null} projeto - O objeto do projeto para edição, ou null para adição.
 */
const openProjectModal = (projeto = null) => {
    const form = document.getElementById('project-form');
    const modalLabel = document.getElementById('projectModalLabel');
    const submitButton = document.getElementById('projectSubmitButton');
    const originalNameInput = document.getElementById('projectOriginalName');

    form.reset(); // Limpa o formulário

    if (projeto) { // Modo Edição
        modalLabel.textContent = 'Editar Projeto';
        submitButton.textContent = 'Salvar Alterações';
        submitButton.className = 'btn btn-primary';

        originalNameInput.value = projeto.nome_projeto;
        form.projectName.value = projeto.nome_projeto;
        form.discipline.value = projeto.disciplina;
        form.description.value = projeto.descricao;
        form.projectStatus.value = projeto.status;
        form.startDate.value = new Date(projeto.data_inicio).toISOString().split('T')[0];
        form.endDate.value = new Date(projeto.data_fim).toISOString().split('T')[0];
        form.projectEngineer.value = projeto.colaborador ? projeto.colaborador.id : "";

    } else { // Modo Adição
        modalLabel.textContent = 'Nova Requisição';
        submitButton.textContent = 'Adicionar Requisição';
        submitButton.className = 'btn btn-primary';
        originalNameInput.value = ''; // Garante que está vazio para o modo de adição
    }
};

/**
 * Manipula a submissão do formulário de projeto (criação ou atualização).
 */
const handleProjectSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const originalName = document.getElementById('projectOriginalName').value;
    const isEditMode = !!originalName;

    const body = {
        nome_projeto: form.projectName.value,
        disciplina: form.discipline.value,
        descricao: form.description.value,
        status: form.projectStatus.value,
        data_inicio: form.startDate.value,
        data_fim: form.endDate.value,
        colaborador_id: parseInt(form.projectEngineer.value) || null
    };

    const url = isEditMode ? `${API_URL}/projeto?nome_projeto=${encodeURIComponent(originalName)}` : `${API_URL}/projeto`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

        if (response.ok) {
            alert(`Projeto ${isEditMode ? 'atualizado' : 'adicionado'} com sucesso!`);
            const modalEl = document.getElementById('projectModal');
            const modal = bootstrap.Modal.getInstance(modalEl);

            // A forma correta de lidar com a atualização da UI após fechar um modal.
            // O evento 'hidden.bs.modal' é disparado somente quando a animação de fechar termina.
            // A opção { once: true } garante que este listener seja executado apenas uma vez.
            modalEl.addEventListener('hidden.bs.modal', () => {
                getProjetos();
            }, { once: true });
            
            modal.hide();
        } else {
            const errorData = await response.json();
            alert(`Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} projeto: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert(`Ocorreu um erro ao tentar ${isEditMode ? 'atualizar' : 'adicionar'} o projeto.`);
    }
};


/*
  ======================================================================================
  Funções para interagir com a API de COLABORADORES
  ======================================================================================
*/

/**
 * Carrega os colaboradores da API e os popula em dropdowns.
 */
const getColaboradores = async () => {
    try {
        const response = await fetch(`${API_URL}/colaboradores`);
        if (!response.ok) throw new Error("Não foi possível carregar os colaboradores.");
        
        const data = await response.json();
        const dropdown = document.getElementById('projectEngineer'); // Supondo um <select> no seu form de projeto
        renderColaboradores(data.colaboradores); // Renderiza a lista de engenheiros na tela

        if (dropdown) {
            // Limpa opções antigas, mantendo a primeira ("Selecione...")
            while (dropdown.options.length > 1) {
                dropdown.remove(1);
            }
            data.colaboradores.forEach(colab => {
                const option = new Option(`${colab.nome} (${colab.disciplina})`, colab.id);
                dropdown.add(option);
            });
        }
    } catch (error) {
        console.error('Erro ao buscar colaboradores:', error);
    }
};

/**
 * Renderiza a lista de colaboradores na interface.
 * @param {Array} colaboradores - A lista de objetos de colaborador.
 */
const renderColaboradores = (colaboradores) => {
    const engineersList = document.getElementById('engineers-list');
    if (!engineersList) return;

    engineersList.innerHTML = ''; // Limpa a lista antes de adicionar
    colaboradores.forEach(colab => {
        const item = document.createElement('div');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        const atribuicaoBadge = ((atribuicao) => {
            const badges = {
                'Elaborador': 'bg-primary',
                'Revisor': 'bg-warning text-dark',
                'Aprovador': 'bg-success'
            };
            return `<span class="badge ${badges[atribuicao] || 'bg-secondary'}">${atribuicao}</span>`;
        })(colab.atribuicao);

        item.innerHTML = `
            <div>
                <h6 class="mb-0">${colab.nome}</h6>
                <small class="text-muted">${colab.cargo} - ${colab.disciplina}</small>
            </div>
            <div>
                ${atribuicaoBadge}
                <button class="btn btn-sm btn-outline-primary ms-2" data-bs-toggle="modal" data-bs-target="#colaboradorModal" onclick='openColaboradorModal(${JSON.stringify(colab)})' title="Editar Colaborador">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/></svg>
                </button>
                <button class="btn btn-sm btn-outline-danger ms-2" onclick="deleteColaborador('${colab.nome}')" title="Remover Colaborador">&times;</button>
            </div>
        `;
        engineersList.appendChild(item);
    });
};

/**
 * Deleta um colaborador via API.
 * @param {string} nomeColaborador - O nome do colaborador a ser deletado.
 */
const deleteColaborador = async (nomeColaborador) => {
    if (confirm(`Tem certeza que deseja remover o colaborador "${nomeColaborador}"?`)) {
        try {
            const response = await fetch(`${API_URL}/colaborador?nome=${encodeURIComponent(nomeColaborador)}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert("Colaborador removido com sucesso!");
                getColaboradores(); // Atualiza a lista de colaboradores
            } else {
                const errorData = await response.json();
                alert(`Erro ao remover colaborador: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert("Ocorreu um erro ao tentar remover o colaborador.");
        }
    }
};

/**
 * Abre e configura o modal de colaborador para Adição ou Edição.
 * @param {object | null} colaborador - O objeto do colaborador para edição, ou null para adição.
 */
const openColaboradorModal = (colaborador = null) => {
    const form = document.getElementById('colaborador-form');
    const modalLabel = document.getElementById('colaboradorModalLabel');
    const submitButton = document.getElementById('colaboradorSubmitButton');
    const originalNameInput = document.getElementById('colaboradorOriginalName');

    form.reset();

    if (colaborador) { // Modo Edição
        modalLabel.textContent = 'Editar Colaborador';
        submitButton.textContent = 'Salvar Alterações';
        originalNameInput.value = colaborador.nome;
        form.engineerName.value = colaborador.nome;
        form.engineerRole.value = colaborador.cargo;
        form.engineerDiscipline.value = colaborador.disciplina;
        form.engineerPlatformRole.value = colaborador.atribuicao;
    } else { // Modo Adição
        modalLabel.textContent = 'Cadastrar Novo Engenheiro';
        submitButton.textContent = 'Cadastrar Engenheiro';
        originalNameInput.value = '';
    }
};

/**
 * Manipula a submissão do formulário de colaborador (criação ou atualização).
 */
const handleColaboradorSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const originalName = document.getElementById('colaboradorOriginalName').value;
    const isEditMode = !!originalName;

    const body = {
        nome: form.engineerName.value,
        cargo: form.engineerRole.value,
        disciplina: form.engineerDiscipline.value,
        atribuicao: form.engineerPlatformRole.value
    };

    const url = isEditMode ? `${API_URL}/colaborador?nome=${encodeURIComponent(originalName)}` : `${API_URL}/colaborador`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

        if (response.ok) {
            alert(`Colaborador ${isEditMode ? 'atualizado' : 'adicionado'} com sucesso!`);
            const modalEl = document.getElementById('colaboradorModal');
            const modal = bootstrap.Modal.getInstance(modalEl);

            // Adiciona um listener para atualizar a lista APÓS o modal ser completamente fechado
            modalEl.addEventListener('hidden.bs.modal', () => {
                getColaboradores();
            }, { once: true });
            
            modal.hide();
        } else {
            const errorData = await response.json();
            alert(`Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} colaborador: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert(`Ocorreu um erro ao tentar ${isEditMode ? 'atualizar' : 'adicionar'} o colaborador.`);
    }
};


/*
  ======================================================================================
  Inicialização e Listeners de Eventos
  ======================================================================================
*/
document.addEventListener('DOMContentLoaded', () => {
    // Mostra a tela inicial do dashboard
    showView('dashboard-view', 'Dashboard Principal');

    // Adiciona listeners aos botões de "Adicionar" para abrir os modais em modo de criação
    document.querySelector('button[data-bs-target="#projectModal"]').addEventListener('click', () => openProjectModal());
    document.querySelector('button[data-bs-target="#colaboradorModal"]').addEventListener('click', () => openColaboradorModal());

    // Adiciona listeners aos formulários
    const projectForm = document.getElementById('project-form');
    if (projectForm) projectForm.addEventListener('submit', handleProjectSubmit);

    const colaboradorForm = document.getElementById('colaborador-form');
    if (colaboradorForm) colaboradorForm.addEventListener('submit', handleColaboradorSubmit);

    // Adiciona listener para a barra de busca de projetos
    const searchInput = document.getElementById('project-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            // Limpa o timer anterior para reiniciar a contagem
            clearTimeout(debounceTimer);
            // Define um novo timer para executar a busca após 300ms
            debounceTimer = setTimeout(() => {
                searchProjetos(e.target.value);
            }, 300);
        });
    }
});
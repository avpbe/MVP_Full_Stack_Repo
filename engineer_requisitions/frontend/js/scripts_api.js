const API_URL = 'http://127.0.0.1:5000';

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
    // if (viewId === 'schedule-view') { ... }
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
        const data = await response.json();
        const projectsList = document.getElementById('projects-list'); // Supondo que você tenha um elemento com este ID no seu HTML
        if (!projectsList) return;

        projectsList.innerHTML = ''; // Limpa a lista antes de adicionar os novos itens
        // Itera sobre a lista de projetos retornada pela API e cria um card para cada um
        data.projetos.forEach(addProjetoToCard);
    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        alert('Erro ao buscar projetos. Verifique o console para mais detalhes.');
    }
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
            <div class="card-body">
                <button class="btn-close position-absolute top-0 end-0 p-2" onclick="deleteProjeto('${projeto.nome_projeto}')" title="Remover projeto"></button>
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
 * Envia um novo projeto para a API.
 */
const postProjeto = async (event) => {
    event.preventDefault();
    const form = event.target;
    const body = {
        nome_projeto: form.projectName.value,
        disciplina: form.discipline.value,
        descricao: form.description.value,
        status: form.projectStatus.value,
        data_inicio: form.startDate.value,
        data_fim: form.endDate.value,
        colaborador_id: parseInt(form.projectEngineer.value) || null
    };

    try {
        const response = await fetch(`${API_URL}/projeto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            alert("Projeto adicionado com sucesso!");
            getProjetos(); // Atualiza a lista de projetos
            form.reset();
        } else {
            const errorData = await response.json();
            alert(`Erro ao adicionar projeto: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert("Ocorreu um erro ao tentar adicionar o projeto.");
    }
};

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
            <button class="btn btn-sm btn-outline-danger ms-2" onclick="deleteColaborador('${colab.nome}')" title="Remover Colaborador">&times;</button>
        `;
        engineersList.appendChild(item);
    });
};

/**
 * Envia um novo colaborador para a API.
 */
const postColaborador = async (event) => {
    event.preventDefault();
    const form = event.target;
    const body = {
        nome: form.engineerName.value,
        cargo: form.engineerRole.value,
        disciplina: form.engineerDiscipline.value,
        atribuicao: form.engineerPlatformRole.value
    };

    try {
        const response = await fetch(`${API_URL}/colaborador`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            alert("Colaborador adicionado com sucesso!");
            getColaboradores(); // Atualiza a lista de colaboradores no dropdown
            form.reset();
        } else {
            const errorData = await response.json();
            alert(`Erro ao adicionar colaborador: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert("Ocorreu um erro ao tentar adicionar o colaborador.");
    }
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

/*
  ======================================================================================
  Inicialização e Listeners de Eventos
  ======================================================================================
*/
document.addEventListener('DOMContentLoaded', () => {
    // Mostra a tela inicial do dashboard
    showView('dashboard-view', 'Dashboard Principal');

    // Carrega dados da API em segundo plano
    getProjetos();
    getColaboradores();

    // Adiciona listeners aos formulários
    const newProjectForm = document.getElementById('new-project-form');
    if (newProjectForm) newProjectForm.addEventListener('submit', postProjeto);

    const newEngineerForm = document.getElementById('new-engineer-form');
    if (newEngineerForm) newEngineerForm.addEventListener('submit', postColaborador);
});
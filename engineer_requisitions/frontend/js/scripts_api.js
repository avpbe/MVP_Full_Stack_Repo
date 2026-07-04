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
                <div class="position-absolute top-0 end-0 p-2">
                    <button class="btn btn-sm" onclick='openEditModal(${JSON.stringify(projeto)})' title="Editar projeto">
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

/**
 * Abre o modal de edição e preenche com os dados do projeto.
 * @param {object} projeto - O objeto do projeto a ser editado.
 */
const openEditModal = (projeto) => {
    // Preenche os campos do formulário no modal
    document.getElementById('editProjectOriginalName').value = projeto.nome_projeto;
    document.getElementById('editProjectName').value = projeto.nome_projeto;
    document.getElementById('editProjectDescription').value = projeto.descricao;

    // Popula e seleciona o status
    const statusSelect = document.getElementById('editProjectStatus');
    statusSelect.innerHTML = ''; // Limpa opções antigas
    ['Aberto', 'Em Andamento', 'Concluído', 'Cancelado'].forEach(status => {
        const option = new Option(`Status: ${status}`, status);
        if (status === projeto.status) {
            option.selected = true;
        }
        statusSelect.add(option);
    });

    // Popula e seleciona o engenheiro
    const engineerSelect = document.getElementById('editProjectEngineer');
    const projectEngineerOptions = document.getElementById('projectEngineer').innerHTML; // Pega opções já carregadas
    engineerSelect.innerHTML = projectEngineerOptions;
    if (projeto.colaborador) {
        engineerSelect.value = projeto.colaborador.id;
    } else {
        engineerSelect.value = ""; // Seleciona "Atribuir a um engenheiro..."
    }

    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById('editProjectModal'));
    modal.show();
};

/**
 * Submete o formulário de edição do projeto.
 */
const submitProjectEdit = async () => {
    const form = document.getElementById('edit-project-form');
    const originalName = form.originalName.value;

    const body = {
        nome_projeto: form.nome_projeto.value,
        descricao: form.descricao.value,
        status: form.status.value,
        colaborador_id: parseInt(form.colaborador_id.value) || null
    };

    try {
        const response = await fetch(`${API_URL}/projeto?nome_projeto=${encodeURIComponent(originalName)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            alert("Projeto atualizado com sucesso!");
            getProjetos(); // Atualiza a lista de projetos
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProjectModal'));
            modal.hide();
        } else {
            const errorData = await response.json();
            alert(`Erro ao atualizar projeto: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert("Ocorreu um erro ao tentar atualizar o projeto.");
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
                <button class="btn btn-sm btn-outline-primary ms-2" onclick='openEditColaboradorModal(${JSON.stringify(colab)})' title="Editar Colaborador">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/></svg>
                </button>
                <button class="btn btn-sm btn-outline-danger ms-2" onclick="deleteColaborador('${colab.nome}')" title="Remover Colaborador">&times;</button>
            </div>
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

/**
 * Abre o modal de edição de colaborador e preenche com os dados.
 * @param {object} colaborador - O objeto do colaborador a ser editado.
 */
const openEditColaboradorModal = (colaborador) => {
    document.getElementById('editColaboradorOriginalName').value = colaborador.nome;
    document.getElementById('editColaboradorName').value = colaborador.nome;
    document.getElementById('editColaboradorDiscipline').value = colaborador.disciplina;

    // Popula e seleciona o cargo
    const roleSelect = document.getElementById('editColaboradorRole');
    roleSelect.innerHTML = '';
    ['Engenheiro Junior', 'Engenheiro Pleno', 'Engenheiro Senior'].forEach(role => {
        const option = new Option(role, role);
        if (role === colaborador.cargo) option.selected = true;
        roleSelect.add(option);
    });

    // Popula e seleciona a atribuição
    const platformRoleSelect = document.getElementById('editColaboradorPlatformRole');
    platformRoleSelect.innerHTML = '';
    ['Elaborador', 'Revisor', 'Aprovador'].forEach(role => {
        const option = new Option(role, role);
        if (role === colaborador.atribuicao) option.selected = true;
        platformRoleSelect.add(option);
    });

    const modal = new bootstrap.Modal(document.getElementById('editColaboradorModal'));
    modal.show();
};

/**
 * Submete o formulário de edição do colaborador.
 */
const submitColaboradorEdit = async () => {
    const form = document.getElementById('edit-colaborador-form');
    const originalName = form.originalName.value;

    const body = {
        nome: form.nome.value,
        cargo: form.cargo.value,
        disciplina: form.disciplina.value,
        atribuicao: form.atribuicao.value
    };

    try {
        const response = await fetch(`${API_URL}/colaborador?nome=${encodeURIComponent(originalName)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            alert("Colaborador atualizado com sucesso!");
            getColaboradores(); // Atualiza a lista de colaboradores
            const modal = bootstrap.Modal.getInstance(document.getElementById('editColaboradorModal'));
            modal.hide();
        } else {
            const errorData = await response.json();
            alert(`Erro ao atualizar colaborador: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert("Ocorreu um erro ao tentar atualizar o colaborador.");
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
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from models import StatusProjeto
from schemas.colaborador import ColaboradorViewSchema

class ProjetoSchema(BaseModel):
    """ Define como um novo projeto a ser inserido deve ser representado """
    nome_projeto: str = "Projeto Alfa"
    disciplina: str = "Instalação"
    descricao: str = "Análise de dutos flexíveis"
    status: StatusProjeto = StatusProjeto.ABERTO
    data_inicio: datetime
    data_fim: datetime
    colaborador_id: Optional[int] = None

class ProjetoBuscaSchema(BaseModel):
    """ Define como deve ser a estrutura que representa a busca por nome do projeto. """
    nome_projeto: str = "Projeto Alfa"

class ProjetoViewSchema(BaseModel):
    """ Define como um projeto será retornado, incluindo o colaborador. """
    id: int = 1
    nome_projeto: str = "Projeto Alfa"
    disciplina: str = "Instalação"
    descricao: str = "Análise de dutos flexíveis"
    status: StatusProjeto = StatusProjeto.ABERTO
    data_inicio: datetime
    data_fim: datetime
    colaborador: Optional[ColaboradorViewSchema] = None

class ListagemProjetosSchema(BaseModel):
    """ Define como uma listagem de projetos será retornada. """
    projetos: List[ProjetoViewSchema]

def apresenta_projetos(projetos: List[any]):
    """ Retorna uma representação do projeto seguindo o schema definido. """
    """ Retorna uma representação do projeto seguindo o schema definido em ProjetoViewSchema. """
    result = []
    for proj in projetos:
        result.append({
            "id": proj.id,
            "nome_projeto": proj.nome_projeto,
            "disciplina": proj.disciplina,
            "descricao": proj.descricao,
            "status": proj.status,
            "data_inicio": proj.data_inicio,
            "data_fim": proj.data_fim,
            "colaborador": proj.colaborador,
        })
        # Utiliza o ProjetoViewSchema para serializar o objeto Projeto do SQLAlchemy
        result.append(ProjetoViewSchema.model_validate(proj))
    return {"projetos": result}
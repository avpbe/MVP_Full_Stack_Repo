from pydantic import BaseModel
from typing import List
from models import Requisicao
 
 
class RequisicaoSchema(BaseModel):
    """ Define como uma nova requisição deve ser representada ao ser inserida.
    """
    nome_projeto: str = "Projeto Exemplo"
    disciplina: str = "Análise de Instalação"
    descricao: str = "Análise de viabilidade da instalação do equipamento X."
 
 
class RequisicaoBuscaSchema(BaseModel):
    """ Define como deve ser a estrutura que representa a busca.
        A busca será feita apenas com base no nome do projeto.
    """
    nome_projeto: str = "Projeto Exemplo"
 
 
class RequisicaoViewSchema(BaseModel):
    """ Define como uma requisição será retornada.
    """
    id: int = 1
    nome_projeto: str = "Projeto Exemplo"
    disciplina: str = "Análise de Instalação"
    descricao: str = "Análise de viabilidade da instalação do equipamento X."
    status: str = "Aberta"
 
 
class ListagemRequisicoesSchema(BaseModel):
    """ Define como uma listagem de requisições será retornada.
    """
    requisicoes:List[RequisicaoViewSchema]
 
 
def apresenta_requisicoes(requisicoes: List[Requisicao]):
    """ Retorna uma representação da requisição seguindo o schema definido em
        RequisicaoViewSchema.
    """
    result = []
    for req in requisicoes:
        result.append(apresenta_requisicao(req))
    return {"requisicoes": result}
 
 
def apresenta_requisicao(requisicao: Requisicao):
    """ Retorna uma representação da requisição seguindo o schema definido em
        RequisicaoViewSchema.
    """
    return {
        "id": requisicao.id,
        "nome_projeto": requisicao.nome_projeto,
        "disciplina": requisicao.disciplina,
        "descricao": requisicao.descricao,
        "status": requisicao.status.value
    }
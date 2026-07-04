from pydantic import BaseModel
from typing import List
from models import AtribuicaoColaborador, CargoColaborador, Colaborador

class ColaboradorSchema(BaseModel):
    """ Define como um novo colaborador a ser inserido deve ser representado """
    nome: str = "João da Silva"
    cargo: CargoColaborador = CargoColaborador.SENIOR
    disciplina: str = "Estruturas"
    atribuicao: AtribuicaoColaborador = AtribuicaoColaborador.ELABORADOR

class ColaboradorBuscaSchema(BaseModel):
    """ Define como deve ser a estrutura que representa a busca por nome. """
    nome: str = "João da Silva"

class ColaboradorViewSchema(BaseModel):
    """ Define como um colaborador será retornado """
    id: int = 1
    nome: str = "João da Silva"
    cargo: CargoColaborador = CargoColaborador.SENIOR
    disciplina: str = "Estruturas"
    atribuicao: AtribuicaoColaborador = AtribuicaoColaborador.ELABORADOR

class ListagemColaboradoresSchema(BaseModel):
    """ Define como uma listagem de colaboradores será retornada. """
    colaboradores: List[ColaboradorViewSchema]

class ColaboradorDelSchema(BaseModel):
    """ Define como deve ser a estrutura do dado retornado após uma requisição
        de remoção.
    """
    message: str
    nome: str

def apresenta_colaboradores(colaboradores: List[Colaborador]):
    """ Retorna uma representação do colaborador seguindo o schema definido em
        ListagemColaboradoresSchema.
    """
    result = []
    for colab in colaboradores:
        result.append({
            "id": colab.id,
            "nome": colab.nome,
            "cargo": colab.cargo,
            "disciplina": colab.disciplina,
            "atribuicao": colab.atribuicao,
        })
    return {"colaboradores": result}
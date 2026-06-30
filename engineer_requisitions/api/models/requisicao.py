from sqlalchemy import Column, String, Integer, DateTime, Enum as SQLAlchemyEnum
from datetime import datetime
from typing import Union
import enum

from ... import Base

class StatusRequisicao(enum.Enum):
    ABERTA = "Aberta"
    EM_ANDAMENTO = "Em Andamento"
    CONCLUIDA = "Concluída"
    CANCELADA = "Cancelada"

class Requisicao(Base):
    __tablename__ = 'requisicao'

    id = Column(Integer, primary_key=True)
    nome_projeto = Column(String(140), unique=True)
    disciplina = Column(String(140))
    descricao = Column(String(2000))
    status = Column(SQLAlchemyEnum(StatusRequisicao), nullable=False, default=StatusRequisicao.ABERTA)
    data_insercao = Column(DateTime, default=datetime.now())
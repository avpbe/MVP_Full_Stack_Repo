from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

# URL de acesso ao banco
# O banco será criado no mesmo diretório da API
db_url = 'sqlite:///requisicoes.db'

# Cria a engine de conexão com o banco
engine = create_engine(db_url, echo=False)

# Instancia um criador de sessão com o banco
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Cria a base declarativa para o modelo SQLAlchemy
Base = declarative_base()

# Importa o modelo para que o Base o reconheça
from .requisicao import Requisicao, StatusRequisicao
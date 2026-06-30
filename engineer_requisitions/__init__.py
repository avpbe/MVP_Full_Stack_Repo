from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
import os
 
# Diretório do banco de dados
db_path = "db/"
# Nome do arquivo do banco
db_name = "requisicoes.db"
 
# Cria o diretório se ele não existir
if not os.path.exists(db_path):
   os.makedirs(db_path)
 
# URL de acesso ao banco
db_url = f'sqlite:///{db_path}{db_name}'
 
# Cria a engine de conexão com o banco
engine = create_engine(db_url, echo=False)
 
# Instancia um criador de sessão com o banco
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
 
# Cria a base declarativa
Base = declarative_base()
from flask_openapi3 import OpenAPI, Info, Tag
from flask import redirect
from urllib.parse import unquote
 
from sqlalchemy.exc import IntegrityError
 
from models import Session, Requisicao, Base, engine, StatusRequisicao
from schemas.requisicao import RequisicaoSchema, RequisicaoBuscaSchema, RequisicaoViewSchema, ListagemRequisicoesSchema, apresenta_requisicao, apresenta_requisicoes
from schemas.error import ErrorSchema
from flask_cors import CORS
 
info = Info(title="MVP - API de Requisições de Engenharia", version="1.0.0")
app = OpenAPI(__name__, info=info)
CORS(app)
 
# Definição de tags para organização da documentação Swagger
home_tag = Tag(name="Documentação", description="Seleção de documentação: Swagger, Redoc ou RapiDoc")
requisicao_tag = Tag(name="Requisição", description="Adição, visualização e remoção de requisições à base")
 
 
@app.get('/', tags=[home_tag])
def home():
    """Redireciona para /openapi, tela de documentação swagger.
    """
    return redirect('/openapi')
 
 
@app.post('/requisicao', tags=[requisicao_tag],
          responses={"200": RequisicaoViewSchema, "409": ErrorSchema, "400": ErrorSchema})
def add_requisicao(form: RequisicaoSchema):
    """Adiciona uma nova Requisição à base de dados
 
    Retorna uma representação da requisição inserida.
    """
    requisicao = Requisicao(
        nome_projeto=form.nome_projeto,
        disciplina=form.disciplina,
        descricao=form.descricao,
        status=StatusRequisicao.ABERTA) # Status padrão ao criar
 
    try:
        session = Session()
        session.add(requisicao)
        session.commit()
        return apresenta_requisicao(requisicao), 200
 
    except IntegrityError as e:
        error_msg = "Requisição com o mesmo nome de projeto já salva na base."
        return {"message": error_msg}, 409
 
    except Exception as e:
        error_msg = "Não foi possível salvar nova requisição."
        return {"message": error_msg}, 400
 
 
@app.get('/requisicoes', tags=[requisicao_tag],
         responses={"200": ListagemRequisicoesSchema, "404": ErrorSchema})
def get_requisicoes():
    """Faz a busca por todas as Requisições cadastradas
 
    Retorna uma representação da listagem de requisições.
    """
    session = Session()
    requisicoes = session.query(Requisicao).all()
 
    if not requisicoes:
        return {"requisicoes": []}, 200
    else:
        return apresenta_requisicoes(requisicoes), 200
 
 
@app.get('/requisicao', tags=[requisicao_tag],
         responses={"200": RequisicaoViewSchema, "404": ErrorSchema})
def get_requisicao(query: RequisicaoBuscaSchema):
    """Faz a busca por uma Requisição a partir do nome do projeto
 
    Retorna uma representação da requisição encontrada.
    """
    nome_projeto = query.nome_projeto
    session = Session()
    requisicao = session.query(Requisicao).filter(Requisicao.nome_projeto == nome_projeto).first()
 
    if not requisicao:
        error_msg = "Requisição não encontrada na base."
        return {"message": error_msg}, 404
    else:
        return apresenta_requisicao(requisicao), 200
 
 
@app.delete('/requisicao', tags=[requisicao_tag],
            responses={"200": RequisicaoViewSchema, "404": ErrorSchema})
def del_requisicao(query: RequisicaoBuscaSchema):
    """Deleta uma Requisição a partir do nome do projeto informado
 
    Retorna uma mensagem de confirmação da remoção.
    """
    nome_projeto = unquote(unquote(query.nome_projeto))
 
    session = Session()
    count = session.query(Requisicao).filter(Requisicao.nome_projeto == nome_projeto).delete()
    session.commit()
 
    if count:
        return {"message": "Requisição removida", "id": nome_projeto}
    else:
        error_msg = "Requisição não encontrada na base."
        return {"message": error_msg}, 404
 
 
# Se precisar criar o banco de dados e a tabela pela primeira vez
if __name__ == '__main__':
    # Cria as tabelas do banco de dados, se não existirem
    Base.metadata.create_all(engine)
    app.run(host='0.0.0.0', port=5000)

```

### Próximos Passos

1.  **Configuração do Ambiente**: Crie um ambiente virtual, instale as dependências (`flask`, `flask-openapi3`, `flask-cors`, `sqlalchemy`, `pydantic`) e execute `app.py` para iniciar o servidor e criar o banco de dados `requisicoes.db`.
2.  **Teste a API**: Acesse `http://127.0.0.1:5000/openapi` no seu navegador para interagir com a documentação do Swagger e testar as rotas.
3.  **Desenvolvimento do Frontend**: Com a API funcionando, você pode começar a desenvolver a SPA em HTML, CSS e JavaScript, fazendo chamadas para essas rotas para exibir, criar e remover as requisições.

Esta base de código já cumpre os principais requisitos do backend e fornece uma fundação sólida para você expandir com funcionalidades adicionais, como edição de requisições, tratamento de usuários e relacionamentos mais complexos.

Espero que isso ajude você a começar com o pé direito no seu projeto!

<!--
[PROMPT_SUGGESTION]Como eu adiciono uma rota de atualização (PUT/PATCH) para modificar uma requisição existente?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Mostre-me como seria o código JavaScript no frontend para buscar e exibir a lista de todas as requisições cadastradas.[/PROMPT_SUGGESTION]
-->
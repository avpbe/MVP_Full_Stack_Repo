Contexto:
Desenvolver um app que possa cadastrar, consultar e deletar requisições de engenharia subsea (Análise de instalação, estruturas ou criação de protótipos).
A visualização inicial deve apresentar a lista de projetos cadastrados com o nome do projeto, disciplina, data e status.
Deverão existir botões de busca de projeto por nome, criação de novo projeto, edição de projeto e exclusão de projeto (apenas para administradores ou donos do projeto).

Requisitos:

A API deverá ser implementada em Python e com Flask com no mínimo 4 rotas (por
exemplo, “/cadastrar_usuario”, “/buscar_usuario”, “/buscar_usuarios” e
“/deletar_usuario”).

Pelo menos uma rota deve implementar o método POST (por exemplo, na rota de
cadastro).

Fazer o uso do banco de dados SQLite com pelo menos uma tabela (por exemplo,
tabela de usuários cadastrados).

Documentação da API com Swagger (OpenAPI), incluindo:
● Descrição clara de cada rota e método HTTP utilizado;
● Estrutura de requisição e resposta;
● Códigos de status esperados.

Criatividade e inovação: Será avaliado o que foi implementado além do exemplo
base: novas rotas, funcionalidades extras, tratamento de datas, uso de relacionamentos
e múltiplas tabelas. Demonstre iniciativa e aprofundamento técnico.

Front-end
Desenvolvimento de uma SPA (Single Page Application) utilizando HTML, CSS e
JavaScript.
Criatividade e Interatividade: será avaliada a originalidade da arquitetura visual da
aplicação, considerando se a estrutura e organização da interface fogem do exemplo
base fornecido. Isso inclui disposição dos elementos na tela, navegação, forma de
interação com o usuário e quaisquer funcionalidades ou melhorias implementadas por
iniciativa própria.

Deve-se exibir elementos em lista ou cards, como usuários, livros, etc.
Que, ao longo do código, seja feita a chamada a todas as rotas implementadas pela
API.

Observações:
1. Não utilize frameworks ou bibliotecas JavaScript baseados em SPA (Single
Page Application) como Angular, Vue, ou React. O não cumprimento deste
requisito resultará em uma penalização de 1,5 ponto na nota final.
2. É permitido o uso de frameworks de estilo, como Bootstrap. No entanto, é
obrigatório incluir regras de estilização personalizadas em CSS.
3. O frontend deve ser executado corretamente ao abrir o arquivo index.html
diretamente no navegador, sem a necessidade de extensões, servidores locais,
configuração no navegador ou outras dependências adicionais. O não
cumprimento deste requisito resultará em uma penalização de 2 pontos na nota
final.

Organização do código:
Devem ser criados dois projetos separados: um para a API e outro para o front-end.
Cada projeto deve estar em um repositório git próprio.
0,5 Em ambos os repositórios deve existir um arquivo README.md contendo as seguintes
informações:
● Título e uma breve descrição do projeto;
● Instruções de Instalação, tais como:
○ descrever as etapas necessárias para que os usuários possam
configurar o ambiente local,
○ instalar dependências,
○ comandos de inicialização, etc;
● Certifique-se de que o arquivo README.md seja formatado de forma clara e
use cabeçalhos, listas e formatação de texto para tornar a documentação fácil
de ler.
0,5 Qualidade da organização do código
### `Instalar dependências`
npm install

### `Iniciar servidor`
npm run start

### `Versão do node utilizada`
v18.13.0

### `Rotas`

##### Criar uma nova solicitação:
curl -X POST -H "Content-Type: application/json" -d '{"assunto": "Problemas com cartão"}' http://localhost:3000/solicitacoes

Assuntos que podem ser adicionados:
 1 - 'Problemas com cartão'
 2 - 'Contratação de empréstimo'
 3 - Qualquer outro assunto será considerando em um canal direcionado para: 'Outros Assuntos';

##### Iniciar o atendimento de até 3 solicitações:
curl -X POST http://localhost:3000/iniciar-atendimento/juan

##### Marcar o final de um atendimento (substitua AssuntoDaSolicitacao pelo assunto da solicitação que deseja marcar como finalizada):
http://localhost:3000/finalizar-atendimento/1

##### Time de cada atendente:
- maria - Cartões
- jose - Empréstimos
- juan - Outros Assuntos


##### Analise dos dados:
- São gerados arquivos em json no seguinte caminho: /src/services.



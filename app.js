const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const requestController = require('./src/controllers/RequestController');

app.use(bodyParser.json());

// Rota para criar uma nova solicitação
app.post('/solicitacoes', requestController.createRequest);

// Rota para iniciar o atendimento com o atendente especificado
app.post('/iniciar-atendimento/:atendente', (req, res) => {
  const atendente = req.params.atendente; // Extrai o atendente dos parâmetros da rota
  try {
    requestController.startHandlingRequests(atendente); // Chama a função do controlador com o atendente
    res.json({ message: `Iniciando o atendimento de até 3 solicitações para o atendente ${atendente}.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Rota para sfinalizar o atendimento
app.post('/finalizar-atendimento/:id', (req, res) => {
  const id = req.params.id; // Extrai o id dos parâmetros da rota

  try {
    requestController.finishRequest(id); // Chama a função do controlador com o id
    res.json({ message: `Atendimento da solicitação finalizada.` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});

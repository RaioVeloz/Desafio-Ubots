const requestService = require('../services/RequestService');

// Função para criar uma nova solicitação
function createRequest(req, res) {
    const { assunto } = req.body;

    try {
        const message = requestService.assignRequestToTeam(assunto);
        res.json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Controlador para simular o atendimento de solicitações
function handleRequests(req, res) {
    try {
        requestService.simulateHandlingRequests();
        res.json({ message: 'Simulando o atendimento de solicitações.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao simular o atendimento de solicitações.' });
    }
}

// Controlador para marcar o final de um atendimento
function finishRequest(req, res) {
    const id = req;

    try {
        requestService.finishRequest(id);
    } catch (error) {
        throw error;
    }
}

// Controlador para iniciar o atendimento
function startHandlingRequests(atendente) {
    try {
        requestService.startHandlingRequests(atendente);
    } catch (error) {
        throw error;
    }
}


module.exports = { createRequest, handleRequests, finishRequest, startHandlingRequests };

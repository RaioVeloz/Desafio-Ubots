const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'data.json');
const finishedDataFilePath = path.join(__dirname, 'atendimentos-finalizados.json');

const teams = {
    'Cartões': { maxConcurrentRequests: 3, atendentes: ['maria'] },
    'Empréstimos': { maxConcurrentRequests: 3, atendentes: ['jose'] },
    'Outros Assuntos': { maxConcurrentRequests: 3, atendentes: ['juan'] },
};

const atendentesEmAtendimento = {
    'maria': true,
    'jose': true,
    'juan': true,
};

// Função para gerar um novo ID autoincrementável
function generateNewId() {
    const data = loadFileData();
    data.lastGeneratedId = (data.lastGeneratedId || 0) + 1;
    saveDataToFile(data);
    return data.lastGeneratedId;
}

// Função para atribuir a solicitação a um time de atendimento
function assignRequestToTeam(assunto) {
    const teamName = getTeamName(assunto);
    maxConcurrentRequests = teams[teamName].maxConcurrentRequests;

    const request = { id: generateNewId(), assunto, team: teamName, status: 'em espera', atendente: null };

    saveRequestToFile(request);

    return `Solicitação "${request.id}" atribuída ao time "${request.team}".`;
}

// Função para obter o nome do time com base no assunto
function getTeamName(assunto) {
    if (assunto === 'Problemas com cartão') {
        return 'Cartões';
    } else if (assunto === 'Contratação de empréstimo') {
        return 'Empréstimos';
    } else {
        return 'Outros Assuntos';
    }
}

function getTeamByAtendente(atendente) {
    if (atendente === 'maria') {
        return 'Cartões';
    } else if (atendente === 'jose') {
        return 'Empréstimos';
    } else {
        return 'Outros Assuntos';
    }
}

// Função para salvar uma solicitação em um arquivo
function saveRequestToFile(request) {
    const data = loadFileData();
    data.solicitacoes.push(request);
    saveDataToFile(data);
}

// Função para carregar os dados do arquivo
function loadFileData() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { lastGeneratedId: 0, solicitacoes: [] };
    }
}

// Função para salvar os dados em um arquivo
function saveDataToFile(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// Função para simular o atendimento de solicitações
function simulateHandlingRequests(id) {
    const data = loadFileData();
    for (const request of data.solicitacoes) {
        if (request.status === 'atendendo') {
            finishRequest(request.assunto);
        }
    }
}

// Função para finalizar um atendimento
function finishRequest(id) {
    // pega todos os dados do arquivo data.json
    const data = loadFileData();
    // pega a solicitação que tem o mesmo id e que está sendo atendida
    const request = data.solicitacoes.find(request => request.id == id && request.status == 'atendendo');

    if (!request) {
        throw new Error(`Nenhuma solicitação "${id}" está sendo atendida.`);
    }

    // Finalizar a solicitação
    request.status = 'finalizada';
    saveDataToFile(data);

    // Salvar a solicitação finalizada em um arquivo separado
    saveFinishedRequestToFile(request);

    return `Atendimento da solicitação "${id}" finalizada.`;
}

// Função para salvar uma solicitação finalizada em um arquivo separado
function saveFinishedRequestToFile(request) {
    const finishedData = loadFinishedFileData();
    finishedData.solicitacoes.push(request);
    fs.writeFileSync(finishedDataFilePath, JSON.stringify(finishedData, null, 2), 'utf8');
}

// Função para carregar os dados do arquivo de atendimentos finalizados
function loadFinishedFileData() {
    try {
        const data = fs.readFileSync(finishedDataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { solicitacoes: [] };
    }
}

function startHandlingRequests(atendente) {
    // Pega todos os dados do arquivo data.json (tem todos os times)
    const data = loadFileData();

    // Verificar qual é o time do atendente
    const teamName = getTeamByAtendente(atendente);

    // pega dadas apenas de teamName
    const updateData = data.solicitacoes.filter(request => request.team === teamName);
    // quero que os dados que tem com o mesmo id em updateData sejam atualizados em data.solicitacoes


    if (updateData.length === 0) {
        throw new Error(`Não há solicitações para o time ${teamName}.`);
    }
    // Verificar se o atendente existe e se é autorizado para o tipo de solicitação
    if (!atendentesEmAtendimento[atendente]) {
        throw new Error(`O atendente ${atendente} não existe.`);
    }

    // Verifica quantas solicitações estão em atendimento

    // quantidade de solicitações que estão em espera
    const requests = updateData.filter(request => request.status === 'em espera');

    // quantidade de atendimento que o atendente já está fazendo
    const requestWithStatusAtendendo = updateData.filter(request => request.status === 'atendendo');

    if (requests.length === 0) {
        throw new Error('Não há solicitações para serem atendidas.');
    }

    // verifica quantas já estão sendo atendidas pelo atendente
    const requestsBeingHandled = requestWithStatusAtendendo.filter(request => request.atendente === atendente);
    if (requestsBeingHandled.length === 3) {
        throw new Error(`O atendente ${atendente} já está atendendo 3 solicitações.`);
    }

    // Iniciar o atendimento de até 3 solicitações, subtraindo as que já estão sendo atendidas pelo atendente
    const quantity = 3 - requestsBeingHandled.length;
    for (let i = 0; i < quantity && i < requests.length; i++) {
        if (requests[i].status === 'em espera') {
            requests[i].status = 'atendendo';
            requests[i].atendente = atendente;
        }
    }

    // Atualizar os dados da variavel data
    data.solicitacoes = data.solicitacoes.map(request => {
        const requestToUpdate = requests.find(requestToUpdate => requestToUpdate.id === request.id);
        if (requestToUpdate) {
            return requestToUpdate;
        }
        return request;
    });

    saveDataToFile(data);

    return `Iniciando o atendimento de até 3 solicitações para o atendente ${atendente}.`;
}


module.exports = { assignRequestToTeam, simulateHandlingRequests, finishRequest, startHandlingRequests };

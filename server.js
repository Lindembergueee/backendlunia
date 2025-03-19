require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env
const fastify = require('fastify')({ 
  logger: true,
  trustProxy: true // Confia nos proxies para usar o x-forwarded-for e capturar o IP real do cliente
});
const cors = require('@fastify/cors');
const mssql = require('mssql');
const dbConfig = require('./config/dbconfig');
const webDbConfig = require('./config/webdbconfig'); // Adicionado
const registerPrivateRoutes = require('./routes/Private/privateRoutes');

// Configurar o CORS
fastify.register(cors, {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'], 
});
// Configurações do banco de dados
fastify.decorate('dbConfig', dbConfig);

// Configuração adicional para o novo banco de dados
fastify.decorate('webDbConfig', webDbConfig); // Adicionado

// Registrar o plugin JWT
fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET
});

// Middleware para verificar a API Key
async function verifyApiKey(req, reply, done) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    reply.status(401).send({ message: 'Unauthorized' });
  } else {
    done();
  }
}

// Função para conectar ao banco de dados principal
async function connectToDatabase() {
  try {
    await mssql.connect(dbConfig);
    fastify.log.info('Conexão com o banco de dados estabelecida com sucesso');
  } catch (error) {
    fastify.log.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
}

// Função para conectar ao novo banco de dados Web_v1
async function connectToWebDatabase() {
  try {
    await mssql.connect(webDbConfig);
    fastify.log.info('Conexão com o banco de dados Web_v1 estabelecida com sucesso');
  } catch (error) {
    fastify.log.error('Erro ao conectar ao banco de dados Web_v1:', error);
    process.exit(1);
  }
}

// Adicionar o hook para verificar o token JWT
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Registrar as rotas públicas
const publicRoutes = [
  require('./routes/public/login'),
  require('./routes/public/register'),
  require('./routes/public/changePassword'),
  require('./routes/public/getCharacterStats'),
  require('./routes/public/getCharacterOnline'),
  require('./routes/public/getTotalGold')
];

// Registrar as rotas de ranking
const rankingRoutes = [
  require('./routes/Ranking/characterRebirth'),
  require('./routes/Ranking/getStageLevelRanking'),
  require('./routes/Ranking/getMaxLevelRanking'),
  require('./routes/Ranking/tower1Ranking'),
  require('./routes/Ranking/tower2Ranking'),
  require('./routes/Ranking/rebirthInfo') 
];

// Registrar as rotas privadas
const privateRoutes = [
  require('./routes/Private/accountInfo'),
  require('./routes/Private/characterList'),
  require('./routes/Private/addNCash'),
  require('./routes/Private/removeNCash'),
];

// Função para registrar as rotas
function registerRoutes(fastify, routes, options = {}) {
  routes.forEach(route => fastify.register(route, options));
}

// Registrar rotas
registerRoutes(fastify, publicRoutes, { prefix: '/api' });
registerRoutes(fastify, rankingRoutes, { prefix: '/api', preHandler: verifyApiKey }); // Verificar API Key
registerRoutes(fastify, privateRoutes, { prefix: '/api', preHandler: [fastify.authenticate, verifyApiKey] }); // Verificar JWT e API Key

// Inicia o servidor
const startServer = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 7705, host: '0.0.0.0' });
    fastify.log.info(`Servidor rodando em ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error('Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
};

// Inicialização e configuração do servidor
const initializeApp = async () => {
  try {
    await connectToDatabase(); // Conexão com o banco de dados principal
    await connectToWebDatabase(); // Conexão com o banco de dados Web_v1
    await startServer();
  } catch (err) {
    fastify.log.error('Erro ao inicializar a aplicação:', err);
    process.exit(1);
  }
};

initializeApp();

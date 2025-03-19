const { createHash } = require('crypto');
const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig');
const webDbConfig = require('../../config/webdbconfig');

// Função para gerar MD5
function generateMD5(input, salt) {
  return createHash('md5').update(input + salt).digest('hex');
}

// Middleware para validar API_KEY
async function verifyApiKey(req, reply) {
  const apiKey = req.headers['x-api-key'];
  req.log.info("Verifying API key...");

  if (!apiKey || apiKey !== process.env.API_KEY) {
    req.log.warn('Acesso negado: API_KEY inválida ou ausente');
    return reply.status(401).send({ message: 'Unauthorized: Invalid API_KEY' });
  }

  req.log.info("API Key is valid.");
}

// Lista de regiões permitidas
const validPreferences = ["StageBR", "StageNA", "StageAS"];

async function registerHandler(req, reply) {
  // Log do body recebido
  req.log.info("=== [Register Handler] BODY RECEIVED ===");
  req.log.info(req.body);

  // Agora esperamos que o front envie "serverPreference1" e "serverPreference2"
  const {
    accountName,
    password,
    serverPreference1,
    serverPreference2,
    isAdmin = false,
  } = req.body;

  req.log.info(`[REGISTER] Campos recebidos: 
    accountName="${accountName}", 
    password=(oculto), 
    serverPreference1="${serverPreference1}", 
    serverPreference2="${serverPreference2}", 
    isAdmin=${isAdmin}
  `);

  const salt = process.env.SALT_FIX;
  req.log.info('Iniciando handler de registro...');

  // Validação dos campos obrigatórios
  if (!accountName || !password) {
    req.log.warn(`Faltando accountName ou password: ${accountName}, (password oculto)`);
    return reply.status(400).send({
      message: 'Nome da conta e senha são obrigatórios.'
    });
  }

  if (!serverPreference1 || !serverPreference2) {
    req.log.warn('Faltando serverPreference1 ou serverPreference2');
    return reply.status(400).send({
      message: 'As preferências de região são obrigatórias.'
    });
  }

  if (
    !validPreferences.includes(serverPreference1) ||
    !validPreferences.includes(serverPreference2)
  ) {
    req.log.warn('Valor inválido para região preferencial.');
    return reply.status(400).send({
      message: 'Valor inválido para região. Permitidos: StageBR, StageNA, StageAS.'
    });
  }

  // Captura do IP do cliente
  let clientIP = req.ip;
  if (!clientIP || clientIP === '127.0.0.1') {
    const forwardedFor = req.headers['x-forwarded-for'];
    clientIP = forwardedFor ? forwardedFor.split(',')[0].trim() : req.socket.remoteAddress;
  }
  req.log.info(`IP Público do usuário: ${clientIP}`);

  let mainPool, webPool;
  try {
    req.log.info('Tentando conectar aos bancos de dados...');
    mainPool = await mssql.connect(dbConfig);
    webPool = await mssql.connect(webDbConfig);
    req.log.info('Conexões com os bancos de dados estabelecidas com sucesso');

    // Gerar hash da senha e userHash
    const hashedPassword = generateMD5(password, salt);
    const userHash = generateMD5(accountName + new Date().toISOString(), salt).substring(0, 6);
    req.log.debug(`[REGISTER] hashedPassword gerada, userHash="${userHash}"`);

    // Verificar duplicidade do usuário
    req.log.info(`[REGISTER] Verificando duplicidade para o usuário: ${accountName}`);
    const existingUser = await mainPool.request()
      .input('accountName', mssql.NVarChar, accountName)
      .query('SELECT 1 FROM Accounts WHERE accountName = @accountName');

    if (existingUser.recordset.length > 0) {
      req.log.warn(`Usuário "${accountName}" já existe no banco de dados.`);
      return reply.status(400).send({ message: 'Usuário já existe.' });
    }

    // Inserção na tabela Accounts
    req.log.info(`[REGISTER] Inserindo registro na tabela Accounts...
      > serverPreference1="${serverPreference1}"
      > serverPreference2="${serverPreference2}"`);

    await mainPool.request()
      .input('accountName', mssql.NVarChar, accountName)
      .input('isNexonId', mssql.Bit, 0)
      .input('vip', mssql.Bit, 0)
      .input('getvip', mssql.Bit, 0)
      .input('password', mssql.NVarChar, hashedPassword)
      .input('nCash', mssql.Int, 0)
      .input('serverPreference1', mssql.NVarChar, serverPreference1)
      .input('serverPreference2', mssql.NVarChar, serverPreference2)
      .query(`
        INSERT INTO Accounts (
          accountName,
          isNexonId,
          vip,
          getvip,
          password,
          nCash,
          serverPreference1,
          serverPreference2
        )
        VALUES (
          @accountName,
          @isNexonId,
          @vip,
          @getvip,
          @password,
          @nCash,
          @serverPreference1,
          @serverPreference2
        )
      `);

    // Testar acesso à tabela Register_v1
    req.log.info('Testando acesso à tabela Register_v1...');
    await webPool.request().query('SELECT TOP 1 * FROM Web_v1.dbo.Register_v1');
    req.log.info('Tabela Register_v1 acessível com sucesso.');

    // Inserção na tabela Register_v1
    req.log.info(`[REGISTER] Inserindo registro na tabela Register_v1...
      > serverPreference1="${serverPreference1}"
      > serverPreference2="${serverPreference2}"`);

    await webPool.request()
      .input('accountName', mssql.NVarChar, accountName)
      .input('userHash', mssql.NVarChar, userHash)
      .input('userIP', mssql.NVarChar, clientIP)
      .input('password', mssql.NVarChar, hashedPassword)
      .input('nCash', mssql.Int, 0)
      .input('isAdmin', mssql.Bit, isAdmin)
      .input('serverPreference1', mssql.NVarChar, serverPreference1)
      .input('serverPreference2', mssql.NVarChar, serverPreference2)
      .query(`
        INSERT INTO Web_v1.dbo.Register_v1 (
          accountName,
          userHash,
          userIP,
          password,
          nCash,
          isAdmin,
          serverPreference1,
          serverPreference2
        )
        VALUES (
          @accountName,
          @userHash,
          @userIP,
          @password,
          @nCash,
          @isAdmin,
          @serverPreference1,
          @serverPreference2
        )
      `);

    req.log.info('[REGISTER] Usuário registrado com sucesso!');
    return reply.status(201).send({
      message: 'Registro bem-sucedido!',
      userHash: userHash,
    });

  } catch (err) {
    req.log.error(`[REGISTER] Erro no processo de registro: ${err.message}`);
    req.log.debug(err.stack);
    return reply.status(500).send({
      message: 'Erro ao conectar ao banco de dados ou inserir dados.'
    });
  } finally {
    if (mainPool) {
      req.log.info('Fechando conexão com o banco de dados principal...');
      mainPool.close();
    }
    if (webPool) {
      req.log.info('Fechando conexão com o banco de dados web...');
      webPool.close();
    }
  }
}

module.exports = function (fastify, opts, done) {
  fastify.post('/register', { preHandler: verifyApiKey }, registerHandler);
  done();
};

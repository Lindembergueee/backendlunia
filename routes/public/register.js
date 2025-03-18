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
  if (!apiKey || apiKey !== process.env.API_KEY) {
    req.log.warn('Acesso negado: API_KEY inválida ou ausente');
    return reply.status(401).send({ message: 'Unauthorized: Invalid API_KEY' });
  }
}

// Função principal do registro
async function registerHandler(req, reply) {
  // Recebendo os campos do body, incluindo as novas preferências de região
  const {
    accountName,
    password,
    isAdmin = false,
    preferenceRegion1,
    preferenceRegion2,
  } = req.body;

  const salt = process.env.SALT_FIX;

  req.log.info('Iniciando handler de registro');

  // Validação de campos obrigatórios
  if (!accountName || !password) {
    req.log.warn('Parâmetro faltando: accountName ou password');
    return reply
      .status(400)
      .send({ message: 'Nome da conta e senha são obrigatórios.' });
  }

  // Captura do IP do cliente
  let clientIP = req.ip; // Se trustProxy estiver ativo
  if (!clientIP || clientIP === '127.0.0.1') {
    const forwardedFor = req.headers['x-forwarded-for'];
    clientIP = forwardedFor ? forwardedFor.split(',')[0].trim() : req.socket.remoteAddress;
  }
  req.log.info(`IP Público do usuário: ${clientIP}`);

  let mainPool, webPool;
  try {
    // Conexões com os bancos de dados
    req.log.info('Tentando conectar aos bancos de dados...');
    mainPool = await mssql.connect(dbConfig);
    webPool = await mssql.connect(webDbConfig);
    req.log.info('Conexões com os bancos de dados estabelecidas com sucesso');

    // Hash da senha e userHash
    const hashedPassword = generateMD5(password, salt);
    const userHash = generateMD5(accountName + new Date().toISOString(), salt).substring(0, 6);
    req.log.debug(`Hashed password gerada e userHash calculado: userHash=${userHash}`);

    // Verificar se o usuário já existe em Accounts
    req.log.info(`Verificando duplicidade para o usuário: ${accountName}`);
    const existingUser = await mainPool.request()
      .input('accountName', mssql.NVarChar, accountName)
      .query('SELECT 1 FROM Accounts WHERE accountName = @accountName');

    if (existingUser.recordset.length > 0) {
      req.log.warn(`Usuário ${accountName} já existe no banco de dados.`);
      return reply.status(400).send({ message: 'Usuário já existe.' });
    }

    // Inserção na tabela "Accounts"
    req.log.info('Inserindo registro na tabela Accounts...');
    await mainPool.request()
      .input('accountName', mssql.NVarChar, accountName)
      .input('isNexonId', mssql.Bit, 0)
      .input('vip', mssql.Bit, 0)
      .input('getvip', mssql.Bit, 0)
      .input('password', mssql.NVarChar, hashedPassword)
      .input('nCash', mssql.Int, 0)
      // Novos campos
      .input('preferenceRegion1', mssql.NVarChar, preferenceRegion1 || null)
      .input('preferenceRegion2', mssql.NVarChar, preferenceRegion2 || null)
      .query(`
        INSERT INTO Accounts (
          accountName,
          isNexonId,
          vip,
          getvip,
          password,
          nCash,
          preferenceRegion1,
          preferenceRegion2
        )
        VALUES (
          @accountName,
          @isNexonId,
          @vip,
          @getvip,
          @password,
          @nCash,
          @preferenceRegion1,
          @preferenceRegion2
        )
      `);

    // Testar acesso direto à tabela Register_v1
    req.log.info('Testando acesso à tabela Register_v1...');
    await webPool.request().query('SELECT TOP 1 * FROM Web_v1.dbo.Register_v1');
    req.log.info('Tabela Register_v1 acessível com sucesso.');

    // Inserção na tabela "Register_v1"
    req.log.info('Inserindo registro na tabela Register_v1...');
    await webPool.request()
      .input('accountName', mssql.NVarChar, accountName)
      .input('userHash', mssql.NVarChar, userHash)
      .input('userIP', mssql.NVarChar, clientIP)
      .input('password', mssql.NVarChar, hashedPassword)
      .input('nCash', mssql.Int, 0)
      .input('isAdmin', mssql.Bit, isAdmin)
      // Novos campos
      .input('preferenceRegion1', mssql.NVarChar, preferenceRegion1 || null)
      .input('preferenceRegion2', mssql.NVarChar, preferenceRegion2 || null)
      .query(`
        INSERT INTO Web_v1.dbo.Register_v1 (
          accountName,
          userHash,
          userIP,
          password,
          nCash,
          isAdmin,
          preferenceRegion1,
          preferenceRegion2
        )
        VALUES (
          @accountName,
          @userHash,
          @userIP,
          @password,
          @nCash,
          @isAdmin,
          @preferenceRegion1,
          @preferenceRegion2
        )
      `);

    req.log.info('Usuário registrado com sucesso!');
    reply.status(201).send({
      message: 'Registro bem-sucedido!',
      userHash: userHash,
    });

  } catch (err) {
    req.log.error(`Erro no processo de registro: ${err.message}`);
    req.log.debug(err.stack);
    reply
      .status(500)
      .send({ message: 'Erro ao conectar ao banco de dados ou inserir dados.' });
  } finally {
    // Fechando conexões
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

// Exporta a rota e adiciona a validação de API_KEY como preHandler
module.exports = function (fastify, opts, done) {
  fastify.post('/register', { preHandler: verifyApiKey }, registerHandler);
  done();
};

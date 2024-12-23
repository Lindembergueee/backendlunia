const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig'); // Certifique-se de que o caminho está correto

async function getAccountInfoHandler(req, reply) {
  const { accountName } = req.user;

  let pool;
  try {
    pool = await mssql.connect(dbConfig);
    req.log.info('Conexão com o banco de dados estabelecida com sucesso');

    const result = await pool.request()
      .input('accountName', mssql.NVarChar, accountName)
      .query('SELECT accountName, createDate, lastLogged, createdCharacter, slotCount, vip, getvip, nCash, userIP FROM Accounts WHERE accountName = @accountName');

    if (!result.recordset.length) {
      req.log.warn('No user found with the given account name.');
      return reply.status(404).send('Usuário não encontrado.');
    }

    const accountInfo = result.recordset[0];
    req.log.info(`Informações da conta retornadas para o usuário: ${accountName}`);
    return reply.send(accountInfo);
  } catch (err) {
    req.log.error(`Database connection error: ${err.message}`, err);
    return reply.status(500).send('Erro ao conectar ao banco de dados.');
  } finally {
    if (pool) {
      pool.close(err => {
        if (err) {
          req.log.error(`Error closing database connection: ${err.message}`, err);
        } else {
          req.log.info('Conexão com o banco de dados fechada');
        }
      });
    }
  }
}

module.exports = function (fastify, opts, done) {
  fastify.get('/accountInfo', { preHandler: fastify.authenticate }, getAccountInfoHandler);
  done();
};

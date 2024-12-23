const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig');

async function removeNCashHandler(req, reply) {
  const { accountName, amount } = req.body;
  const { accountName: adminAccountName } = req.user;

  if (!accountName || !amount) {
    return reply.status(400).send('Nome da conta e valor são obrigatórios.');
  }

  let pool;
  try {
    pool = await mssql.connect(dbConfig);
    req.log.info('Conexão com o banco de dados estabelecida com sucesso');

    const adminCheck = await pool.request()
      .input('adminAccountName', mssql.NVarChar, adminAccountName)
      .query('SELECT isAdmin FROM Accounts WHERE accountName = @adminAccountName');

    if (!adminCheck.recordset.length || !adminCheck.recordset[0].isAdmin) {
      req.log.warn('Tentativa de acesso à rota protegida por usuário não-administrador.');
      return reply.status(403).send('Acesso negado. Apenas administradores podem realizar esta ação.');
    }

    const accountCheck = await pool.request()
      .input('accountName', mssql.NVarChar, accountName)
      .query('SELECT nCash FROM Accounts WHERE accountName = @accountName');

    if (!accountCheck.recordset.length) {
      req.log.warn('Conta não encontrada.');
      return reply.status(404).send('Conta não encontrada.');
    }

    const currentNCash = accountCheck.recordset[0].nCash;

    if (currentNCash < amount) {
      req.log.warn('Saldo insuficiente.');
      return reply.status(400).send('Saldo insuficiente para realizar a operação.');
    }

    await pool.request()
      .input('accountName', mssql.NVarChar, accountName)
      .input('amount', mssql.Int, amount)
      .query('UPDATE Accounts SET nCash = nCash - @amount WHERE accountName = @accountName');

    req.log.info(`nCash removido com sucesso da conta: ${accountName}`);
    return reply.send({ message: `nCash removido com sucesso da conta: ${accountName}` });
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
  fastify.post('/removeNCash', { preHandler: fastify.authenticate }, removeNCashHandler);
  done();
};

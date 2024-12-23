const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig'); // Certifique-se de que o caminho está correto

async function addNCashHandler(req, reply) {
  const { accountName, amount } = req.body;
  const { accountName: adminAccountName } = req.user; // Obtém o nome da conta do admin autenticado

  if (!accountName || !amount) {
    return reply.status(400).send('Nome da conta e valor são obrigatórios.');
  }

  let pool;
  try {
    pool = await mssql.connect(dbConfig);
    req.log.info('Conexão com o banco de dados estabelecida com sucesso');

    // Verificar se o usuário autenticado é administrador
    const adminCheck = await pool.request()
      .input('adminAccountName', mssql.NVarChar, adminAccountName)
      .query('SELECT isAdmin FROM Accounts WHERE accountName = @adminAccountName');

    if (!adminCheck.recordset.length || adminCheck.recordset[0].isAdmin !== true) {
      req.log.warn('Tentativa de acesso à rota protegida por usuário não-administrador.');
      return reply.status(403).send('Acesso negado. Apenas administradores podem realizar esta ação.');
    }

    // Adicionar nCash à conta especificada
    const result = await pool.request()
      .input('accountName', mssql.NVarChar, accountName)
      .input('amount', mssql.Int, amount)
      .query('UPDATE Accounts SET nCash = nCash + @amount WHERE accountName = @accountName');

    if (result.rowsAffected[0] === 0) {
      req.log.warn('Nenhuma conta encontrada com o nome especificado.');
      return reply.status(404).send('Conta não encontrada.');
    }

    req.log.info(`nCash adicionado com sucesso à conta: ${accountName}`);
    return reply.send({ message: `nCash adicionado com sucesso à conta: ${accountName}` });
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
  fastify.post('/addNCash', { preHandler: fastify.authenticate }, addNCashHandler);
  done();
};

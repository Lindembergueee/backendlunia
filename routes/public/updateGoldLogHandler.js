const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig'); // Certifique-se de que o caminho está correto

async function getGoldLogHandler(req, reply) {
  let pool;
  try {
    pool = await mssql.connect(dbConfig);
    req.log.info('Conexão com o banco de dados estabelecida com sucesso');

    const goldLogResult = await pool.request()
      .query("SELECT TOP 10 * FROM GoldLog ORDER BY LogTime DESC");

    const goldLog = goldLogResult.recordset.map(entry => ({
      ...entry,
      TotalGold: Math.floor(parseInt(entry.TotalGold, 10) / 10000).toString() // Remove os quatro últimos dígitos e converte para string
    }));

    req.log.info('Dados do GoldLog obtidos com sucesso');
    return reply.send(goldLog);
  } catch (err) {
    req.log.error(`Erro ao conectar ao banco de dados: ${err.message}`, err);
    return reply.status(500).send('Erro ao conectar ao banco de dados.');
  } finally {
    if (pool) {
      try {
        await pool.close();
        req.log.info('Conexão com o banco de dados fechada');
      } catch (err) {
        req.log.error(`Erro ao fechar a conexão com o banco de dados: ${err.message}`, err);
      }
    }
  }
}

module.exports = function (fastify, opts, done) {
  fastify.get('/getGoldLog', getGoldLogHandler);
  done();
};
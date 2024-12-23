const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig'); // Certifique-se de que o caminho está correto

async function getCharacterStatsHandler(req, reply) {
  let pool;
  try {
    pool = await mssql.connect(dbConfig);
    req.log.info('Conexão com o banco de dados estabelecida com sucesso');

    // Consultar número total de personagens
    const totalCharactersResult = await pool.request()
      .query('SELECT COUNT(*) AS totalCharacters FROM Characters WHERE isDeleted = 0');
    
    const totalCharacters = totalCharactersResult.recordset[0].totalCharacters;

    // Consultar número de personagens por classe e ordenar pela quantidade
    const classStatsResult = await pool.request()
      .query('SELECT classNumber, COUNT(*) AS count FROM Characters WHERE isDeleted = 0 GROUP BY classNumber ORDER BY count DESC');

    const classStats = classStatsResult.recordset.map(row => ({
      classNumber: row.classNumber,
      count: row.count
    }));

    req.log.info('Estatísticas de personagens retornadas com sucesso');
    return reply.send({
      totalCharacters,
      classStats
    });
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
  fastify.get('/characterStats', getCharacterStatsHandler);
  done();
};

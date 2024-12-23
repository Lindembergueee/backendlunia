const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig'); // Certifique-se de que o caminho está correto

async function getMaxLevelRankingHandler(req, reply) {
  let pool;
  try {
    pool = await mssql.connect(dbConfig);
    req.log.info('Conexão com o banco de dados estabelecida com sucesso');

    // Consultar ranking dos personagens pelo maxLevelReachedDate
    const rankingResult = await pool.request()
      .query('SELECT characterName, classNumber, stageLevel, maxLevelReachedDate FROM Characters WHERE stageLevel = 99 AND isDeleted = 0 ORDER BY maxLevelReachedDate ASC');

    const ranking = rankingResult.recordset.map((row, index) => ({
      rank: index + 1,
      characterName: row.characterName,
      classNumber: row.classNumber,
      stageLevel: row.stageLevel,
      maxLevelReachedDate: row.maxLevelReachedDate
    }));

    req.log.info('Ranking de maxLevel retornado com sucesso');
    return reply.send(ranking);
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
  fastify.get('/maxLevelRanking', getMaxLevelRankingHandler);
  done();
};

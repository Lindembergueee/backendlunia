const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig');

async function getStageLevelRankingHandler(req, reply) {
  let pool;
  try {
    pool = await mssql.connect(dbConfig);
    req.log.info('Conexão com o banco de dados estabelecida com sucesso');

    // Consultar ranking dos personagens pela tabela de logs
    const rankingResult = await pool.request()
      .query(`
        SELECT 
          l.characterName, 
          l.classNumber, 
          l.stageLevel, 
          l.stageExp,  
          l.updateDate as levelUpdatedDate 
        FROM LevelUpLog l
        JOIN Characters c ON l.characterName = c.characterName
        WHERE c.isDeleted = 0
        ORDER BY l.stageLevel DESC, l.stageExp DESC, l.updateDate ASC
      `);

    const ranking = rankingResult.recordset.map((row, index) => ({
      rank: index + 1,
      characterName: row.characterName,
      classNumber: row.classNumber,
      stageLevel: row.stageLevel,
      stageExp: row.stageExp,
      levelUpdatedDate: row.levelUpdatedDate
    }));

    req.log.info('Ranking de stageLevel retornado com sucesso');
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
  fastify.get('/stageLevelRanking', getStageLevelRankingHandler);
  done();
};

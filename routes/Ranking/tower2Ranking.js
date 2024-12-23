const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig'); // Certifique-se de que o caminho está correto

function secondToDate(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
}

async function getTower2RankingHandler(req, reply) {
  let pool;
  try {
    pool = await mssql.connect(dbConfig);
    req.log.info('Conexão com o banco de dados estabelecida com sucesso');

    const rankingResult = await pool.request()
      .query(`
        SELECT TOP 10 [cName], [cStageGroupHash], [cLevel], [cTime]
        FROM [v4_stage].[dbo].[TowerRank]
        WHERE cStageGroupHash = '21859841'
        ORDER BY cLevel DESC, cTime ASC;
      `);

    const ranking = rankingResult.recordset.map((row, index) => ({
      rank: index + 1,
      characterName: row.cName,
      level: row.cLevel,
      time: secondToDate(row.cTime)
    }));

    req.log.info('Ranking da torre 2 retornado com sucesso');
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
  fastify.get('/tower2Ranking', getTower2RankingHandler);
  done();
};

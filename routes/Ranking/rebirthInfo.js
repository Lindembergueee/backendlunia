const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig'); // Certifique-se de que o caminho está correto

async function getRebirthRankingHandler(req, reply) {
  let pool;
  try {
    pool = await mssql.connect(dbConfig);
    req.log.info('Conexão com o banco de dados estabelecida com sucesso');

    const rankingResult = await pool.request()
      .query(`
        SELECT TOP 100
          [characterName],
          [rebirthCount],
          [storedLevel],
          [skillPoint],
          FORMAT([lastRebirthDate], 'yyyy-MM-dd HH:mm:ss') AS lastRebirthDate
        FROM [v3_character].[dbo].[CharacterRebirth]
        ORDER BY [rebirthCount] DESC, [lastRebirthDate] ASC;
      `);

    const ranking = rankingResult.recordset.map((row, index) => ({
      rank: index + 1,
      characterName: row.characterName,
      rebirthCount: row.rebirthCount,
      storedLevel: row.storedLevel,
      skillPoint: row.skillPoint,
      lastRebirthDate: row.lastRebirthDate
    }));

    req.log.info('Ranking de renascimento retornado com sucesso');
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
  fastify.get('/rebirthRanking', getRebirthRankingHandler);
  done();
};

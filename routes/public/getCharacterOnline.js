const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig'); // Certifique-se de que o caminho está correto

async function getCharacterOnlineHandler(req, reply) {
  let pool;
  try {
    pool = await mssql.connect(dbConfig);
    req.log.info('Conexão com o banco de dados estabelecida com sucesso');

    // Certifique-se de usar o esquema correto, por exemplo, dbo.Connections
    const onlineCharactersResult = await pool.request()
      .query("SELECT COUNT(*) AS onlineCharacters FROM [v4_stage].[dbo].[Connections] WHERE characterName <> ''");

    const onlineCharacters = onlineCharactersResult.recordset[0].onlineCharacters;

    req.log.info('Número de personagens online retornado com sucesso');
    return reply.send({
      onlineCharacters
    });
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
  fastify.get('/getCharacterOnline', getCharacterOnlineHandler);
  done();
};

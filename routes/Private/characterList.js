const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig'); // Certifique-se de que o caminho está correto

function formatMoney(value) {
  return Math.floor(value / 10000);
}

async function getCharacterListHandler(req, reply) {
  const { accountName } = req.user; // Obtém o nome da conta do token JWT

  req.log.info(`Fetching characters for account: ${accountName}`);

  let pool;
  try {
    pool = await mssql.connect(dbConfig);
    req.log.info('Conexão com o banco de dados estabelecida com sucesso');

    const result = await pool.request()
      .input('accountName', mssql.NVarChar, accountName)
      .query('SELECT characterName, classNumber, stageLevel, gameMoney, bankMoney, skillPoint FROM Characters WHERE accountName = @accountName');

    req.log.info(`Query result: ${JSON.stringify(result.recordset)}`);

    if (!result.recordset.length) {
      req.log.warn('No characters found for the given account name.');
      return reply.status(404).send('Nenhum personagem encontrado.');
    }

    const characterList = result.recordset.map(character => ({
      characterName: character.characterName,
      classNumber: character.classNumber,
      stageLevel: character.stageLevel,
      gameMoney: formatMoney(character.gameMoney),
      bankMoney: formatMoney(character.bankMoney),
      skillPoint: character.skillPoint
    }));

    req.log.info(`Lista de personagens retornada para o usuário: ${accountName}`);
    return reply.send(characterList);
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
  fastify.get('/characterList', { preHandler: fastify.authenticate }, getCharacterListHandler);
  done();
};

const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig');

async function getUsers(request, reply) {
  try {
    const { page = 1, pageSize = 10, name } = request.query;

    let query = 'SELECT * FROM v3_character.dbo.CharacterRebirth WHERE 1=1';
    const params = {};
    
    if (name) {
      query += ' AND name LIKE @name';
      params.name = `%${name}%`;
    }

    const pool = await mssql.connect(dbConfig);
    const sqlRequest = pool.request();

    // Adiciona os parâmetros à consulta SQL
    Object.entries(params).forEach(([key, value]) => {
      sqlRequest.input(key, mssql.NVarChar, value);
    });

    const result = await sqlRequest.query(query);
    const totalCount = result.recordset.length;

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalCount);

    const users = result.recordset.slice(startIndex, endIndex);

    return reply.send({ users, totalCount });
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    return reply.status(500).send({ error: 'Erro interno do servidor' });
  }
}

module.exports = function (fastify, opts, done) {
  fastify.get('/characterrebirth', getUsers);
  done();
};

const { createHash } = require('crypto');
const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig'); // Corrigido o caminho do dbConfig

function generateMD5(input, salt) {
  return createHash('md5').update(input + salt).digest('hex');
}

async function loginHandler(req, reply) {
  const { accountName, password } = req.body;
  const salt = "rERHAV7hBX96k9ze1X0e1dJbaUAI7cEPGX5vzyT1484-";
  const hashedPassword = generateMD5(password, salt);

  req.log.info(`Generated Hash for password: ${hashedPassword}`);

  let pool;
  try {
    pool = await mssql.connect(dbConfig);
    req.log.info('Conexão com o banco de dados estabelecida com sucesso');

    const result = await pool.request()
      .input('accountName', mssql.NVarChar, accountName)
      .query('SELECT password FROM Accounts WHERE accountName = @accountName');

    if (!result.recordset.length) {
      req.log.warn('No user found with the given account name.');
      return reply.status(401).send('Usuário não encontrado.');
    } else {
      const storedHash = result.recordset[0].password;
      req.log.info(`Stored Hash in DB: ${storedHash}`);

      if (storedHash === hashedPassword) {
        req.log.info('Login successful!');

        // Gera o token JWT
        const token = req.server.jwt.sign({ accountName });

        return reply.send({ message: 'Login bem-sucedido!', token });
      } else {
        req.log.warn('Failed login attempt. Incorrect password.');
        return reply.status(401).send('Falha no login. Senha incorreta.');
      }
    }
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
  fastify.post('/login', loginHandler);
  done();
};

const { createHash } = require('crypto');
const mssql = require('mssql');
const dbConfig = require('../../config/dbconfig'); // Certifique-se de que o caminho está correto

function generateMD5(input, salt) {
  return createHash('md5').update(input + salt).digest('hex');
}

async function changePasswordHandler(req, reply) {
  const { accountName } = req.user; // Obtém o nome da conta do token JWT
  const { currentPassword, newPassword } = req.body;
  const salt = "rERHAV7hBX96k9ze1X0e1dJbaUAI7cEPGX5vzyT1484-";

  if (!currentPassword || !newPassword) {
    return reply.status(400).send('Senhas atual e nova são obrigatórias.');
  }

  if (newPassword.length > 50) {
    return reply.status(400).send('A nova senha não pode exceder 50 caracteres.');
  }

  const hashedCurrentPassword = generateMD5(currentPassword, salt);
  const hashedNewPassword = generateMD5(newPassword, salt);

  req.log.info(`Generated Hash for current password: ${hashedCurrentPassword}`);
  req.log.info(`Generated Hash for new password: ${hashedNewPassword}`);

  let pool;
  try {
    pool = await mssql.connect(dbConfig);
    req.log.info('Conexão com o banco de dados estabelecida com sucesso');

    // Verificar se a senha atual está correta
    const result = await pool.request()
      .input('accountName', mssql.NVarChar, accountName)
      .query('SELECT password FROM Accounts WHERE accountName = @accountName');

    if (!result.recordset.length) {
      req.log.warn('No user found with the given account name.');
      return reply.status(404).send('Usuário não encontrado.');
    }

    const storedHash = result.recordset[0].password;

    if (storedHash !== hashedCurrentPassword) {
      req.log.warn('Current password is incorrect.');
      return reply.status(401).send('Senha atual incorreta.');
    }

    // Atualizar a senha no banco de dados
    await pool.request()
      .input('accountName', mssql.NVarChar, accountName)
      .input('password', mssql.NVarChar, hashedNewPassword)
      .query('UPDATE Accounts SET password = @password WHERE accountName = @accountName');

    req.log.info('Password updated successfully!');
    return reply.send('Senha atualizada com sucesso!');
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
  fastify.put('/changePassword', { preHandler: fastify.authenticate }, changePasswordHandler);
  done();
};

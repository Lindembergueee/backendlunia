const mssql = require('mssql');
const webDbConfig = {
  user: process.env.WEB_DB_USER,
  password: process.env.WEB_DB_PASSWORD,
  server: process.env.WEB_DB_SERVER,
  database: process.env.WEB_DB_NAME,
  port: parseInt(process.env.WEB_DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

(async () => {
  try {
    const pool = await mssql.connect(webDbConfig);
    console.log('Conectou com Web_v1 com sucesso!');
    const result = await pool.request().query('SELECT TOP 1 * FROM Web_v1.dbo.Register_v1');
    console.log('Consulta executada com sucesso:', result.recordset);
    pool.close();
  } catch (err) {
    console.error('Erro ao conectar ou consultar tabela Register_v1:', err.message);
  }
})();

require("dotenv").config();
const sql = require('mssql');

const sqlConfig = {
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    stream: false,
    options: {
      enableArithAbort: true,
      encrypt: true
    },
    port: +process.env.DB_PORT,
    user: process.env.DB_USER,
    server: process.env.DB_HOST,
}

const pool = new sql.ConnectionPool(sqlConfig);
const poolConnection = pool.connect();

module.exports = {
    pool
}

const sql = require('mssql');
const sqlConfig = require("./database-config");

const pool = new sql.ConnectionPool(sqlConfig);
pool.connect();

module.exports = {
    pool
}

require("dotenv").config()

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

class MigrationDB {
    constructor(){
        this.con = sql.connect(sqlConfig);
    }

    async execute(sql){
        return new Promise((resolve, reject) => {
            this.con.then(pool => {
                pool.request().query(sql)
                    .then( () => { resolve()})
                    .catch(() => { reject })
            });
        });
    }
}

let _migrationDB = null;

function migrationDB(){
    if (_migrationDB === null)
        _migrationDB = new MigrationDB()
    return _migrationDB
}

module.exports = {
    migrationDB
}

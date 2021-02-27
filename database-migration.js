const sql = require('mssql');
const sqlConfig = require("./database-config");

class MigrationDB {
    constructor(){
        this.con = sql.connect(sqlConfig);
    }

    async execute(sql){
        return new Promise((resolve, reject) => {
            this.con.then(pool => {
                pool.request().query(sql)
                    .then( () => {
                        resolve();
                    })
                    .catch(e => { 
                        console.error(e)
                        reject();
                    })
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

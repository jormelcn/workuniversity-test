const { pool } = require("../database-repository");

const {
    ASSIGNED_ORDER
} = require("../src/infrastructure/repository/work-day-repository-sqlserver/assigned-order-utils");

const {
    WORK_DAY
} = require("../src/infrastructure/repository/work-day-repository-sqlserver/work-day-repository-sqlserver");

const {
    VEHICLE_ORDER
} = require("../src/infrastructure/repository/order-repository");

const {
    VEHICLE_TYPE
} = require("../src/infrastructure/repository/vehicle-type-repository-sqlserver");

async function clearDatabase(){
    await pool.connect(); 
    let request = pool.request();

    await request.query(`
        DELETE FROM "${ASSIGNED_ORDER}";
    `);

    await request.query(`
        DELETE FROM "${WORK_DAY}";
    `);

    await request.query(`
        DELETE FROM "${VEHICLE_ORDER}";
    `);

    await request.query(`
        DELETE FROM "${VEHICLE_TYPE}";
    `);

}

module.exports = {
    clearDatabase
}


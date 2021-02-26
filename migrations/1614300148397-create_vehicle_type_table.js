'use strict'

const { migrationDB } = require("../database");

module.exports.up = async function () {
  await migrationDB().execute(`
    CREATE TABLE vehicle_type(
      id varchar(64) NOT NULL,
      name varchar(64) NOT NULL,
      manufacturing_hours INT
    );
  `);
}

module.exports.down = async function () {
  await migrationDB().execute(`
    DROP TABLE vehicle_type;
  `);
}

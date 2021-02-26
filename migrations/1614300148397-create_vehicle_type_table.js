'use strict'

const { migrationDB } = require("../database");

module.exports.up = async function () {
  await migrationDB().execute(`
    CREATE TABLE vehicle_type(
      id varchar(64) NOT NULL,
      name varchar(64) NOT NULL,
      manufacturing_hours INT NOT NULL,
      CONSTRAINT pk_vehicle_type PRIMARY KEY(id)
    );
  `);
}

module.exports.down = async function () {
  await migrationDB().execute(`
    DROP TABLE vehicle_type;
  `);
}

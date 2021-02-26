'use strict'

const { migrationDB } = require("../database");

module.exports.up = async function () {
  await migrationDB().execute(`
    CREATE TABLE vehicle_order(
      id varchar(64) NOT NULL,
      datetime_of_request DATETIME NOT NULL,
      CONSTRAINT pk_vehicle_order PRIMARY KEY(id)
    );
  `);
}

module.exports.down = async function () {
  await migrationDB().execute(`
    DROP TABLE vehicle_order;
  `);
}

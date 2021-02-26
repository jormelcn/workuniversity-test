'use strict'

const { migrationDB } = require("../database");

module.exports.up = async function () {
  await migrationDB().execute(`
    CREATE TABLE work_day(
      id varchar(64) NOT NULL,
      "date" DATE NOT NULL,
      work_hours INT NOT NULL,
      CONSTRAINT pk_work_day PRIMARY KEY(id)
    );
  `);
}

module.exports.down = async function () {
  await migrationDB().execute(`
    DROP TABLE work_day;
  `);
}

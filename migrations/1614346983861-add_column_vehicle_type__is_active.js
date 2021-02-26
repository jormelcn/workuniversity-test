'use strict'

const { migrationDB } = require("../database");

module.exports.up = async function () {
  await migrationDB().execute(`
    ALTER TABLE vehicle_type ADD is_active BIT NOT NULL;
  `);
}

module.exports.down = async function () {
  await migrationDB().execute(`
    ALTER TABLE vehicle_type DROP COLUMN is_active;
  `);
}

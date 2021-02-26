'use strict'

const { migrationDB } = require("../database-migration");

module.exports.up = function (done) {
  migrationDB().execute(`
    ALTER TABLE vehicle_type ADD is_active BIT NOT NULL;
  `).then(done);
}

module.exports.down = function (done) {
  migrationDB().execute(`
    ALTER TABLE vehicle_type DROP COLUMN is_active;
  `).then(done);
}

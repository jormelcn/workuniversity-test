'use strict'

const { migrationDB } = require("../database-migration");

module.exports.up = function (done) {
  migrationDB().execute(`
    CREATE TABLE vehicle_type(
      id varchar(64) NOT NULL,
      name varchar(64) NOT NULL,
      manufacturing_hours INT NOT NULL,
      CONSTRAINT pk_vehicle_type PRIMARY KEY(id)
    );
  `).then(done)
}

module.exports.down = function (done) {
  migrationDB().execute(`
    DROP TABLE vehicle_type;
  `).then(done)
}

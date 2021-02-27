'use strict'

const { migrationDB } = require("../database-migration");

module.exports.up = function (done) {
  migrationDB().execute(`
    CREATE TABLE vehicle_order(
      id varchar(64) NOT NULL,
      datetime_of_request DATETIME NOT NULL,
      CONSTRAINT pk_vehicle_order PRIMARY KEY(id)
    );
  `).then(done);
}

module.exports.down =  function (done) {
  migrationDB().execute(`
    DROP TABLE vehicle_order;
  `).then(done);
}

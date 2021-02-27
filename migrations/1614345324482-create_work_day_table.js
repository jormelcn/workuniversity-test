'use strict'

const { migrationDB } = require("../database-migration");

module.exports.up = function (done) {
  migrationDB().execute(`
    CREATE TABLE work_day(
      id varchar(64) NOT NULL,
      "date" DATE NOT NULL,
      work_hours INT NOT NULL,
      CONSTRAINT pk_work_day PRIMARY KEY(id)
    );
  `).then(done);
}

module.exports.down = function (done) {
  migrationDB().execute(`
    DROP TABLE work_day;
  `).then(done);
}

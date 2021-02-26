'use strict'

const { migrationDB } = require("../database-migration");

module.exports.up = function (done) {
  migrationDB().execute(`
    CREATE TABLE assigned_order(
      id varchar(64) NOT NULL,
      id_vehicle_type varchar(64) NOT NULL,
      id_vehicle_order varchar(64) NOT NULL,
      id_work_day varchar(64) NOT NULL,
      vehicle_manufacturing_hours INT NOT NULL,
      quantity INT NOT NULL,
      CONSTRAINT pk_assigned_order PRIMARY KEY(id),
      CONSTRAINT fk_assigned_order_id_vehicle_type FOREIGN KEY (id_vehicle_type) REFERENCES vehicle_type(id),
      CONSTRAINT fk_assigned_order_id_vehicle_order FOREIGN KEY (id_vehicle_order) REFERENCES vehicle_order(id),
      CONSTRAINT fk_assigned_order_id_work_day FOREIGN KEY (id_work_day) REFERENCES work_day(id)
    );
  `).then(done);
}

module.exports.down = function (done) {
  migrationDB().execute(`
    DROP TABLE assigned_order;
  `).then(done);
}

const { VehicleTypeRepositorySqlServer } = require("./vehicle-type-repository-sqlserver");
const { WorkDayRepositorySqlServer } = require("./work-day-repository-sqlserver/work-day-repository-sqlserver");
const { VehicleOrderRepositorySqlServer } = require("./vehicle-order-repository");

module.exports = {
    VehicleTypeRepositorySqlServer,
    WorkDayRepositorySqlServer,
    VehicleOrderRepositorySqlServer,
}

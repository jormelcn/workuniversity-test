const { VehicleTypeRepositorySqlServer } = require("./vehicle-type-repository-sqlserver");
const { WorkDayRepositorySqlServer } = require("./work-day-repository-sqlserver/work-day-repository-sqlserver");
const { OrderRepositorySqlServer } = require("./order-repository");

module.exports = {
    VehicleTypeRepositorySqlServer,
    WorkDayRepositorySqlServer,
    OrderRepositorySqlServer,
}

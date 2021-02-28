const { VehicleTypeRepository } = require("./vehicle-type-repository");
const { AssignedOrderRepository } = require("./assigned-order-repository");
const { WorkDayRepository } = require("./work-day-repository");
const { VehicleOrderRepository } = require("./vehicle-order-repository");
const { OrderAssignmentRepository } = require("./order-assignment-repository");

module.exports = {
    VehicleTypeRepository,
    AssignedOrderRepository,
    WorkDayRepository,
    VehicleOrderRepository,
    OrderAssignmentRepository,
}

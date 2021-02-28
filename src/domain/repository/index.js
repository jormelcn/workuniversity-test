const { VehicleTypeRepository } = require("./vehicle-type-repository");
const { AssignedOrderRepository } = require("./assigned-order-repository");
const { WorkDayRepository } = require("./work-day-repository");
const { OrderRepository } = require("./order-repository");
const { OrderAssignmentRepository } = require("./order-assignment-repository");

module.exports = {
    VehicleTypeRepository,
    AssignedOrderRepository,
    WorkDayRepository,
    OrderRepository,
    OrderAssignmentRepository,
}

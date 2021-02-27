const { pool } = require("../database-repository");

const { 
    WorkDayRepositorySqlServer, 
    VehicleOrderRepositorySqlServer,
    VehicleTypeRepositorySqlServer,
} = require("../src/infrastructure/repository");



const { WorkDay } = require("../src/domain/aggregate");
const { dummyFactory } = require("./dummy-factory");

const chai = require("chai");
const assert = chai.assert;



describe("Work Day Repository", () => {


    it("Save", async function() {
        const vehicleOrderRepository = new VehicleOrderRepositorySqlServer(pool);
        const vehicleTypeRepository = new VehicleTypeRepositorySqlServer(pool);
        const repository = new WorkDayRepositorySqlServer(pool);

        const vehicleOrder = dummyFactory.vehicleOrder()
        await vehicleOrderRepository.save(vehicleOrder);

        const vehicleType = dummyFactory.vehicleType();
        await vehicleTypeRepository.save(vehicleType);

        const workDay = dummyFactory.workDay();
        workDay.asignateNewOrder(vehicleOrder.id, vehicleType, 1);
        await repository.save(workDay);
    });

    it("Get By Date", async function() {
        const repository = new WorkDayRepositorySqlServer(pool, dummyFactory.workDayFactory());
        const workDay = dummyFactory.workDay();
        await repository.save(workDay);

        const item = await repository.getByDate(workDay.date);
        assert.instanceOf(item, WorkDay);
        assert.equal(item.id, workDay.id);
    });

    it("Update", async function() {
        const vehicleOrderRepository = new VehicleOrderRepositorySqlServer(pool);
        const vehicleTypeRepository = new VehicleTypeRepositorySqlServer(pool);
        const repository = new WorkDayRepositorySqlServer(pool, dummyFactory.workDayFactory());

        const vehicleOrder = dummyFactory.vehicleOrder()
        await vehicleOrderRepository.save(vehicleOrder);

        const vehicleType = dummyFactory.vehicleType();
        await vehicleTypeRepository.save(vehicleType);

        const workDay = dummyFactory.workDay();
        workDay.asignateNewOrder(vehicleOrder.id, vehicleType, 1);
        await repository.save(workDay);

        workDay.assignedOrders[0].quantity += 1;
        await repository.update(workDay)
        const updated = await repository.getByDate(workDay.date);
        assert.equal(workDay.assignedOrders[0].quantity, updated.assignedOrders[0].quantity);
    });

    it("Get First With Available Hours StartingAt", async function() {
        const repository = new WorkDayRepositorySqlServer(pool, dummyFactory.workDayFactory());
        const workDay = dummyFactory.workDay();
        await repository.save(workDay);

        const freeWorkDay = await repository.getFirstWithAvailableHoursStartingAt(new Date());
        assert.instanceOf(freeWorkDay, WorkDay);
    });

});

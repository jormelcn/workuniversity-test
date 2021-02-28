const { pool } = require("../database-repository");

const { 
    WorkDayRepositorySqlServer, 
    VehicleOrderRepositorySqlServer,
    VehicleTypeRepositorySqlServer,
} = require("../src/infrastructure/repository");



const { WorkDay } = require("../src/domain/aggregate");
const { dummyFactory } = require("./dummy-factory");

const chai = require("chai");
const { expect } = require("chai");
const assert = chai.assert;



describe("Work Day Repository", () => {


    it("Get Last Assigned Date", async function(){
        const workDay = dummyFactory.workDay()
        
        const repository = new WorkDayRepositorySqlServer(pool);
        
        //await expect(() => repository.getLastAssigedDate()).to.throw();
        
        repository.save(workDay);

        const lastDate = await repository.getLastAssigedDate();
        assert.instanceOf(lastDate, Date);
        
        const lastDateStr = lastDate.toISOString().substring(0,10);
        const expectedDateStr = workDay.date.toISOString().substring(0,10);

        assert.equal(lastDateStr, expectedDateStr);
    });

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

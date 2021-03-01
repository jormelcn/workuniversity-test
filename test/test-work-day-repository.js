const { pool } = require("../database-repository");

const { 
    WorkDayRepositorySqlServer, 
    OrderRepositorySqlServer,
    VehicleTypeRepositorySqlServer,
} = require("../src/infrastructure/repository");



const { WorkDay } = require("../src/domain/aggregate");

const { dummyFactory } = require("./dummy-factory");
const { clearDatabase } = require("./utils");

const { assert} = require("chai");


describe("Work Day Repository", () => {

    before(async function(){
        await clearDatabase();
    });

    it("Get Last Assigned Date", async function(){
        const workDay = dummyFactory.workDay()
        
        const repository = new WorkDayRepositorySqlServer(pool, dummyFactory.workDayFactory());
        
        await repository.save(workDay);

        const lastDate = await repository.getLastAssigedDate();
        assert.instanceOf(lastDate, Date);
        
        const lastDateStr = lastDate.toISOString().substring(0,10);
        const expectedDateStr = workDay.date.toISOString().substring(0,10);

        assert.equal(lastDateStr, expectedDateStr);
    });

    it("Save", async function() {
        const orderRepository = new OrderRepositorySqlServer(pool);
        const vehicleTypeRepository = new VehicleTypeRepositorySqlServer(pool);
        const repository = new WorkDayRepositorySqlServer(pool, dummyFactory.workDayFactory());

        const order = dummyFactory.order()
        await orderRepository.save(order);

        const vehicleType = dummyFactory.vehicleType();
        await vehicleTypeRepository.save(vehicleType);

        const workDay = dummyFactory.workDay();
        workDay.asignateNewOrder(order.id, vehicleType, 1);
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
        const orderRepository = new OrderRepositorySqlServer(pool);
        const vehicleTypeRepository = new VehicleTypeRepositorySqlServer(pool);
        const repository = new WorkDayRepositorySqlServer(pool, dummyFactory.workDayFactory());

        const order = dummyFactory.order()
        await orderRepository.save(order);

        const vehicleType = dummyFactory.vehicleType();
        await vehicleTypeRepository.save(vehicleType);

        const workDay = dummyFactory.workDay();
        workDay.asignateNewOrder(order.id, vehicleType, 1);
        await repository.save(workDay);

        workDay.assignedOrders[0].quantity += 1;
        await repository.update(workDay)
        const updated = await repository.getByDate(workDay.date);
        assert.equal(workDay.assignedOrders[0].quantity, updated.assignedOrders[0].quantity);
    });

    it("Get First With Available Hours StartingAt", async function() {
        await clearDatabase();

        const orderRepository = new OrderRepositorySqlServer(pool);
        const vehicleTypeRepository = new VehicleTypeRepositorySqlServer(pool);
        const repository = new WorkDayRepositorySqlServer(pool, dummyFactory.workDayFactory());

        const order = dummyFactory.order()
        await orderRepository.save(order);

        const vehicleType = dummyFactory.vehicleType();
        await vehicleTypeRepository.save(vehicleType);

        const workDay = dummyFactory.workDay();
        workDay.workHours = 16;
        workDay.asignateNewOrder(order.id, vehicleType, 1);

        await repository.save(workDay);

        const freeWorkDay = await repository.getFirstWithAvailableHoursStartingAt(new Date());
        assert.instanceOf(freeWorkDay, WorkDay);
    });

    it("Get From to", async function() {
        await clearDatabase();

        const orderRepository = new OrderRepositorySqlServer(pool);
        const vehicleTypeRepository = new VehicleTypeRepositorySqlServer(pool);
        const repository = new WorkDayRepositorySqlServer(pool, dummyFactory.workDayFactory());

        const today = new Date();
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const after7days = new Date();
        after7days.setDate(after7days.getDate() +  7);

        const result1 = await repository.getFromTo(today, after7days);
        assert.isArray(result1);
        assert.isEmpty(result1);

        const order = dummyFactory.order()
        await orderRepository.save(order);

        const workDay1 = dummyFactory.workDay();
        workDay1.date = today;
        workDay1.workHours = 16;

        const workDay2 = dummyFactory.workDay();
        workDay2.date = tomorrow;
        workDay2.workHours = 16;

        await repository.save(workDay1);
        const result2 = await repository.getFromTo(today, after7days);
        assert.isArray(result2);
        assert.lengthOf(result2, 1);
        assert.isArray(result2[0].assignedOrders);
        assert.lengthOf(result2[0].assignedOrders, 0);
        
        const vehicleType = dummyFactory.vehicleType();
        vehicleType.manufacturingHours = 8

        await vehicleTypeRepository.save(vehicleType);
        workDay1.asignateNewOrder(order.id, vehicleType, 2);
        workDay2.asignateNewOrder(order.id, vehicleType, 1);
        await repository.update(workDay1);
        await repository.save(workDay2);

        const result3 = await repository.getFromTo(today, after7days);

        assert.isArray(result3);
        assert.lengthOf(result3, 2);
        assert.isArray(result3[0].assignedOrders);
        assert.lengthOf(result3[0].assignedOrders, 1);
        assert.equal(result3[0].assignedOrders[0].quantity, 2);
        assert.isArray(result3[1].assignedOrders);
        assert.lengthOf(result3[1].assignedOrders, 1);
        assert.equal(result3[1].assignedOrders[0].quantity, 1);
    });    

});

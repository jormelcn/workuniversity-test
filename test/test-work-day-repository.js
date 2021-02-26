const { pool } = require("../database-repository");

const { 
    WorkDayRepositorySqlServer, 
    VehicleOrderRepositorySqlServer,
    VehicleTypeRepositorySqlServer,
} = require("../src/infrastructure/repository");

const {
    IdGenerationServiceUUID
} = require("../src/infrastructure/service");

const {
    AssignedOrderFactory,
    WorkDayFactory,
} = require("../src/domain/factory");

const { WorkDay } = require("../src/domain/aggregate");

const { 
    VehicleType,
    VehicleOrder,
} = require("../src/domain/entity");

const chai = require("chai");
const { VehicleOrderRepository } = require("../src/domain/repository");
const assert = chai.assert;


describe("Work Day Repository", () => {

    // it("Get All", async function() {
    //     const repository = new VehicleTypeRepositorySqlServer(pool);
    //     const items = await repository.getAll();    
    //     assert.isArray(items);
    //     items.map(item => assert.instanceOf(item, VehicleType));
    // });

    // it("Update", async function() {
    //     const repository = new VehicleTypeRepositorySqlServer(pool);
    //     const id = "e1015098d5a64951b26f2b6c3152f4dd";
    //     const item = await repository.getById(id);    
    //     assert.instanceOf(item, VehicleType);    
    //     assert.equal(item.id, id);
    //     await repository.update(item)
    // });



    it("Save", async function() {
        const idGenerationService = new IdGenerationServiceUUID();

        const vehicleOrder = new VehicleOrder(idGenerationService.nextId(), new Date());
        const vehicleOrderRepository = new VehicleOrderRepositorySqlServer(pool);
        await vehicleOrderRepository.save(vehicleOrder);

        const vehicleType = new VehicleType(idGenerationService.nextId(), "Dummy Name 5", 5);
        const vehicleTypeRepository = new VehicleTypeRepositorySqlServer(pool);
        await vehicleTypeRepository.save(vehicleType);

        const assignedOrderFactory = new AssignedOrderFactory(idGenerationService);
        const workDayFactory = new WorkDayFactory(idGenerationService, assignedOrderFactory);

        const workDay = workDayFactory.fromDate(new Date());    
        workDay.asignateNewOrder(vehicleOrder.id, vehicleType, 1);
    
        const repository = new WorkDayRepositorySqlServer(pool);
        await repository.save(workDay);
    });

    it("Get By Date", async function() {

        const idGenerationService = new IdGenerationServiceUUID();
        const assignedOrderFactory = new AssignedOrderFactory(idGenerationService);
        const factory = new WorkDayFactory(idGenerationService, assignedOrderFactory);
        const repository = new WorkDayRepositorySqlServer(pool, factory);
        const item = await repository.getByDate(new Date());
        assert.instanceOf(item, WorkDay);
    });

    it("Update", async function() {

        const idGenerationService = new IdGenerationServiceUUID();
        const assignedOrderFactory = new AssignedOrderFactory(idGenerationService);
        const factory = new WorkDayFactory(idGenerationService, assignedOrderFactory);

        const repository = new WorkDayRepositorySqlServer(pool, factory);
        const item = await repository.getByDate(new Date());
        // item.assignedOrders[0].quantity += 1;
        // await repository.update(item)
        // const newItem = await repository.getByDate(new Date());
        
    });

});

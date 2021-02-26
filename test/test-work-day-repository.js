const { pool } = require("../database-repository");

const { 
    WorkDayRepositorySqlServer, 
    VehicleTypeRepositorySqlServer ,
    VehicleOrderRepositorySqlServer,
} = require("../src/infrastructure/repository");

const {
    IdGenerationService
} = require("../src/domain/service");

const {
    AssignedOrderFactory,
    WorkDayFactory,
} = require("../src/domain/factory");

const { WorkDay } = require("../src/domain/aggregate");

const { 
    AssignedOrder,
    VehicleType,
    VehicleOrder,
} = require("../src/domain/entity");

const { v4: uuidv4 } = require('uuid');
const chai = require("chai");
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
        const vehicleTypeRepository = new VehicleTypeRepositorySqlServer(pool);
        const idVehicleType = uuidv4().replace(/-/g, '');
        const vehicleType = new VehicleType(idVehicleType, "Vehicle Type Name", 5);
        await vehicleTypeRepository.save(vehicleType)

        const idVehicleOrder = uuidv4().replace(/-/g, '');
        const dateVehicleOrder = new Date();
        const vehicleOrder = new VehicleOrder(idVehicleOrder, dateVehicleOrder);
        const vehicleOrderRepository = new VehicleOrderRepositorySqlServer(pool);
        await vehicleOrderRepository.save(vehicleOrder);

        const id = uuidv4().replace(/-/g, '');
        const date = new Date();

        const idAssignedOrder = uuidv4().replace(/-/g, '');

        const assignedOrder = new AssignedOrder(
            idAssignedOrder,
            idVehicleOrder,
            new Date(),
            vehicleType,
            2
        );

        const workDay = new WorkDay(
            id, date, 16, [assignedOrder], new AssignedOrderFactory(new IdGenerationService())
        );
    
        const repository = new WorkDayRepositorySqlServer(pool);
        await repository.save(workDay);
    });

    it("Get By Date", async function() {

        const idGenerationService = new IdGenerationService();
        const assignedOrderFactory = new AssignedOrderFactory(idGenerationService);
        const factory = new WorkDayFactory(idGenerationService, assignedOrderFactory);

        const repository = new WorkDayRepositorySqlServer(pool, factory);
        const item = await repository.getByDate(new Date());
        assert.instanceOf(item, WorkDay);
    });

});

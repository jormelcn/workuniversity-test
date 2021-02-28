const { pool } = require("../../database-repository");

const { clearDatabase } = require("../utils");

const { assert } = require("chai");

const { dummyFactory } = require("../dummy-factory");

const {
    OrderService
} = require("../../src/domain/service/order-service");

const {
    WorkDayRepositorySqlServer,
    OrderRepositorySqlServer,
    VehicleTypeRepositorySqlServer,
} = require("../../src/infrastructure/repository");

describe("Order Service", () => {


    it("Assign New Order without prev orders", async function() {

        await clearDatabase();

        const workDayRepository = new WorkDayRepositorySqlServer(
            pool, dummyFactory.workDayFactory());

        const orderRepository = new OrderRepositorySqlServer(pool);
        const vehicleTypeRepository = new VehicleTypeRepositorySqlServer(pool);

        const vehicleType1 = dummyFactory.vehicleType();
        const vehicleType2 = dummyFactory.vehicleType();
        const vehicleType3 = dummyFactory.vehicleType();

        vehicleType1.manufacturingHours = 9;
        vehicleType2.manufacturingHours = 8;
        vehicleType3.manufacturingHours = 5;
        await vehicleTypeRepository.save(vehicleType1);
        await vehicleTypeRepository.save(vehicleType2);
        await vehicleTypeRepository.save(vehicleType3);

        const service = new OrderService(
            workDayRepository, 
            dummyFactory.workDayFactory(), 
            dummyFactory.idGenerationService(),
            orderRepository
        );

        await service.assignNewOrder([vehicleType1, vehicleType3], [1, 2]);

    });

});

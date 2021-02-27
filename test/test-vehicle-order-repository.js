const { pool } = require("../database-repository");
const { VehicleOrderRepositorySqlServer } = require("../src/infrastructure/repository");
const { VehicleOrder } = require("../src/domain/entity");

const chai = require("chai");
const assert = chai.assert;

const { dummyFactory } = require("./dummy-factory");

describe("Vehicle Order Repository", () => {

    it("Save", async function() {
        const vehicleOrder = dummyFactory.vehicleOrder()
        const repository = new VehicleOrderRepositorySqlServer(pool);
        await repository.save(vehicleOrder);
    });

    it("Get By Id", async function() {
        const vehicleOrder = dummyFactory.vehicleOrder();
        const repository = new VehicleOrderRepositorySqlServer(pool);
        await repository.save(vehicleOrder);

        const item = await repository.getById(vehicleOrder.id);    
        assert.instanceOf(item, VehicleOrder);    
        assert.equal(item.id, vehicleOrder.id);
    });


    it("Get All", async function() {
        const repository = new VehicleOrderRepositorySqlServer(pool);
        const items = await repository.getAll();    
        assert.isArray(items);
        items.map(item => assert.instanceOf(item, VehicleOrder));
    });

});

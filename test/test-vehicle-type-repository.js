const { pool } = require("../database-repository");
const { VehicleTypeRepositorySqlServer } = require("../src/infrastructure/repository");
const { VehicleType } = require("../src/domain/entity");
const { IdGenerationServiceUUID } = require("../src/infrastructure/service");

const { dummyFactory } = require("./dummy-factory");

const chai = require("chai");
const assert = chai.assert;


describe("Vehicle Type Repository", () => {


    it("Save", async function() {       
        const vehicleType = dummyFactory.vehicleType();
        const repository = new VehicleTypeRepositorySqlServer(pool);
        await repository.save(vehicleType);
    });

    it("Get By Id", async function() {
        const vehicleType = dummyFactory.vehicleType();
        const repository = new VehicleTypeRepositorySqlServer(pool);
        await repository.save(vehicleType);

        const item = await repository.getById(vehicleType.id);    
        assert.instanceOf(item, VehicleType);    
        assert.equal(item.id, vehicleType.id);
        assert.equal(item.isActive, vehicleType.isActive);
    });


    it("Get All", async function() {
        const repository = new VehicleTypeRepositorySqlServer(pool);
        const items = await repository.getAll();    
        assert.isArray(items);
        items.map(item => assert.instanceOf(item, VehicleType));
    });

    it("Update", async function() {
        const vehicleType = dummyFactory.vehicleType();
        const repository = new VehicleTypeRepositorySqlServer(pool);
        await repository.save(vehicleType);
        
        await repository.update(vehicleType);

        // TODO: comprobar que se actualizan los valores
    });

});

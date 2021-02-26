const { pool } = require("../database-repository");
const { VehicleTypeRepositorySqlServer } = require("../src/infrastructure/repository");
const { VehicleType } = require("../src/domain/entity");
const { IdGenerationServiceUUID } = require("../src/infrastructure/service");

const chai = require("chai");
const assert = chai.assert;


describe("Vehicle Type Repository", () => {


    it("Save", async function() {
        const idGenerationService = new IdGenerationServiceUUID();
        const id = idGenerationService.nextId()
        const name = "Nombre Ramdom 1";
        const vehicleType = new VehicleType(id, name, 5);
        const repository = new VehicleTypeRepositorySqlServer(pool);
        await repository.save(vehicleType);
    });

    it("Get By Id", async function() {
        const idGenerationService = new IdGenerationServiceUUID();
        const id = idGenerationService.nextId()
        const name = "Nombre Ramdom 2";
        const vehicleType = new VehicleType(id, name, 5);
        const repository = new VehicleTypeRepositorySqlServer(pool);
        await repository.save(vehicleType);

        const item = await repository.getById(id);    
        assert.instanceOf(item, VehicleType);    
        assert.equal(item.id, id);
    });


    it("Get All", async function() {
        const repository = new VehicleTypeRepositorySqlServer(pool);
        const items = await repository.getAll();    
        assert.isArray(items);
        items.map(item => assert.instanceOf(item, VehicleType));
    });

    it("Update", async function() {
        const idGenerationService = new IdGenerationServiceUUID();
        const id = idGenerationService.nextId()
        const name = "Nombre Ramdom 3";
        const vehicleType = new VehicleType(id, name, 5);
        const repository = new VehicleTypeRepositorySqlServer(pool);
        await repository.save(vehicleType);
        
        await repository.update(vehicleType);

        // TODO: comprobar que se actualizan los valores
    });

});

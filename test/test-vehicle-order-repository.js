const { pool } = require("../database-repository");
const { VehicleOrderRepositorySqlServer } = require("../src/infrastructure/repository");
const { VehicleOrder } = require("../src/domain/entity");

const { v4: uuidv4 } = require('uuid');
const chai = require("chai");
const assert = chai.assert;


describe("Vehicle Order Repository", () => {

    it("Save", async function() {
        const id = uuidv4().replace(/-/g, '');
        const date = new Date();
        const vehicleOrder = new VehicleOrder(id, date);
        const repository = new VehicleOrderRepositorySqlServer(pool);
        await repository.save(vehicleOrder);
    });

    it("Get By Id", async function() {

        const id = uuidv4().replace(/-/g, '');
        const date = new Date();
        const vehicleOrder = new VehicleOrder(id, date);
        const repository = new VehicleOrderRepositorySqlServer(pool);
        await repository.save(vehicleOrder);

        const item = await repository.getById(id);    
        assert.instanceOf(item, VehicleOrder);    
        assert.equal(item.id, id);
    });


    it("Get All", async function() {
        const repository = new VehicleOrderRepositorySqlServer(pool);
        const items = await repository.getAll();    
        assert.isArray(items);
        items.map(item => assert.instanceOf(item, VehicleOrder));
    });


});

const { pool } = require("../database-repository");
const { VehicleTypeRepositorySqlServer } = require("../src/infrastructure/repository");
const { VehicleType } = require("../src/domain/entity");

const { v4: uuidv4 } = require('uuid');
const chai = require("chai");
const assert = chai.assert;


describe("Vehicle Type Repository", () => {


    it("Get By Id", async function() {
        const repository = new VehicleTypeRepositorySqlServer(pool);
        const id = "e1015098d5a64951b26f2b6c3152f4dd";
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
        const repository = new VehicleTypeRepositorySqlServer(pool);
        const id = "e1015098d5a64951b26f2b6c3152f4dd";
        const item = await repository.getById(id);    
        assert.instanceOf(item, VehicleType);    
        assert.equal(item.id, id);
        await repository.update(item)
    });



    // it("Save", async function() {
    //     const id = uuidv4().replace(/-/g, '');
    //     console.log(id);
    //     const name = "Nombre Ramdom 2";
    //     const vehicleType = new VehicleType(id, name, 5);
    //     const repository = new VehicleTypeRepositorySqlServer(pool);
    //     await repository.save(vehicleType);
    // });

});

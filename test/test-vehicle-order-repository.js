const { pool } = require("../database-repository");
const { OrderRepositorySqlServer } = require("../src/infrastructure/repository");
const { Order } = require("../src/domain/entity");

const chai = require("chai");
const assert = chai.assert;

const { dummyFactory } = require("./dummy-factory");
const { clearDatabase } = require("./utils");

describe("Vehicle Order Repository", () => {

    before(async function(){
        await clearDatabase();
    });

    it("Save", async function() {
        const order = dummyFactory.order()
        const repository = new OrderRepositorySqlServer(pool);
        await repository.save(order);
    });

    it("Get By Id", async function() {
        const order = dummyFactory.order();
        const repository = new OrderRepositorySqlServer(pool);
        await repository.save(order);

        const item = await repository.getById(order.id);    
        assert.instanceOf(item, Order);    
        assert.equal(item.id, order.id);
    });


    it("Get All", async function() {
        const repository = new OrderRepositorySqlServer(pool);
        const items = await repository.getAll();    
        assert.isArray(items);
        items.map(item => assert.instanceOf(item, Order));
    });

});

const { 
    RemainingOrderManagement
} = require("../../src/domain/service/order-service/remaining-order-management");

const { dummyFactory } = require("../dummy-factory");
const { VehicleType } = require("../../src/domain/entity");

const chai = require("chai");

const assert = chai.assert;
const expect = chai.expect;


describe("Remaining Order Management", () => {


    it("Get remainig vehicle", async function() {
        const type1 = dummyFactory.vehicleType();
        const type2 = dummyFactory.vehicleType();
        
        type1.manufacturingHours = 5;
        type2.manufacturingHours = 3;

        const manager = new RemainingOrderManagement([type1, type2], [1, 2]);

        assert.deepEqual(manager.serialiceHours(), [5, 3, 3]);

        const v1 = manager.orderVehicle(3);
        assert.instanceOf(v1, VehicleType)
        assert.equal(v1.manufacturingHours, 3);

        assert.deepEqual(manager.serialiceHours(), [5, 3]);

        const v2 = manager.orderVehicle(5);
        assert.instanceOf(v2, VehicleType)
        assert.equal(v2.manufacturingHours, 5);

        assert.deepEqual(manager.serialiceHours(), [3]);

        expect(() => manager.orderVehicle(5)).to.throw();
    });

});

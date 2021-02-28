const {assert, expect} = require("chai");

const {
    IdGenerationService,
    OrderService
} = require("../src/domain/service");

const {
    AssignedOrderFactory,
    WorkDayFactory
} = require("../src/domain/factory");

const {
    OrderAssignmentRepository,
    OrderRepository,
    VehicleTypeRepository,
    WorkDayRepository,
} = require("../src/domain/repository");


const {
    resolveByClass
} = require("../src/injection/injection");


describe("Injection", () => {

    before(async function(){
        require("../src/injection/resolver/factory");
        require("../src/injection/resolver/repository-sqlserver");
        require("../src/injection/resolver//service");
    })

    it("Factory", async function() {

        assert.instanceOf(resolveByClass(AssignedOrderFactory), AssignedOrderFactory);
        assert.instanceOf(resolveByClass(WorkDayFactory), WorkDayFactory);
        
    });

    it("Service", async function() {

        assert.instanceOf(resolveByClass(IdGenerationService), IdGenerationService);
        assert.instanceOf(resolveByClass(OrderService), OrderService);
        
    });

    it("Repository", async function() {

        assert.instanceOf(resolveByClass(OrderRepository), OrderRepository);
        assert.instanceOf(resolveByClass(VehicleTypeRepository), VehicleTypeRepository);
        assert.instanceOf(resolveByClass(WorkDayRepository), WorkDayRepository);

        expect(() => resolveByClass(OrderAssignmentRepository)).to.throw();
         
    });

});

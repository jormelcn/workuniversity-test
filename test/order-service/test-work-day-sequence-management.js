const { pool } = require("../../database-repository");

const { 
    WorkDaySequenceManagement
} = require("../../src/domain/service/order-service/work-day-sequence-management");

const { 
    WorkDayRepositorySqlServer,
} = require("../../src/infrastructure/repository");

const { dummyFactory } = require("../dummy-factory");
const { VehicleType } = require("../../src/domain/entity");

const { clearDatabase } = require("../utils");

const { assert, expect } = require("chai");

function strDate(date){
    return date.toISOString().substring(0,10);
}

describe("Work Day Sequence management", () => {

    // before(async function(){
    //     await clearDatabase();
    // });

    it("Next Day without prev registered day", async function() {
        await clearDatabase();

        const repository = new WorkDayRepositorySqlServer(pool, dummyFactory.workDayFactory());
        const daysSequenceManager = new WorkDaySequenceManagement(
            dummyFactory.workDayFactory(),
            repository,
        );

        const date1 = new Date();
        date1.setDate(date1.getDate() + 1);

        const result1 = await daysSequenceManager.nextDay();
        assert.equal(strDate(result1.workDay.date) , strDate(date1));
        assert.isFalse(result1.itIsRegistered);
    });


    it("Next Day with prev registered day", async function() {

        await clearDatabase();

        const type1 = dummyFactory.vehicleType();
        const type2 = dummyFactory.vehicleType();
        
        type1.manufacturingHours = 5;
        type2.manufacturingHours = 3;

        const repository = new WorkDayRepositorySqlServer(pool, dummyFactory.workDayFactory());

        const daysSequenceManager = new WorkDaySequenceManagement(
            dummyFactory.workDayFactory(),
            repository,
        );

        const date2 = new Date();
        const date3 = new Date();
        date2.setDate(date2.getDate() + 2);
        date3.setDate(date3.getDate() + 3);

        const workDay2 = dummyFactory.workDay();
        workDay2.date = date2;
        workDay2.workHors = 1;

        await repository.save(workDay2);

        const result1 = await daysSequenceManager.nextDay();
        assert.equal(strDate(result1.workDay.date) , strDate(date2));
        assert.isTrue(result1.itIsRegistered);

        const result2 = await daysSequenceManager.nextDay();
        assert.equal(strDate(result2.workDay.date) , strDate(date3));
        assert.isFalse(result2.itIsRegistered);
        
    });

});

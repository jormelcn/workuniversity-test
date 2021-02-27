const {
    AssignedOrderFactory,
    WorkDayFactory,
} = require("../src/domain/factory");

const {
    IdGenerationServiceUUID
} = require("../src/infrastructure/service");

const { 
    VehicleOrder,
    VehicleType,
} = require("../src/domain/entity");


class DummyFactory {

    constructor(
        workDayFactory,
        idGenerationService,
    ){
        this._workDayFactory = workDayFactory;
        this.idGenerationService = idGenerationService;

        this.vehicleTypeCount = 0;
        this.workDayCount = 0;
    }

    workDayFactory(){
        return this._workDayFactory;
    }

    vehicleType(){
        this.vehicleTypeCount += 1;
        return new VehicleType(
            this.idGenerationService.nextId(), 
            `Dummy Name ${this.vehicleTypeCount}`, 
            2,
            true,
        );
    }

    vehicleOrder(){
        return new VehicleOrder(
            this.idGenerationService.nextId(), 
            new Date()
        );
    }

    workDay(){
        const date = new Date();
        date.setDate(date.getDate() + this.workDayCount);
        
        this.workDayCount +=1;
        const workDay = this._workDayFactory.fromDate(date);
        workDay.workHours = 16;
        return workDay;
    }

}

const idGenerationService = new IdGenerationServiceUUID();
const assignedOrderFactory = new AssignedOrderFactory(idGenerationService);
const workDayFactory = new WorkDayFactory(idGenerationService, assignedOrderFactory);

const dummyFactory = new DummyFactory(workDayFactory, idGenerationService);

module.exports = {
    dummyFactory
}

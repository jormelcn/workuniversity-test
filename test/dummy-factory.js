const {
    AssignedOrderFactory,
    WorkDayFactory,
} = require("../src/domain/factory");

const {
    IdGenerationServiceUUID
} = require("../src/infrastructure/service");

const { 
    Order,
    VehicleType,
} = require("../src/domain/entity");


class DummyFactory {

    constructor(
        workDayFactory,
        idGenerationService,
    ){
        this._workDayFactory = workDayFactory;
        this._idGenerationService = idGenerationService;

        this.vehicleTypeCount = 0;
        this.workDayCount = 0;
    }

    idGenerationService(){
        return this._idGenerationService;
    }

    workDayFactory(){
        return this._workDayFactory;
    }

    vehicleType(){
        this.vehicleTypeCount += 1;
        return new VehicleType(
            this._idGenerationService.nextId(), 
            `Dummy Name ${this.vehicleTypeCount}`, 
            2,
            true,
        );
    }

    order(){
        return new Order(
            this._idGenerationService.nextId(), 
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

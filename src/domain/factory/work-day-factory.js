const {
    InvalidArgumentError
} = require("../error");

const {
    verifyIsInstance
} = require("../model-utils");

const {
    IdGenerationService
} = require("../service");

const {
    AssignedOrderFactory
} = require("./assigned-order-factory");

const { WorkDay } = require("../aggregate/work-day");


const defaultWorkHoursPerDay = [
    // Sunday
    0,
    // Monday
    16,
    // Tuesday
    16,
    // Wednesday
    16,
    // Thursday
    16,
    // Friday
    16,
    // Saturday
    4,
]


class WorkDayFactory {

    constructor(
        idGenerationService,
        assignedOrderFactory
    ){
        if(!verifyIsInstance(idGenerationService, IdGenerationService))
            throw new InvalidArgumentError("WorkDayFactory: idGenerationService debe ser una instancia de IdGenerationService");
        if(!verifyIsInstance(assignedOrderFactory, AssignedOrderFactory))
        throw new InvalidArgumentError("WorkDayFactory: assignedOrderFactory debe ser una instancia de AssignedOrderFactory");
        
        this.idGenerationService = idGenerationService;
        this.assignedOrderFactory = assignedOrderFactory;
    }

    fromProperties(id, date, workHours, assignedOrders){
        return new WorkDay(
            id, 
            date, 
            workHours, 
            assignedOrders, 
            this.assignedOrderFactory
        )
    }

    fromDate(date) {
        const id = this.idGenerationService.nextId();
        const workHours = defaultWorkHoursPerDay[date.getDay()];
        return new WorkDay(
            id,
            date,
            workHours,
            [],
            this.assignedOrderFactory
        );
    }

}

module.exports = {
    WorkDayFactory
}

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

}

module.exports = {
    WorkDayFactory
}

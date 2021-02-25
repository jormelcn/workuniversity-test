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
    AssignedOrder
} = require("../entity");

class AssignedOrderFactory {

    constructor(
        idGenerationService
    ){
        if(!verifyIsInstance(idGenerationService, IdGenerationService))
            throw new InvalidArgumentError("AssignedOrderFactory: idGenerationService debe ser una instancia de IdGenerationService")
        this.idGenerationService = idGenerationService;
    }

    fromVehicleTypeQuantityAndDate(vehicleType, quantity, date){
        const id = this.idGenerationService.nextId();
        return new AssignedOrder(id, date, vehicleType, quantity);
    }

}

module.exports = {
    AssignedOrderFactory
}

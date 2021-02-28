const {
    InvalidArgumentError
} = require("../error");

const {
    verifyIsInstance
} = require("../model-utils");

const {
    IdGenerationService
} = require("../service/id-generation-service");

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

    fromPropertiesWithoutId(idOrder, vehicleType, quantity, date){
        const id = this.idGenerationService.nextId();
        return new AssignedOrder(id, idOrder, date, vehicleType, quantity);
    }

}

module.exports = {
    AssignedOrderFactory
}

const {
    NotImplementedError
} = require("../error");


class AssignedOrderRepository {

    getStartingAt(startDate){
        throw new NotImplementedError("AssignedOrderRepository:  se debe implementar getStartingAt");
    }

    getStartingAtEndingAt(startDate, endDate){
        throw new NotImplementedError("AssignedOrderRepository:  se debe implementar getStartingAtEndingAt");
    }

    saveMultiple(assignedOrders){
        throw new NotImplementedError("AssignedOrderRepository:  se debe implementar saveMultiple");
    }

}

module.exports = {
    AssignedOrderRepository
}

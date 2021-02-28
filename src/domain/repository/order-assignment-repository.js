const {
    NotImplementedError
} = require("../error");


class OrderAssignmentRepository {

    getById(id){
        throw new NotImplementedError("OrderAssignmentRepository:  se debe implementar getById");
    }

}

module.exports = {
    OrderAssignmentRepository
}

const {
    NotImplementedError
} = require("../error");

class OrderRepository {

    getById(id){
        throw new NotImplementedError("OrderRepository: se debe implementar getById");
    }

    getAll(){
        throw new NotImplementedError("OrderRepository: se debe implementar getAll");
    }

    save(Order){
        throw new NotImplementedError("OrderRepository: se debe implementar save");
    }

}

module.exports = {
    OrderRepository
}

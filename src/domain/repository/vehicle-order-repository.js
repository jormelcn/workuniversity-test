const {
    NotImplementedError
} = require("../error");

class VehicleOrderRepository {

    getById(id){
        throw new NotImplementedError("VehicleOrderRepository: se debe implementar getById");
    }

    getAll(){
        throw new NotImplementedError("VehicleOrderRepository: se debe implementar getAll");
    }

    save(VehicleOrder){
        throw new NotImplementedError("VehicleOrderRepository: se debe implementar save");
    }

}

module.exports = {
    VehicleOrderRepository
}

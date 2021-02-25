const {
    NotImplementedError
} = require("../error");

class VehicleTypeRepository {

    getById(id){
        throw new NotImplementedError("VehicleTypeRepository: se debe implementar getById");
    }

    getAll(){
        throw new NotImplementedError("VehicleTypeRepository: se debe implementar getAll");
    }

    save(vehicleType){
        throw new NotImplementedError("VehicleTypeRepository: se debe implementar save");
    }

    update(vehicleType){
        throw new NotImplementedError("VehicleTypeRepository: se debe implementar update");
    }

    removeById(id){
        throw new NotImplementedError("VehicleTypeRepository: se debe implementar removeById");
    }

}

module.exports = {
    VehicleTypeRepository
}

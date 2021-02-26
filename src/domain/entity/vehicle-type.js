const {
    InvalidArgumentError
} = require("../error")

const {
    verifyIsString,
    verifyIsInteger,
} = require("../model-utils")


class VehicleType {
    constructor(id, name, manufacturingHours){
        if(!verifyIsString(id))
            throw new InvalidArgumentError("VehicleType: id debe ser string")
        if(!verifyIsString(name))
            throw new InvalidArgumentError("VehicleType: name debe ser string")
        if(!verifyIsInteger(manufacturingHours))
            throw new InvalidArgumentError("VehicleType: manufacturingHours debe ser un número entero")

        this.id = id;
        this.name = name;
        this.manufacturingHours = manufacturingHours;
    }
}

module.exports = {
    VehicleType,
}

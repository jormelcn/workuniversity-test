const {
    InvalidArgumentError
} = require("../error");

const {
    verifyIsString,
    verifyIsInteger,
    verifyIsBoolean,
} = require("../model-utils");


class VehicleType {
    constructor(id, name, manufacturingHours, isActive){
        if(!verifyIsString(id))
            throw new InvalidArgumentError("VehicleType: id debe ser string");
        if(!verifyIsString(name))
            throw new InvalidArgumentError("VehicleType: name debe ser string");
        if(!verifyIsInteger(manufacturingHours))
            throw new InvalidArgumentError("VehicleType: manufacturingHours debe ser un número entero");
        if(!verifyIsBoolean(isActive))
            throw new InvalidArgumentError("VehicleType: isActive debe ser un booleano");

        this.id = id;
        this.name = name;
        this.manufacturingHours = manufacturingHours;
        this.isActive = isActive;
    }
}

module.exports = {
    VehicleType,
}

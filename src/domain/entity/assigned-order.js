const {
    VehicleType
} = require("./")

const {
    InvalidArgumentError,
} = require("../error");

const {
    verifyIsString,
    verifyIsInteger,
    verifyIsInstance,
} = require("../model-utils");


class AssignedOrder {
    constructor(
        id,
        date,
        vehicleType,
        quantity,
    ){
        if(!verifyIsString(id))
            throw new InvalidArgumentError("AssignedOrder: id debe ser string");
        if(!verifyIsInstance(date, Date))
            throw new InvalidArgumentError("AssignedOrder: date debe ser instancia de Date");
        if(!verifyIsInstance(vehicleType, VehicleType))
            throw new InvalidArgumentError("AssignedOrder: vehicleType debe ser instancia de VehicleType");
        if(!verifyIsInteger(quantity))       
            throw new InvalidArgumentError("AssignedOrder: quantity debe ser un número entero");
        
        this.id = id;
        this.date = date;
        this.vehicleType = vehicleType;
        this.quantity = quantity;
    }
}

module.exports = {
    AssignedOrder
}

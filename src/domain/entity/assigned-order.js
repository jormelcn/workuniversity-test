const {
    VehicleType
} = require("./")

const {
    InvalidTypeError,
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
            throw new InvalidTypeError("AssignedOrder: id debe ser string");
        if(!verifyIsInstance(date, Date))
            throw new InvalidTypeError("AssignedOrder: date debe ser instancia de Date");
        if(!verifyIsInstance(vehicleType, VehicleType))
            throw new InvalidTypeError("AssignedOrder: vehicleType debe ser instancia de VehicleType");
        if(!verifyIsInteger(quantity))       
            throw new InvalidTypeError("AssignedOrder: quantity debe ser un número entero");
        
        this.id = id;
        this.date = date;
        this.vehicleType = vehicleType;
        this.quantity = quantity;
    }
}

module.exports = {
    AssignedOrder
}

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
        idVehicleOrder,
        date,
        vehicleType,
        quantity,
    ){
        if(!verifyIsString(id))
            throw new InvalidArgumentError("AssignedOrder: id debe ser string");
        if(!verifyIsString(idVehicleOrder))
            throw new InvalidArgumentError("AssignedOrder: idVehicleOrder debe ser string");
        if(!verifyIsInstance(date, Date))
            throw new InvalidArgumentError("AssignedOrder: date debe ser instancia de Date");
        if(!verifyIsInstance(vehicleType, VehicleType))
            throw new InvalidArgumentError("AssignedOrder: vehicleType debe ser instancia de VehicleType");
        if(!verifyIsInteger(quantity))       
            throw new InvalidArgumentError("AssignedOrder: quantity debe ser un número entero");
        
        this.id = id;
        this.idVehicleOrder = idVehicleOrder;
        this.date = date;
        this.vehicleType = vehicleType;
        this.quantity = quantity;
    }

    assignedHours(){
        return this.vehicleType.manufacturingHours * this.quantity;
    }
}

module.exports = {
    AssignedOrder
}

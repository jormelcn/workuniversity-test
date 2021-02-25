const {
    InvalidTypeError,
    InvalidOrderQuantity,
} = require("../error");

const {
    verifyIsString,
    verifyIsInteger,
    verifyIsInstance,
    verifyArrayInstanceOf,
    verifyArray,

    sumarArray,
} = require("../model-utils");

const {
    VehicleType
} = require("./");

const minQuantity = 1;
const maxQuantity = 10;


class VehicleOrder {
    constructor(
        id,
        orderDate,
        vehiclesList,
        quantityList,
    ){
        if(!verifyIsString(id))
            throw new InvalidTypeError("VehicleOrder: id debe ser string");
        if(!verifyIsInstance(orderDate, Date))
            throw new InvalidTypeError("VehicleOrder: orderDate debe ser instancia de Date");
        if(!verifyArrayInstanceOf(vehiclesList, VehicleType))
            throw new InvalidTypeError("VehicleOrder: vehiclesList debe ser una lista de VehicleType");
        if(!verifyArray(quantityList, verifyIsInteger))
            throw new InvalidTypeError("VehicleOrder: quantityList debe ser una lista de Numeros enteros");

        const totalQuantity = sumarArray(quantityList);
        if(totalQuantity < minQuantity || totalQuantity > maxQuantity)
            throw new InvalidOrderQuantity("VehicleOrder: La cantidad requerida excede los limites establecidos");

        this.id = is;
        this.orderDate = orderDate;
        this.vehiclesList = vehiclesList;
        this.quantityList = quantityList;
    }
}

module.exports = {
    VehicleOrder
}

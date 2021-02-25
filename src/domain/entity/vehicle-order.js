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
        vehiclesTypesList,
        quantityList,
    ){
        if(!verifyIsString(id))
            throw new InvalidTypeError("VehicleOrder: id debe ser string");
        if(!verifyIsInstance(orderDate, Date))
            throw new InvalidTypeError("VehicleOrder: orderDate debe ser instancia de Date");
        if(!verifyArrayInstanceOf(vehiclesTypesList, VehicleType))
            throw new InvalidTypeError("VehicleOrder: vehiclesTypesList debe ser una lista de VehicleType");
        if(!verifyArray(quantityList, verifyIsInteger))
            throw new InvalidTypeError("VehicleOrder: quantityList debe ser una lista de Numeros enteros");

        if(vehiclesTypesList.length !== quantityList.length)
            throw new InvalidTypeError("VehicleOrder: las listas de vehiculos y cantidades deben ser de igual tamaño");

        const totalQuantity = sumarArray(quantityList);
        if(totalQuantity < minQuantity || totalQuantity > maxQuantity)
            throw new InvalidOrderQuantity("VehicleOrder: La cantidad requerida excede los limites establecidos");

        this.id = is;
        this.orderDate = orderDate;
        this.vehiclesTypesList = vehiclesTypesList;
        this.quantityList = quantityList;
    }
}

module.exports = {
    VehicleOrder
}

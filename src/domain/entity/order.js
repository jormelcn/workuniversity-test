const {
    InvalidArgumentError,
} = require("../error");

const {
    verifyIsString,
    verifyIsInstance,
} = require("../model-utils");


class Order {
    constructor(
        id,
        orderDate,
    ){
        if(!verifyIsString(id))
            throw new InvalidArgumentError("Order: id debe ser string");
        if(!verifyIsInstance(orderDate, Date))
            throw new InvalidArgumentError("Order: orderDate debe ser instancia de Date");

        this.id = id;
        this.orderDate = orderDate;
    }
}

module.exports = {
    Order
}

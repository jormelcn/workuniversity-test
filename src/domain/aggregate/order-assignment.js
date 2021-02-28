const {
    AssignedOrder
} = require("../entity");

class OrderAssignment {
    constructor(
        id,
        orderDate,
        assignedOrders,
    ){
        if(!verifyIsString(id))
            throw new InvalidArgumentError("OrderAssignment: id debe ser string");
        if(!verifyIsInstance(orderDate, Date))
            throw new InvalidArgumentError("OrderAssignment: orderDate debe ser instancia de Date");
        if(!verifyArrayInstanceOf(assignedOrders, AssignedOrder))
            throw new InvalidArgumentError("OrderAssignment: assignedOrders debe ser un array de AssignedOrders");
        
            
        this.id = id;
        this.orderDate = orderDate;
        this.assignedOrders = assignedOrders;
    }
}

module.exports = {
    OrderAssignment
}

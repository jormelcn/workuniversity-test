const {
    AssignedOrder
} = require("../entity");

const {
    verifyIsString,
    verifyIsInstance,
    verifyIsInteger,
    verifyArrayInstanceOf,

    sumarArray,
} = require("../model-utils");

const {
    InvalidArgumentError,
    InsufficientWorkingHours,
} = require("../error");

const {
    AssignedOrderFactory
} = require("../factory/assigned-order-factory");


class WorkDay {
    constructor(
        id,
        date,
        workHours,
        assignedOrders,
        assignedOrderFactory,
    ){
        if(!verifyIsString(id))
            throw new InvalidArgumentError("WorkDay: id debe ser string");
        if(!verifyIsInstance(date, Date))
            throw new InvalidArgumentError("WorkDay: date debe ser instancia de Date");
        if(!verifyIsInteger(workHours))
            throw new InvalidArgumentError("WorkDay: workHours debe ser un número entero");
        if(!verifyArrayInstanceOf(assignedOrders, AssignedOrder))
            throw new InvalidArgumentError("WorkDay: assignedOrders debe ser un array de AssignedOrders");
        if(!verifyIsInstance(assignedOrderFactory, AssignedOrderFactory))
            throw new InvalidArgumentError("WorkDay: assignedOrderFactory debe ser instancia de AssignedOrderFactory");
            
        this.id = id;
        this.date = date;
        this.workHours = workHours;
        this.assignedOrders = assignedOrders;
        this.assignedOrderFactory = assignedOrderFactory;
    }
    
    getAssignedHours(){
        const assignedHours = this.assignedOrders
            .map(order => order.vehicleType.manufacturingHours*order.quantity);
        return sumarArray(assignedHours);
    }

    getAvailableHours(){
        return this.workHours - this.getAssignedHours()
    }

    asignateNewOrder(idVehicleOrder, vehicleType, quantity){
        const assignedOrder =  this.assignedOrderFactory
            .fromPropertiesWithoutId(idVehicleOrder, vehicleType, quantity, this.date);
        if (assignedOrder.assignedHours() > this.getAvailableHours())
            throw new InsufficientWorkingHours("WorkDay: No hay suficientes horas disponibles")
        
        for(let i = 0; i < this.this.assignedOrders.length; i++){
            if (this.this.assignedOrders[i].vehicleType.id === vehicleType.id){
                this.this.assignedOrders[i].quantity += quantity;
                return;
            }
        }
        this.assignedOrders.push(assignedOrder);
    }
}

module.exports = {
    WorkDay
}

const { resolveByClass } = require("../../../injection/injection");

const { VehicleTypeRepository } = require("../../../domain/repository");
const { OrderService } = require("../../../domain/service");

const { 
    verifyArray, 
    verifyIsInteger, 
    verifyIsString
} = require("../../../domain/model-utils");

const { 
    NotFoundError,
    InvalidOrderQuantity,
} = require("../../../domain/error");


const vehicleTypeRepository = resolveByClass(VehicleTypeRepository);
const orderService = resolveByClass(OrderService);


function assignNewOrder(req, res){
    if (!(req.body instanceof Array) )
        return res.status(400).json({error:  "Body debe ser un array [ {idVehicleType: string, quantity: int}, ... ]"});

    const ids = req.body.map(item => item.idVehicleType);
    const quantities = req.body.map(item => item.quantity);
    
    if(!verifyArray(ids, verifyIsString))
        return res.status(400).json({error: "Body debe ser un array [ {idVehicleType: string, quantity: int}, ... ]"});
    if(!verifyArray(quantities, verifyIsInteger))
        return res.status(400).json({error: "Body debe ser un array [ {idVehicleType: string, quantity: int}, ... ]"});

    vehicleTypeRepository.getAll().then( vts => {
        const orderVTs = vts.filter(vt => ids.indexOf(vt.id) !== -1);
        if(orderVTs.length < ids.length)
            throw new NotFoundError("No se encontraron todos los tipos de vehículos especificados");
        return orderService.assignNewOrder(orderVTs, quantities);
    }).then( () => {
        res.json({success: true});
    }).catch(error => {
        if(error instanceof NotFoundError){
            res.status(404).json({error: error.message});
        }
        else if(error instanceof InvalidOrderQuantity){
            res.status(400).json({error: error.message});
        }
        else {
            res.status(500).json({error: "error desconocido"});
            console.error(error);
        }
    });
}

module.exports = {
    assignNewOrder
}

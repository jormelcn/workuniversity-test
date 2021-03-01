const { resolveByClass } = require("../../../injection/injection");

const { VehicleTypeRepository } = require("../../../domain/repository");
const { VehicleType } = require("../../../domain/entity");
const { IdGenerationService } = require("../../../domain/service");

const { NotFoundError } = require("../../../domain/error");
const repository = resolveByClass(VehicleTypeRepository);
const idGenerationService = resolveByClass(IdGenerationService);


function getAll(req, res){
    repository.getAll().then( items =>
        res.json(items)
    ).catch( error => {
        res.status(500).json({error: "error desconocido"});
        console.log(error);
    });
}


function update(req, res){
    let vehicleType;
    try{
        vehicleType = new VehicleType(
            req.params.id,
            req.body.name,
            req.body.manufacturingHours,
            req.body.isActive === false ? false : true
        );
    }
    catch(e){
        return res.status(400).json({error: e.message});
    }
    repository.update(vehicleType).then(() => {
        res.json({success: true});
    }).catch(error => {
        if (error instanceof NotFoundError)
            return res.status(404).json({error: "No se encontró un elemento con el identificador especificado"});
        res.status(500).json({error: "error desconocido"});
        console.log(error);
    });
}

function save(req, res){
    let vehicleType;
    try{
        vehicleType = new VehicleType(
            idGenerationService.nextId(),
            req.body.name,
            req.body.manufacturingHours,
            true,
        );
    }
    catch(e){
        return res.status(400).json({error: e.message});       
    }

    repository.save(vehicleType).then(() => {
        res.json(vehicleType);
    }).catch(error => {
        res.status(500).json({error: "error desconocido"});
        console.log(error);
    });
}

module.exports = {
    getAll,
    update,
    save,
}

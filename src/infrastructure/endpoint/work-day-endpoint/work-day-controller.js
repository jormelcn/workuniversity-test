const { resolveByClass } = require("../../../injection/injection");
const { WorkDayRepository } = require("../../../domain/repository");

const workDayRepository = resolveByClass(WorkDayRepository);


function getWorkDaysFromTo(req, res){

    const start = new Date(req.query.start);
    const end = new Date(req.query.end);
    
    if(isNaN(start) || isNaN(end))
        return res.status(400).json({error: "Los parámetros de consulta start y end, deben ser formatos válidos de fecha"});
    
    workDayRepository.getFromTo(start, end).then( workDays => {
        res.json(workDays);
    }).catch( error => {
        res.status(500).json({error: "error desconocido"});
        console.error(error);
    });

}

module.exports = {
    getWorkDaysFromTo
}

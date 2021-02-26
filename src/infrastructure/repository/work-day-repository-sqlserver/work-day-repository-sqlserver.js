const {
    WorkDayRepository
} = require("../../../domain/repository");

const {
    InaccessibleRepository,
    NotFoundError,
    InvalidArgumentError,
} = require("../../../domain/error");

const { 
    WorkDay,
} = require("../../../domain/aggregate");

const {
    verifyIsInstance,
    verifyIsString,
} = require("../../../domain/model-utils");

const {
    getWorkDayAssignedOrders,
    saveWorkDayAssignedOrders,
    updateAssignedOrderQuantity,
} = require("./assigned-order-utils");

const WORK_DAY = "work_day";
const WORK_DAY_ID = "id";
const WORK_DAY_DATE = "date";
const WORK_DAY_WORK_HOURS = "work_hours";


class WorkDayRepositorySqlServer extends WorkDayRepository{

    constructor(pool, workDayFactory){
        super()
        this.pool = pool;
        this.workDayFactory = workDayFactory;
    }

    async getByDate(date){
        await this.pool.connect();
        let workDayDTO;
        try {
            const request = this.pool.request();
            const dateStr = date.toISOString().substring(0, 10);
            const result = await request.query(`
                SELECT * FROM "${WORK_DAY}" WHERE "${WORK_DAY_DATE}" = '${dateStr}';
            `);
            if (result.recordset.length === 0)
                throw new NotFoundError(`WorkDayRepositorySqlServer: no se encontró workDay para la fecha ${dateStr}`)
            workDayDTO = result.recordset[0];
        }catch(e){
            throw new InaccessibleRepository(`VehicleTypeRepositorySqlServer: error desconocido -> ${e}`)
        }
        const id = workDayDTO[WORK_DAY_ID];
        const _date = workDayDTO[WORK_DAY_DATE];
        const workHours = workDayDTO[WORK_DAY_WORK_HOURS];
        const assignedOrders = await getWorkDayAssignedOrders(id, _date, this.pool);
        return this.workDayFactory.fromProperties(id, _date, workHours, assignedOrders)
    }

    async save(workDay){
        if(!verifyIsInstance(workDay, WorkDay))
            throw new InvalidArgumentError("WorkDayRepositorySqlServer: workDay debe ser instancia de WorkDay");
        const {id, date, workHours} = workDay;
        await this.pool.connect();
        try{
            const request = this.pool.request();
            await request.query(`
                INSERT INTO "${WORK_DAY}" VALUES ('${id}', '${date.toISOString()}', '${workHours}');
            `);
        }
        catch(e){
            throw new InaccessibleRepository(`VehicleTypeRepositorySqlServer: error desconocido -> ${e}`)
        }
        if (workDay.assignedOrders.length > 0)
            await saveWorkDayAssignedOrders(workDay.id, workDay.assignedOrders, this.pool);
    }

    async update(workDay){
        if(!verifyIsInstance(workDay, WorkDay))
            throw new InvalidArgumentError("WorkDayRepositorySqlServer: workDay debe ser instancia de WorkDay");
        const old_workDay = await this.getByDate(workDay.date);
        const prevExists_assignedOrders_ids = old_workDay.assignedOrders.map(ao => ao.id);
    
        const update_assignedOrders = workDay.assignedOrders.filter( 
            ao => prevExists_assignedOrders_ids.indexOf(ao.id) !== -1
        );
        for(let i=0; i < update_assignedOrders.length; i++)
            await updateAssignedOrderQuantity(update_assignedOrders[i], this.pool);
        
        const new_assignedOrders = workDay.assignedOrders.filter( 
            ao => prevExists_assignedOrders_ids.indexOf(ao.id) === -1
        );
        if (new_assignedOrders.length > 0)
            await saveWorkDayAssignedOrders(workDay.id, new_assignedOrders, this.pool);

    }

}

module.exports = {
    WorkDayRepositorySqlServer,
    WORK_DAY,
    WORK_DAY_ID,
    WORK_DAY_DATE,
    WORK_DAY_WORK_HOURS,
}

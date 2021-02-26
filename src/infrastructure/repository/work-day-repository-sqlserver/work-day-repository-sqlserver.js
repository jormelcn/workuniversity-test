
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
            const dateStr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
            const result = await request.query(`
                SELECT * FROM "${WORK_DAY}" WHERE "${WORK_DAY_DATE}" = '${dateStr}'
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
        await saveWorkDayAssignedOrders(workDay.id, workDay.assignedOrders, this.pool);
    }

}

module.exports = {
    WorkDayRepositorySqlServer
}

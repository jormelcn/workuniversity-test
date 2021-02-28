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
    WorkDayFactory,
} = require("../../../domain/factory");

const {
    verifyIsInstance,
} = require("../../../domain/model-utils");

const {
    getWorkDayAssignedOrders,
    saveWorkDayAssignedOrders,
    updateAssignedOrderQuantity,
    ASSIGNED_ORDER,
    ASSIGNED_ORDER_ID_WORK_DAY,
    ASSIGNED_ORDER_QUANTITY,
    ASSIGNED_ORDER_VEHICLE_MANUFACTURING_HOURS,
} = require("./assigned-order-utils");

const WORK_DAY = "work_day";
const WORK_DAY_ID = "id";
const WORK_DAY_DATE = "date";
const WORK_DAY_WORK_HOURS = "work_hours";


class WorkDayRepositorySqlServer extends WorkDayRepository{

    constructor(pool, workDayFactory){
        super()
        this.pool = pool;

        if(!verifyIsInstance(workDayFactory, WorkDayFactory))
            throw new InvalidArgumentError("WorkDayRepositorySqlServer: workDayFactory debe ser instancia de WorkDayFactory");
        this.workDayFactory = workDayFactory;
    }

    async getLastAssigedDate(){
        const query = `
        SELECT 
            MAX("${WORK_DAY_DATE}") as last_date
        FROM 
            "${WORK_DAY}"
        `;
        await this.pool.connect();
        let result;
        try {
            const request = this.pool.request();
            result = await request.query(query);
        }catch(e){
            throw new InaccessibleRepository(`WorkDayRepositorySqlServer: error desconocido -> ${e}`);
        }
        if (result.recordset[0].last_date == null)
            throw new NotFoundError(`WorkDayRepositorySqlServer: no hay ningun dia de trabajo asignado`);
        return result.recordset[0].last_date;
    }

    async getFirstWithAvailableHoursStartingAt(date){
        const dateStr = date.toISOString().substring(0, 10);
        const query = `
            SELECT
                wd."${WORK_DAY_ID}",
                wd."${WORK_DAY_DATE}",
                wd."${WORK_DAY_WORK_HOURS}",
                COALESCE(SUM(ao."${ASSIGNED_ORDER_QUANTITY}" * ao."${ASSIGNED_ORDER_VEHICLE_MANUFACTURING_HOURS}"), 0) AS assigned_hours
            FROM
                "${WORK_DAY}" AS wd
                LEFT JOIN "${ASSIGNED_ORDER}" AS ao
                    ON wd."${WORK_DAY_ID}" = ao."${ASSIGNED_ORDER_ID_WORK_DAY}"
            WHERE 
                wd."${WORK_DAY_DATE}" >= '${dateStr}'
            GROUP BY 
                wd."${WORK_DAY_ID}", wd."${WORK_DAY_WORK_HOURS}", wd."${WORK_DAY_DATE}"
            HAVING 
                COALESCE(SUM(ao."${ASSIGNED_ORDER_QUANTITY}" * ao."${ASSIGNED_ORDER_VEHICLE_MANUFACTURING_HOURS}"), 0) < wd."${WORK_DAY_WORK_HOURS}"
            ORDER BY 
                wd."${WORK_DAY_DATE}" ASC
            OFFSET 0 ROWS
                FETCH NEXT 1 ROWS ONLY;
        `;
        await this.pool.connect();
        let result;
        try {
            const request = this.pool.request();
            result = await request.query(query);
        }catch(e){
            throw new InaccessibleRepository(`WorkDayRepositorySqlServer: error desconocido -> ${e}`)
        }
        if (result.recordset.length === 0)
            throw new NotFoundError(`WorkDayRepositorySqlServer: no se encontró workDay con horas disponibles`);
        const workDayDTO = result.recordset[0];
        const id = workDayDTO[WORK_DAY_ID];
        const _date = workDayDTO[WORK_DAY_DATE];
        const workHours = workDayDTO[WORK_DAY_WORK_HOURS];
        const assignedOrders = await getWorkDayAssignedOrders(id, _date, this.pool);
        return this.workDayFactory.fromProperties(id, _date, workHours, assignedOrders);   
    }

    async getByDate(date){
        await this.pool.connect();
        let result;
        try {
            const request = this.pool.request();
            const dateStr = date.toISOString().substring(0, 10);
            result = await request.query(`
                SELECT * FROM "${WORK_DAY}" WHERE "${WORK_DAY_DATE}" = '${dateStr}';
            `);
        }catch(e){
            throw new InaccessibleRepository(`WorkDayRepositorySqlServer: error desconocido -> ${e}`)
        }
        if (result.recordset.length === 0)
            throw new NotFoundError(`WorkDayRepositorySqlServer: no se encontró workDay para la fecha ${dateStr}`);
        const workDayDTO = result.recordset[0];
        const id = workDayDTO[WORK_DAY_ID];
        const _date = workDayDTO[WORK_DAY_DATE];
        const workHours = workDayDTO[WORK_DAY_WORK_HOURS];
        const assignedOrders = await getWorkDayAssignedOrders(id, _date, this.pool);
        return this.workDayFactory.fromProperties(id, _date, workHours, assignedOrders);
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
            throw new InaccessibleRepository(`WorkDayRepositorySqlServer: error desconocido -> ${e}`)
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

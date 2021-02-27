const {
    AssignedOrder,
    VehicleType,
} = require("../../../domain/entity");

const {
    InaccessibleRepository,
} = require("../../../domain/error");

const {
    VEHICLE_TYPE,
    VEHICLE_TYPE_ID,
    VEHICLE_TYPE_NAME,
    VEHICLE_TYPE_IS_ACTIVE,
} = require("../vehicle-type-repository-sqlserver")


const ASSIGNED_ORDER = "assigned_order";
const ASSIGNED_ORDER_ID = "id";
const ASSIGNED_ORDER_ID_VEHICLE_TYPE = "id_vehicle_type";
const ASSIGNED_ORDER_ID_VEHICLE_ORDER = "id_vehicle_order";
const ASSIGNED_ORDER_ID_WORK_DAY = "id_work_day";
const ASSIGNED_ORDER_VEHICLE_MANUFACTURING_HOURS = "vehicle_manufacturing_hours";
const ASSIGNED_ORDER_QUANTITY = "quantity";

function assignedOrderFromDTO(dto, date){
    const vehicleType = new VehicleType(
        dto[ASSIGNED_ORDER_ID_VEHICLE_TYPE],
        dto.name_vehicle_type,
        dto[ASSIGNED_ORDER_VEHICLE_MANUFACTURING_HOURS],
        dto.is_active_vehicle_type === 1,
    );

    return new AssignedOrder(
        dto[ASSIGNED_ORDER_ID],
        dto[ASSIGNED_ORDER_ID_VEHICLE_ORDER],
        date,
        vehicleType,
        dto[ASSIGNED_ORDER_QUANTITY]
    )
}


async function getWorkDayAssignedOrders(id, date, pool){
    await pool.connect();
    try {
        const request = pool.request();
        const query = `
            SELECT 
                ao."${ASSIGNED_ORDER_ID}" ,
                ao."${ASSIGNED_ORDER_ID_VEHICLE_TYPE}",
                ao."${ASSIGNED_ORDER_ID_VEHICLE_ORDER}",
                ao."${ASSIGNED_ORDER_VEHICLE_MANUFACTURING_HOURS}",
                ao."${ASSIGNED_ORDER_QUANTITY}",
                vt."${VEHICLE_TYPE_NAME}" AS name_vehicle_type,
                vt."${VEHICLE_TYPE_IS_ACTIVE}" AS is_active_vehicle_type
            FROM 
                "${ASSIGNED_ORDER}" AS ao
                INNER JOIN "${VEHICLE_TYPE}" AS vt 
                    ON  ao."${ASSIGNED_ORDER_ID_VEHICLE_TYPE}" = vt."${VEHICLE_TYPE_ID}"
            WHERE
                ao."${ASSIGNED_ORDER_ID_WORK_DAY}" = '${id}'
        `;
        
        const result = await request.query(query);
        return result.recordset.map(dto => assignedOrderFromDTO(dto, date))
    }
    catch(e){
        throw new InaccessibleRepository(`VehicleTypeRepositorySqlServer: error desconocido -> ${e}`)
    }
}

async function saveWorkDayAssignedOrders(id, assignedOrders, pool){
    await pool.connect();
    try {
        const request = pool.request();
        const sqlValues = assignedOrders.map(ao => (
            `(
                '${ao.id}', 
                '${ao.vehicleType.id}', 
                '${ao.idVehicleOrder}', 
                '${id}', 
                '${ao.vehicleType.manufacturingHours}',
                '${ao.quantity}'
            )`
        )).join(',')
        const sqlQuery = `
            INSERT INTO "${ASSIGNED_ORDER}"
            VALUES ${sqlValues}
        `;
        await request.query(sqlQuery);
    }
    catch(e){
        throw new InaccessibleRepository(`VehicleTypeRepositorySqlServer: error desconocido -> ${e}`)
    }
}

async function updateAssignedOrderQuantity(assignedOrder, pool){
    await pool.connect();
    try {
        const request = pool.request();
        const sqlQuery = `
            UPDATE "${ASSIGNED_ORDER}"
                SET "${ASSIGNED_ORDER_QUANTITY}" = '${assignedOrder.quantity}'
        `;
        await request.query(sqlQuery);
    }
    catch(e){
        throw new InaccessibleRepository(`VehicleTypeRepositorySqlServer: error desconocido -> ${e}`)
    }
}


module.exports = {
    getWorkDayAssignedOrders,
    saveWorkDayAssignedOrders,
    updateAssignedOrderQuantity,
    ASSIGNED_ORDER,
    ASSIGNED_ORDER_ID,
    ASSIGNED_ORDER_ID_VEHICLE_TYPE,
    ASSIGNED_ORDER_ID_VEHICLE_ORDER,
    ASSIGNED_ORDER_ID_WORK_DAY,
    ASSIGNED_ORDER_VEHICLE_MANUFACTURING_HOURS,
    ASSIGNED_ORDER_QUANTITY,

}

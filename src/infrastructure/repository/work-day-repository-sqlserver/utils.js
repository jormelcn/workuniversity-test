const {
    AssignedOrder,
    VehicleType,
} = require("../../../domain/entity");

const {
    InaccessibleRepository, InvalidArgumentError,
} = require("../../../domain/error");

const {
    VEHICLE_TYPE,
    VEHICLE_TYPE_ID,
    VEHICLE_TYPE_NAME,
    VEHICLE_TYPE_IS_ACTIVE,
} = require("../vehicle-type-repository-sqlserver")

const WORK_DAY = "work_day";
const WORK_DAY_ID = "id";
const WORK_DAY_DATE = "date";
const WORK_DAY_WORK_HOURS = "work_hours";

const ASSIGNED_ORDER = "assigned_order";
const ASSIGNED_ORDER_ID = "id";
const ASSIGNED_ORDER_ID_VEHICLE_TYPE = "id_vehicle_type";
const ASSIGNED_ORDER_ID_VEHICLE_ORDER = "id_vehicle_order";
const ASSIGNED_ORDER_ID_WORK_DAY = "id_work_day";
const ASSIGNED_ORDER_VEHICLE_MANUFACTURING_HOURS = "vehicle_manufacturing_hours";
const ASSIGNED_ORDER_QUANTITY = "quantity";


function assignedOrderFromDTO(dto){
    const vehicleType = new VehicleType(
        dto[ASSIGNED_ORDER_ID_VEHICLE_TYPE],
        dto.name_vehicle_type,
        dto[ASSIGNED_ORDER_VEHICLE_MANUFACTURING_HOURS],
        dto.is_active_vehicle_type,
    );

    return new AssignedOrder(
        dto.id_assigned_order,
        dto[ASSIGNED_ORDER_ID_VEHICLE_ORDER],
        dto[WORK_DAY_DATE],
        vehicleType,
        dto[ASSIGNED_ORDER_QUANTITY]
    )
}


function workDayFromGroupDTO(groupDTO, workDayFactory){
    let assignedOrders = [];
    
    try { assignedOrders = groupDTO.map(dto => assignedOrderFromDTO(dto)); }
    catch (e){ }
    
    return workDayFactory.fromProperties(
        groupDTO[0].id_work_day, 
        groupDTO[0][WORK_DAY_DATE], 
        groupDTO[0][WORK_DAY_WORK_HOURS], 
        assignedOrders
    )
}


function groupByKey(items, key){
    if(items.length === 0)
        return [];
    const groups = []
    let currentKey = items[0][key];
    let currentGroup = [];
    for(let i = 0; i < items.length; i++){
        if(items[i][key] !== currentKey){
            groups.push(currentGroup)
            currentGroup = []
        }
        currentGroup.push(items[i])
    }
    groups.push(currentGroup);
    return groups;
}

const workDayBaseQuery = `
SELECT 
    wd."${WORK_DAY_ID}" AS id_work_day,
    wd."${WORK_DAY_DATE}",
    wd."${WORK_DAY_WORK_HOURS}",
    ao."${ASSIGNED_ORDER_ID}" AS id_assigned_order,
    ao."${ASSIGNED_ORDER_ID_VEHICLE_TYPE}",
    ao."${ASSIGNED_ORDER_ID_VEHICLE_ORDER}",
    ao."${ASSIGNED_ORDER_VEHICLE_MANUFACTURING_HOURS}",
    ao."${ASSIGNED_ORDER_QUANTITY}",
    vt."${VEHICLE_TYPE_NAME}" AS name_vehicle_type,
    vt."${VEHICLE_TYPE_IS_ACTIVE}" AS is_active_vehicle_type
FROM 
    "${WORK_DAY}" AS wd
LEFT JOIN "${ASSIGNED_ORDER}" AS ao
    ON wd."${WORK_DAY_ID}" = ao."${ASSIGNED_ORDER_ID_WORK_DAY}"
LEFT JOIN "${VEHICLE_TYPE}" AS vt 
    ON  ao."${ASSIGNED_ORDER_ID_VEHICLE_TYPE}" = vt."${VEHICLE_TYPE_ID}"
`;


async function getWorkDayAssignedOrders(id, date, pool){
    await pool.connect();
    let result;
    try {
        const request = pool.request();
        const query = `${workDayBaseQuery}
            WHERE
                wd."${WORK_DAY_ID}" = '${id}'
        `;
        result = await request.query(query);
    }
    catch(e){
        throw new InaccessibleRepository(`VehicleTypeRepositorySqlServer: error desconocido -> ${e}`)
    }
    let assignedOrders = [];
    try{
        assignedOrders = result.recordset.map(dto => assignedOrderFromDTO(dto, date));
    }catch(e){
        if (!(e instanceof InvalidArgumentError))
            throw e;
    }
    return assignedOrders;
}


async function saveWorkDayAssignedOrders(id, assignedOrders, pool){
    await pool.connect();
    try {
        const request = pool.request();
        const sqlValues = assignedOrders.map(ao => (
            `(
                '${ao.id}', 
                '${ao.vehicleType.id}', 
                '${ao.idOrder}', 
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


async function getWorksFromTo(startDateStr, endDateStr, pool, workDayFactory){
    await pool.connect();
    let result;
    try {
        const request = pool.request();
        const query = `${workDayBaseQuery}
        WHERE
            wd."${WORK_DAY_DATE}" >= '${startDateStr}' AND wd."${WORK_DAY_DATE}" <= '${endDateStr}'
        ORDER BY 
            wd."${WORK_DAY_DATE}" ASC
        `;
        
        result = await request.query(query);
    }
    catch(e){
        throw new InaccessibleRepository(`VehicleTypeRepositorySqlServer: error desconocido -> ${e}`)
    }

    const groups = groupByKey(result.recordset, "id_work_day");
    const workDays = groups.map(g => workDayFromGroupDTO(g, workDayFactory));
    return workDays;
}


module.exports = {
    getWorkDayAssignedOrders,
    saveWorkDayAssignedOrders,
    updateAssignedOrderQuantity,
    getWorksFromTo,
    ASSIGNED_ORDER,
    ASSIGNED_ORDER_ID,
    ASSIGNED_ORDER_ID_VEHICLE_TYPE,
    ASSIGNED_ORDER_ID_VEHICLE_ORDER,
    ASSIGNED_ORDER_ID_WORK_DAY,
    ASSIGNED_ORDER_VEHICLE_MANUFACTURING_HOURS,
    ASSIGNED_ORDER_QUANTITY,
    WORK_DAY,
    WORK_DAY_ID,
    WORK_DAY_DATE,
    WORK_DAY_WORK_HOURS,
}

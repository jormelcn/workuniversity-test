const {
    VehicleOrderRepository,
} = require("../../domain/repository");

const {
    InaccessibleRepository,
    NotFoundError,
    InvalidArgumentError,
} = require("../../domain/error");

const { 
    VehicleOrder,
} = require("../../domain/entity");

const {
    verifyIsInstance,
    verifyIsString,
} = require("../../domain/model-utils");


const VEHICLE_ORDER = "vehicle_order";
const VEHICLE_ORDER_ID = "id";
const VEHICLE_ORDER_DATETIME_OF_REQUEST = "datetime_of_request";

function VehicleOrderFromDTO(dto){
    return new VehicleOrder(
        dto[VEHICLE_ORDER_ID],
        dto[VEHICLE_ORDER_DATETIME_OF_REQUEST]
    )
}

class VehicleOrderRepositorySqlServer extends VehicleOrderRepository {

    constructor(pool){
        super();
        this.pool = pool;
    }

    async getById(id){
        if(!verifyIsString(id))
            throw new InvalidArgumentError("VehicleOrderRepositorySqlServer: id debe ser string");
        await this.pool.connect();
        try {
            const request = this.pool.request();
            const result = await request.query(`
                SELECT * FROM "${VEHICLE_ORDER}" WHERE "${VEHICLE_ORDER_ID}" = '${id}';
            `);
            if (result.recordset.length === 0)
                throw new NotFoundError(`VehicleOrderRepositorySqlServer: no se encontró el id ${id}`)
            const resultDTO = result.recordset[0];
            return VehicleOrderFromDTO(resultDTO);
        }
        catch(e){
            throw new InaccessibleRepository(`VehicleOrderRepositorySqlServer: error desconocido -> ${e}`)
        }
    }

    async getAll(){
        await this.pool.connect();
        try {
            const request = this.pool.request();
            const result = await request.query(`
                SELECT * FROM "${VEHICLE_ORDER}";
            `);
            return result.recordset.map(dto => VehicleOrderFromDTO(dto))
        }
        catch(e){
            throw new InaccessibleRepository(`VehicleOrderRepositorySqlServer: error desconocido -> ${e}`)
        }
    }

    async save(vehicleOrder){
        if(!verifyIsInstance(vehicleOrder, VehicleOrder))
            throw new InvalidArgumentError("VehicleOrderRepositorySqlServer: vehicleOrder debe ser instancia de VehicleOrder");
        const {id, orderDate} = vehicleOrder;
        await this.pool.connect();
        try {
            const request = this.pool.request();
            await request.query(`
                INSERT INTO "${VEHICLE_ORDER}" VALUES ('${id}', '${orderDate.toISOString()}');
            `);
        }
        catch(e){
            throw new InaccessibleRepository(`VehicleOrderRepositorySqlServer: error desconocido -> ${e}`);
        }
    }
}

module.exports = {
    VehicleOrderRepositorySqlServer,
    VEHICLE_ORDER,
    VEHICLE_ORDER_ID,
    VEHICLE_ORDER_DATETIME_OF_REQUEST,
}

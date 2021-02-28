const {
    OrderRepository,
} = require("../../domain/repository");

const {
    InaccessibleRepository,
    NotFoundError,
    InvalidArgumentError,
} = require("../../domain/error");

const { 
    Order,
} = require("../../domain/entity");

const {
    verifyIsInstance,
    verifyIsString,
} = require("../../domain/model-utils");


const VEHICLE_ORDER = "vehicle_order";
const VEHICLE_ORDER_ID = "id";
const VEHICLE_ORDER_DATETIME_OF_REQUEST = "datetime_of_request";

function OrderFromDTO(dto){
    return new Order(
        dto[VEHICLE_ORDER_ID],
        dto[VEHICLE_ORDER_DATETIME_OF_REQUEST]
    )
}

class OrderRepositorySqlServer extends OrderRepository {

    constructor(pool){
        super();
        this.pool = pool;
    }

    async getById(id){
        if(!verifyIsString(id))
            throw new InvalidArgumentError("OrderRepositorySqlServer: id debe ser string");
        await this.pool.connect();
        try {
            const request = this.pool.request();
            const result = await request.query(`
                SELECT * FROM "${VEHICLE_ORDER}" WHERE "${VEHICLE_ORDER_ID}" = '${id}';
            `);
            if (result.recordset.length === 0)
                throw new NotFoundError(`OrderRepositorySqlServer: no se encontró el id ${id}`)
            const resultDTO = result.recordset[0];
            return OrderFromDTO(resultDTO);
        }
        catch(e){
            throw new InaccessibleRepository(`OrderRepositorySqlServer: error desconocido -> ${e}`)
        }
    }

    async getAll(){
        await this.pool.connect();
        try {
            const request = this.pool.request();
            const result = await request.query(`
                SELECT * FROM "${VEHICLE_ORDER}";
            `);
            return result.recordset.map(dto => OrderFromDTO(dto))
        }
        catch(e){
            throw new InaccessibleRepository(`OrderRepositorySqlServer: error desconocido -> ${e}`)
        }
    }

    async save(order){
        if(!verifyIsInstance(order, Order))
            throw new InvalidArgumentError("OrderRepositorySqlServer: order debe ser instancia de Order");
        const {id, orderDate} = order;
        await this.pool.connect();
        try {
            const request = this.pool.request();
            await request.query(`
                INSERT INTO "${VEHICLE_ORDER}" VALUES ('${id}', '${orderDate.toISOString()}');
            `);
        }
        catch(e){
            throw new InaccessibleRepository(`OrderRepositorySqlServer: error desconocido -> ${e}`);
        }
    }
}

module.exports = {
    OrderRepositorySqlServer,
    VEHICLE_ORDER,
    VEHICLE_ORDER_ID,
    VEHICLE_ORDER_DATETIME_OF_REQUEST,
}

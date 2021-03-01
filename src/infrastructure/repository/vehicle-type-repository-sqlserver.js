const {
    VehicleTypeRepository,
} = require("../../domain/repository");

const {
    InaccessibleRepository,
    NotFoundError,
    InvalidArgumentError,
} = require("../../domain/error");

const { 
    VehicleType,
} = require("../../domain/entity");

const {
    verifyIsInstance,
    verifyIsString,
} = require("../../domain/model-utils");


const VEHICLE_TYPE = "vehicle_type";
const VEHICLE_TYPE_ID = "id";
const VEHICLE_TYPE_NAME = "name";
const VEHICLE_TYPE_MANUFACTORING_HOURS = "manufacturing_hours";
const VEHICLE_TYPE_IS_ACTIVE = "is_active";

function vehicleTypeFromDTO(dto){
    return new VehicleType(
        dto[VEHICLE_TYPE_ID],
        dto[VEHICLE_TYPE_NAME],
        dto[VEHICLE_TYPE_MANUFACTORING_HOURS],
        dto[VEHICLE_TYPE_IS_ACTIVE],
    );
}

class VehicleTypeRepositorySqlServer extends VehicleTypeRepository {

    constructor(pool){
        super();
        this.pool = pool;
    }

    async getById(id){
        if(!verifyIsString(id))
            throw new InvalidArgumentError("VehicleTypeRepositorySqlServer: id debe ser string");
        await this.pool.connect();
        try {
            const request = this.pool.request();
            const result = await request.query(`
                SELECT * FROM "${VEHICLE_TYPE}" WHERE "${VEHICLE_TYPE_ID}" = '${id}';
            `);
            if (result.recordset.length === 0)
                throw new NotFoundError(`VehicleTypeRepositorySqlServer: no se encontró el id ${id}`)
            const resultDTO = result.recordset[0];
            return vehicleTypeFromDTO(resultDTO);
        }
        catch(e){
            throw new InaccessibleRepository(`VehicleTypeRepositorySqlServer: error desconocido -> ${e}`)
        }
    }

    async getAll(){
        await this.pool.connect();
        try {
            const request = this.pool.request();
            const result = await request.query(`
                SELECT * FROM "${VEHICLE_TYPE}";
            `);
            return result.recordset.map(dto => vehicleTypeFromDTO(dto))
        }
        catch(e){
            throw new InaccessibleRepository(`VehicleTypeRepositorySqlServer: error desconocido -> ${e}`)
        }
    }

    async save(vehicleType){
        if(!verifyIsInstance(vehicleType, VehicleType))
            throw new InvalidArgumentError("VehicleTypeRepositorySqlServer: vehicleType debe ser instancia de VehicleType");
        const {id, name, manufacturingHours, isActive} = vehicleType;
        await this.pool.connect();
        try {
            const request = this.pool.request();
            const query = `
                INSERT INTO "${VEHICLE_TYPE}" VALUES ('${id}', '${name}', '${manufacturingHours}', '${isActive ? 1 : 0}');
            `;
            await request.query(query);
        }
        catch(e){
            throw new InaccessibleRepository(`VehicleTypeRepositorySqlServer: error desconocido -> ${e}`);
        }
    }

    async update(vehicleType){
        if(!verifyIsInstance(vehicleType, VehicleType))
            throw new InvalidArgumentError("VehicleTypeRepositorySqlServer: vehicleType debe ser instancia de VehicleType");
        const {id, name, manufacturingHours, isActive} = vehicleType;
        await this.pool.connect();
        let result;
        try {
            const request = this.pool.request();
            const query = `
                UPDATE "${VEHICLE_TYPE}" 
                    SET
                        "${VEHICLE_TYPE_NAME}" = '${name}',
                        "${VEHICLE_TYPE_MANUFACTORING_HOURS}" = '${manufacturingHours}',
                        "${VEHICLE_TYPE_IS_ACTIVE}" = '${isActive ? 1 : 0}'
                    WHERE
                        "${VEHICLE_TYPE_ID}" = '${id}'
            `;
            result = await request.query(query);
        }
        catch(e){
            throw new InaccessibleRepository(`VehicleTypeRepositorySqlServer: error desconocido -> ${e}`);
        }
        if (result.rowsAffected[0] === 0)
            throw new NotFoundError(`VehicleTypeRepositorySqlServer: no se encontró el id ${vehicleType.id}`);
    }

    removeById(id){
        throw new NotImplementedError("VehicleTypeRepository: se debe implementar removeById");
    }
}

module.exports = {
    VehicleTypeRepositorySqlServer,
    VEHICLE_TYPE,
    VEHICLE_TYPE_ID,
    VEHICLE_TYPE_NAME,
    VEHICLE_TYPE_MANUFACTORING_HOURS,
    VEHICLE_TYPE_IS_ACTIVE,
}

const { registerResolvers } = require("../injection");
const { 
    OrderRepositorySqlServer,
    VehicleTypeRepositorySqlServer,
    WorkDayRepositorySqlServer
} = require("../../infrastructure/repository");

const { pool } = require("../../../database-repository");

registerResolvers({

    OrderRepository(){
        return new OrderRepositorySqlServer(pool);
    },

    VehicleTypeRepository(){
        return new VehicleTypeRepositorySqlServer(pool);
    },

    WorkDayRepository(){
        return new WorkDayRepositorySqlServer(
            pool, 
            this.resolveDependency('WorkDayFactory')
        );
    },

});

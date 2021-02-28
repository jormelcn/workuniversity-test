const { registerResolvers } = require("../injection");

const { 
    IdGenerationServiceUUID  
} = require("../../infrastructure/service");

const {
    OrderService: _OrderService
} = require("../../domain/service")


registerResolvers({

    IdGenerationService(){
        return new IdGenerationServiceUUID();
    },

    OrderService(){
        return new _OrderService(
            this.resolveDependency('WorkDayRepository'),
            this.resolveDependency('WorkDayFactory'),
            this.resolveDependency('IdGenerationService'),
            this.resolveDependency('OrderRepository'),
        )
    }

});

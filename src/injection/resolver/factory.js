const { registerResolvers } = require("../injection");
const { 
    AssignedOrderFactory: _AssignedOrderFactory,
    WorkDayFactory: _WorkDayFactory,
} = require("../../domain/factory");



registerResolvers({

    AssignedOrderFactory(){
        return new _AssignedOrderFactory(
            this.resolveDependency('IdGenerationService')
        )
    },

    WorkDayFactory(){
        return new _WorkDayFactory(
            this.resolveDependency('IdGenerationService'),
            this.resolveDependency('AssignedOrderFactory'),
        )
    }


});

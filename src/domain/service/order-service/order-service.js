const {
    verifyArrayInstanceOf,
    verifyArray,
    verifyIsInteger,
    verifyIsInstance,

    sumarArray
} = require("../../model-utils");

const {
    InvalidArgumentError,
    InvalidOrderQuantity,
} = require("../../error");

const {
    VehicleType, Order
} = require("../../entity");

const {
    RemainingOrderManagement
} = require("./remaining-order-management");

const {
    WorkDaySequenceManagement
} = require("./work-day-sequence-management");

const {
    WorkDayFactory
} = require("../../factory/work-day-factory");

const {
    IdGenerationService
} = require("../../service/id-generation-service");

const {
    WorkDayRepository,
    OrderRepository,
} = require("../../repository");

const {
    searchClosestSum
} = require("./utils");


const maxOrderQuantity = 10;
const minOrderQuantity = 1;


class OrderService {

    constructor(
        workDayRepository,
        workDayFactory,
        idGenerationService,
        orderRepository,
    ){
        if(!verifyIsInstance(workDayRepository, WorkDayRepository))
            throw new InvalidArgumentError("OrderService: workDayRepository debe ser instancia de WorkDayRepository");
        if(!verifyIsInstance(workDayFactory, WorkDayFactory))
            throw new InvalidArgumentError("OrderService: workDayFactory debe ser instancia de WorkDayFactory");
        if(!verifyIsInstance(idGenerationService, IdGenerationService))
            throw new InvalidArgumentError("OrderService: idGenerationService debe ser instancia de IdGenerationService");
        if(!verifyIsInstance(orderRepository, OrderRepository))
            throw new InvalidArgumentError("OrderService: orderRepository debe ser instancia de OrderRepository");

        this.workDayRepository = workDayRepository;
        this.workDayFactory = workDayFactory;
        this.idGenerationService = idGenerationService;
        this.orderRepository = orderRepository;
    }

    async assignNewOrder(vehicleTypes, quantities){
        if(!verifyArrayInstanceOf(vehicleTypes, VehicleType))
            throw new InvalidArgumentError("OrderService: vehicleTypes debe ser un array de VehicleType");
        if(!verifyArray(quantities, verifyIsInteger))
            throw new InvalidArgumentError("OrderService: quantities debe ser un array de numeros enteros");
        
        const totalQuantity = sumarArray(quantities);
        if(totalQuantity > maxOrderQuantity || totalQuantity < minOrderQuantity)
            throw new InvalidOrderQuantity(`OrderService: la cantidad total de vehículos está fuera de lo permitido`);

        const orderManagement = new RemainingOrderManagement(vehicleTypes, quantities);
        
        const daySequenceManagement = new WorkDaySequenceManagement(
            this.workDayFactory, this.workDayRepository);
        
        const order = new Order(
            this.idGenerationService.nextId(), new Date())

        this.orderRepository.save(order);

        while (!orderManagement.orderIsComplete()){
            const { workDay, itIsRegistered} = await daySequenceManagement.nextDay();
            const assignableHoursCombination = searchClosestSum(
                workDay.getAvailableHours(), 
                orderManagement.serialiceHours()
            )
            for(let i = 0; i < assignableHoursCombination.length; i++){
                let vehicleType = orderManagement.orderVehicle(assignableHoursCombination[i]);
                workDay.asignateNewOrder(order.id, vehicleType, 1);
            }
            if(itIsRegistered && assignableHoursCombination.length > 0)
                await this.workDayRepository.update(workDay);
            if(! itIsRegistered)
                 await this.workDayRepository.save(workDay);
        }
    }
}

module.exports = {
    OrderService
}


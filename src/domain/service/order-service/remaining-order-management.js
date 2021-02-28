
class RemainingOrderManagement{
    
    constructor(vehicleTypes, quantities){
        this.vehicleTypes = vehicleTypes;
        this.quantities = quantities.map(q => q);
    }
    
    serialiceHours(){
        const hours = [];
        for(let i = 0; i < this.quantities.length; i++){
            for(let j = 0; j < this.quantities[i]; j++){
                hours.push(this.vehicleTypes[i].manufacturingHours);
            }
        }
        return hours;
    }

    orderVehicle(hours){
        for(let i = 0; i < this.quantities.length; i++){
            if (this.vehicleTypes[i].manufacturingHours === hours && this.quantities[i] > 0){
                this.quantities[i] -= 1;
                return this.vehicleTypes[i];
            }
        }
        throw new Error("RemainingOrderManagement: Se solicitó un vehículo no disponible")
    }

}

module.exports = {
    RemainingOrderManagement
}

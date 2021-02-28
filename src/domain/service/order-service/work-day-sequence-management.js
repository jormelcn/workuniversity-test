const {
    NotFoundError
} = require("../../error");


function nextDate(date){
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d;
}


class WorkDaySequenceManagement {

    constructor(
        workDayFactory,
        workDayRepository,
    ){
        this.workDayFactory =  workDayFactory;
        this.workDayRepository = workDayRepository;

        this.currentDate = null;
        this.itIsRegistered = null;
    }

    _nextUnregisteredDay() {
        this.currentDate = nextDate(this.currentDate);
        this.itIsRegistered = false;
        const workDay = this.workDayFactory.fromDate(this.currentDate);
        return {
            workDay,
            itIsRegistered: false,
        }
    }

    _thisResisteredDay(workDay) {
        this.currentDate = workDay.date;
        this.itIsRegistered = true;
        return {
            workDay,
            itIsRegistered: true,
        }
    }

    async nextDay(){
        
        if(this.itIsRegistered === false)
            return this._nextUnregisteredDay();
        
        if(this.currentDate === null){
            try{
                const workDay = await this.workDayRepository
                    .getFirstWithAvailableHoursStartingAt(nextDate(new Date()));  
                return this._thisResisteredDay(workDay);
            }
            catch(e){
                if (!(e instanceof NotFoundError))
                    throw e;
                this.currentDate = new Date();
                try{
                    this.currentDate = await this.workDayRepository
                        .getLastAssigedDate();
                }
                catch(e){
                    if (!(e instanceof NotFoundError))
                        throw e;
                }
                return this._nextUnregisteredDay();
            }
        }

        try{
            const workDay = await this.workDayRepository
                .getByDate(nextDate(this.currentDate));
            return this._thisResisteredDay(workDay);
        } 
        catch(e){
            if (!(e instanceof NotFoundError))
                throw e;
            return this._nextUnregisteredDay();
        }
        
    }

}

module.exports = {
    WorkDaySequenceManagement
}

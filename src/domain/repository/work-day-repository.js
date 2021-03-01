const {
    NotImplementedError
} = require("../error");


class WorkDayRepository {

    getLastAssigedDate(){
        throw new NotImplementedError("WorkDayRepository: se debe implementar getLastAssigedDate");
    }

    getFirstWithAvailableHoursStartingAt(date){
        throw new NotImplementedError("WorkDayRepository: se debe implementar getFirstWithAvailableHoursStartingAt");
    }

    getByDate(date){
        throw new NotImplementedError("WorkDayRepository: se debe implementar getByDate");
    }

    save(workDay){
        throw new NotImplementedError("WorkDayRepository: se debe implementar save");
    }

    update(workDay){
        throw new NotImplementedError("WorkDayRepository: se debe implementar update");
    }

    getFromTo(startDate, endDate){
        throw new NotImplementedError("WorkDayRepository: se debe implementar getFromTo");
    }

}

module.exports = {
    WorkDayRepository
}

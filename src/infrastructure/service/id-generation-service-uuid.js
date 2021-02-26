const { v4: uuidv4 } = require('uuid');
const { IdGenerationService } = require("../../domain/service/id-generation-service");


class IdGenerationServiceUUID extends IdGenerationService {
    constructor()

    nextId(){
        return uuidv4().replace(/-/g, '');
    }

}

module.exports = {
    IdGenerationServiceUUID
}

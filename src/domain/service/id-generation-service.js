const {
    NotImplementedError
} = require("../error");

class IdGenerationService {

    nextId(){
        throw new NotImplementedError("IdGenerationService: se debe implementar nextId")
    }

}

module.exports = {
    IdGenerationService
}

function verifyIsBoolean(value){
    if(typeof(value) === "boolean")
        return true;
    return false;
}

function verifyIsString(value){
    if(typeof(value) === "string")
        return true;
    return false;
}

function verifyIsNumber(value){
    if(typeof(value) === "number")
        return true;
    return false;
}

function verifyIsInteger(value){
    if(! verifyIsNumber(value))
        return false;
    if(value % 1 !== 0)
        return false;
    return true;
}

function verifyIsInstance(value, typeClass){
    if(value instanceof typeClass)    
        return true;
    return false;
}

function verifyArrayInstanceOf(array, typeClass){
    if(!verifyIsInstance(array, Array))
        return false;
    for(let i = 0; i < array.length; i++){
        if(!verifyIsInstance(array[i], typeClass))
            return false;
    }
    return true;
}

function verifyArray(array, verificator){
    if(!verifyIsInstance(array, Array))
        return false;
    for(let i = 0; i < array.length; i++){
        if(!verificator(array[i]))
            return false;
    }
    return true;
}

module.exports = {
    verifyIsBoolean,
    verifyIsString,
    verifyIsNumber,
    verifyIsInteger,
    verifyIsInstance,
    verifyArrayInstanceOf,
    verifyArray,
}


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

module.exports = {
    verifyIsBoolean,
    verifyIsString,
    verifyIsNumber,
    verifyIsInteger,
}


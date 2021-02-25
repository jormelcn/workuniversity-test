
function sumarArray(array){
    let suma = 0;
    for(let i = 0; i < array.length; i++)
        suma += array[i];
    return suma;
}

module.exports = {
    sumarArray
}

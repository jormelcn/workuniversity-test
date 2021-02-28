const {
    sumarArray
} = require("../../model-utils");


function generateCombinations(alphabet, n, results = [], resultInput = []) {
    let resultado;
    if (!resultInput)
        resultado = [];
    else
        resultado = resultInput;
    for (let i = 0; i < alphabet.length; ++i) {
        let newResult = resultado.slice();
        let newAlphabet = alphabet.slice();
        newResult.push(alphabet[i]);
        newAlphabet.splice(i, 1);
        if (n > 1) {
            generateCombinations(newAlphabet, n - 1, results, newResult);
        } else {
            results.push(newResult);
        }
    }
    return results
}


function searchClosestSum(total, elementos) {
    if (total == 0)
        return []
    let closestSum = 0;
    let closestSumElements = []
    for (let i = 1; i <= elementos.length; i++) {
        let lowestSum = null;
        const combinations = generateCombinations(elementos, i)
        for (let j = 0; j < combinations.length; j++) {
            let combination = combinations[j];
            const sum = sumarArray(combination);
            if (sum === total)
                return combination;
            if (sum > closestSum && sum < total) {
                closestSum = sum;
                closestSumElements = combination;
            }
            if (lowestSum === null)
                lowestSum = sum
            if (sum < lowestSum)
                lowestSum = sum
        }
        if (lowestSum > total)
            return closestSumElements;
    }
    return closestSumElements
}

module.exports = {
    searchClosestSum,
    generateCombinations,
}

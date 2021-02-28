const { 
    generateCombinations,
    searchClosestSum,
} = require("../../src/domain/service/order-service/utils");

const { assert } = require("chai");

describe("Order Service Utils", () => {


    it("Generate Combinations", async function() {
        const result1 = generateCombinations([1, 2, 3], 2);
        assert.deepEqual(result1, [[1,2], [1,3], [2,1], [2,3], [3,1], [3,2]]);

        const result2 = generateCombinations([1, 2, 3, 4], 1);
        assert.deepEqual(result2, [[1], [2], [3], [4]]);

        const result3 = generateCombinations([1, 2], 3);
        assert.deepEqual(result3, []);
    });

    it("searchClosestSum", async function() {
        const result1 = searchClosestSum(23, [8, 7, 5]);
        assert.deepEqual(result1, [8, 7, 5]);
        
        const result2 = searchClosestSum(23, [8, 8, 7, 7,  6]);
        assert.deepEqual(result2, [8, 8, 7]);

        const result3 = searchClosestSum(0, [8, 8, 7, 7,  6]);
        assert.deepEqual(result3, []);
        
    });

});

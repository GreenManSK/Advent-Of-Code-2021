var fs = require('fs');
fs.readFile('input7.txt', 'utf8', function(err, data) {
    if (err) throw err;
    const crabs = data.trim().split(",").map(x => parseInt(x));
    console.log("1:", findOptimalFuelUsage(crabs, findFuelUsage1));
    console.log("2:", findOptimalFuelUsage(crabs, findFuelUsage2));
});

function findOptimalFuelUsage(crabs, fuelUsageFn) {
    const minPos = Math.min(...crabs);
    const maxPos = Math.max(...crabs);
    let optimal = Number.MAX_VALUE;
    for (let i = minPos; i <= maxPos; i++) {
        optimal = Math.min(optimal, fuelUsageFn(crabs, i));
    }
    return optimal;
}

function findFuelUsage1(crabs, position) {
    return crabs.map(crab => Math.abs(position - crab)).reduce((a,b) => a + b);
}

function findFuelUsage2(crabs, position) {
    return crabs.map(crab => {
        const n = Math.abs(position - crab);
        return n * (n + 1) / 2;
    }).reduce((a,b) => a + b);
}
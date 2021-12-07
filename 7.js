var fs = require('fs');
fs.readFile('input7.txt', 'utf8', function(err, data) {
    if (err) throw err;
    const crabs = data.trim().split(",").map(x => parseInt(x));
    console.log("1:", findOptimalFuelUsage(crabs));
});

function findOptimalFuelUsage(crabs) {
    const minPos = Math.min(...crabs);
    const maxPos = Math.max(...crabs);
    let optimal = Number.MAX_VALUE;
    for (let i = minPos; i <= maxPos; i++) {
        optimal = Math.min(optimal, findFuelUsage(crabs, i));
    }
    return optimal;
}

function findFuelUsage(crabs, position) {
    return crabs.map(crab => Math.abs(position - crab)).reduce((a,b) => a + b);
}
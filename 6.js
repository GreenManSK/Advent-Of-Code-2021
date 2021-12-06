var fs = require('fs');
fs.readFile('input6.txt', 'utf8', function(err, data) {
    if (err) throw err;
    const fishes = data.trim().split(",").map(x => parseInt(x));
    const days = 80;
    console.log("1:", modelForNDays(fishes, days));
    console.log("2:", modelForNDaysOptimal(fishes, 256));
});

const modelForNDays = (fishes, days) => {
    for (let i = 0; i < days; i++) {
        const newFishes = [];
        for (const fish of fishes) {
            const newValue = fish - 1;
            if (newValue < 0) {
                newFishes.push(6);
                newFishes.push(8);
            } else {
                newFishes.push(newValue);
            }
        }
        fishes = newFishes;
    }
    return fishes.length;
}


const modelForNDaysOptimal = (fishes, days) => {
    return fishes.map(x => computeFish(x, days)).reduce((a,b) => a + b);
};

const memory = new Map();
const getFromMem = (fish, days) => {
    const fishData = memory.get(fish);
    return fishData && fishData.get(days);
}
const saveToMem = (fish, days, value) => {
    if (!memory.get(fish)) {
        memory.set(fish, new Map());
    }
    memory.get(fish).set(days, value);
};

const computeFish = (fish, days) => {
    if (getFromMem(fish, days) !== undefined)
        return getFromMem(fish, days);
    if (fish >= days) {
        return 1;
    }
    const remaining = days - fish - 1;
    const result = computeFish(6, remaining) + computeFish(8, remaining);
    saveToMem(fish, days, result);
    return result;
}
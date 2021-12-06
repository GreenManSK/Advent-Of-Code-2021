var fs = require('fs');
fs.readFile('input6.txt', 'utf8', function(err, data) {
    if (err) throw err;
    const fishes = data.trim().split(",").map(x => parseInt(x));
    const days = 80;
    console.log("1:", modelForNDays(fishes, days));
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

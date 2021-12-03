var fs = require('fs');
fs.readFile('input1.txt', 'utf8', function(err, data) {
    if (err) throw err;
    let meassures = data.trim().split("\n").map(x => parseInt(x));
    console.log("1:", findIncreases(meassures));
    console.log("2:", findIncreases(make3Window(meassures)));
});

function findIncreases(data) {
    let increases = 0;
    for (let i = 1; i < data.length; i++) {
        if (data[i] > data[i - 1])
            increases++;
    }
    return increases;
}

function make3Window(data) {
    let windows = [];
    for (let i = 2; i < data.length; i++) {
        windows.push(data[i] + data[i - 1] + data[i - 2]);
    }
    return windows;
}
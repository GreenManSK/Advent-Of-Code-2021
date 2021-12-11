var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input9.txt', 'utf8', function (err, data) {
    if (err) throw err;
    heatmap = data.trim().replace(/\r/g, "").split("\n").map(x => x.split('').map(n => parseInt(n)));
    console.log("1:", solve1(heatmap));
    console.log("2:", solve2(heatmap));
});

function findLowPoints(heatmap) {
    const lowPoints = [];
    for (let y = 0; y < heatmap.length; y++) {
        for (let x = 0; x < heatmap[y].length; x++) {
            const value = heatmap[y][x];
            let isLow = true;
            forAllNeighs(heatmap, x, y, (cx, cy) => {
                if (value >= heatmap[cy][cx]) {
                    isLow = false;
                }
            })
            if (isLow)
                lowPoints.push([y, x]);
        }
    }
    return lowPoints;
}

function forAllNeighs(heatmap, x, y, callback) {
    [-1, 1].forEach(d => {
        if (x + d >= 0 && x + d < heatmap[y].length)
            callback(x + d, y);
        if (y + d >= 0 && y + d < heatmap.length)
            callback(x, y + d);
    })
}

function solve1(heatmap) {
    return findLowPoints(heatmap).map((coords) => heatmap[coords[0]][coords[1]] + 1).reduce((a, b) => a + b)
}

function solve2(heatmap) {
    const lowPoints = findLowPoints(heatmap);
    const basinMap = new Array(heatmap.length).fill(0).map(x => new Array(heatmap[0].length).fill(undefined));
    const basins = [];
    lowPoints.forEach(([y, x]) => {
        const basin = [];
        basins.push(basin);
        basin.push([x, y]);
        basinMap[y][x] = basin;
    });
    let changed;
    do {
        changed = false;
        for (let y = 0; y < heatmap.length; y++) {
            for (let x = 0; x < heatmap[y].length; x++) {
                if (heatmap[y][x] === 9 || basinMap[y][x] !== undefined) {
                    continue;
                }
                let added = false;
                forAllNeighs(heatmap, x, y, (cx, cy) => {
                    if (!added && basinMap[cy][cx] !== undefined) {
                        basinMap[y][x] = basinMap[cy][cx];
                        basinMap[cy][cx].push([x, y]);
                        changed = true;
                        added = true;
                    }
                })
            }
        }
    } while (changed);
    return basins.map(x => x.length).sort((a, b) => b - a).slice(0, 3).reduce((a,b) => a * b);
}
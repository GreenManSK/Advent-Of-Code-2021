var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input11.txt', 'utf8', function (err, data) {
    if (err) throw err;
    grid = data.trim().replace(/\r/g, "").split("\n").map(x => x.split('').map(n => parseInt(n)));
    console.log("1:", countFlashes(grid, 100));
    console.log("2:", solve2(grid));
});

function countFlashes(grid, steps) {
    let flashes = 0;
    for (let i = 0; i < steps; i++) {
        grid = increaseStep(grid);
        let newFlashes = 0;
        do {
            [grid, newFlashes] = flashStep(grid);
            flashes += newFlashes;
        } while (newFlashes !== 0);
        grid = setToZeros(grid);
    }
    return flashes;
}

function solve2(grid) {
    let step = 0;
    const octopusses = grid.length * grid[0].length;
    while (true) {
        grid = increaseStep(grid);
        let stepFlashes = 0;
        let newFlashes = 0;
        do {
            [grid, newFlashes] = flashStep(grid);
            stepFlashes += newFlashes;
        } while (newFlashes !== 0);
        grid = setToZeros(grid);
        step++;
        if (stepFlashes === octopusses)
            return step;
    }
    return -1;
}

function increaseStep(grid) {
    return grid.map(line => line.map(x => x + 1));
}

function setToZeros(grid) {
    return grid.map(line => line.map(x => x === 'f' ? 0 : x));
}

function flashStep(grid) {
    let flashes = 0;
    let flashed;
    do {
        flashed = false;
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                const value = grid[y][x];
                if (value > 9) {
                    forAllNeighs(grid, x, y, (cx, cy) => {
                        if (grid[cy][cx] !== 'f') {
                            grid[cy][cx] += 1;
                        }
                    });
                    grid[y][x] = 'f';
                    flashes++;
                    flashed = true;
                }
            }
        }
    } while (flashed);
    return [grid, flashes];
}

function forAllNeighs(heatmap, x, y, callback) {
    const diffs = [-1, 0, 1];
    diffs.forEach(dx => diffs.forEach(dy => {
        if (dx === 0 && dy === 0)
            return;
        if (x + dx < 0 || x + dx >= grid[y].length)
            return;
        if (y + dy < 0 || y + dy >= grid.length)
            return;
        callback(x + dx, y + dy);
    }))
}
var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input25.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const grid = data.trim().replace(/\r/g, "").split("\n").map(x => x.split(''));

    console.log("1:", solve1(grid));
});

function solve1(grid) {
    let step = 0;
    let moved = true;
    while (moved) {
        step++;
        [grid, moved] = move(grid);
    }
    return step;
}

function move(grid) {
    const subSteps = [
        {
            what: '>',
            change: [1, 0]
        },
        {
            what: 'v',
            change: [0, 1]
        }
    ];
    let moved = false;
    let oldGrid = grid;
    let newGrid;
    for (const step of subSteps) {
        newGrid = new Array(grid.length).fill('.').map(_ => new Array(grid[0].length).fill('.'));
        const [dx, dy] = step.change;
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (oldGrid[y][x] !== step.what) {
                    if (oldGrid[y][x] !== '.')
                        newGrid[y][x] = oldGrid[y][x];
                    continue;
                }
                const [nX, nY] = getNewPosition(x, y, dx, dy, grid);
                if (oldGrid[nY][nX] === '.') {
                    newGrid[nY][nX] = step.what;
                    moved = true;
                } else {
                    newGrid[y][x] = step.what;
                }
            }
        }
        oldGrid = newGrid;
    }
    return [newGrid, moved];
}

function getNewPosition(x, y, dx, dy, grid) {
    let nX = x + dx, nY = y + dy;
    if (nY >= grid.length) {
        nY %= grid.length;
    }
    if (nX >= grid[y].length) {
        nX %= grid[y].length;
    }
    return [nX, nY];
}
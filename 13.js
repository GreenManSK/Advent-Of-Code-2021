var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input13.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const input = data.trim().replace(/\r/g, "").split("\n");
    const [points, folds] = prepareInupt(input);
    console.log("1:", solve1(points, folds));
    solve2(points, folds);
});

function prepareInupt(input) {
    const points = [];
    const folds = [];
    let i = 0;
    while (input[i] !== '') {
        points.push(input[i].split(',').map(x => parseInt(x)));
        i++;
    }
    i++;
    for (; i < input.length; i++) {
        const isX = input[i].search('x=') !== -1;
        const val = parseInt(input[i].replace(/[a-z= ]/g, ''));
        folds.push([isX, val]);
    }

    return [points, folds];
}

function solve1(points, folds) {
    let grid = pepareGrid(points);
    return foldGrid(grid, folds[0][0], folds[0][1]).flat().filter(x => x === '#').length;
}

function solve2(points, folds) {
    let grid = pepareGrid(points);
    for (const fold of folds) {
        grid = foldGrid(grid, fold[0], fold[1]);
    }
    console.log(helpers.print2D(grid));
}

function pepareGrid(points) {
    const maxX = Math.max(...points.map(x => x[0]));
    const maxY = Math.max(...points.map(x => x[1]));
    const grid = new Array(maxY + 1).fill(0).map(() => new Array(maxX + 1).fill('.'));
    points.forEach(([x, y]) => grid[y][x] = '#');
    return grid;
}

function foldGrid(grid, isX, value) {
    return isX ? foldGridX(grid, value) : foldGridY(grid, value);
}

function foldGridX(grid, value) {
    for (let y = 0; y < grid.length; y++) {
        grid[y][value] = '|';
    }
    for (let i = 1; i <= value; i++) {
        const newX = value - i;
        const oldX = value + i;
        for (let y = 0; y < grid.length; y++) {
            if (grid[y][oldX] !== '.')
                grid[y][newX] = grid[y][oldX];
            grid[y][oldX] = ' ';
        }
    }
    return grid.map(line => line.slice(0, value));
}

function foldGridY(grid, value) {
    grid[value] = grid[value].map(() => '-');
    for (let i = 1; i <= value; i++) {
        const newY = value - i;
        const oldY = value + i;
        for (let x = 0; x < grid[oldY].length; x++) {
            if (grid[oldY][x] !== '.')
                grid[newY][x] = grid[oldY][x];
            grid[oldY][x] = ' ';
        }
    }
    return grid.slice(0, value);
}
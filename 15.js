var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input15.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const grid = data.trim().replace(/\r/g, "").split("\n").map(line => line.split('').map(x => parseInt(x)));
    console.log("1:", findShortestPath(grid));
    console.log("2:", findShortestPath(increaseGrid(grid)));
});

function findShortestPath(grid) {
    const width = grid[0].length;
    const height = grid.length;
    const dist = new Array(height).fill(1).map(() => new Array(width).fill(Number.MAX_VALUE));
    const prioirty = new PriorityQueue();
    dist.forEach((line, y) => line.forEach((val, x) => {
        prioirty.push(x, y, val);
    }));
    dist[0][0] = 0;
    prioirty.push(0, 0, 0);
    prioirty.init();

    while (!prioirty.isEmpty()) {
        const { x, y } = prioirty.pop();
        helpers.forAllNeighsSimple(width, height, x, y, (cx, cy) => {
            if (!prioirty.contains(cx, cy))
                return;

            const alt = dist[y][x] + grid[cy][cx];
            if (alt < dist[cy][cx]) {
                dist[cy][cx] = alt;
                prioirty.push(cx, cy, alt);
            }
        });
        if (x === width - 1 && y === height - 1)
            break;
    }

    return dist[height - 1][width - 1];
}

function increaseGrid(grid, times = 5) {
    const heigth = grid.length;
    const width = grid[0].length;
    const newGrid = new Array(heigth * times).fill(0).map(() => new Array(width * times).fill(0));
    for (let bx = 0; bx < times; bx++) {
        for (let by = 0; by < times; by++) {
            const bw = bx * width;
            const bh = by * heigth;
            for (let y = 0; y < heigth; y++) {
                for (let x = 0; x < width; x++) {
                    newGrid[bh + y][x + bw] = grid[y][x] + bx + by;
                    if (newGrid[bh + y][x + bw] >= 10) {
                        newGrid[bh + y][x + bw] = (newGrid[bh + y][x + bw] % 10) + 1;
                    }
                }
            }
        }
    }
    return newGrid;
}

class PriorityQueue {
    constructor() {
        this.data = [];
        this.points = new Map();
        this.isInit = false;
    }

    init() {
        this.isInit = true;
        this.sort();

    }

    push(x, y, priority) {
        if (!this.contains(x, y)) {
            const value = { priority, x, y };
            this.points.set(this.toKey(x, y), value);
            this.data.push(value);
        } else {
            const old = this.points.get(this.toKey(x, y));
            old.priority = priority;
            const index = this.data.indexOf(old);
            if (index > -1) {
                this.data.splice(index, 1);
            }
            // Find position in data
            let added = false;
            for (let i = this.data.length - 1; i >= 0; i--) {
                if (this.data[i].priority > priority) {
                    this.data.splice(i + 1, 0, old);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.data.splice(0, 0, old);
            }
        }
    }

    contains(x, y) {
        return this.points.has(this.toKey(x, y));
    }

    sort() {
        this.data.sort((a, b) => b.priority - a.priority);
    }

    pop() {
        const value = this.data.pop();
        this.points.delete(this.toKey(value.x, value.y))
        return value;
    }

    isEmpty() {
        return this.data.length === 0;
    }

    toKey(x, y) {
        return `${x}_${y}`;
    }
}
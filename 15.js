var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input15.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const grid = data.trim().replace(/\r/g, "").split("\n").map(line => line.split('').map(x => parseInt(x)));
    console.log("1:", findShortestPath(grid));
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
    }

    return dist[height -1 ][width - 1];
}

class PriorityQueue {
    constructor() {
        this.data = [];
        this.isInit = false;
    }

    init() {
        this.isInit = true;
        this.sort();

    }

    push(x, y, priority) {
        const old = this.data.filter(d => d.x === x && d.y === y)[0];
        if (!old) {
            this.data.push({ priority, x, y });
        } else {
            old.priority = priority;
        }
        if (this.isInit)
            this.sort();
    }

    contains(x, y) {
        // Optimize with map
        return this.data.filter(d => d.x === x && d.y === y).length > 0;
    }

    remove(x, y) {
        this.data = this.data.filter(d => d.x !== x && d.y !== y);
    }

    sort() {
        this.data.sort((a, b) => b.priority - a.priority);
    }

    pop() {
        return this.data.pop();
    }

    isEmpty() {
        return this.data.length === 0;
    }
}
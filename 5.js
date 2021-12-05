var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input5.txt', 'utf8', function (err, data) {
    if (err) throw err;
    data = data.trim().replace(/\r/g, "").split("\n");
    const lines = prepareLines(data);
    console.log("1:\n" + findIntersections1(lines));
    console.log("2:\n" + findIntersections2(lines));
});

function prepareLines(data) {
    return data.map(x => new Line(...x.split(" -> ")));
}

function getBoardSize(lines) {
    const width = [Number.MAX_VALUE, Number.MIN_VALUE];
    const height = [Number.MAX_VALUE, Number.MIN_VALUE];

    for (const line of lines) {
        width[0] = Math.min(width[0], line.start[0], line.end[0]);
        width[1] = Math.max(width[1], line.start[0], line.end[0]);
        height[0] = Math.min(height[0], line.start[1], line.end[1]);
        height[1] = Math.max(height[1], line.start[1], line.end[1]);
    }

    return [width, height];
}

function findIntersections1(lines) {
    const [widht, height] = getBoardSize(lines);
    const board = new Array(height[1] - height[0] + 1).fill(0).map(_ => new Array(widht[1] - widht[0] + 1).fill(0));

    for (const line of lines) {
        if (!line.isNice())
            continue;
        for (const point of line.getPoints()) {
            board[point[1] - height[0]][point[0] - widht[0]] += 1;
        }
    }

    return board.flat().filter(x => x > 1).length;
}

function findIntersections2(lines) {
    const [widht, height] = getBoardSize(lines);
    const board = new Array(height[1] - height[0] + 1).fill(0).map(_ => new Array(widht[1] - widht[0] + 1).fill(0));

    for (const line of lines) {
        for (const point of line.getPoints()) {
            board[point[1] - height[0]][point[0] - widht[0]] += 1;
        }
    }

    return board.flat().filter(x => x > 1).length;
}

class Line {
    constructor(start, end) {
        const a = start.split(',').map(x => parseInt(x));
        const b = end.split(',').map(x => parseInt(x));
        this.start = a[0] < b[0] ? a : b;
        this.end = this.start === a ? b : a;
    }

    getPoints() {
        const points = [];
        const dx = this.getD(0);

        const dy = this.getD(1);
        if (dy === 0 && dx !== 0) {
            for (let x = this.start[0]; x != this.end[0]; x += dx) {
                points.push([x, this.start[1]]);
            }
        } else if (dx === 0 && dy !== 0) {
            for (let y = this.start[1]; y != this.end[1]; y += dy) {
                points.push([this.start[0], y]);
            }
        } else {
            for (let x = this.start[0], y = this.start[1]; x != this.end[0] && y != this.end[1]; x += dx, y += dy) {
                points.push([x, y]);
            }
        }
        points.push(this.end);
        return points;
    }

    getD(i) {
        const diff = this.start[i] - this.end[i];
        if (diff === 0)
            return 0;
        return diff < 0 ? 1 : -1;
    }

    isNice() {
        return this.start[0] === this.end[0] || this.start[1] === this.end[1];
    }
}
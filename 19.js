var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input19.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const input = data.trim().replace(/\r/g, "").split("\n");
    const scanners = parseInput(input);

    console.log("1:", solve1(scanners));
});

function solve1(scanners) {
    let changed;
    do {
        changed = false;
        for (let i = 1; i < scanners.length; i++) {
            const [overlap, pairs] = hasOverlap(scanners[0], scanners[i], 12);
            if (overlap) {
                scanners[0] = joinScanners(scanners[0], scanners[i], pairs)
                changed = true;
                scanners.splice(scanners.indexOf(scanners[i]), 1);
                break;
            }
        }
    } while (changed);
    return scanners[0].points.length;
}

function joinScanners(a, b, pairs) {
    pairs = pairs.map(x => x.map(y => [...y.coords]));
    const base = [[...pairs[0][0]], [...pairs[0][1]]];
    for (const line of pairs) {
        for (let i = 0; i < 3; i++) {
            line[0][i] -= base[0][i];
            line[1][i] -= base[1][i];
        }
    }
    const scramble = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (Math.abs(pairs[1][0][i]) === Math.abs(pairs[1][1][j])) {
                scramble[i] = j;
                break;
            }
        }
    }

    const rotation = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        rotation[i] = pairs[1][0][i] / pairs[1][1][scramble[i]];
    }

    const newPoints = [];
    for (const point of b.rawPoints) {
        newPoints.push(pointSum(pointTimes(pointScramble(pointDiff(point, base[1]), scramble), rotation), base[0]));
    }

    return new Scanner(joinPoints(newPoints, a.rawPoints));
}

function hasOverlap(a, b, minOverlap) {
    let overlap = 0;
    const pairs = [];
    for (const pointA of a.points) {
        for (const pointB of b.points) {
            let sameDistances = 0;
            pointB.distances.forEach(dist => {
                if (pointA.distances.has(dist)) {
                    sameDistances += Math.min(pointA.distMap.get(dist).length, pointB.distMap.get(dist).length);
                }
            });
            if (sameDistances >= minOverlap - 1) {
                pairs.push([pointA, pointB]);
                overlap++;
            }
        }
    }
    return [overlap >= minOverlap, pairs];
}

function parseInput(input) {
    const scanners = [];
    let currentScanner = [];
    for (const line of input) {
        if (line.trim() === '') {
            continue;
        } else if (line.startsWith('---')) {
            currentScanner.length && scanners.push(new Scanner(currentScanner));
            currentScanner = [];
        } else {
            currentScanner.push(line.split(',').map(x => parseInt(x)));
        }
    }
    scanners.push(new Scanner(currentScanner));
    return scanners;
}

class Scanner {
    constructor(points) {
        this.rawPoints = points;
        this.points = points.map(x => new Point(x));
        this.points.forEach(p => p.prepareDistances(this.points));
    }
}

class Point {
    constructor(coords) {
        this.coords = coords;
        this.distances = new Set();
        this.distMap = new Map();
    }

    prepareDistances(points) {
        for (const point of points) {
            if (this.isEqual(point))
                continue;
            let distance = 0;
            for (let i = 0; i < 3; i++) {
                distance += Math.pow(this.coords[i] - point.coords[i], 2);
            }
            this.distances.add(distance);
            if (!this.distMap.has(distance)) {
                this.distMap.set(distance, []);
            }
            this.distMap.get(distance).push(point);
        }
    }

    isEqual(point) {
        return this.coords[0] === point.coords[0] && this.coords[1] === point.coords[1] && this.coords[2] === point.coords[2];
    }
}

function pointSum(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = a[i] + b[i];
    }
    return result;
}

function pointDiff(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = a[i] - b[i];
    }
    return result;
}
function pointTimes(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = a[i] * b[i];
    }
    return result;
}

function joinPoints(a, b) {
    const added = new Set();
    const points = [];

    for (const point of [...a, ...b]) {
        const key = point.join(',');
        if (added.has(key))
            continue;
        added.add(key);
        points.push(point);
    }

    return points;
}

function pointScramble(point, map) {
    const result = [];
    for (let i = 0; i < 3; i++) {
        result[i] = point[map[i]];
    }
    return result;
}
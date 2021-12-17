var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input17.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const targetSize = data.trim().replace('target area: ', '').split(', ').map(x => x.replace(/\w=/, '').split('..').map(y => parseInt(y)));
    console.log("1:", findHighestPosition(targetSize));
    // doReachTarget([17,-4], targetSize)
});

function findHighestPosition(targetSize) {
    let maxY = 0;
    for (let x = 0; x < targetSize[0][1]; x++) {
        for (let y = targetSize[1][0]; y < -targetSize[1][0]; y++) {
            const [reach, maxX, newY] = doReachTarget([x, y], targetSize);
            if (reach && newY > maxY) {
                console.log("new best", x, y);
                maxY = newY;
            }
        }
    }
    return maxY;
}

function doReachTarget(velocity, targetSize) {
    const point = [0, 0];
    let maxY = 0;
    let maxX = 0;
    while (point[0] <= targetSize[0][1] && point[1] >= targetSize[1][0]) {
        point[0] += velocity[0];
        point[1] += velocity[1];
        maxY = Math.max(maxY, point[1]);
        maxX = Math.max(maxX, point[0]);
        if (velocity[0] !== 0)
            velocity[0] += velocity[0] > 0 ? -1 : 1;
        velocity[1] -= 1;
        if (isInArae(point, targetSize)) {
            return [true, maxX, maxY];
        }
    }
    return [false, maxX, maxY];
}

function isInArae(point, targetSize) {
    return targetSize[0][0] <= point[0] && point[0] <= targetSize[0][1] &&
        targetSize[1][0] <= point[1] && point[1] <= targetSize[1][1];
}
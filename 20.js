var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input20.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const input = data.trim().replace(/\r/g, "").split("\n");
    const [enhancement, image] = parseInput(input);

    console.log("1:", solve1(image, enhancement));
    console.log("2:", solve2(image, enhancement));
});

function parseInput(input) {
    const enhancement = input[0].split('');
    const image = input.filter((_, k) => k > 1).map(l => l.split(''));
    return [enhancement, image]
}

function solve1(image, enhancement) {
    const first = enhance(image, enhancement, '.');
    const second = enhance(first, enhancement, enhancement[0] === '.' ? '.' : '#');
    return second.flat().filter(x => x === '#').length;
}

function solve2(image, enhancement) {
    const iterations = 50;
    let last = image;
    let lastBackground = '.';
    for (let i = 0; i < iterations; i++) {
        last = enhance(last, enhancement, lastBackground);
        lastBackground = lastBackground === '.' ? enhancement[0] : enhancement[enhancement.length - 1];
    }
    return last.flat().filter(x => x === '#').length;
}

function enhance(image, enhancement, base = '.') {
    const added = 2;
    const newHeihgt = image.length + added;
    const newWidth = image[0].length + added;
    const newImage = new Array(newHeihgt).fill(0).map(_ => new Array(newWidth).fill('.'));

    for (let y = 0; y < newImage.length; y++) {
        for (let x = 0; x < newImage[y].length; x++) {
            let binNumber = '';
            forAllInWindow(x - (added / 2), y - (added / 2), (v) => binNumber += v === '#' ? '1' : '0', image, base);
            let index = parseInt(binNumber, 2);
            newImage[y][x] = enhancement[index];
        }
    }

    return newImage;
}

function forAllInWindow(x, y, callback, image, base = '.') {
    const moves = [-1, 0, 1];
    moves.forEach(dy => {
        moves.forEach(dx => {
            const row = image[y + dy];
            if (!row) {
                callback(base);
                return;
            }
            const value = row[x + dx];
            if (!value) {
                callback(base);
                return;
            }
            callback(value);
        });
    });
}
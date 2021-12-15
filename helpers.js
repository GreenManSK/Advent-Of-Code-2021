function print2D(array) {
    return array.map(x => x.join('')).join('\n');
}

function forAllNeighsSimple(width, heigth, x, y, callback) {
    [-1, 1].forEach(d => {
        if (x + d >= 0 && x + d < width)
            callback(x + d, y);
        if (y + d >= 0 && y + d < heigth)
            callback(x, y + d);
    })
}

module.exports = { print2D, forAllNeighsSimple };
function print2D(array) {
    return array.map(x => x.join('')).join('\n');
}

module.exports = { print2D };
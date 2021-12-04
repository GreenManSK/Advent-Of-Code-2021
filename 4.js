var fs = require('fs');
fs.readFile('input4.txt', 'utf8', function(err, data) {
    if (err) throw err;
    data = data.trim().replace(/\r/g,"").split("\n");
    [calls, boards] = prepareData(data);
    console.log("1", findWinning(calls, boards));
});

function prepareData(data) {
    const calls = data[0].split(",").map(x => parseInt(x));
    const boards = [];

    let board = [];
    for (let i = 2; i < data.length; i++) {
        const line = data[i];
        if (line === "") {
            boards.push(new Board(board));
            board = [];
        } else {
            board.push(line.trim().split(/\s+/).map(x => parseInt(x)));
        }
    }
    boards.push(new Board(board));

    return [calls, boards];
}

class Board {
    constructor(board) {
        this.numbers = new Set(board.flat());
        this.lines = [];
        this.columns = [];
        for (let i = 0; i < board.length; i++) {
            const line = new Set(board[i]);
            const column = new Set(board.map(x => x[i]));
            this.lines.push(line);
            this.columns.push(column);
        }
    }

    callNumber(number) {
        for (const sets of [this.lines, this.columns]) {
            for (const line of sets) {
                line.delete(number);
            }
        }
        this.numbers.delete(number);
    }

    isWinning() {
        for (const line of this.lines) {
            if (line.size === 0)
                return true;
        }
        for (const column of this.columns) {
            if (column.size === 0)
                return true;
        }
        return false;
    }
}

function findWinning(calls, boards) {
    for (const number of calls) {
        for (const board of boards) {
            board.callNumber(number);
            if (board.isWinning()) {
                return board, number * Array.from(board.numbers).reduce((a,b) => a + b)
            }
        }
    }
    return undefined;
}
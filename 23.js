var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input23a.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const input = data.trim().replace(/\r/g, "").split("\n").map(x => x.split(''));
    const diagram = new Diagram(input);

    console.log("1:", solve1(diagram)[0]);
});

fs.readFile('input23b.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const input = data.trim().replace(/\r/g, "").split("\n").map(x => x.split(''));
    const diagram = new Diagram(input);

    console.log("2:", solve1(diagram)[0]);
});

const energyMap = {
    'A': 1,
    'B': 10,
    'C': 100,
    'D': 1000
}

const memory = {};
function solve1(diagram) {
    if (diagram.isSolved())
        return [0, []];
    const key = diagram.toString();
    if (memory[key]) {
        return memory[key];
    }

    const letters = diagram.spaces.filter(s => s.occupant !== null);
    let bestCost = Number.MAX_SAFE_INTEGER;
    let bestWay = [];
    for (const letter of letters) {
        const moves = letter.getMoves();
        // console.log(letter.occupant, moves.map((v) => `dis: ${v[1]} for x:${v[0].x};y:${v[0].y}`))

        for (const [move, distance] of moves) {
            const price = distance * energyMap[letter.occupant];

            // do move
            move.occupant = letter.occupant;
            letter.occupant = null;

            // call recursion
            const [subSolve, subWay] = solve1(diagram);

            // check if not max
            if (subSolve !== Number.MAX_SAFE_INTEGER) {
                bestCost = Math.min(bestCost, subSolve + price);
                if (bestCost === subSolve + price) {
                    bestWay = [diagram.toString(), ...subWay];
                }
            }

            // redo move
            letter.occupant = move.occupant;
            move.occupant = null;
        }
    }
    memory[key] = [bestCost, bestWay];
    return memory[key];
}

class Space {
    isHallway = true;
    occupant = null;
    target = null;
    left = null;
    top = null;
    right = null;
    bottom = null;
    _canStop = undefined;

    constructor(x = 0, y = 0, isHallway, occupant = null, target = null) {
        this.x = x;
        this.y = y;
        this.isHallway = isHallway;
        this.occupant = occupant;
        this.target = target;
    }

    canStop() {
        if (this._canStop === undefined) {
            this._canStop = !(this.left?.isHallway === false || this.right?.isHallway === false
                || this.top?.isHallway === false || this.bottom?.isHallway === false);
        }
        return this._canStop;

    }

    isSolved() {
        return this.occupant === this.target;
    }

    isSolvedUnder() {
        let under = this.bottom;
        while (under !== null) {
            if (!under.isSolved()) {
                return false;
            }
            under = under.bottom;
        }
        return true;
    }

    getMoves() {
        const moves = [];
        if (this.occupant === null)
            return moves;
        if (this.isSolved() && this.isSolvedUnder()) {
            return moves;
        }
        if (!this.isHallway) {
            // moves to outside and its own room
            let top = this.top;
            let topDistance = 1;
            if (top.occupant !== null)
                return moves;
            while (top.top !== null) {
                top = top.top;
                topDistance++;
            }
            // find left right moves
            const dirs = ['left', 'right'];
            for (const dir of dirs) {
                let next = top[dir];
                let distance = topDistance + 1;
                while (next !== null && next.occupant === null) {
                    if (next.canStop())
                        moves.push([next, distance]);
                    distance++;
                    next = next[dir];
                }
            }

            // find moves that put in rooms
            moves.push(...this._getFinishingMoves(top, topDistance));

        } else {
            // moves only to its own room
            moves.push(...this._getFinishingMoves(this));
        }

        return moves;
    }

    _getFinishingMoves(from, fromDistance = 0) {
        const moves = [];
        const dirs = ['left', 'right'];
        for (const dir of dirs) {
            let next = from[dir];
            let distance = fromDistance + 1;
            while (next !== null) {
                if (next.occupant !== null)
                    break;
                if (!next.canStop() && next.bottom.target === this.occupant) {
                    let bottom = next.bottom;
                    let subDistance = distance + 1;
                    do {
                        if (bottom.occupant !== null)
                            break;
                        if (bottom.isSolvedUnder()) {
                            moves.push([bottom, subDistance]);
                            break;
                        }
                        bottom = bottom.bottom;
                        subDistance++;
                    } while (bottom !== null);
                }
                distance++;
                next = next[dir];
            };
        }
        return moves;
    }
}

class Diagram {
    constructor(input) {
        this.spaces = [];

        for (let i = 0; i < input[1].length; i++) {
            if (input[1][i] === '.') {
                const newHallway = new Space(i, 1, true);
                if (this.spaces.length > 0) {
                    const prevHallway = this.spaces[this.spaces.length - 1];
                    newHallway.left = prevHallway;
                    prevHallway.right = newHallway;
                }
                this.spaces.push(newHallway);
            }
        }

        let target = 'A';
        for (let i = 0; i < input[2].length; i++) {
            const occupant = input[2][i];
            if (occupant === '#')
                continue;
            const newSpace = new Space(i, 2, false, occupant, target);
            this.spaces[i - 1].bottom = newSpace;
            newSpace.top = this.spaces[i - 1];
            this.spaces.push(newSpace);
            let last = newSpace;
            for (let j = 3; j < input.length; j++) {
                const underOccupant = input[j][i];
                if (underOccupant === '#')
                    continue;
                const underSpace = new Space(i, j, false, underOccupant, target);
                underSpace.top = last;
                last.bottom = underSpace;
                last = underSpace;
                this.spaces.push(underSpace);
            }
            target = nextChar(target);
        }
    }

    isSolved() {
        return this.spaces.filter(s => !s.isSolved()).length === 0;
    }

    toString() {
        return this.spaces.map(s => s.occupant ?? '.').join('');
    }
}

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}
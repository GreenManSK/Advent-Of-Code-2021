var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input24.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const instructions = data.trim().replace(/\r/g, "").split("\n").map(x => x.split(' '));

    for (let i = 99999999999999; i >= 11111111111111; i--) {
        const input = i.toString().split('');
        if (input.filter(x => x == 0).length > 0)
            continue;
        let z = 0;
        z = process(z, 1, 14, 12, input[0]);
        z = process(z, 1, 10, 9, input[1]);
        z = process(z, 1, 13, 8, input[2]);
        z = process(z, 26, -8, 3, input[3]);
        z = process(z, 1, 11, 0, input[4]);
        z = process(z, 1, 11, 11, input[5]);
        z = process(z, 1, 14, 10, input[6]);
        z = process(z, 26, -11, 13, input[7]);
        z = process(z, 1, 14, 3, input[8]);
        z = process(z, 26, -1, 10, input[9]);
        z = process(z, 26, -8, 10, input[10]);
        z = process(z, 26, -5, 14, input[11]);
        z = process(z, 26, -16, 6, input[12]);
        z = process(z, 26, -6, 5, input[13]);
        if (z === 0) {
            console.log(i);
            return i;
        }
    }
});

function process(z, zdiv, a, b, w) {
    const oldZ = z;
    z = Math.floor(z / zdiv);
    if (((oldZ % 26) + a) != w) {
        z = z * 26;
        z += w + b;
    }
    return z;
}

const symbolMap = {
    'add': (a, b) => `${a} + ${b}`,
    'mul': (a, b) => `${a} * ${b}`,
    'mod': (a, b) => `${a} % ${b}`,
    'div': (a, b) => `Math.floor(${a} / ${b})`,
    'eql': (a, b) => `(${a} == ${b}) ? 1 : 0`
}


class Monad {
    constructor(input) {
        this.memory = {};
        this.input = input;
        this.inputPointer = 0;
    }

    getMem(variable) {
        return this.memory[variable] ?? 0;
    }

    setMem(variable, value) {
        this.memory[variable] = value;
    }

    parseInput(value) {
        if (isNaN(value)) {
            return this.getMem(value);
        }
        return parseInt(value);
    }

    process(instruction) {
        const a = this.getMem(instruction[1]);
        const b = instruction.length > 1 ? this.parseInput(instruction[2]) : undefined;
        switch (instruction[0]) {
            case 'inp':
                this.setMem(instruction[1], this.input[this.inputPointer]);
                this.inputPointer++;
                break;
            case 'add':
                this.setMem(instruction[1], a + b);
                break;
            case 'mul':
                this.setMem(instruction[1], a * b);
                break;
            case 'div':
                this.setMem(instruction[1], Math.floor(a / b));
                break;
            case 'mod':
                this.setMem(instruction[1], a % b);
                break;
            case 'eql':
                this.setMem(instruction[1], a == b ? 1 : 0)
                break;
            default:
                console.error("yikes!");
        }
    }
}
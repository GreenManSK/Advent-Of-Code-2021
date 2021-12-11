var fs = require('fs');
fs.readFile('input10.txt', 'utf8', function(err, data) {
    if (err) throw err;
    const lines = data.trim().trim().replace(/\r/g, "").split("\n").map(x => x.split(''));
    console.log("1:", solve1(lines));
    console.log("2:", solve2(lines));
});

const scoresErr = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
};
const opening = new Set(['(', '[', '{', '<']);
const pairs = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
};
const scoreInc = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
};

function solve1(lines) {
    let result = 0;
    for (const line of lines) {
        const [type, r] = checkLine(line);
        if (type === 'invalid') {
            result += scoresErr[r];
        }
    }

    return result;
}

function checkLine(line) {
    const stack = [];
    for (const chr of line) {
        if (opening.has(chr)) {
            stack.push(chr);
        } else {
            const top = stack.pop();
            if (pairs[top] !== chr)
                return ['invalid', chr];
        }
    }
    if (stack.length !== 0) {
        return ['incomplete', stack];
    }
    return ['complete', null];
}

function solve2(lines) {
    const results = [];
    for (const line of lines) {
        const [type, r] = checkLine(line);
        if (type === 'incomplete') {
            results.push(scoreIncomplete(r));
        }
    }
    const sorted = results.sort((a,b) => a-b);
    return sorted[Math.floor(sorted.length / 2)];
}

function scoreIncomplete(r) {
    let result = 0;
    for (let i = r.length - 1; i >= 0; i--) {
        const chr = r[i];
        result *= 5;
        result += scoreInc[pairs[chr]];
    }
    return result;
}
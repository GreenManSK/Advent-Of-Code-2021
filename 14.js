var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input14.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const input = data.trim().replace(/\r/g, "").split("\n");
    const [template, rules, letters] = prepareInupt(input);
    console.log("1:", solve(template, rules, letters, 10));
    console.log("2:", solve(template, rules, letters, 40));
});

function prepareInupt(input) {
    const rules = {};
    const letters = new Set();
    for (let i = 2; i < input.length; i++) {
        const [match, add] = input[i].split(' -> ');
        rules[match] = add;
        letters.add(add);
    }
    return [input[0], rules, Array.from(letters)];
}

function solve(template, rules, letters, rounds) {
    const counts = getCounts(template, rules, letters, rounds);
    return Math.max(...counts) - Math.min(...counts);
}

function polymerizeIterative(template, rules, rounds) {
    let polymer = template;
    for (let round = 0; round < rounds; round++) {
        let newPolymer = polymer[0];
        getParts(polymer).forEach((base) => {
            if (rules[base]) {
                newPolymer += rules[base];
            }
            newPolymer += base[1];
        });
        polymer = newPolymer;
    }
    return polymer;
}


function countLetters(polymer, letters) {
    const counts = [];
    const polymerSplit = polymer.split("");
    for (const letter of letters) {
        counts.push(polymerSplit.filter(x => x === letter).length);
    }
    return counts;
}

function getParts(polymer) {
    const parts = [];
    for (let i = 0; i < polymer.length - 1; i++) {
        parts.push(polymer.substring(i, i + 2));
    }
    return parts;
}

function sumArrs(a, b) {
    const sum = [];
    for (let i = 0; i < a.length; i++) {
        sum[i] = a[i] + b[i];
    }
    return sum;
}

// const memory = new Map();
function getCounts(polymer, rules, letters, rounds, memory = new Map()) {
    if (rounds <= 0 || polymer.length <= 1) {
        return countLetters(polymer, letters);
    }
    const key = `${polymer}_${rounds}`;
    if (!memory.has(key)) {
        if (polymer.length == 2) {
            const newPolymer = polymerizeIterative(polymer, rules, 1);
            let counts = countLetters(newPolymer, letters);
            getParts(newPolymer).forEach(part => {
                const partCounts = getCounts(part, rules, letters, rounds - 1, memory);
                partCounts[letters.indexOf(part[0])] -= 1;
                partCounts[letters.indexOf(part[1])] -= 1;
                counts = sumArrs(counts, partCounts);
            });
            memory.set(key, counts.join(","));
        } else {
            let counts = countLetters(polymer, letters);
            getParts(polymer).forEach(part => {
                const partCounts = getCounts(part, rules, letters, rounds, memory);
                partCounts[letters.indexOf(part[0])] -= 1;
                partCounts[letters.indexOf(part[1])] -= 1;
                counts = sumArrs(counts, partCounts);
            });
            memory.set(key, counts.join(","));
        }
    }
    return memory.get(key).split(",").map(x => parseInt(x));
}
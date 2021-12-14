var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input14.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const input = data.trim().replace(/\r/g, "").split("\n");
    const [template, rules, letters] = prepareInupt(input);
    console.log("1:", solve(template, rules, letters, 10));
    // console.log("2:", solve(template, rules, letters, 40));
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
    const polymer = polymerizeIterative(template, rules, rounds).split('');
    const counts = [];
    for (const letter of letters) {
        counts.push(polymer.filter(x => x === letter).length);
    }
    return Math.max(...counts) - Math.min(...counts);
}

function polymerizeIterative(template, rules, rounds) {
    let polymer = template;
    for (let round = 0; round < rounds; round++) {
        let newPolymer = polymer[0];
        for (let i = 0; i < polymer.length - 1; i++) {
            const base = polymer.substring(i, i + 2);
            if (rules[base]) {
                newPolymer += rules[base];
            }
            newPolymer += base[1];
        }
        polymer = newPolymer;
    }
    return polymer;
}
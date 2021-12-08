var fs = require('fs');

fs.readFile('input8.txt', 'utf8', function (err, data) {
    if (err) throw err;
    data = data.trim().replace(/\r/g, "").split("\n").map(x => x.split(' | ').map(y => y.split(' ')));
    console.log("1:", solve1(data));
    console.log("2:", solve2(data));
});

const allSegments = "abcdefg";
const segments = ["abcefg", "cf", "acdeg", "acdfg", "bcdf", "abdfg", "abdefg", "acf", "abcdefg", "abcdfg"];
const segmentMap = segments.map(x => new Set(x.split('')));

function solve1(data) {
    let result = 0;
    for (const line of data) {
        result += line[1].filter(n => [2,3,4,7].indexOf(n.length) !== -1).length;
    }
    return result;
}

function solve2(data) {
    let result = 0;
    for (const line of data) {
        result += solveLine(line);
    }
    return result;
}

function solveLine(line) {
    const inputs = line[0].sort((a,b) => a.length - b.length);
    const outputs = line[1];
    const mappingCandidates = new Map();
    allSegments.split('').forEach(l => mappingCandidates.set(l, new Set(allSegments.split(''))));

    for (const input of inputs) {
        for (const digit in segmentMap) {
            const segments = segmentMap[digit];
            if (input.length === segments.size) {
                // check if can be valid digit
                if (!canBeValid(input, segments, mappingCandidates)) {
                    continue;
                }
                
                mappingCandidates.forEach((candidates, letter) => {
                    if (segments.has(letter)) {
                        const toRemove = [];
                        for (const candidate of candidates) {
                            if (input.indexOf(candidate) === -1)
                                toRemove.push(candidate);
                        }
                        toRemove.forEach(r => candidates.delete(r));
                    } else {
                        input.split('').forEach(l => candidates.delete(l));
                    }
                });
            }
        }
    }

    const resultMapping = new Map();
    mappingCandidates.forEach((val, key) => resultMapping.set(val.values().next().value, key));

    return parseInt(outputs.map(number => segments.indexOf(number.split('').map(x => resultMapping.get(x)).sort().join(''))).join(''));
}

function canBeValid(input, segments, mappingCandidates) {
    for (const [letter, candidates] of mappingCandidates) {
        if (segments.has(letter)) {
            const toRemove = [];
            for (const candidate of candidates) {
                if (input.indexOf(candidate) === -1)
                    toRemove.push(candidate);
            }
            if (toRemove.length >= candidates.size)
                return false;
        } else {
            const candidatesCopy = new Set(candidates);
            input.split('').forEach(l => candidatesCopy.delete(l));
            if (candidatesCopy.size === 0) {
                return false;
            }
        }
    }
    return true;
}
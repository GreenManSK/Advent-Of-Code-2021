var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input21.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const input = data.trim().replace(/\r/g, "").split("\n").map(x => parseInt(x.charAt(x.length - 1)));

    console.log("1:", solve1(input));
    const res2 = solve2(...input);
    console.log("2:", res2, res2[0] > res2[1] ? res2[0] : res2[1]);
});

function solve1([player1, player2]) {
    const winScore = 1000;

    let rolls = 0;
    let dice = 1;
    let isFirst = true;

    let player1Score = 0;
    let player2Score = 0;

    while (player1Score < winScore && player2Score < winScore) {
        rolls += 3;
        let value = dice + normalize(dice + 1) + normalize(dice + 2);
        dice = normalize(dice + 3);
        if (isFirst) {
            player1 = normalize(player1 + value, 10);
            player1Score += player1;
        } else {
            player2 = normalize(player2 + value, 10);
            player2Score += player2;
        }
        isFirst = !isFirst;
    }
    return (player1Score >= winScore ? player2Score : player1Score) * rolls;
}

const diracDiceCombos = [];
const diracValues = [1, 2, 3];
diracValues.forEach(a => diracValues.forEach(b => diracValues.forEach(c => diracDiceCombos.push(a + b + c))));

const memory = {};
function solve2(player1, player2, score1 = 0, score2 = 0, target = 21) {
    if (score1 >= target) {
        return [1n, 0n];
    }
    if (score2 >= target) {
        return [0n, 1n];
    }

    const key = `${player1}_${player2}_${score1}_${score2}_${target}`;
    if (memory[key] !== undefined) {
        return memory[key];
    }

    const wins = [0n, 0n];
    for (const value of diracDiceCombos) {
        // Move player
        const newPlayer1 = normalize(player1 + value, 10);
        const newScore1 = score1 +  newPlayer1;

        if (newScore1 < target) {
            // Compute wins in subuniverses
            const subWins = solve2(player2, newPlayer1, score2, newScore1, target);

            // add to wins
            wins[0] += subWins[1];
            wins[1] += subWins[0];
        } else {
            wins[0] += 1n;
        }
    }
    memory[key] = wins;
    return wins;
}

function normalize(value, base = 100) {
    let normal = value % base;
    return normal === 0 ? base : normal;
}

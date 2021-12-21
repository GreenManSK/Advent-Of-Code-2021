var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input21.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const input = data.trim().replace(/\r/g, "").split("\n").map(x => parseInt(x.charAt(x.length - 1)));

    console.log("1:", solve1(input));
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

function normalize(value, base = 100) {
    let normal = value % base;
    return normal === 0 ? base : normal;
}

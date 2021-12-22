var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input22.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const input = data.trim().replace(/\r/g, "").split("\n");
    const commands = parseInput(input);

    console.log("1:", solve1(commands));
});

function parseInput(input) {
    const commands = [];
    for (const line of input) {
        const [turn, coords] = line.split(' ');
        const parsedCoords = coords.replace(/\w=/g, '').split(',').map(x => x.split('..').map(y => parseInt(y)));
        commands.push({
            isOn: turn === 'on',
            x: parsedCoords[0],
            y: parsedCoords[1],
            z: parsedCoords[2]
        });
    }
    return commands;
}

function solve1(commands) {
    const cube = new Array(101).fill(false).map(x => new Array(101).fill(false).map(y => new Array(101).fill(false)));
    for (const command of commands) {
        for (let x = Math.max(-50, command.x[0]); x <= Math.min(50, command.x[1]); x++) {
            for (let y = Math.max(-50, command.y[0]); y <= Math.min(50, command.y[1]); y++) {
                for (let z = Math.max(-50, command.z[0]); z <= Math.min(50, command.z[1]); z++) {
                    cube[x + 50][y + 50][z + 50] = command.isOn;
                }
            }
        }
    }
    return cube.flat(2).filter(x => x).length;
}
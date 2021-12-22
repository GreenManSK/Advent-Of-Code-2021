var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input22.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const input = data.trim().replace(/\r/g, "").split("\n");
    const commands = parseInput(input);

    console.log("1:", solve1(commands));
    console.log("2:", solve2(commands));
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

function solve2(commands) {
    const reactor = new Reactor();
    commands.forEach(c => {
        reactor.process(c);
    });
    return reactor.countOn();
}


const coords = ["x", "y", "z"];
class Reactor {

    constructor() {
        this.onRegions = [];
    }

    process(command) {
        if (command.isOn) {
            const overlap = this.getOverlap(command);
            if (overlap === null) {
                this.onRegions.push(command);
            } else {
                const subRegions = this.remove(command, overlap);
                subRegions.forEach(region => this.process(region));
            }
        } else {
            let overlap = this.getOverlap(command);
            while (overlap !== null) {
                const index = this.onRegions.indexOf(overlap);
                this.onRegions.splice(index, 1);
                const subRegions = this.remove(overlap, command);
                subRegions.forEach(region => this.onRegions.push(region));
                overlap = this.getOverlap(command);
            }
        }
    }

    remove(from, what) {
        const remove = {};
        for (const coord of coords) {
            remove[coord] = [];
            remove[coord][0] = Math.max(from[coord][0], what[coord][0]);
            remove[coord][1] = Math.min(from[coord][1], what[coord][1]);
        }
        const subRegions = [
            {
                isOn: from.isOn,
                x: from.x,
                y: from.y,
                z: [from.z[0], remove.z[0] - 1]
            },
            {
                isOn: from.isOn,
                x: from.x,
                y: from.y,
                z: [remove.z[1] + 1, from.z[1]]
            },
            { // 1
                isOn: from.isOn,
                x: from.x,
                y: [from.y[0], remove.y[0] - 1],
                z: remove.z
            },
            { // 2
                isOn: from.isOn,
                x: [from.x[0], remove.x[0] - 1],
                y: remove.y,
                z: remove.z
            },
            { // 3
                isOn: from.isOn,
                x: [remove.x[1] + 1, from.x[1]],
                y: remove.y,
                z: remove.z
            },
            { // 4
                isOn: from.isOn,
                x: from.x,
                y: [remove.y[1] + 1, from.y[1]],
                z: remove.z
            }
        ];

        return subRegions.filter(x => this.isValid(x));
    }

    isValid(region) {
        return region.x[0] <= region.x[1] && region.y[0] <= region.y[1] && region.z[0] <= region.z[1];
    }

    getOverlap(maskRegion) {
        for (const region of this.onRegions) {
            let hasOverlap = true;
            for (const coord of coords) {
                hasOverlap = hasOverlap && ((region[coord][0] <= maskRegion[coord][0] && maskRegion[coord][0] <= region[coord][1])
                    || (region[coord][0] <= maskRegion[coord][1] && maskRegion[coord][1] <= region[coord][1])
                    || (maskRegion[coord][0] <= region[coord][0] && region[coord][0] <= maskRegion[coord][1])
                    || (maskRegion[coord][0] <= region[coord][1] && region[coord][1] <= maskRegion[coord][1]));
            }
            if (hasOverlap)
                return region;
        }
        return null;
    }

    countOn() {
        let result = 0;
        for (const region of this.onRegions) {
            result += (region.x[1] - region.x[0] + 1) * (region.y[1] - region.y[0] + 1) * (region.z[1] - region.z[0] + 1);
        }

        return result;
    }
}
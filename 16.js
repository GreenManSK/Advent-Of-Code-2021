var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input16.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const packet = data.trim();
    console.log("1:", solve1(packet));
    console.log("2:", solve2(packet));
});

function solve1(hexPacket) {
    const { packet } = parsePacketHex(hexPacket);
    return sumVersions(packet);
}

function solve2(hexPacket) {
    const { packet } = parsePacketHex(hexPacket);
    return packet.value;
}

function sumVersions(packet) {
    const subPacketsSum = (packet.subPackets ? packet.subPackets.map(p => sumVersions(p)).reduce((a, b) => a + b, 0) : 0)
    return packet.version + subPacketsSum;
}

const decToBinTable = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    'A': '1010',
    'B': '1011',
    'C': '1100',
    'D': '1101',
    'E': '1110',
    'F': '1111',
};
function parsePacketHex(packet) {
    const binPacket = packet.split('').map(ch => decToBinTable[ch]).join('');
    return parsePacket(binPacket);
}

function parsePacket(binPacket) {
    const version = parseInt(binPacket.substring(0, 3), 2);
    const type = parseInt(binPacket.substring(3, 6), 2);
    const base = {
        version,
        type
    }

    if (type === 4) {
        const [value, remainder] = parseLiteral(binPacket.substring(6, binPacket.length));
        return {
            packet: {
                ...base,
                value
            },
            remainder
        };
    } else {
        const is15Bit = binPacket.charAt(6) === '0';
        const packet = binPacket.substring(7, binPacket.length);
        const { subPackets, remainder } = is15Bit ? parse15Bit(packet) : parse11Bit(packet);
        const subPacketsValues = subPackets.map(p => p.value);
        let value = 0;
        switch (type) {
            case 0:
                value = subPacketsValues.reduce((a, b) => a + b, 0);
                break;
            case 1:
                value = subPacketsValues.reduce((a, b) => a * b, 1);
                break;
            case 2:
                value = Math.min(...subPacketsValues);
                break;
            case 3:
                value = Math.max(...subPacketsValues);
                break;
            case 5:
                value = subPacketsValues[0] > subPacketsValues[1] ? 1 : 0;
                break;
            case 6:
                value = subPacketsValues[0] < subPacketsValues[1] ? 1 : 0;
                break;
            case 7:
                value = subPacketsValues[0] == subPacketsValues[1] ? 1 : 0;
                break;
        }
        return {
            packet: {
                ...base,
                is15Bit,
                subPackets,
                value
            },
            remainder
        };
    }

    // switch (type) {
    //     case 4: {
    //         const [value, remainder] = parseLiteral(binPacket.substring(6, binPacket.length));
    //         return {
    //             packet: {
    //                 ...base,
    //                 value
    //             },
    //             remainder
    //         };
    //     }
    //     default:
    //         const is15Bit = binPacket.charAt(6) === '0';
    //         const packet = binPacket.substring(7, binPacket.length);
    //         const { subPackets, remainder } = is15Bit ? parse15Bit(packet) : parse11Bit(packet);
    //         let value = 0;
    //         return {
    //             packet: {
    //                 ...base,
    //                 is15Bit,
    //                 subPackets,
    //                 value
    //             },
    //             remainder
    //         };
    // }
}

function parse11Bit(packet) {
    const subPacketsNumber = parseInt(packet.substring(0, 11), 2);
    const subPackets = [];
    let packets = packet.substring(11, packet.length);
    for (let i = 0; i < subPacketsNumber; i++) {
        const { packet, remainder } = parsePacket(packets);
        subPackets.push(packet);
        packets = remainder;
    }
    return {
        subPackets,
        remainder: packets
    }
}

function parse15Bit(packet) {
    const subLength = parseInt(packet.substring(0, 15), 2);
    const subPackets = [];
    let packets = packet.substring(15, 15 + subLength);
    while (packets.length > 0) {
        const { packet, remainder } = parsePacket(packets);
        subPackets.push(packet);
        packets = remainder;
    }

    return {
        subPackets,
        remainder: packet.substring(15 + subLength, packet.length)
    };
}

function parseLiteral(packet) {
    let binValue = '';
    let i;
    for (i = 0; ; i += 5) {
        binValue += packet.substring(i + 1, i + 5);
        if (packet.charAt(i) === '0')
            break;
    }
    return [parseInt(binValue, 2), packet.substring(i + 5, packet.length)];
}
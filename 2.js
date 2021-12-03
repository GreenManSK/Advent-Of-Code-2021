var fs = require('fs');
fs.readFile('input2.txt', 'utf8', function(err, data) {
    if (err) throw err;
    let inst = data.trim().replace(/\r/g,"").split("\n");
    console.log("1:", findPosition(inst));
    console.log("2:", findPosition2(inst));
});

function findPosition(instructions) {
    let h = 0;
    let d = 0;
    for (let inst of instructions) {
        let [dir, val] = inst.split(" ");
        val = parseInt(val);
        switch (dir) {
            case "forward":
                h += val;
                break;
            case "down":
                d += val;
                break;
            case "up":
                d -= val;
                break;
        }
    }
    return [h,d,h*d];
}

function findPosition2(instructions) {
    let h = 0;
    let d = 0;
    let aim = 0;
    for (let inst of instructions) {
        let [dir, val] = inst.split(" ");
        val = parseInt(val);
        switch (dir) {
            case "forward":
                h += val;
                d += val * aim;
                break;
            case "down":
                aim += val;
                break;
            case "up":
                aim -= val;
                break;
        }
    }
    return [h,d,h*d];
}
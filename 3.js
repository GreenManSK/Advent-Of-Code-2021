var fs = require('fs');
fs.readFile('input3.txt', 'utf8', function(err, data) {
    if (err) throw err;
    data = data.trim().replace(/\r/g,"").split("\n");
    console.log("1:", findResult1(data));
    console.log("2:", findResult2(data));
});

function findResult1(data) {
    if (data.length === 0)
        return null;
    let counts = new Array(data[0].length).fill(0);
    for (let line of data) {
        for  (let i = 0; i < line.length; i++) {
            counts[i] += line.charAt(i) == "1" ? 1 : -1;
        }
    }
    let gamma = counts.map(x => x >= 0 ? "1" : "0").join("");
    let epsilon = counts.map(x => x >= 0 ? "0" : "1").join("");
    return [counts, gamma, epsilon, parseInt(gamma,2) * parseInt(epsilon,2)];
}

function findResult2(data) {
    const oxygen = findRating([...data]);
    const co2 = findRating([...data], false);
    return [oxygen, co2, oxygen * co2];
}

function findRating(data, oxygen = true) {
    let bit = 0;
    while (data.length !== 1) {
        let count = 0;
        for (const line of data) {
            count += line.charAt(bit) == "1" ? 1 : -1;
        }
        const wanted = oxygen ? (count >= 0 ? "1" : "0") : (count >= 0 ? "0" : "1");
        data = data.filter(x => x.charAt(bit) === wanted);
        bit++;
    }
    return parseInt(data[0], 2)
}
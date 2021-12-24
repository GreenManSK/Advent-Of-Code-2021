function process(z, zdiv, a, b, w) {
    const oldZ = z;
    z = Math.floor(z / zdiv);
    if (((oldZ % 26) + a) != w) {
        z = z * 26;
        z += w + b;
    }
    return z;
}

const digits = [9, 8, 7, 6, 5, 4, 3, 2, 1];
// z = 0;
// z = process(z, 1, 14, 12, input[0]);
// z = process(z, 1, 10, 9, input[1]);
// z = process(z, 1, 13, 8, input[2]);
// z = process(z, 26, -8, 3, input[3]);
// z = process(z, 1, 11, 0, input[4]);
// z = process(z, 1, 11, 11, input[5]);
// z = process(z, 1, 14, 10, input[6]);
// z = process(z, 26, -11, 13, input[7]);
// z = process(z, 1, 14, 3, input[8]);
// z = process(z, 26, -1, 10, input[9]);
// z = process(z, 26, -8, 10, input[10]);
// z = process(z, 26, -5, 14, input[11]);
// z = process(z, 26, -16, 6, input[12]);
// z = process(z, 26, -6, 5, input[13]);

const stepMap = {};
const maxStep = 14;
for (let step = 0; step < maxStep; step++) {
    const stepData = {
        states: new Set(),
        digitToState: new Map(),
        stateToNumber: new Map()
    };
    stepMap[step] = stepData;
    if (step === 0) {
        digits.forEach(d => {
            const value = process(0, 1, 14, 12, d);
            stepData.states.add(value);
            stepData.digitToState.set(d, new Set([value]));
            stepData.stateToNumber.set(value, [d]);
        });
        continue;
    }
    const prevStepData = stepMap[(step - 1)];
    prevStepData.states.forEach(z => {
        for (const d of digits) {
            let value = 0;
            if (step == 1)
                value = process(z, 1, 10, 9, d);
            if (step == 2)
                value = process(z, 1, 13, 8, d);
            if (step == 3)
                value = process(z, 26, -8, 3, d);
            if (step == 4)
                value = process(z, 1, 11, 0, d);
            if (step == 5)
                value = process(z, 1, 11, 11, d);
            if (step == 6)
                value = process(z, 1, 14, 10, d);
            if (step == 7)
                value = process(z, 26, -11, 13, d);
            if (step == 8)
                value = process(z, 1, 14, 3, d);
            if (step == 9)
                value = process(z, 26, -1, 10, d);
            if (step == 10)
                value = process(z, 26, -8, 10, d);
            if (step == 11)
                value = process(z, 26, -5, 14, d);
            if (step == 12)
                value = process(z, 26, -16, 6, d);
            if (step == 13)
                value = process(z, 26, -6, 5, d);

            stepData.states.add(value);
            if (!stepData.digitToState.has(d)) {
                stepData.digitToState.set(d, new Set());
            }
            stepData.digitToState.get(d).add(value);
            if (stepData.stateToNumber.has(value)) {
                const currentNumber = stepData.stateToNumber.get(value);
                if (currentNumber[currentNumber.length - 1] < d)
                    currentNumber[currentNumber.length - 1] = d;
            } else {
                stepData.stateToNumber.set(value, [...prevStepData.stateToNumber.get(z), d]);
            }
        }
    });
    delete stepMap[(step - 1)];
    console.log(stepData.states.size);
}

console.log(stepMap[maxStep - 1].stateToNumber.get(0));
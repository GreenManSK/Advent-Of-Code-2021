var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input18.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const numbers = data.trim().replace(/\r/g, "").split("\n").map(x => new Tree(...eval(x)));
    console.log("1:", solve1(...numbers).toString());
});

function solve1(current, ...rest) {
    let currentSum = current;
    for (const tree of rest) {
        currentSum = sum(currentSum, tree);
    }
    return currentSum.magnitude();
}

function sum(a, b) {
    const result = new Tree(a, b);
    reduce(result);
    return result;
}

function reduce(tree) {
    let reduced = false;
    do {
        reduced = false;
        // explode
        tree.forEach((node) => {
            if (node.depth > 4) {
                const toExplode = node.parent;
                const leftmost = toExplode.leftmostNode();
                const rightmost = toExplode.rightmostNode();
                if (leftmost !== null) {
                    leftmost.value += toExplode.left.value;
                }
                if (rightmost !== null) {
                    rightmost.value += toExplode.right.value;
                }
                if (toExplode.parent.left === toExplode) {
                    toExplode.parent.left = new Node(0, toExplode.parent);
                } else {
                    toExplode.parent.right = new Node(0, toExplode.parent);
                }
                reduced = true;
                return true;
            }
        });
        if (reduced)
            continue;
        tree.forEach((node) => {
            if (node.value >= 10) {
                const newTree = new Tree(Math.floor(node.value / 2), Math.ceil(node.value / 2), node.parent, node.depth);
                if (node.parent.left === node) {
                    node.parent.left = newTree;
                } else {
                    node.parent.right = newTree;
                }
                reduced = true;
                return true;
            }
        });
    } while (reduced);
    return tree;
}

class Tree {
    constructor(left, right, parent = null, depth = 0) {
        this.parent = parent;
        this.depth = depth;
        if (left instanceof Tree) {
            this.left = left;
            left.parent = this;
            left.updateDepth(depth + 1);
        } else {
            this.left = Number.isInteger(left) ? new Node(left, this) : new Tree(...left, this, depth + 1);
        }
        if (right instanceof Tree) {
            this.right = right;
            right.parent = this;
            right.updateDepth(depth + 1);
        } else {
            this.right = Number.isInteger(right) ? new Node(right, this) : new Tree(...right, this, depth + 1);
        }
    }

    updateDepth(depth) {
        this.depth = depth;
        this.left?.updateDepth(depth + 1);
        this.right?.updateDepth(depth + 1);
    }

    forEach(callback) {
        const items = [this.left, this.right];
        for (const item of items) {
            const value = item instanceof Node ? callback(item) : item.forEach(callback);
            if (value === true)
                return true;
        }
    }

    leftmostNode() {
        if (this.parent === null)
            return null;
        // while in left branch go up
        let target = this;
        while (target.parent !== null && target === target.parent.left) {
            target = target.parent;
        }
        if (target.parent === null)
            return null;
        target = target.parent.left;
        while (!(target instanceof Node)) {
            target = target.right;
        }
        return target;
    }

    rightmostNode() {
        if (this.parent === null)
            return null;
        let target = this;
        while (target.parent !== null && target === target.parent.right) {
            target = target.parent;
        }
        if (target.parent === null)
            return null;
        target = target.parent.right;
        while (!(target instanceof Node)) {
            target = target.left;
        }
        return target;
    }

    magnitude() {
        return 3 * this.left.magnitude() + 2 * this.right.magnitude();
    }

    toString() {
        return `[${this.left.toString()},${this.right.toString()}]`;
    }
}

class Node {
    constructor(value, parent) {
        this.value = value;
        this.parent = parent;
        this.depth = parent.depth + 1;
    }

    updateDepth(depth) {
        this.depth = depth;
    }

    magnitude() {
        return this.value;
    }

    toString() {
        return this.value.toString();
    }
}
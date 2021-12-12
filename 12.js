var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input12.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const edges = data.trim().replace(/\r/g, "").split("\n").map(x => x.split('-'));
    const graph = buildSimpleGraph(edges);
    console.log("1:", solve1(graph));
    console.log("2:", solve2(graph));
});

function buildSimpleGraph(edges) {
    const graph = {};
    for (const edge of edges) {
        const start = edge[0];
        const end = edge[1];
        if (!graph[start]) {
            graph[start] = [];
        }
        if (!graph[end]) {
            graph[end] = [];
        }
        if (end !== 'start' && start !== 'end')
            graph[start].push(end);
        if (start !== 'start' && end !== 'end')
            graph[end].push(start);
    }
    console.log(graph);
    return graph;
}

function solve1(graph, node = 'start', visited = new Set(['start'])) {
    if (node === 'end') {
        return 1;
    }
    let paths = 0;
    for (const newNode of graph[node]) {
        if (newNode === newNode.toLowerCase() && visited.has(newNode))
            continue;
        visited.add(newNode);
        paths += solve1(graph, newNode, visited);
        visited.delete(newNode);
    }
    return paths;
}

function solve2(graph, node = 'start', visited = new Set(['start']), double = undefined, path = []) {
    if (node === 'end') {
        return 1;
    }
    let paths = 0;
    for (const newNode of graph[node]) {
        const isLowerCase = newNode === newNode.toLowerCase();
        if (isLowerCase && visited.has(newNode)) {
            if (double !== undefined) {
                continue;
            }
            path.push(newNode);
            paths += solve2(graph, newNode, visited, newNode, path);
            path.pop();
        } else {
            visited.add(newNode);
            path.push(newNode);
            paths += solve2(graph, newNode, visited, double, path);
            path.pop();
            visited.delete(newNode);
        }
    }
    return paths;
}
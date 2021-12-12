var fs = require('fs');
var helpers = require('./helpers');

fs.readFile('input12.txt', 'utf8', function (err, data) {
    if (err) throw err;
    const edges = data.trim().replace(/\r/g, "").split("\n").map(x => x.split('-'));
    const graph = buildSimpleGraph(edges);
    console.log("1:", solve1(graph));
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
        graph[start].push(end);
        graph[end].push(start);
    }
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
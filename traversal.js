const ug = require('ug');

let graph = new ug.Graph();

// load graph from flat file into RAM
graph.load('./graph.ugd', function() {

    //find the hotel node, traverse the graph and get recommendations
    // get the closest 10 'hotel' nodes, at a minimum depth (distance) of 0
    let results = graph.closest(node, {
        compare: function(node) { return node.entity === 'hotel'; },
        minDepth: 0,
        count: 10
    });

// results is now an array of Paths, which are each traces from your starting node to your result node...
let resultNodes = result.map(function(path) {
    return path.end();
});

console.log(resultNodes); // render, whatever you'd like

});
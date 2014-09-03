'use strict';

var fs          = require('fs'),
    readline    = require('readline'),
    stream      = require('stream'),
    sort        = require('node-sort');


var train       = process.cwd() + '\\train.csv',
    test        = process.cwd() + '\\test.csv';


// see http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
var liner = new stream.Transform( { objectMode: true } );
var source = fs.createReadStream(train);
 

liner._transform = function (chunk, encoding, done) {
     var data = chunk.toString();
     if (this._lastLineData) data = this._lastLineData + data;
 
     var lines = data.split('\n');
     this._lastLineData = lines.splice(lines.length-1,1)[0];
 
     lines.forEach(this.push.bind(this));
     done();
}
 
liner._flush = function (done) {
     if (this._lastLineData) this.push(this._lastLineData);
     this._lastLineData = null;
     done();
}

console.log('Reading from...\n' + train + '\n');

source.pipe(liner);

var lineNo = 0;
var matrix = [];

liner.on('readable', function () {
     var line;
     
     while (line = liner.read()) {
        // do something with line
        lineNo += 1;

        if (lineNo === 1) continue; 

        else {

            var i = lineNo - 2; // starts at lineNo = 2, i = 0

            var data = line.split(',');

            var label       = data[0];
            var features    = data.slice(1);

            matrix[i] = features; 

            //console.log(lineNo + ':\t' + label + '\t' + features.slice(200,210));
        }
    }

    //console.log(matrix.length);
}); 


function distance(a, b) {
    // given two arrays
    // return euclidian distance
    // d = sqrt{ (x2 - x1)^2 + (y2 - y1)^2 + ... }

    if (a.length !== b.length) return 'Whoops! Give me two equal length arrays, please.';

    var innerSum = 0; 

    for (var i = 0; i < a.length; i++) {

        var curr = distance_helper(a[i], b[i]); 
        innerSum += curr; 
    }
    return Math.sqrt(innerSum);
};


function distance_helper(a, b) {
    // returns diff squared
    var diff = a - b; 
    return Math.pow(diff, 2); 
};


Array.matrix = function(m, n, initial) {
    var a, i, j, mat = []; 
    for (i = 0; i < m; i += 1) {
        a = [];
        for (j = 0; j < n; j += 1) {
            a[j] =  initial;
        }
        mat[i] = a;
    }
    return mat; 
}; 

var a = [4,-2,3];
var b = [3,3,4];
// console.log(distance(a, b));

var sample = [
    [0.2, 0.5, 0.6],
    [0.3, 0.4, 0.8],
    [-0.1, 0.25, 0.5]
];

function distance_matrix(mat) {
    var i, j, dist_mat = Array.matrix(mat.length, mat.length, 0);

    for (i = 0; i < mat.length; i+=1) {
        for (j = 0; j < mat.length; j+=1) {
            // console.log('i:\t' + mat[i]);
            // console.log('j:\t' + mat[j]); 
            // console.log('Dist: ' + distance(mat[i], mat[j]) + '\n'); 

            dist_mat[i][j] = distance(mat[i], mat[j]); 
        }
    }
    return dist_mat; 
}

var dist = distance_matrix(sample); 

console.log(dist + '\n'); 

var sorter = new sort(); 

console.log("Merge Sort:\n");
console.log(sorter.mergeSort(dist[0]));
console.log(sorter.mergeSort(dist[1]));
console.log(sorter.mergeSort(dist[2]));


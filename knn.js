'use strict';

var csv     = require('csv'); 
var train   = process.cwd() + '/train.csv';
var test    = process.cwd() + '/test.csv';


console.log('Reading from...\n' + train + '\n');

csv.from.path('/tmp/data.csv').on('data', console.log);
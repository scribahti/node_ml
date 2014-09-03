'use strict';

var fs          = require('fs'),
    readline    = require('readline'),
    stream      = require('stream');


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

liner.on('readable', function () {
     var line;
     
     while (line = liner.read()) {
        // do something with line
        lineNo += 1;

        if (lineNo === 1) continue; 

        else {

            var data = line.split(',');

            var label       = data[0];
            var features    = data.slice(1);

            console.log(lineNo + ':\t' + label + '\t' + features.slice(200,210));
        }
    }
})
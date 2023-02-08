const fs = require('fs');
const peg = require('pegjs');
const parser = require('./parser')

// read the input file
const input = fs.readFileSync(__dirname + '/index.txt', 'utf8');

// parse the input and print the result
const result = parser.parse(input);
console.log(result);

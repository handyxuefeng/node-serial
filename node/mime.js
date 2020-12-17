const path = require('path');
const mime = require('mime');
let a = mime.getType(path.resolve(__dirname, '11.jpeg'));
let b = mime.getType(path.resolve(__dirname, 'exlce.xlsx'));
let csv = mime.getType(path.resolve(__dirname, '11.csv'));
console.log(csv);
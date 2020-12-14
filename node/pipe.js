const path = require('path');
const fs = require('fs');
const fsw = fs.createReadStream(path.resolve(__dirname, '1.txt'), {
    highWaterMark: 4
});

const ws = fs.createWriteStream(path.resolve(__dirname, 'f.txt'));


fsw.pipe(ws)
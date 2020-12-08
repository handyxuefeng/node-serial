const path = require('path');
const fs = require('fs');

let arr = [];
let readStream = fs.createReadStream(path.resolve(__dirname, 'a.txt'), {
    flags: "r",
    encoding: null,
    autoClose: true,
    start: 0,
    highWaterMark: 3,  //每次读取3个字节
    mode: 0o666,
    end: 1000 //从索引0的位置读取到索引3的位置
});

//流监听数据
readStream.on('open', (fd) => {
    console.log('open-event=', fd);
});

//消费流数据，监听data事件时，会讲数据emit出来
readStream.on('data', (chunk) => {
    arr.push(chunk);
    console.log('data event=', chunk);
});



readStream.on('end', () => {
    console.log('end-event=', Buffer.concat(arr).toString());
});



//监听流的关闭
readStream.on('close', () => {
    console.log('close-event=');
});




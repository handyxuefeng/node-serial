
const path = require('path');
const fs = require('fs');

const WriteStream = require('./myWriteStream');

//创建一个可写流
let ws = new WriteStream(path.resolve(__dirname, 'e.txt'), {
    flags: "w",
    encoding: 'utf-8',
    start: 0,
    highWaterMark: 2,  //每次写入4个字节， 默认期望是写入16k

});
let index = 0;
let isCanWriting = true;
function writeFile() {
    while (index < 10) {
        isCanWriting = ws.write((index++).toString());
        if (!isCanWriting) {
            break;
        }
        if (index >= 10) {
            ws.end('write is finish'); // end方法内部调用了write + close
        }
    }
}

ws.on('drain', () => {
    console.log('预设被消耗完了,可以再继续写');
    writeFile();
});
ws.on('close', () => {
    console.log('文件写入已经关闭');
})


writeFile();







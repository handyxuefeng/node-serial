const fs = require('fs');
const path = require('path');

//大文件的边读边写步骤
//1.先打开文件
//2.利用Buffer读取部分文件
//3.把buffer中的内容写入到指定文件

// r 读操作， w 写操作   a 文件追加操作

let buffer = Buffer.alloc(3);// 在内存中预留3个位置
fs.open(path.resolve(__dirname, "a.txt"), 'r', (err, fd) => {

    // fd 可以用来描述要对这个文件做什么操作
    // 读取文件(读取位置) 从buffer的第0个位置写入，写3个
    fs.read(fd, buffer, 0, 3, 0, (err, bytesRead) => {
        //bytesRead 表示真实读取到的个数

        //将读取的结果写到到指定的文件
        fs.open(path.resolve(__dirname, "b.txt"), 'w', (err, wfd) => {

            fs.write(wfd, buffer, 0, buffer.length, 0, (err, written) => {
                if (err) return err;
                fs.close(fd, () => { }); //关闭读的文件流
                fs.close(wfd, () => { })
            });
        });

    })

});

//2.下面是先读完，再慢慢写入，缺点就是一下子读取到内存中，大文件的话，会导致内存溢出
let step = 3;
fs.readFile(path.resolve(__dirname, 'a.txt'), (err, data) => {

    //data = <Buffer 61 62 63 64 65 66 67 68 69 6a 6b 6c 6d 6e 6f 70 71 72 73 74 75 76 77 78 79 7a>
    let offset = 0;
    let current = 0;
    let total = 0


    fs.open(path.resolve(__dirname, "c.txt"), 'w', (err, wfd) => {
        let currentBuffer;
        function readAndWrite() {
            if (data.length >= 3) {
                currentBuffer = data.slice(total, total + step);
            }
            else {
                currentBuffer = data.slice(total);
            }
            //console.log('currentBuffer = ', currentBuffer);
            fs.write(wfd, currentBuffer, 0, currentBuffer.length, total, (err, written) => {
                if (err) return err;
                total += step;
                if (total > data.length) {
                    fs.close(wfd, () => { })
                } else {
                    readAndWrite()
                }
            });
        }
        readAndWrite();

    });
});



//边读边写

let BUFFER_SIZE = 3;
let writeOffset = 0;
let readOffset = 0;
let bufferApply = Buffer.alloc(BUFFER_SIZE);

fs.open(path.resolve(__dirname, "a.txt"), 'r', (err, fd) => {
    // fd 可以用来描述要对这个文件做什么操作
    fs.open(path.resolve(__dirname, "d.txt"), 'w', (err, wfd) => {
        function writeFile() {
            //bytesRead 实际读到的个数
            fs.read(fd, bufferApply, 0, BUFFER_SIZE, readOffset, function (err, bytesRead) {
                //读取到的内容
                if (bytesRead > 0) {
                    console.log('读取的buffer=', bufferApply);
                    fs.write(wfd, bufferApply, 0, BUFFER_SIZE, writeOffset, function (err, written) {
                        readOffset += bytesRead;
                        writeOffset += written;
                        writeFile();
                    });
                }
                else {
                    console.log('----finish');
                    fs.close(fd, () => { })
                    fs.close(wfd, () => { })
                }
            });
        }
        writeFile();

    });
});







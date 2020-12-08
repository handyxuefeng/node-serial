let str = '上';

let arr = Buffer.from(str);
console.log(arr);

//<Buffer e4 b8 8a>

let str1 = (0xe4).toString(2); //11100100

let str2 = (0xb8).toString(2);  //10111000

let str3 = (0x8a).toString(2);  //10001010

//console.log('str1', str1, 'str2', str2, 'str3', str3);

// 3 * 8 => 4 * 6
let newStr = `00111001 00001011 00100010 00001010`;

let s1 = '0b00111001';  // 十进制的 57
let s2 = '0b00001011';  // 十进制的 11
let s3 = '0b00100010'; // 十进制的 34
let s4 = '0b00001010'; // 十进制的 10

console.log(parseInt(0b00111001), parseInt(0b00001011), parseInt(0b00100010), parseInt(0b00001010));

let base64Str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

base64Str += base64Str.toLowerCase();
base64Str += '0123456789+/';
let res = base64Str[57] + base64Str[11] + base64Str[34] + base64Str[10];
console.log(`中文${str}转换为base64编码为:${res}`);

console.log(Buffer.from('上').toString('base64'));

const fs = require('fs');
const path = require('path');
const iconvLite = require('iconv-lite');
const { off } = require('process');
const r = fs.readFileSync(path.resolve(__dirname, 'gbk.txt'));


//把GBK 转换为 utf8

const content = iconvLite.decode(r, 'gbk'); //调用这个方法把gbk进行转化

console.log('gbk to utf8', content);


//--------Buffer的concat方法

let buf1 = Buffer.from('中国');
let buf2 = Buffer.from('上海')

let buf3 = Buffer.concat([buf1, buf2], 30);
console.log(buf3);


let bufStr = Buffer.from('中国我爱你爱1');
Buffer.prototype.split = function (sep) {
    let current = 0;
    let offset = 0;
    let arr = [];
    let speLength = Buffer.from(sep).length;
    while ((current = this.indexOf(sep, offset)) != -1) {
        console.log('current = ', current);
        arr.push(this.slice(offset, current));
        offset = current + speLength;
    }
    arr.push(this.slice(offset));

    return arr;
}

let sep = '爱';
let newArr = bufStr.split(sep);
console.log('newArr = ', newArr.toString());









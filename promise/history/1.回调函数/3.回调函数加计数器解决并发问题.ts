const fs = require('fs');
const path = require('path');
const obj = {};
let times = 2;

interface IPerson {
    age: number,
    name: string
}

/**
 * 通过计算器的模式解决并发问题
 * @param key 
 * @param data 
 */
const after = (key, data) => {
    times--;
    obj[key] = data;
    if (times == 0) {
        console.log(obj);
    }
}

/**
 * 通过高阶函数异步回调解决并发
 * @param restTimes 
 * @param cb 
 */
let exec = (restTimes: number, cb: Function) => {
    let temp = {};
    return (key: string, val: number | string) => {
        restTimes--;
        temp[key] = val;
        if (restTimes == 0) {
            cb(temp);
        }
    }
}

let fn = exec(times, (obj: IPerson) => {
    console.log('temp = ', obj);
})

fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', (err, data) => {
    after("age", data); //
    fn("age", data);
});

fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', (err, data) => {
    after('name', data);
    fn("name", data);
});


export { }
const fs = require('fs').promises;
const path = require('path');

function* readAge(filePath) {
    let ageFilename = yield fs.readFile(filePath, 'utf8');
    let ageContext = yield fs.readFile(path.resolve(__dirname, ageFilename), 'utf8');

    return ageContext;
};


/*
let promise1 = it.next(); // { value: Promise { <pending> }, done: false }
Promise.resolve(promise1.value).then(data1 => {
    let obj2 = it.next(data1);
    Promise.resolve(obj2.value).then(data2 => {
        let obj3 = it.next(data2);
        console.log('obj3=', obj3);

    })
});
上面的代码，就可以封装，封装之后的代码就是co库
*/

function co(it: any) {
    return new Promise((resolve, reject) => {
        function next(val: unknown) {
            console.log('val= ', val);
            let { value, done } = it.next(val);
            if (done) {
                resolve(value);
            }
            else {
                Promise.resolve(value).then((data) => {
                    next(data);
                }, reject);
            }
        }
        next('');
    });
}


let it = readAge(path.resolve(__dirname, './name.txt'));

let promise = co(it);

promise.then((data) => {
    console.log('result = ', data);
});







export { }
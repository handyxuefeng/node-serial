
const fs = require('fs').promises;
const path = require('path');

function* readAge(filePath) {
    let ageFilename = yield fs.readFile(filePath, 'utf8');
    let ageContext = yield fs.readFile(path.resolve(__dirname, ageFilename), 'utf8');

    return ageContext;
};

function co(it) {
    return new Promise((resolve, reject) => {
        function next(val) {
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
        next();
    });
}


let it = readAge(path.resolve(__dirname, './name.txt')); //

let promise = co(it);
promise.then((data) => {
    console.log('result = ', data);
});







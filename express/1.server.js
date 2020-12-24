//const express = require('express'); //官方的
const express = require('./express-principle');
const app = express();
const port = 9999;
const fs = require('fs');
const path = require('path');

const obj = { t: Date.now() * 1 }

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(fs.readFileSync(path.resolve(__dirname, 'public/index.html')));
});

app.post('/', (req, res, next) => {
    console.log(11);
}, (req, res, next) => {
    console.log(22);
}, (req, res, next) => {
    console.log(33);
})



const methods = ['get', 'post', 'put', 'delete'];

methods.forEach(method => {
    app[method]('/add', (req, res, next) => {
        console.log('method = ', method, '/add');
        res.end(JSON.stringify({ ...obj, method }));
    });
    app[method]('/login',
        (req, res, next) => {
            console.log('1');
            next();
            console.log('4');
        },
        (req, res, next) => {
            console.log('2');
            next();
            console.log('5');
        },
        (req, res, next) => {
            console.log('3');
            next();
            console.log('6');
        }
    );
    app[method]('/login', (req, res, next) => {
        res.end(JSON.stringify({ ...obj, method }));
    })

})









app.listen(port, () => {
    console.log(`${port}端口已经启动。。。。。。。`);
});
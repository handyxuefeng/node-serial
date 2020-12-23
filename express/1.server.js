//const express = require('express'); //官方的
const express = require('./express-principle');
const app = express();
const port = 9999;

// app.get('/', (req, res) => {
//     res.setHeader('Content-Type', 'text/html; charset=utf-8');
//     res.end('首页');
// });

// app.get('/add', (req, res, next) => {
//     console.log('add');
//     res.end('add');
// });
app.get('/login',
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
app.get('/login', (req, res, next) => {
    res.end('login')
})




app.listen(port, () => {
    console.log(`${port}端口已经启动。。。。。。。`);
});
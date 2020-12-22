//const express = require('express'); //官方的
const express = require('./express-principle');
const app = express();
const port = 9999;
const setHttpHeaderMiddleWare = function (res) {
    res && res.setHeader('Content-Type', 'text/html; charset=utf-8');
}



app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('首页');
});

app.get('/add', (req, res, next) => {
    console.log('add');
    res.end('add');
});




app.listen(port, () => {
    console.log(`${port}端口已经启动。。。。。。。`);
});
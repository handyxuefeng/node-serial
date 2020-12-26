//const express = require('express'); //官方的
const express = require('./express-principle');
const app = express();
const url = require('url');
const port = 1234;
const pathToRegExp = require('path-to-RegExp')


app.use("/", function (req, res, next) {
    let urlParse = url.parse(req.url);
    req.path = urlParse.pathname;
    req.query = urlParse.query;
    res.send = function (data) {
        if (typeof data === 'object') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        }
        else {
            res.setHeader('Content-Type', "text/html;charset=utf-8");
            res.end(data);
        }
    }
    next();
})
app.get('/', (req, res, next) => {
    res.send('首页');
});

/**
 * 带参数的路由
 * http://localhost:1234/user/:id/:name:/hxf
 * http://localhost:1234/user/A0001/jackie/22/hxf
 * {id:A0001,name:"jackie","age":22}
 */
app.get('/user/:id/:name/hxf', function (req, res, next) {
    console.log('req.params = ', req.params);
    res.send(req.params);
});



app.listen(port, () => {
    console.log(`${port}端口已经启动。。。。。。。`);
});
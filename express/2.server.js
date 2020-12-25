const express = require('express'); //官方的
const app = express();
const port = 3000;
const url = require('url');



// app.use("/", function (req, res, next) {
//     let urlParse = url.parse(req.url);
//     req.path = urlParse.pathname;
//     req.query = urlParse.query;
//     res.send = function (data) {
//         if (typeof data === 'object') {
//             res.setHeader('Content-Type', 'application/json');
//             res.end(JSON.stringify(data));
//         }
//     }
//     next();
// })

app.use(function (req, res, next) {
    let arr = [];
    req.on('data', (chunk) => {
        arr.push(chunk);
    });
    req.on('end', () => {
        req.body = Buffer.concat(arr).toString();
        //next('出错了111111');
        next();
    })

});

app.use("/user", function (req, res, next) {
    req.user = '88'
    next();
})

app.get("/", function (req, res) {
    res.end('home');
})
app.get('/user', function (req, res, next) {
    res.end('/user');
});
app.get('/user/add', function (req, res, next) {
    console.log('user.add = ', req.user);
    next('路由出错了');
    res.end('/user / add')

});
app.get('/user/remove', function (req, res, next) {
    console.log('user.remove = ', req.user);
    res.send({ a: 1, b: 2, c: 2 });
});


//express 添加统一错误处理中间件，都是在app.listen之前，所有请求之后
app.use(function (err, req, res, next) {
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.end(`error = ${err}`);
})


app.listen(port, () => {
    console.log(`${port}端口已经启动。。。。。。。`);
});
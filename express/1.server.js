//const express = require('express'); //官方的
const express = require('./express-principle');
const app = express();
const port = 9999;
const fs = require('fs');
const path = require('path');

const obj = { t: Date.now() * 1 };


app.use(function (req, res, next) {
    let arr = [];
    req.on('data', (chunk) => {
        arr.push(chunk);
    });
    req.on('end', () => {
        req.body = Buffer.concat(arr).toString();
        //next('出错了111111');
        next();
    });

});



app.use("/user", function (req, res, next) {
    console.log('中间件中定义的/user');
    req.user = '88'
    next();
});

app.get('/user', function (req, res, next) {
    res.end('/user');
});
app.get('/user/add', function (req, res, next) {
    console.log('user.add = ', req.user);
    next('/user/add接口请求时，查询数据库异常');
    res.end('/user/add')

});
app.get('/user/remove', function (req, res, next) {
    console.log('user.remove = ', req.user);
    res.send({ a: 1, b: 2, c: 2 });
});


app.post('/article', function (req, res, next) {
    res.end('article');
});


//express 添加统一错误处理中间件，都是在app.listen之前，所有请求之后
app.use(function (err, req, res, next) {
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.end(`error = ${err}`);
})




// app.get('/', (req, res) => {
//     res.setHeader('Content-Type', 'text/html; charset=utf-8');
//     res.end(fs.readFileSync(path.resolve(__dirname, 'public/index.html')));
// });

// app.post('/', (req, res, next) => {
//     console.log(11);
// }, (req, res, next) => {
//     console.log(22);
// }, (req, res, next) => {
//     console.log(33);
// })



// const methods = ['get', 'post', 'put', 'delete'];

// methods.forEach(method => {
//     app[method]('/add', (req, res, next) => {
//         console.log('method = ', method, '/add');
//         res.end(JSON.stringify({ ...obj, method }));
//     });
//     app[method]('/login',
//         (req, res, next) => {
//             console.log('1');
//             next();
//             console.log('4');
//         },
//         (req, res, next) => {
//             console.log('2');
//             next();
//             console.log('5');
//         },
//         (req, res, next) => {
//             console.log('3');
//             next();
//             console.log('6');
//         }
//     );
//     app[method]('/login', (req, res, next) => {
//         res.end(JSON.stringify({ ...obj, method }));
//     })

// })









app.listen(port, () => {
    console.log(`${port}端口已经启动。。。。。。。`);
});
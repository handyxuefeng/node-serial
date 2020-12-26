/**
 * Express 中二级路由的实现
*/
//const express = require('express');
const express = require('./express-principle');
const app = express();
const port = 1234;

const userRouter = require('./routes/user'); //导入用户路由
const articleRouter = require('./routes/article'); //导入文章的路由


app.use('/user', userRouter);
app.use('/article', articleRouter);

app.listen(port, () => {
    console.log(`${port}端口已经启动。。。。。。。`);
});

app.use('/user', function (req, res, next) {

});


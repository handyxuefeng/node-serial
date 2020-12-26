const express = require('../express-principle');

const userRouter = express.Router();

userRouter.use("/", function (req, res, next) {
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    next();
});

userRouter.get('/add', function (req, res, next) {
    res.end('二级路由/user/add');
});


userRouter.get('/remove', function (req, res, next) {
    res.end('二级路由/user/remove');
});


let UserChildRouter = express.Router();
UserChildRouter.get('/add', function (req, res, next) {
    res.end('child add')
})
UserChildRouter.get('/remove', function (req, res, next) {
    res.end('child remove')
})
userRouter.use('/child', UserChildRouter)


exports = module.exports = userRouter;

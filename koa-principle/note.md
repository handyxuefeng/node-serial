## express 和 koa 对比

- express es5 来写的 并且靠回调的
- koa es6 来写的 靠的是 promise
- express 内置很多了中间件 路由系统 (express.static())， koa 内核非常小，用起来更灵活
- express 扩展 req 和 res , koa 封装了 ctx 来进行扩展
- koa1.0 generator -》 async + await
- express 和 koa 的中间件的区别 （一个支持 promise 一个不支持）

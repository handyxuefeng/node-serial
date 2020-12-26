//const Koa = require('koa');
const Koa = require('./koa');
const app = new Koa();
const port = 3000;

// response
app.use(ctx => {

    //request   response   app   req   res   originalUrl   state
    //ctx.body = keys.join('   ');
    console.log('ctx.req.url=', ctx.req.url);
    console.log('ctx.request.req.url', ctx.request.req.url);
    // console.log('ctx.request.req.url', ctx.request.req.url);
    // console.log('ctx.url', ctx.url);


    console.log('ctx.request.path', ctx.request.path);
    console.log('ctx.path', ctx.path);
    // console.log('ctx.request.req.path', ctx.request.req.path);

    // console.log('ctx.req.path', ctx.req.path);
});



// app.use(function (req, res) {
//     res.end('ok');
// });

app.listen(port, () => {
    console.log(`${port}端口已经启动........`);
});
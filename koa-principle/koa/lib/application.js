const EventEmitter = require('events');
const http = require('http');
const context = require('./context');
const requset = require('./request');
const response = require('./response');


class Koa extends EventEmitter {
    constructor(params) {
        super();
        /**
         * let app = new Koa();
         * 为了确保每个app上的context,request,response都是独立的，则全部Object.create来创建，
           这样不破坏context，request,response的原型上的方法和属性
         */
        this.context = Object.create(context); //每个app的context都是独立的
        this.request = Object.create(requset);
        this.response = Object.create(response);
        this.middlewares = [];
    }
    use(middleware) {
        this.middlewares.push(middleware);
    }
    createContext(req, res) {
        let ctx, request, response;
        /**
         * 为了确保同一个app的不同路由的请求的上下文context,request,response都保持独立
         * (1) http://localhost:3000/add  
         * (2) http://localhost:3000/remove
         * 为了保证请求(1)和(2)两个请求各自的context,request,response都保持独立，则要再次通过Object.create来创建
        */
        try {
            ctx = Object.create(this.context);
            request = Object.create(this.request);
            response = Object.create(this.response);
            //console.log(ctx.__proto__.__proto__ === context);

            //处理http上req的赋值给ctx的req,request对象
            ctx.req = req;
            ctx.request = request;
            ctx.request.req = req;

            //把http上res的赋值给ctx的res,response对象
            ctx.res = res;
            ctx.response = response;
            ctx.response.res = res;

        } catch (error) {
            console.log('error=', error.message);
        }
        return ctx;
    }
    compose(ctx) {
        let index = -1;
        const dispatch = (i) => {
            if (i <= index) return Promise.reject('next方法被调用多次了');
            index = i;
            if (i === this.middlewares.length) return Promise.resolve();
            let middleware = this.middlewares[i];
            let next = dispatch(i + 1);
            return Promise.resolve(middleware(ctx, next));
        }
        return dispatch(0);
    }
    handlerRequest(req, res) {

        let ctx = this.createContext(req, res);  //创建下文对象

        this.compose(ctx).then(() => {
            // ---------复杂逻辑-----------------
            if (ctx.body) {
                res.end(ctx.body);
            } else {
                res.end('Not Found')
            }
        }).catch(err => {
            this.emit('error', err)
        })


        // this.middleware(ctx); //这个函数给ctx.body赋值
        // if (ctx.body) {
        //     res.end(ctx.body);
        // }
        // else {
        //     res.end('Not Found')
        // }

    }
    listen() {
        const server = http.createServer(this.handlerRequest.bind(this));
        // const server = http.createServer((req, res) => {
        //     this.handlerRequest.call(this, req, res); //页面请求处理
        // });
        server.listen(...arguments);
    }
}

exports = module.exports = Koa;
const url = require('url');
const Layer = require('./layer');
const Route = require('./route');
const methods = require('methods'); //引入express中的methods包

function Router() {
    this.routes = [];
}

/**
 * 增加中间件功能
 * @param {*} path  ="/"
 * @param  {...any} handlers  = [Function,Funciton]
 * app.use("/",function(req,res,next){})
 * app.use(function(req,res,next){})
 */
Router.prototype.use = function (path, ...handlers) {
    if (!handlers[0]) {
        handlers.push(path);
        path = '/';
    }
    handlers.forEach(handler => {
        let layer = new Layer(path, handler);
        layer.method = 'use'; //中间件方法都为use
        this.routes.push(layer);
    });
    console.log("中间件的路由也加入到路由中=", this.routes);

}

Router.prototype.passHandlersToRoute = function (path, method) {
    //1.创建一个route
    let route = new Route();

    //2.创建一个Layer，存放请求的path,和route.dispatch方法
    let outLayer = new Layer(path, route.dispatch.bind(route));
    outLayer.route = route;
    outLayer.method = method;
    this.routes.push(outLayer); //
    console.log("请页面请求路由=", this.routes);

    return route;
}

/**
 * 
 * @param {*} path 
 * @param {*} hanlders  hanlders = [ [Function], [Function], [Function] ]
 */
methods.forEach(method => {
    Router.prototype[method] = function (path, hanlders) {
        let route = this.passHandlersToRoute(path, method); //Router.route()
        route[method](hanlders); //
    }
});




//请求进入后，开始匹配路由
Router.prototype.matchHandler = function (req, res, matchNonePath) {
    let { pathname } = url.parse(req.url);
    let requestMethod = req.method.toLowerCase();
    let idx = 0;
    const next = (err) => {
        if (idx >= this.routes.length) return matchNonePath(req, res);
        let outLayer = this.routes[idx++];
        //如果出错了，则要开始找统一错误处理的中间件函数
        if (err) {
            //中间件的特点就是outLayer.route =null
            if (outLayer.route == null) {
                /**
                 * 统一错误处理中间件的参数必须是4个，第一个参数就是err
                 *  express 添加统一错误处理中间件，都是在app.listen之前，所有请求之后
                    app.use(function (err, req, res, next) {
                        res.setHeader('Content-Type', 'text/html;charset=utf-8');
                        res.end(`error = ${err}`);
                    })
                 */
                if (outLayer.handler.length === 4) { //有4个参数表示的就是统一错误处理的中间件
                    outLayer.handler(err, req, res, next)
                }
                else {
                    next(err);
                }
            }
            else { //表示是正常的路由请求
                next(err);
            }
        }
        else {
            //匹配到请求url的话，这里匹配是模糊匹配的，如 /user 可以匹配到/ 或者 /user
            if (outLayer.matchRequest(pathname)) {
                //outLayer.route = null,表示的是中间件函数，没有内层的layer，则直接执行
                if (outLayer.route == null) {
                    // 参数个数==4，表示是的Express的统一错误处理中间件
                    if (outLayer.handler.length === 4) {
                        next(err);
                    }
                    else {
                        outLayer.handler_Request(req, res, next); //route.dispatch
                    }

                }
                else {
                    if (outLayer.route.methods[requestMethod]) {
                        outLayer.handler_Request(req, res, next); //route.dispatch
                    }
                    else {
                        next();
                    }
                }
            }
            else {
                next();
            }
        }


    }
    next();
}

exports = module.exports = Router;
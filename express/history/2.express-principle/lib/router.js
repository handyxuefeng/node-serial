const url = require('url');
const Layer = require('./layer');
const Route = require('./route');
const methods = require('methods'); //引入express中的methods包

function Router() {
    this.routes = [];
}

Router.prototype.passHandlersToRoute = function (path) {
    //1.创建一个route
    let route = new Route();

    //2.创建一个Layer，存放请求的path,和route.dispatch方法
    let outLayer = new Layer(path, route.dispatch.bind(route));
    outLayer.route = route;
    this.routes.push(outLayer); //

    return route;
}

/**
 * 
 * @param {*} path 
 * @param {*} hanlders  hanlders = [ [Function], [Function], [Function] ]
 */


methods.forEach(method => {
    Router.prototype[method] = function (path, hanlders) {
        let route = this.passHandlersToRoute(path); //Router.route()
        route[method](hanlders); //
    }
});




//请求进入后，开始匹配路由
Router.prototype.matchHandler = function (req, res, matchNonePath) {
    let { pathname } = url.parse(req.url);
    let requestMethod = req.method.toLowerCase();
    let idx = 0;
    const next = () => {
        if (idx >= this.routes.length) return matchNonePath(req, res);
        let outLayer = this.routes[idx++];
        //如果请求路径匹配到了，则执行路径对应的函数
        if (outLayer.matchRequest(pathname) && outLayer.route.methods[requestMethod]) {
            outLayer.handler_Request(req, res, next); //route.dispatch
        }
        else {
            next();//递归匹配下一个路由
        }

    }
    next();
}

exports = module.exports = Router;
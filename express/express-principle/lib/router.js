const url = require('url');
const Layer = require('./layer');
const Route = require('./route');
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
Router.prototype.get = function (path, hanlders) {
    console.log('hanlders =', hanlders);

    let route = this.passHandlersToRoute(path); //Router.route()
    route.get(hanlders); //
}




//请求进入后，开始匹配路由
Router.prototype.matchHandler = function (req, res, matchNonePath) {

    let { pathname } = url.parse(req.url);
    //console.log('pathname = ', pathname);
    let idx = 0;
    const next = () => {

        if (idx >= this.routes.length) return matchNonePath(req, res);
        let outLayer = this.routes[idx++];

        //如果请求路径匹配到了，则执行路径对应的函数
        if (outLayer.path === pathname) {
            outLayer.handler(req, res, next); //route.dispatch
        }
        else {
            next();//递归匹配下一个路由
        }

    }
    next();









    // for (let i = 0; i < this.routes.length; i++) {
    //     let item = this.routes[i];
    //     let path = item.path;
    //     let method = item.method.toLowerCase();
    //     let hanlder = item.hanlder;
    //     console.log('path = ', path, 'pathname = ', pathname, 'method = ', method, 'requestMethod = ', requestMethod);
    //     if (path === pathname && method === requestMethod) {
    //         return hanlder(req, res);
    //     }
    // }
    // //没有匹配到路由时，执行传递过来的兜底输出函数
    // matchNonePath(req, res);

}

exports = module.exports = Router;
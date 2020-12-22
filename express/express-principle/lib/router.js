const url = require('url');
function Router() {
    this.routes = [];
}

Router.prototype.get = function (path, hanlder) {
    this.routes.push({
        path,
        method: "get",
        hanlder
    });
}

Router.prototype.matchHandler = function (req, res, matchNonePath) {

    let { pathname } = url.parse(req.url);
    let requestMethod = req.method.toLowerCase();
    for (let i = 0; i < this.routes.length; i++) {
        let item = this.routes[i];
        let path = item.path;
        let method = item.method.toLowerCase();
        let hanlder = item.hanlder;
        console.log('path = ', path, 'pathname = ', pathname, 'method = ', method, 'requestMethod = ', requestMethod);
        if (path === pathname && method === requestMethod) {
            return hanlder(req, res);
        }
    }
    //没有匹配到路由时，执行传递过来的兜底输出函数
    matchNonePath(req, res);

}

exports = module.exports = Router;
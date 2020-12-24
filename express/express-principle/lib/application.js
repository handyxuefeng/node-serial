const http = require('http');
const url = require('url');
const Router = require('./router');
const methods = require('methods'); //引入express中的methods包


//初始化时，默认一个路由系统
function Application() {
    this._router = new Router();
}

//get方法的

methods.forEach(method => {
    Application.prototype[method] = function (path, ...handlers) {
        this._router[method](path, handlers);
    }
});



Application.prototype.listen = function (port, handler) {
    //表示路由没有匹配到，则执行兜底函数
    const matchNonePath = (req, res) => {
        let { pathname } = url.parse(req.url);
        let method = req.method.toLowerCase();
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.end(`接口的 ${pathname} 的 ${method} 方法 没有定义`);
    };


    //页面的请求的入口
    const server = http.createServer((req, res) => {
        this._router.matchHandler(req, res, matchNonePath);
    });


    server.listen(port, (...args) => {
        handler(...args)
    });
}






exports = module.exports = Application;
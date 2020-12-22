const http = require('http');
const url = require('url');
const Router = require('./router');
const mime = require('mime');

//初始化时，默认一个路由系统
function Application() {
    this._router = new Router();
    this.res = null;
}

//get方法的
Application.prototype.get = function (path, handler) {
    this._router.get(path, handler);
}

//post方法
Application.prototype.post = function (path, handler) {

}

Application.prototype.listen = function (port, handler) {
    //表示路由没有匹配到，则执行兜底函数
    const matchNonePath = (req, res) => {
        let { pathname } = url.parse(req.url);
        let method = req.method.toLowerCase();
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.end(`接口的 ${pathname} 的 ${method} 方法 没有定义`);
    };
    const server = http.createServer((req, res) => {
        this._router.matchHandler(req, res, matchNonePath);
    });
    server.listen(port, (...args) => {
        handler(...args)
    });
}






exports = module.exports = Application;
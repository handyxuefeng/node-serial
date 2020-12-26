
const { pathToRegexp } = require("path-to-regexp");

function Layer(path, handler) {
    this.path = path;
    this.keys = [];
    //将定义好的/user/:id/:name/hxf路由转换为正则
    if (this.path != '*') {
        this.pathToReg = pathToRegexp(this.path, this.keys);  //将请求路由转换正则
        //console.log(this.pathToReg, this.keys);
    }
    this.handler = handler;
    this.method = '';
    this.route = null;
    this.params = {}; //用来保存/user/:id/:name/hxf 这种方式匹配到路由，的参数
}
/**
 * app.use("/user")
 * @param {*} pathname  ="/user/add"
 */
Layer.prototype.matchRequest = function (pathname) {
    // return this.path === pathname;
    if (this.path === pathname) {
        return true;
    }

    //中间件只有开头就行，route=null,表示是中间件传入进来的path
    if (this.route === null) {
        if (this.path === '/') { //可以匹配任何路径
            return true;
        }
        return pathname.startsWith(this.path + '/')
    }
    else {
        //将用户的请求路由pathname 和 正则进行匹配
        // let matches = pathname.match(this.pathToReg);
        //console.log('matches = ', matches);
        console.log(pathname, '=-', this.pathToReg);
        //如果请求路径能够匹配的到
        if (this.pathToReg.test(pathname)) {
            let [, ...matches] = pathname.match(this.pathToReg);
            this.keys.forEach((item, idx) => {
                this.params[item.name] = matches[idx];
            });
            console.log('this.params = ', this.params);
            return true;
        }
        else {
            return false;
        }

    }


    return false;
}
Layer.prototype.handler_Request = function (req, res, next) {
    this.handler(req, res, next);
}



exports = module.exports = Layer;


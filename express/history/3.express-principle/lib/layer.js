function Layer(path, handler) {
    this.path = path;
    this.handler = handler;
    this.method = '';
    this.route = null;
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
    return false;
}
Layer.prototype.handler_Request = function (req, res, next) {
    this.handler(req, res, next);
}



exports = module.exports = Layer;


function Layer(path, handler) {
    this.path = path;
    this.handler = handler;
    this.method = '';
    this.route = null;
}

Layer.prototype.matchRequest = function (pathname) {
    return this.path === pathname;
}
Layer.prototype.handler_Request = function (req, res, next) {
    this.handler(req, res, next);
}



exports = module.exports = Layer;


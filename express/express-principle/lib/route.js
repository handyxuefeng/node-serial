const Layer = require("./layer");
function Route() {
    this.stack = [];
}

/**
 * 
 * @param {*} handlers = [ [Function], [Function], [Function] ]
 */
Route.prototype.get = function (handlers) {
    handlers.forEach(hander => {
        let innerLayer = new Layer('*', hander);
        innerLayer.method = 'get';
        this.stack.push(innerLayer);
    });
}

Route.prototype.dispatch = function (req, res, out) {

    let requestMethod = req.method.toLowerCase();
    let idx = 0;
    const next = () => {
        if (idx > this.stack.length) return out(req, res);
        let innerLayer = this.stack[idx++];
        if (innerLayer && requestMethod === innerLayer.method) {
            innerLayer.handler(req, res, next);
        }
        else {
            next();
        }
    }
    next();
}


exports = module.exports = Route;
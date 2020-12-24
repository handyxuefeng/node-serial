const Layer = require("./layer");
const methods = require('methods'); //引入express中的methods包
function Route() {
    this.stack = [];
    this.methods = {};
}

/**
 * 
 * @param {*} handlers = [ [Function], [Function], [Function] ]
 */
methods.forEach(method => {
    Route.prototype[method] = function (handlers) {
        handlers.forEach(hander => {
            let innerLayer = new Layer('*', hander);
            innerLayer.method = method;
            this.methods[method] = true;
            this.stack.push(innerLayer);
        });
    }

})

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} out = 外层next
 */
Route.prototype.dispatch = function (req, res, outNext) {

    let requestMethod = req.method.toLowerCase();
    let idx = 0;
    const innerNext = () => {
        if (idx >= this.stack.length) return outNext(req, res); //内层匹配到的handler执行完之后，跳出
        let innerLayer = this.stack[idx++];
        if (innerLayer && requestMethod === innerLayer.method) {
            innerLayer.handler_Request(req, res, innerNext);
        }
        else {
            innerNext();
        }
    }
    innerNext();
}


exports = module.exports = Route;
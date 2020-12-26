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
    const innerNext = (err) => {
        //如果有err，说明出错了，要去执行在外层定义的错误中间件函数执行
        if (err) {
            return outNext(err);
        }
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
let proto = {};
proto.use = function () {
    console.log('原型上的use方法');
}
proto.hander = function () {

}

function Router() {
    let router = function (req, res, next) {

    }
    router.stack = [];
    router.isFunction = true;
    router.__proto__ = proto;
    return router;
}

let router = new Router;
console.log(router.use);

const ctx = {};

/*
__defineGetter__和 __defineSetter__是很早的给对象扩展属性的方法，现在已经可以使用
Object.defineProperty或者 Proxy来代替
ctx.__defineGetter__("url", function () {
    return this.request.url;
});

ctx.__defineGetter__('path', function () {
    return this.request.path;
});
*/


function defineGetter(target, key) {
    ctx.__defineGetter__(key, function () {
        return this[target][key];
    });
}

function defineSetter(target, key) {
    ctx.__defineSetter__(key, function (value) {
        this[target][key] = value;
    })
}
defineGetter("request", "url");
Object.defineProperty(ctx, "path", {
    get() {
        return this.request.path
    }
});




defineGetter('response', 'body');
defineSetter('response', 'body');



module.exports = ctx;
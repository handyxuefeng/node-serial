declare global {
    interface Function {
        before: (cb: Function) => Function;
    }
}

/**
 *  高阶函数：函数的参数或者或者返回值是一个函数
*/
Function.prototype.before = function (cb: Function) {
    return (...args: any[]) => {
        cb();
        this(...args);
    }
}

function core() {
    console.log('this is core method', arguments);
}
let newFun = core.before(() => {
    console.log('call before');
});
newFun(1, 2, 3, 4);

export { }

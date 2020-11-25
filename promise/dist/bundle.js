'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

/**
 Promise 解决的问题:
 * 1. promise  解决多个异步并行执行，最终得到所有的结果
 * 2. 异步嵌套调用问题

 Promise的特征
 * 1.每个Promise 都有三个状态, Pending(等待)，fulfilled(成功)，rejected(拒绝)
 * 2.每个Promise 都有一个then方法
 * 3.new Promise 后都会立即执行
 * 4.then方法里面有两个回调函数作为参数，一个成功的回调，一个失败的回调
 * 5.Promise的状态只能从pending-->fulfilled(等待-->成功) 或者 pending-->rejected(等待-->失败)
 * 6.Promise里面使用发布订阅模式，把then方法传入的成功回调和失败回调都订阅到对应数组中
 * 7.上一个then方法走到会走到下一个then方法的成功回调中的情况:
 *   7-1.上一个then方法的成功回调和失败回调方法中，如果这两个方法的返回值是一个非promise的值，那么都会都传递到下个then方法的成功回调中
 *   7-2.上一个then方法的成功回调和失败回调方法中，返回是promise时，执行的是promise的reslove逻辑
 * 8.上一个then方法走到会走到下一个then方法的失败回调中的情况:
 *   8.1 上一个then的成功回调中，抛出异常throw new Error('异常会走到下一个then的失败回调')
 *   8-2.上一个then方法的成功回调和失败回调方法中，返回是promise时，执行的是promise的reject逻辑
 */
var resolvePromise = function (promise, x, resolve, reject) {
    if (promise == x) {
        return reject(new TypeError('错误的引用,promise 和 x 是同一个对象了'));
    }
    if ((x != null && typeof x == 'object') || typeof x === 'function') {
        try {
            var then = x.then; //如果x对象存在then，且then 是一个方法，则说明x是一个promise
            if (then && typeof then == 'function') {
                //直接执行x.then方法.写法就是promise.then.call(x,()=>{},()=>{})
                then.call(x, function (y) {
                    //如果y还是一个还是一个promise，则递归判断
                    resolvePromise(promise, y, resolve, reject);
                }, function (r) {
                    reject(r);
                });
            }
            else {
                resolve(x);
            }
        }
        catch (error) {
            reject(error);
        }
    }
    else { //如果返回的是非promise的普通值
        resolve(x);
    }
};
var MyPromise = /** @class */ (function () {
    function MyPromise(executorFn) {
        var _this = this;
        this.status = "PENDING" /* peding */; //初始化时都是pending状态
        this.value = undefined; //根据promiseA+ 规范
        this.reason = undefined;
        this.onFulFilledList = [];
        this.onRejectedList = [];
        var resolved = function (data) {
            if (_this.status === "PENDING" /* peding */) {
                _this.status = "FULFILLED" /* fulfilled */; //执行reslove方法时，要修改当前Promise的状态为成功
                _this.value = data;
                _this.onFulFilledList.forEach(function (fulfilledCallback) { return fulfilledCallback(); });
            }
        };
        var reject = function (data) {
            if (_this.status === "PENDING" /* peding */) {
                _this.status = "REJECTED" /* rejected */; //执行reslove方法时，要修改当前Promise的状态为失败
                _this.reason = data;
                _this.onRejectedList.forEach(function (rejectedCallback) { return rejectedCallback(); });
            }
        };
        try {
            executorFn(resolved, reject);
        }
        catch (error) {
            reject(error);
        }
    }
    /**
     *
     * @param onFulfilled
     * @param onRejected
     * then方法返回的是一个全新的Promise，不是返回this
     */
    MyPromise.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (val) { return val; };
        onRejected = typeof onRejected === 'function' ? onRejected : function () { throw new Error(''); };
        var promise2 = new MyPromise(function (resolve, reject) {
            //then方法可以在promise实例化多次调用，所以要订阅then传入的成功和失败函数
            if (_this.status === "PENDING" /* peding */) {
                //订阅then的成功回调
                if (typeof onFulfilled === 'function') {
                    _this.onFulFilledList.push(function () {
                        setTimeout(function () {
                            try {
                                var x = onFulfilled(_this.value);
                                //对返回的x做判断，判断x 是普通值还是promise
                                resolvePromise(promise2, x, resolve, reject);
                            }
                            catch (error) {
                                reject(error); //出错则执行到下一个then方法的失败回调
                            }
                        }, 0);
                    });
                }
                //订阅then的失败回调
                if (typeof onRejected === 'function') {
                    _this.onRejectedList.push(function () {
                        setTimeout(function () {
                            try {
                                var x = onRejected(_this.reason);
                                //对返回的x做判断，判断x 是普通值还是promise
                                resolvePromise(promise2, x, resolve, reject);
                            }
                            catch (error) {
                                reject(error);
                            }
                        }, 0);
                    });
                }
            }
            //如果是成功，则在then方法中执行成功的回调
            if (_this.status === "FULFILLED" /* fulfilled */) {
                //添加settimeout的目的是为了确保newPromise一定不为undefined
                setTimeout(function () {
                    try {
                        var x = onFulfilled(_this.value);
                        //对返回的x做判断，判断x 是普通值还是promise
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (error) {
                        reject(error);
                    }
                }, 0);
            }
            if (_this.status === "REJECTED" /* rejected */) {
                setTimeout(function () {
                    try {
                        var x = onRejected(_this.reason);
                        //对返回的x做判断，判断x 是普通值还是promise
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (error) {
                        reject(error);
                    }
                }, 0);
            }
        });
        return promise2;
    };
    /**
     * Promise的catch方法就是then方法没有传递成功的回调函数
     * @param errorFn
     */
    MyPromise.prototype.catch = function (errorFn) {
        console.log('catche');
        return this.then(null, errorFn);
    };
    /**
     * all方法返回的也是一个promise
     * @param valuesList
     */
    MyPromise.all = function (valuesList) {
        var length = valuesList.length; // 传过来的数组的长度
        var times = 0;
        var results = [];
        return new MyPromise(function (resolve, reject) {
            //收集值
            function collectValue(i, val) {
                times++;
                results[i] = val;
                if (times == length) {
                    resolve(results);
                }
            }
            valuesList.forEach(function (item, idx) {
                //判断传递过来的每一项是否是promise
                if (item.then && typeof item.then === 'function') {
                    console.log('item=', item);
                    item.then(function (data) {
                        collectValue(idx, data);
                    }, function (err) {
                        reject(err);
                    });
                }
                else { //如果是一个普通值
                    collectValue(idx, item);
                }
            });
        });
    };
    return MyPromise;
}());
MyPromise.deferred = function () {
    var dfd = {};
    dfd.promise = new MyPromise(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};
//exports = module.exports = MyPromise

/**
 Promise 解决的问题:
 * 1. promise  解决多个异步并行执行，最终得到所有的结果
 * 2. 异步嵌套调用问题

 Promise的特征
 * 1.每个Promise 都有三个状态, Pending(等待)，fulfilled(成功)，rejected(拒绝)
 * 2.每个Promise 都有一个then方法
 * 3.new Promise 后都会立即执行
 * 4.then方法里面有两个回调函数作为参数，一个成功的回调，一个失败的回调
 */
var fs = require('fs');
var path = require('path');
function promisify(fn) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new MyPromise(function (resolve, reject) {
            fn.apply(void 0, __spreadArrays(args, [function (err, data) {
                    if (err)
                        reject(err);
                    resolve(data);
                }]));
        });
    };
}
var readFile = promisify(fs.readFile);
var promise11 = readFile(path.posix.resolve(__dirname, 'name.txt'), "utf8");
var promise22 = readFile(path.posix.resolve(__dirname, 'age.txt'), "utf8");
// readFile(path.posix.resolve(__dirname, 'name.txt'), "utf8").then((data) => {
//     console.log('data=1111111 ', data);
// });
MyPromise.all([promise11, promise22, 9000]).then(function (data) {
    console.log(data);
}, function (error) {
    console.log('error =', error);
});
//# sourceMappingURL=bundle.js.map

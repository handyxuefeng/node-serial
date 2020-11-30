
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

//定义常量枚举
const enum STATUS {
    peding = 'PENDING',
    fulfilled = 'FULFILLED',
    rejected = 'REJECTED'
}

const resolvePromise = (promise, x, resolve, reject) => {
    if (promise == x) {
        return reject(new TypeError('错误的引用,promise 和 x 是同一个对象了'));
    }
    if ((x != null && typeof x == 'object') || typeof x === 'function') {
        try {
            let then = x.then;  //如果x对象存在then，且then 是一个方法，则说明x是一个promise
            if (then && typeof then == 'function') {
                //直接执行x.then方法.写法就是promise.then.call(x,()=>{},()=>{})
                then.call(x, (y) => {
                    //如果y还是一个还是一个promise，则递归判断
                    resolvePromise(promise, y, resolve, reject)
                }, (r) => {
                    reject(r)
                });
            } else {
                resolve(x);
            }
        } catch (error) {
            reject(error)
        }
    }
    else {  //如果返回的是非promise的普通值
        resolve(x);
    }

}



class MyPromise {
    static deferred;
    public status: STATUS;
    public value;  //成功的原因
    public reason; //失败的原因
    public onFulFilledList: Array<Function>;
    public onRejectedList: Array<Function>;
    constructor(executorFn: Function) {
        this.status = STATUS.peding; //初始化时都是pending状态
        this.value = undefined; //根据promiseA+ 规范
        this.reason = undefined;
        this.onFulFilledList = [];
        this.onRejectedList = [];
        let resolved = (data?: unknown) => {
            if (data instanceof MyPromise) {
                return data.then(resolved, reject);
            }
            if (this.status === STATUS.peding) {
                this.status = STATUS.fulfilled;  //执行reslove方法时，要修改当前Promise的状态为成功
                this.value = data;
                this.onFulFilledList.forEach((fulfilledCallback: Function) => fulfilledCallback());
            }

        }
        let reject = (data?: unknown) => {
            if (this.status === STATUS.peding) {
                this.status = STATUS.rejected;  //执行reslove方法时，要修改当前Promise的状态为失败
                this.reason = data;
                this.onRejectedList.forEach((rejectedCallback: Function) => rejectedCallback())
            }
        }
        try {
            executorFn(resolved, reject);
        } catch (error) {
            reject(error);
        }
    }
    /**
     * 
     * @param onFulfilled 
     * @param onRejected 
     * then方法返回的是一个全新的Promise，不是返回this
     */
    then(onFulfilled?: Function, onRejected?: Function) {

        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected = typeof onRejected === 'function' ? onRejected : () => { throw new Error('') };

        let promise2 = new MyPromise((resolve: Function, reject: Function) => {

            //then方法可以在promise实例化多次调用，所以要订阅then传入的成功和失败函数
            if (this.status === STATUS.peding) {
                //订阅then的成功回调
                if (typeof onFulfilled === 'function') {
                    this.onFulFilledList.push(() => {

                        setTimeout(() => {
                            try {
                                let x = onFulfilled(this.value);
                                //对返回的x做判断，判断x 是普通值还是promise
                                resolvePromise(promise2, x, resolve, reject);
                            } catch (error) {
                                reject(error); //出错则执行到下一个then方法的失败回调
                            }
                        }, 0);

                    });
                }
                //订阅then的失败回调
                if (typeof onRejected === 'function') {
                    this.onRejectedList.push(() => {
                        setTimeout(() => {
                            try {
                                let x = onRejected(this.reason);
                                //对返回的x做判断，判断x 是普通值还是promise
                                resolvePromise(promise2, x, resolve, reject);
                            } catch (error) {
                                reject(error);
                            }
                        }, 0);

                    });
                }
            }

            //如果是成功，则在then方法中执行成功的回调
            if (this.status === STATUS.fulfilled) {
                //添加settimeout的目的是为了确保newPromise一定不为undefined
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        //对返回的x做判断，判断x 是普通值还是promise
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            }
            if (this.status === STATUS.rejected) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        //对返回的x做判断，判断x 是普通值还是promise
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }
        });

        return promise2;
    }
    /**
     *  MyPromise.resolve(1000).finally((data) => {
            return 1888;
        }).then((data) => {
            console.log('1', data);
        }, err => {
            console.log('2', err);
        })
     * @param callback 
     */
    finally = (callback: Function) => {
        return this.then(() => {
            return MyPromise.resolve(callback()).then((data) => data);
        }, (error) => {
            return MyPromise.resolve(callback()).then(err => { throw err });
        });
    }
    /**
     * Promise的catch方法就是then方法没有传递成功的回调函数
     * @param errorFn 
     */
    catch(errorFn: Function) {
        return this.then(null, errorFn);
    }
    /**
     * all方法返回的也是一个promise
     * @param valuesList 
     */
    static all(valuesList: any[]) {

        const length = valuesList.length;// 传过来的数组的长度
        let times = 0;
        const results = [];

        return new MyPromise((resolve, reject) => {
            //收集值
            function collectValue(i, val) {
                times++;
                results[i] = val;
                if (times == length) {
                    resolve(results);
                }
            }
            valuesList.forEach((item, idx) => {
                //判断传递过来的每一项是否是promise
                if (item.then && typeof item.then === 'function') {
                    console.log('item=', item);
                    item.then((data) => {
                        collectValue(idx, data)
                    }, err => {
                        reject(err);
                    })
                } else { //如果是一个普通值
                    collectValue(idx, item);
                }
            });

        });
    }

    static resolve(data?: unknown) {
        return new MyPromise((reslove) => {
            reslove(data);
        });
    }
    /**
     * 那个promise执行完，状态就以哪个为准
     * @param promiseArray 
     */
    static race(promiseArray: Array<MyPromise>) {
        console.log('promiseArray = ', promiseArray);
        return new MyPromise((resolve, reject) => {
            promiseArray.forEach(promise => {
                return promise.then((data) => resolve(data), err => reject(err));
            });
        });
    }


}



MyPromise.deferred = function () {
    let dfd = {} as any;
    dfd.promise = new MyPromise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}



export default MyPromise;

//exports = module.exports = MyPromise




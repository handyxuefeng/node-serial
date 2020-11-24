
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
class MyPromise {
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
            if (this.status === STATUS.peding) {
                this.status = STATUS.fulfilled;  //执行reslove方法时，要修改当前Promise的状态为成功
                this.value = data;
                this.onFulFilledList.forEach((fulfilledCallback: Function) => fulfilledCallback())
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
    then(onFulfilled: Function, onRejected: Function) {

        let newPromise = new MyPromise((resolve: Function, reject: Function) => {

            //then方法可以在promise实例化多次调用，所以要订阅then传入的成功和失败函数
            if (this.status === STATUS.peding) {
                //订阅then的成功回调
                if (typeof onFulfilled === 'function') {
                    this.onFulFilledList.push(() => {

                        try {
                            let x = onFulfilled(this.value);
                            //返回的不是Promise的实列,promise的实列都是有then方法的,x是一个普通值
                            if (!x.then) {
                                resolve(x);
                            }
                            else {
                                let status = x.status;
                                if (status === STATUS.fulfilled) {
                                    resolve(x.value);
                                }
                                else {
                                    reject(x.reason);
                                }
                            }
                        } catch (error) {
                            reject(error); //出错则执行到下一个then方法的失败回调
                        }


                    });
                }
                //订阅then的失败回调
                if (typeof onRejected === 'function') {
                    this.onRejectedList.push(() => {
                        try {
                            let x = onRejected(this.reason);
                            //返回的不是Promise的实列，x是一个普通值
                            if (!x.then) {
                                resolve(x);
                            } else {
                                let status = x.status;
                                if (status === STATUS.fulfilled) {
                                    resolve(x.value);
                                }
                                else {
                                    reject(x.reason);
                                }
                            }

                        } catch (error) {
                            reject(error)
                        }
                    });
                }
            }

            //如果是成功，则在then方法中执行成功的回调
            if (this.status === STATUS.fulfilled) {
                try {
                    let x = onFulfilled(this.value);
                    //返回的不是Promise的实列，x是一个普通值
                    if (!x.then) {
                        resolve(x);
                    }
                    else { //返回的是一个Promise的话，则要看Promise里执行的是reslove，还是reject逻辑
                        let status = x.status;
                        if (status === STATUS.fulfilled) {
                            resolve(x.value);
                        }
                        else {
                            reject(x.reason);
                        }
                    }
                } catch (error) {
                    reject(error);
                }
            }
            if (this.status === STATUS.rejected) {
                try {
                    let x = onRejected(this.reason);
                    //返回的不是Promise的实列，x是一个普通值
                    if (!x.then) {
                        resolve(x);
                    } else {
                        let status = x.status;
                        if (status === STATUS.fulfilled) {
                            resolve(x.value);
                        }
                        else {
                            reject(x.reason);
                        }
                    }
                } catch (error) {
                    reject(error)
                }
            }
        });

        return newPromise;





    }
}
export default MyPromise;

//exports = module.exports = MyPromise




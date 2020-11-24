
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
        return this;
    }
    then(onFulfilled: Function, onRejected: Function) {
        //then方法可以在promise实例化多次调用，所以要订阅then传入的成功和失败函数
        if (this.status === STATUS.peding) {
            //promiseA+规范 2.2.1 规定
            if (typeof onFulfilled === 'function') {
                this.onFulFilledList.push(() => {
                    onFulfilled(this.value);
                });
            }
            if (typeof onRejected === 'function') {
                this.onRejectedList.push(() => {
                    onRejected(this.reason);
                });
            }
        }


        //如果是成功，则在then方法中执行成功的回调
        if (this.status === STATUS.fulfilled) {
            onFulfilled(this.value);
        }
        if (this.status === STATUS.rejected) {
            onRejected(this.reason);
        }
        return this;
    }
}
export default MyPromise;

//exports = module.exports = MyPromise




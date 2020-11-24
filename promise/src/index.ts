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



/*
let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('11111')
        reject(1000);
    }, 1000);
});
promise.then((successData) => {
    console.log(successData);
}, (error) => {
    console.log('失败数据=', error);
});
*/

/*
let promise = new Promise((resolve, reject) => {
    resolve('ok')
});
promise.then().then().then().then(data => {
    console.log('data =', data);
})
*/



import MyPromise from './promise/index';
let promise2 = new MyPromise((reslove, reject) => {
    setTimeout(() => {
        //reslove('99999999999');
        reject('fail');
    }, 2000);
    //reslove('ok');
    //reject('fail');
    //throw new Error('报错了')
}).then((data) => {
    console.log('成功回调1111=', data);
    //throw new Error('第一个错误回调中throw Error')
    //return 1000;
    // return new MyPromise((reslove, reject) => {
    //     reject('goto next reject')
    //     //reslove('111')
    // });
    return new MyPromise((reslove, reject) => {
        reslove(new MyPromise((reslove, reject) => {
            reslove("88888888888");
        }));
    });



}, (error) => {
    // throw new Error('第一个错误回调中throw Error')
    console.log('失败回调1111=', error);
    //return '99999'
    return new MyPromise((reslove, reject) => {
        reject('goto next then errorcallback')
        //reslove('111')
    })
});

promise2.then((data) => {
    console.log('成功回调2222=', data);
}, (error) => {
    console.log('失败回调2222=', error);
});

let promise3 = new MyPromise((resolve, reject) => {
    resolve(1);
});
promise3.then().then().then().then(data => {
    console.log('then的穿透实现 = ', data);
})












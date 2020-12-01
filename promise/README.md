# promise 涉及到知识点

- 高阶函数
- 函数柯里化

# Promise 解决的问题:

- 1. promise 解决多个异步并行执行，最终得到所有的结果
- 2. 异步嵌套调用问题

# Promise 的特征

- 1.每个 Promise 都有三个状态, Pending(等待)，fulfilled(成功)，rejected(拒绝)
- 2.每个 Promise 都有一个 then 方法
- 3.new Promise 后都会立即执行
- 4.then 方法里面有两个回调函数作为参数，一个成功的回调，一个失败的回调
- 5.Promise 的状态只能从 pending-->fulfilled(等待-->成功) 或者 pending-->rejected(等待-->失败)
- 6.Promise 里面使用发布订阅模式，把 then 方法传入的成功回调和失败回调都订阅到对应数组中
- 7.上一个 then 方法走到会走到下一个 then 方法的成功回调中的情况:
  - 7-1.上一个 then 方法的成功回调和失败回调方法中，如果这两个方法的返回值是一个非 promise 的值，那么都会都传递到下个 then 方法的成功回调中
  - 7-2.上一个 then 方法的成功回调和失败回调方法中，返回是 promise 时，执行的是 promise 的 reslove 逻辑
- 8.上一个 then 方法走到会走到下一个 then 方法的失败回调中的情况:

  - 8.1 上一个 then 的成功回调中，抛出异常 throw new Error('异常会走到下一个 then 的失败回调')
  - 8-2.上一个 then 方法的成功回调和失败回调方法中，返回是 promise 时，执行的是 promise 的 reject 逻辑

- 9.promise 中 all,race,finally,resolve 等静态方法的实现

# generate + co 的原理

```
const fs = require('fs').promises;
const path = require('path');
function* readAge(filePath) {
    let ageFilename = yield fs.readFile(filePath, 'utf8');
    let ageContext = yield fs.readFile(path.resolve(__dirname, ageFilename), 'utf8');

    return ageContext;
};
/*
let promise1 = it.next(); // { value: Promise { <pending> }, done: false }
Promise.resolve(promise1.value).then(data1 => {
    let obj2 = it.next(data1);
    Promise.resolve(obj2.value).then(data2 => {
        let obj3 = it.next(data2);
        console.log('obj3=', obj3);

    })
});
上面的代码，就可以封装，封装之后的代码就是co库
*/

function co(it: any) {
    return new Promise((resolve, reject) => {
        function next(val: unknown) {
            console.log('val= ', val);
            let { value, done } = it.next(val);
            if (done) {
                resolve(value);
            }
            else {
                Promise.resolve(value).then((data) => {
                    next(data);
                }, reject);
            }
        }
        next('');
    });
}


let it = readAge(path.resolve(__dirname, './name.txt'));

let promise = co(it);

promise.then((data) => {
    console.log('result = ', data);
});


```

# async + await 就是等价于 generate + co 库

# EventLoop 事件环

- 宏任务
  - script 中的脚本的执行栈
  - setTimeout
  - setInterval
  - ajax
  - EventListener
  - setImmediate
  - messageChannel
  - requestAnimationFrame
- 微任务
  - Promise.then
  - mutationObserver
  - queueMicroTask
  - process.nextTick

```
//微任务和GUI渲染
<script>
        document.body.style.background = 'red';
        console.log(1)
        Promise.resolve().then(()=>{
            console.log(2)
            document.body.style.background = 'yellow';
        })
        console.log(3);
</script>

<script>
        button.addEventListener('click',()=>{
            console.log('listener1');
            Promise.resolve().then(()=>console.log('micro task1'))
        })
        button.addEventListener('click',()=>{
            console.log('listener2');
            Promise.resolve().then(()=>console.log('micro task2'))
        })
        button.click(); // click1() click2()
</script>

//定时器任务
Promise.resolve().then(() => {
    console.log('Promise1')
    setTimeout(() => {
        console.log('setTimeout2')
    }, 0);
})
setTimeout(() => {
    console.log('setTimeout1');
    Promise.resolve().then(() => {
        console.log('Promise2')
    })
}, 0);

//await 和 promise

console.log(1);
async function async() {
    console.log(2);
    await console.log(3);
    console.log(4);
    /*
    在事件循环中，如果碰到await，时，则进行转换成 Promise.resolve().then()来看
    Promise.resolve(console.log(3)).then(() => {
        console.log(4);
    });
    */
}

setTimeout(() => {
    console.log(5);
}, 0);
const promise = new Promise((resolve, reject) => {
    console.log(6);
    resolve(7)
})
promise.then(res => {
    console.log(res)
})
async();
console.log(8);






```

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

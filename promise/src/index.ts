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

process.nextTick(() => {
    console.log(12);
})

// 宏任务:[s1,]
// 微任务:[then7, then4]

//1 , 6, 2 , 4 ,8, 7, 3 ,5
//1 , 6, 2 , 3,9 ,8, 7, 4 ,5
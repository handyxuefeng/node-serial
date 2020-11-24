
type utilsType = Record<string, Function>;
let utils: utilsType = {
    isBoolean: Function,
    isString: Function,
    isNumber: Function,
    isObject: Function,
};

/**
 * 函数柯里化,就是把一个有用多个参数的函数，拆分成多个函数，把函数的参数拆分得更细
 * @param typing 
*/
function isType(typing: string) {
    return (val: unknown) => {
        return Object.prototype.toString.call(val) == `[object ${typing}]`
    }
};

["String", "Number", "Boolean", "Object"].forEach(typing => {
    utils[`is${typing}`] = isType(typing);
});

let val = { a: 1 };
console.log(utils.isObject(val));
console.log(utils.isNumber(1));
console.log(utils.isString("12"));


/**
 * 通用的柯里化函数的封装
 * 原则就是函数每次传入的参数都记录下来，如果每次传入的实参个数没有达到形参的个数，则返回函数，直到达到函数形参的个数后，就直接执行函数
 * @param fun 
 */
const curring = (fun: Function) => {
    let paramsLength = fun.length; //获取传入函数的形参的个数，这个非常重要
    let tempArgs = [];
    const innerFun = (...args) => {
        tempArgs.push(...args);
        if (tempArgs.length < paramsLength) {
            return innerFun;
        }
        else {
            let res = fun(...tempArgs);
            tempArgs = [];
            return res;
        }
    }
    return innerFun;
}

function sum(a, b, c, d) {
    return a + b + c + d;
}

let curringSum = curring(sum);
let r1 = curringSum(1)(2)(3)(4);
let r2 = curringSum(1)(2, 3)(4);
let r3 = curringSum(1)(2, 3, 4);

let r4 = curringSum(1, 2)(3)(4);
let r5 = curringSum(1, 2)(3, 4);

let r6 = curringSum(1, 2, 3)(4);
let r7 = curringSum(1, 2, 3, 4);
console.log('r1 = ', r1, 'r2 = ', r2, 'r3 = ', r3, 'r4 = ', r4, 'r5=', r5, 'r6=', r6, 'r7=', r7);

export { }
const { pathToRegexp, match, parse, compile } = require("path-to-regexp");
let str = '/';
let keys = [];
// let regStr = str.replace(/:([^\/]+)/g, function () {
//     // console.log(arguments);
//     keys.push(arguments[1])
//     return `([^\/]+)`;
// });

//regStr = /user/([^/]+)/([^/]+)/hxf
//let Reg = new RegExp(regStr); //将路径字符串转换为正则
let pathToReg = pathToRegexp(str, keys); //npm官网的路径转换
//let arr = '/user/1/linda/hxf'.match(pathToReg, []);


console.log(pathToReg, keys);

/**
 pathToReg = /^\/user(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))\/hxf[\/#\?]?$/i;
 keys = [
  {
    name: 'id',
    prefix: '/',
    suffix: '',
    pattern: '[^\\/#\\?]+?',
    modifier: ''
  },
  {
    name: 'name',
    prefix: '/',
    suffix: '',
    pattern: '[^\\/#\\?]+?',
    modifier: ''
  }
]
*/

// /user/1/2/hxf =- /^\/user(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))\/hxf[\/#\?]?$/i
let pathReg = /^\/user(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))\/hxf[\/#\?]?$/i;
let url = '/user/1/2/hxf';
let result = pathReg.test(url);
let matches = url.match(pathReg);
let [, ...params] = matches;

console.log(result, matches, params);
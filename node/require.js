const path = require('path');
const fs = require('fs');
const vm = require('vm');

function Module(id) {
    this.id = id;
    this.exports = {};
}
//文件模块的后缀名的策略模式
Module._extensions = {
    '.js'(moduleInstance) {
        //console.log('moduleInstance = ', moduleInstance);
        let scriptContent = fs.readFileSync(moduleInstance.id, 'utf8');
        let iifeFunctionString = `(function(exports, require, module, __filename, __dirname){ 
            ${scriptContent} 
        })`;
        let iifeFunction = vm.runInThisContext(iifeFunctionString);
        //console.log('iifeFunction =', iifeFunction.toString());
        let exports = moduleInstance.exports;  // {}
        let __dirname = path.dirname(moduleInstance.id);
        let __filename = moduleInstance.id;
        iifeFunction.call(moduleInstance, exports, myRequire, moduleInstance, __filename, __dirname);
    },
    ".json"(moduleInstance) {
        let jsonContent = fs.readFileSync(moduleInstance.id, 'utf8');
        moduleInstance.exports = JSON.parse(jsonContent);
    },
    ".node"() {

    }

}


//将文件的相对路径转换成绝对路径
Module._resolveFileName = function (id) {
    let absolutePath = path.resolve(__dirname, id);
    let isExists = fs.existsSync(absolutePath); //文件是否存在
    if (isExists) return absolutePath;
    let keys = Object.keys(Module._extensions);
    for (let i = 0; i < keys.length; i++) {
        let newFilePath = absolutePath + keys[i];
        if (fs.existsSync(newFilePath)) return newFilePath;
    }
    throw new Error(`${absolutePath}不存在`);
}
Module._load = function (id) {
    //先根据传入的路径，查找文件的路径
    let filePath = Module._resolveFileName(id); //filePath =  /Users/hanxf.han/project/node-serial/node/util.js 
    console.log('filePath= ', filePath);
    if (Module._cache[filePath]) {
        //console.log('Module._cache[filePath] = ', Module._cache[filePath]);
        return Module._cache[filePath].exports;
    }

    let module = new Module(filePath);
    module.load();//开始根据文件路径读取文件内容
    Module._cache[filePath] = module;
    return module.exports;

}
Module._cache = {};
Module.prototype.load = function () {
    //this.id  =  /Users/hanxf.han/project/node-serial/node/util.js 
    //根据文件的后缀，采取不同的加载策略
    let extendName = path.extname(this.id);
    //  console.log('extendName = ', extendName);
    Module._extensions[extendName](this);
}
function myRequire(id) {
    return Module._load(id);
}

let util = myRequire('./util');

console.log('util = ', util);

let user = myRequire('./name');
console.log('user = ', user);

module.exports = myRequire;




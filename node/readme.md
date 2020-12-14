## require 的原理

- module.exports = exports = {}
- 引用模块和被引用模块在 global 模块定义的变量都能被访问到

## node 中 events 的原理

- on,emit,off,once,newListener 的实现

## node 中 buffer 和 base64 编码的原理

- 3 \* 8 转变为 4 \* 6 转换为 base64

## node 中的文件系统

- readFileSync,writeFileSync 同步读取，写入文件
- readFile,wrieteFile 异步读取，写入文件
- 利用文件流 createReadStream,createWriteStream 的模式，对文件进行边读边写
- pipe 通道

## 链表结构

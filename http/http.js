const http = require('http');
const url = require('url');
let port = 8008;


//curl -v -X POST -d 'a=1&b=2&c=3' http://localhost:8008
const dataStream = [];
const server = http.createServer((req, res) => {
    const requestUrl = req.url;

    req.on('data', (chunk) => {
        console.log('chunk=', chunk.toString());
        dataStream.push(chunk);
    });
    req.on('end', () => {
        console.log('接受到的数据为:', dataStream.toString());
    });



    //const testUrl = `http://username:password@localhost:8008/index.html?a=1&b=1#hash=12`;
    //console.log(url.parse(requestUrl, true));
    res.setHeader('Content-type', 'text/plain;charset=utf-8')
    console.log('请求的路径为:', requestUrl);
    res.end(`请求的路径为:${requestUrl},${dataStream.toString()}`);
});

server.listen(port, () => {
    console.log(`${port}已经启动`);
});
server.on('error', (err) => {
    //表示端口号被占用
    if (err.errno === 'EADDRINUSE') {
        console.log(`${err.port}端口号被占用`);
        server.listen(++port)
    }
})


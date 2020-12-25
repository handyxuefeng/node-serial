const http = require('http');
const port = 3000;
// 设置cookie  参数
// key/value/domain/path/maxAge/expires/httpOnly
// domain 限制域名 默认是当前的域名
// path 限制设置cookie的路径 (基本用不到) 减少cookie的传入
// maxAge  （多少秒）/ expires 确切的时间点（）cache
// cookie 可以设置 httpOnly 不能通过代码去更改cookie
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', `text/html;charset=utf-8`);
    if (req.url == '/readCookie') {
        let cookie = req.headers['cookie']; //读取浏览器客户端请求头的cookie
        res.end(`请求头的cookie为:${cookie}`);
    }
    else if (req.url == '/read/write') {
        res.setHeader('set-Cookie', ['use=admin; path="/read"']); //表示只能在/read/write才能设置cookie，指定了路径
        res.end('cookie写入成功');
    }
    else if (req.url == '/wirteCookie') {
        res.setHeader('set-Cookie', ['a=1', 'b=2', 'c=3']); //设置cookie，不限制域名
        res.setHeader('set-Cookie', ['d=1; domain=han.cn', 'e=2; domain=han.cn', 'name=han']); //制定对应的cookie在哪些域名下能够访问得到
        res.setHeader('Set-Cookie', ['name=hx; max-age=10', 'age=10; path="/"']); //设置cookie的有效时间
        res.setHeader('set-Cookie', ['token=fal24dk/81IU98Q; httpOnly=true']);// 设置cookie的为只读，不能被篡改
        res.end('cookie写入成功');
    }
    else {
        res.end(`${req.url}路径不存在，可通过/wirteCookie, /readCookie分别设置和读取cookie`);
    }





})
server.listen(port, () => {
    console.log(`${port}端口已经启动。。。`);
});
const http = require('http');
const querystring = require('querystring');
const crypto = require('crypto');
/**
 * 利用 openssl生成私钥的命令:
 * openssl genrsa -out rsa_private_key.pem 1024
 */
const privateKey = `MIICXQIBAAKBgQCzikbNLHM3w9FgTA7iK+ULV4qqDmT7TfdtGuL/2f0mMlRAxHfV
ZWLC529bmsq/HQlG7w8bg1kbwXUY3HNNC70Dw8mRPZ6e6dlgFxb0IjQq+OHdr/yw
21wlt6Z93P6fFra82QbP8UFaRctQjgmECL7rEprLAAsFzBwF/J6deiPsawIDAQAB
AoGBALAGfFAgqn4cEKW3LEh2/MNX+u2r2znAQTvJRpHOKbJPWed+OHcSRfgNbFKF
uw4Q682OCGPTLYRW8fWD/c+mGJN4G2e50a7uQCd1Mctc7512+dsrQxtSlUEUpG7V
TCuf+QEsORam+WAXkLdqVTZjON+6hLZclLW9QIawbx94LhPRAkEA64oYnUnyMncI
Z4caFKfblxDHDVO9tTRbv33mUTtuPIkIjixNzfeG6dFyZsZNuTlorqAyhooTWpe4
tMDO34uuNQJBAMMi35Su7/xSfJLxR2ReG5v06++2iqEMpFvqpd2+vaUZQsUgkh9F
r4/Ea4Qhp4odrXhSBWe2yb/D48aObzedBB8CQQDL5Af4qBkzHB03WRj3hnKs60YT
wEi5AjDlq7ti2BpN5qV0RN+5CqtL3hW057ZCP3LhryTtl7q3Mh0ewsSReF19AkA4
N9bUHiYzuov7RZn814P6xXAnyp5b0amUdaC9ptM6OnHbGwweCFSRBdS3534+M1ij
vnWiMK4lGkmIDccK7aifAkBrRAPtkpsgruMR1V/9Hg8bEh2tQoSSMyqVHeBKLwke
SoFy+gmeo7atrJCyJrJS780k/npSY9ifMw2pNtoER3kL`; // openssl 生成一个1024字节的秘钥  https openssl 先生成 配置到nginx
const port = 7000;

const uuid = require('uuid');


function signed(value) { // 比md5 多了一个盐值
    return crypto.createHmac('sha256', privateKey).update(value.toString()).digest('base64');
}
const session = {};
const SessionId = 'connect.sid';
let sid = uuid.v4(); //生成一个唯一的数

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', `text/html;charset=utf-8`);

    req.getCookie = function (key, options = {}) {
        //  key=value;  key=value;  key=value  .split(; ) line.split('=')
        let cookieObj = querystring.parse(req.headers['cookie'], '; ');
        console.log('cookieObj = ', cookieObj);
        if (options.signed) { // 需要校验签名
            let [value, sign] = cookieObj[key].split('.');
            /**
             * age = 10.IpM0aa4dZwtIWDrQEwNl5lX93Qm/dIzjwJyki97i5Kg=
             * [value,sign]= [10,IpM0aa4dZwtIWDrQEwNl5lX93Qm/dIzjwJyki97i5Kg=]
             * value = 10;
             * sign = IpM0aa4dZwtIWDrQEwNl5lX93Qm/dIzjwJyki97i5Kg=
             * 获取cookie时候，对有签名的cookie进行验证，对value值进行签名，看签名出来的值是否和一开始服务端签名的值是否一样
             */
            let repeatSign = signed(value); //取cookie时，再签名，和之前输出给浏览器的签名进行再比较
            //console.log('repeatSign =', repeatSign, 'sign =', sign);
            if (repeatSign == sign) { // jwt 也是这个原理
                return value;
            } else {
                return ''; // 校验失败 说明cookie失效，可能用户被修改了
            }
        } else {
            if (cookieObj[key]) {
                return cookieObj[key].split('.')[0]
            } else {
                return ''
            }
        }
    }
    let cookies = []
    res.setCookie = function (key, value, options = {}) {
        // {age:1,name:2} => age=1&name=2
        let optArgs = [];

        if (options.maxAge) {
            optArgs.push(`max-age=${options.maxAge}`)
        }
        if (options.path) {
            optArgs.push(`path=${options.path}`)
        }
        if (options.httpOnly) {
            optArgs.push(`httpOnly=${options.httpOnly}`)
        }
        if (options.signed) {
            value = value + '.' + signed(value);
        }
        let cookieValue = `${key}=${value}`
        // cookie的分隔符是; name=zf; max-age=10; expires= ; 
        cookies.push(`${cookieValue}; ${optArgs.join('; ')}`)
        res.setHeader('Set-Cookie', cookies);
    }

    if (req.url == '/sid') {
        let session_id = req.getCookie('SessionId');

        if (session_id) {
            let total = session[session_id];
            if (total > 0) {
                session[session_id] -= 20;
                res.end(`money=${session[session_id]}`)
            }
            else {
                res.end(`已经为0了,${total}`)
            }
        }
        else { //第一次，则设置cookie
            // res.setCookie('total', 100);
            session[sid] = 100;
            res.setCookie('SessionId', sid, { httpOnly: true });

        }
        res.end('sid设置成功')
    }
    else {
        res.end('请设置sid');
    }







});

server.listen(port, () => {
    console.log(`${port}端口已经启动。。。。。。`);
});
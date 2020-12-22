/**
 * jwt= json web token  JSON Web Token（JWT）是目前最流行的跨域身份验证解决方案
 * 解决问题：session不支持分布式架构，无法支持横向扩展，只能通过数据库来保存会话数据实现共享。如果持久层失败会出现认证失败。
 * 优点：服务器不保存任何会话数据，即服务器变为无状态，使其更容易扩展。
 * JWT 作为一个令牌（token），有些场合可能会放到 URL（比如 api.example.com/?token=xxx）。
   Base64 有三个字符+、/和=，在 URL 里面有特殊含义，所以要被替换掉：=被省略、+替换成-，/替换成_ 。这就是 Base64URL 算法。

   npm i jwt-simple

 */

const crypto = require('crypto');


/**
 * 封装JWT 工具
 * JWT包含了使用.分隔的三部分
 * 1.Header 头部{ "alg": "HS256", "typ": "JWT"}   
     algorithm => HMAC SHA256
     type => JWT
 * 2.Payload 负载、载荷
    JWT 规定了7个官方字段
    iss (issuer)：签发人
    exp (expiration time)：过期时间
    sub (subject)：主题
    aud (audience)：受众
    nbf (Not Before)：生效时间
    iat (Issued At)：签发时间
    jti (JWT ID)：编号

 * 3.Signature 签名:对前两部分的签名，防止数据篡改
     HMACSHA256( base64UrlEncode(header) + "." + base64UrlEncode(payload),privateKey)

 *4.JWT 作为一个令牌（token），有些场合可能会放到 URL（比如 api.example.com/?token=xxx）。
    Base64 有三个字符+、/和=，在 URL 里面有特殊含义，所以要被替换掉：=被省略、+替换成-，/替换成_ 。
    这就是 Base64URL 算法。  
*/
const myJwt = {
    base64UrlEscapce(content) {
        //Base64 有三个字符+、/和=，在 URL 里面有特殊含义，所以要被替换掉：=被省略、+替换成-，/替换成_
        return content.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
    },
    base64UrlUnEscape(str) {
        str += new Array(5 - str.length % 4).join('=');
        return str.replace(/\-/g, '+').replace(/_/g, '/');
    },
    toBase64(content) {
        let str = JSON.stringify(content);
        let base64Str = Buffer.from(str).toString('base64');
        let result = this.base64UrlEscapce(base64Str);
        return result;
    },
    encode(info, privateKey) {
        let header = this.toBase64({ "alg": "HS256", "typ": "JWT" }); //把头部变成base64
        let content = this.toBase64(info);
        let sign = this.signed(`${header}.${content}`, privateKey);
        let token = `${header}.${content}.${sign}`;
        return token;
    },

    decode(token, privateKey) {
        let [header, content, sign] = token.split('.');
        let newSign = this.signed(header + '.' + content, privateKey); //进行再次严密，看加密后的结果是否是一样的 
        if (sign == newSign) {
            let reverseContent = this.base64UrlUnEscape(content); //把 之前的 ‘=被省略、+替换成-，/替换成_’规则反转回去
            return JSON.parse(Buffer.from(reverseContent, 'base64').toString());
        } else {
            throw new Error('token值已经被串改,请重新登录'); //抛出异常

        }
    },
    signed(content, privateKey) {
        let base64Str = crypto.createHmac('sha256', privateKey).update(content.toString()).digest('base64');
        return this.base64UrlEscapce(base64Str);
    }
};
module.exports = myJwt;
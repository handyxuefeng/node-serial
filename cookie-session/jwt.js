const http = require('http');
const path = require('path');
const url = require('url'); //用来解析url
const querystring = require('querystring');
const crypto = require('crypto');
const uuid = require('uuid')
const key = 'hx';
const port = 9001;

function signed(value) {
    return crypto.createHmac('sha256', key).update(value.toString()).digest('base64');
}


const server = http.createServer((req, res) => {
    //访问/login
    console.log('req.url = ', req.url);

    if (req.ur == '/login') {
        console.log('object');
        let arr = [];
        req.on('data', (chunk) => {
            arr.push(chunk)
        });
        req.on('end', () => {
            let result;
            let formData = Buffer.concat(arr).toString();
            //传递的是表单数据
            if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
                result = querystring.parse(formData);
            }
            else if (req.headers['content-type'] === 'application/json') {
                result = JSON.parse(formData);
            }
            //console.log('req.headers = ', req.headers);
            console.log('result = ', result);
            res.end(result)
        })
    }
    else {
        res.end();
    }

});


server.listen(port, () => {
    console.log(`${port}端口已经启动`);
})
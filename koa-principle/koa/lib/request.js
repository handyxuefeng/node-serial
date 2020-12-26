const url = require('url')
const request = {
    //属性访问器，相当于Object.defineProperty()
    get path() {
        return url.parse(this.req.url).pathname;
    },
    get url() {
        return this.req.url
    }
};

// request文件仅仅是为了对req进行扩展，要把原生上的相关属性都是通过属性访问器的方式来访问


module.exports = request;


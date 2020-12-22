const http = require('http');
const url = require('url');
const routes = [
    {
        path: "*",
        method: "all",
        handler(req, res) {
            let method = req.method;
            let url = req.url;
            res.end(`the ${method} of this  ${url} Cannot Found , not defined`)
        }
    }
]
function createApplication() {

    const app = {
        get(path, handler) {
            routes.push({
                path,
                method: "GET",
                handler
            });
        },
        listen(port, handler) {
            const server = http.createServer((req, res) => {
                let { pathname } = url.parse(req.url);
                let requestMethod = req.method.toLowerCase();
                routes.forEach(item => {
                    let path = item.path;
                    let method = item.method.toLowerCase();;
                    let handler = item.handler;
                    if (path === pathname) {
                        if (method == requestMethod) {
                            return handler(req, res);
                        }
                    }
                });
                return routes[0].handler(req, res);
            });
            server.listen(port, (...args) => {
                handler(...args)
            });
        }
    }
    return app;





}

exports = module.exports = createApplication;
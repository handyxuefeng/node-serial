const Application = require("./application");
const Router = require('./router');

const Express = function createApplication() {
    const app = new Application()
    return app;
}

Express.Router = Router;

exports = module.exports = Express;
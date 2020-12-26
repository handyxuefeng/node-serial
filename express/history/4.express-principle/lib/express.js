const Application = require("./application");

function createApplication() {
    const app = new Application()
    return app;
}

exports = module.exports = createApplication;
const express = require('../express-principle');

const articleRouter = express.Router();



articleRouter.get('/add', function (req, res) {
    res.end('二级路由/article/add');
});


articleRouter.get('/remove', function (req, res) {
    res.end('二级/article/remove');
});






exports = module.exports = articleRouter;

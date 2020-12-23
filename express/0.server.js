const express = require('express'); //官方的
const app = express();
const port = 8888;
const path = require('path');
const fs = require('fs');
app.get('/',
    function (req, res, next) {
        console.log(1);
        next();
        console.log(4);

    },
    function (req, res, next) {
        console.log(2);
        next();
        console.log(5);

    },
    function (req, res, next) {
        console.log(3);
        next();
        console.log(6);
    }
);

app.get("/", (req, res) => {
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.end(fs.readFileSync(path.resolve(__dirname, 'public/index.html')));
});

const obj = { t: Date.now() * 1 }
app.get("/login", (req, res) => {
    console.log('12');
    res.end(JSON.stringify({ ...obj, method: "get" }));
});

app.post("/login", (req, res) => {

    res.end(JSON.stringify({ ...obj, method: "post" }));
});

app.delete("/login", (req, res) => {
    res.end(JSON.stringify({ ...obj, method: "delete" }));
});

app.put("/login", (req, res) => {
    res.end(JSON.stringify({ ...obj, method: "put" }));
});




app.listen(port, () => {
    console.log(`${port}端口已经启动。。。。。。。`);
});
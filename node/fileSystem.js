const path = require('path');
const fs = require('fs');

fs.readFile(path.resolve(__dirname, '1.txt'), (err, data) => {
    if (err) {
        console.log(err);
        return err;
    }
    fs.writeFile(path.resolve(__dirname, '2.txt'), data, (err) => {
        console.log('write Success');
    });
});

const path = require('path');
const fs = require('fs').promises;
let filePath = path.resolve(__dirname, './name.txt');
async function readAgeByAsync(filePath) {
    let ageFilename = await fs.readFile(filePath, 'utf8');
    let ageContext = await fs.readFile(path.resolve(__dirname, ageFilename), 'utf8');
    return ageContext;
};

readAgeByAsync(filePath).then(data => {
    console.log('async = ', data);
})


/**
 * generator+co  ===> async + await
 */

export { }
Promise.resolve().then(() => {
    console.log('1');
    Promise.resolve().then(() => {
        console.log('1-1');
        return Promise.resolve();
    }).then(() => {
        console.log('1-2');
    });
}).then(() => {
    console.log('2');
}).then(() => {
    console.log('3');
}).then(() => {
    console.log('4');
}).then(() => {
    console.log('5');
});

function light() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('red');
            resolve(1)
        }, 3000);
    }).then(() => {
        setTimeout(() => {
            console.log('green');
        }, 2000);
    }).then(() => {
        return light();
    })
}
light();
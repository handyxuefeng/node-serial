const EventEmitter = require('./events');

function Gril() {

}
Object.setPrototypeOf(Gril.prototype, EventEmitter.prototype)

let girl = new Gril();

girl.on('newListener', (type) => {
    console.log('newListener  -', type);
})

girl.on('a', (args) => {
    console.log(1, args);
})
girl.on('a', (args) => {
    console.log(2);
})


let fn3 = (args) => {
    console.log(3, args);
};
girl.once('a', fn3);

girl.once('b', () => {
    console.log('bbb');
});



// girl.off('a', fn3)
// girl.emit('a', '123');



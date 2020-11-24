//通过发布订阅模式解决并发问题
const path = require('path');
const fs = require('fs');

let person = {};
let events = {
    fnList: [],
    on(fn: Function) {
        this.fnList.push(fn);
    },
    emit() {
        this.fnList.forEach((fn: Function) => {
            fn();
        });
    }
}

//订阅一个事件
events.on(() => {
    if (Reflect.ownKeys(person).length === 2) {
        console.log('person =', person);
    }
});


fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', (err, data) => {
    person['age'] = data;
    events.emit();
});

fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', (err, data) => {
    person['name'] = data;
    events.emit();
});

export { }
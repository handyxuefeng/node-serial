
class EventEmitter {

    constructor() {
        this.eventsList = {}
    }
    on(eventName, fn) {
        if (!this.eventsList) this.eventsList = {};

        //如果订阅的事件名不是newListener，就触发newListener事件
        if (eventName !== 'newListener') {
            this.emit('newListener', eventName);
        }

        if (!this.eventsList[eventName]) {
            this.eventsList[eventName] = [];
        }
        this.eventsList[eventName].push(fn);

    }
    once(eventName, fn) {
        const once = (...args) => {
            fn(...args);
            this.off(eventName, once);
        }
        once.l = fn;
        this.on(eventName, once);
    }
    emit(eventName, ...args) {
        let eventList = this.eventsList[eventName] || [];
        eventList && eventList.length > 0 && eventList.forEach(fn => {
            fn(...args);
        });
    }
    off(eventName, fn) {
        let eventList = this.eventsList[eventName] || [];
        eventList.forEach((innerFn, idx) => {
            if (innerFn === fn || innerFn.l === fn) {
                eventList.splice(idx, 1);
            }
        })
    }


}


exports = module.exports = EventEmitter;
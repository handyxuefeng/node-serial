//观察者模式

const path = require('path');
const fs = require('fs');

//观察者
class Observer {
    public observerNameList: Array<string> = [];
    constructor(public name: string) {
        this.observerNameList.push(name);
    }
    notifyObserve(action: string, subjector: Objector, observe: Observer) {
        console.log(`${observe.name},${subjector.name} is ${action}`);
    }

}

//被观察者
class Objector {
    public observerList: Array<Observer> = [];
    constructor(public name: string) {
        //public name的写法，等价于 this.name = name;
    }
    emit(action: string) {
        this.observerList.forEach((observe: Observer) => {
            observe.notifyObserve(action, this, observe);
        });
    }
    addObserver(observe: Observer) {
        this.observerList.push(observe);
    }
}


let child = new Objector("kate");
let father = new Observer("father");
let monther = new Observer("monther");
let grandma = new Observer("grandma");

//添加观察者
child.addObserver(father);
child.addObserver(monther);
child.addObserver(grandma);

//被观察者发布
child.emit("cry");
child.emit("hungry");

export { }


//节点类
class Node {
    constructor(element, next) {
        this.element = element;
        this.next = next;
    }
}

//链表类
class LinkList {
    constructor() {
        this.head = null;
        this.currentNode = null;
    }
    //链表添加节点
    add(element) {
        let node = new Node(element, null);
        //表示是头节点
        if (this.head == null) {
            this.head = node;
            this.currentNode = node;
            node.next = null;
        }
        else {
            this.currentNode.next = node;
            this.currentNode = node;
        }
    }
    init(len) {
        for (let i = 0; i < len; i++) {
            this.add(i);
        }
    }
    reverse() {
        let current = this.head;  //1
        let lastNode = null;
        const findLastNode = () => {
            while (current) {
                if (current.next) {
                    current = current.next;
                }
                else {
                    lastNode = current;
                    break;
                }
            }
        }
        findLastNode();
        current = this.head;
        while (current) { //1
            if (current.next == null) {
                break;
            }
            else if (current.next && current.next.next != null) { //2
                current = current.next;
            }
            else {
                current.next.next = current;
                current.next = null;
                current = this.head;

            }
        }
        this.head = lastNode;
        return this.head;
    }


}

const linklist = new LinkList();
linklist.init(10)

console.dir(linklist, { depth: 100 });

let reverlinklist = linklist.reverse();
console.dir(reverlinklist, { depth: 100 });







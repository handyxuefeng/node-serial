class Node {
    constructor(element, parent) {
        this.element = element;
        this.parent = parent;
        this.left = null;
        this.right = null;
    }
}


class BST {
    constructor() {
        this.root = null;
        this.size = 0;
        this.output = [];
    }
    //利用递归实现先序遍历
    preorderTraversal() {
        const outputBst = (node) => {
            if (node === null) return;
            this.output.push(node.element);
            if (node.left) {
                outputBst(node.left)
            }
            if (node.right) {
                outputBst(node.right)
            }
        }
        outputBst(this.root);
        return this.output;
    }

    //通过数组实现先序遍历
    preSearchNodeByArray(cb) {
        let stack = [this.root];
        let list = [];
        while (stack.length) {
            let currentNode = stack.pop();
            list.push(currentNode.element);
            if (currentNode.right) {
                stack.push(currentNode.right);
            }
            if (currentNode.left) {
                stack.push(currentNode.left);
            }
        }
        console.log('利用队列通过数组实现先序遍历= ', list.join(','));
    }





    inOrderTraversal() {
        this.output.length = 0;
        const outputBst = (node) => {
            if (node === null) return;
            outputBst(node.left)
            this.output.push(node.element);
            outputBst(node.right)
        }
        outputBst(this.root);
        return this.output;
    }

    postTraversal() {
        this.output.length = 0;
        const outputBst = (node) => {
            if (node === null) return;
            outputBst(node.left)
            outputBst(node.right)
            this.output.push(node.element);
        }
        outputBst(this.root);
        return this.output;
    }
    /**
     * 利用队列实现层序遍历
     */
    levelTravel() {
        let currentNode = this.root;
        let stack = [this.root];
        let index = 0;
        this.output.length = 0;
        this.output.push(currentNode.element);
        while (currentNode = stack[index++]) {
            if (currentNode.left) {
                this.output.push(currentNode.left.element);
                stack.push(currentNode.left);
            }
            if (currentNode.right) {
                this.output.push(currentNode.right.element);
                stack.push(currentNode.right);
            }
        }
        return this.output;
    }
    //利用队列实现树的层序遍历
    levelTravelByArray(cb) {
        let stack = [this.root];
        let list = [];
        while (stack.length) {
            let currentNode = stack.shift();

            list.push(currentNode.element);
            if (currentNode.left) {
                stack.push(currentNode.left);
            }
            if (currentNode.right) {
                stack.push(currentNode.right);
            }
        }
        console.log('利用队列实现树的层序遍历 = ', list.join(','));
    }




    //树的反转
    reverseBst1() {
        const swap = (node) => {
            let temp = node.left;
            node.left = node.right;
            node.right = temp;
            node.left && swap(node.left);
            node.right && swap(node.right);
        }
        swap(this.root);
        return this.root;
    }
    reverseBst2() {
        let currentNode = this.root;
        let stack = [this.root];
        let index = 0;
        while (currentNode = stack[index++]) {
            let temp = currentNode.left;
            currentNode.left = currentNode.right;
            currentNode.right = temp;
            stack.push(currentNode.left, currentNode.right);
        }
        return this.root;
    }
    add(element) {
        let currentNode = this.root;  //每次都是从根节点开始
        if (this.root == null) {
            this.root = new Node(element, null);
            this.size++;
            return;
        }
        else {
            let compareResult = 0; //比较结果
            let parentNode = null;
            while (currentNode) {
                parentNode = currentNode;
                compareResult = element - currentNode.element;
                if (compareResult > 0) {
                    currentNode = currentNode.right;
                }
                else {
                    currentNode = currentNode.left;
                }
            }
            currentNode = new Node(element, parentNode);
            if (compareResult > 0) {
                parentNode.right = currentNode
            }
            else {
                parentNode.left = currentNode;
            }


        }
    }
}
let arr = [10, 8, 19, 6, 15, 22, 20];
let bst = new BST();

arr.forEach(item => {
    bst.add(item)
});
//console.dir(bst, { depth: 100 });

//
//let preorderTraversalList = bst.preorderTraversal();
//let InorderTraversalList = bst.inOrderTraversal();
//let postTraversalList = bst.postTraversal();
//let levelTravelList = bst.levelTravel();
//console.log('前序遍历', preorderTraversalList); // [10,  8,  6, 19,15, 22, 20]
//console.log('中序遍历', InorderTraversalList); // [6,  8, 10, 15,19, 20, 22]
//console.log('后序遍历', postTraversalList); // [6,  8, 15, 20,22, 19, 10]
//console.log('层序遍历', levelTravelList); // [10,  8, 19, 6, 15, 22, 20]


// //树的反转
// let newTree1 = bst.reverseBst1();
// console.dir(newTree1, { depth: 100 });


// // let newTree2 = bst.reverseBst2();
// // console.dir(newTree2, { depth: 100 });


//通过数组实现树的先序遍历
bst.preSearchNodeByArray()

//利用队列实现树的层序遍历
bst.levelTravelByArray();


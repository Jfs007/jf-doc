import Base from './base';
import {
    guid,
    getProperty
} from '../util/index';
import {
    getTextNode,
    loopNodes
} from "@/util/dom";
import {
    getRange
} from '@/util/range';
import Tabs from '@/lib/tabs.js';
export default class Node extends Base {
    constructor(options, update = false) {
        super();
        this.class = '';
        this.nodeName = '';
        this.text = '';
        this.style = '';
        this.parentNode = null;
        this.childNodes = [];
        this.nextSibling = null;
        this.previousSibling = null;
        this.lastChild = null;
        this.firstChild = null;
        this._dirty = true;
        // dom渲染的时候会进行绑定真实dom
        this.__el__ = null;
        // 是否处于虚拟节点阶段
        // this.__virtual__ = false;
        this.guid = guid();
        // this.render_id = guid();
        super.init(options);
        if (update) {
            this.guid = guid();
        }


    }

    get D() {
        let nodeType = this.nodeType; 
        if(nodeType == 'unit') {
            return this.parentNode.parentNode.parentNode;
        }
        if(nodeType == 'line') {
            return this.parentNode.parentNode;
        }
        if(nodeType == 'section') {
            return this.parentNode;
        }
        if(nodeType == 'doc') {
            return this;
        }

        return null;

    }
    get S() {
        let nodeType = this.nodeType; 
        if(nodeType == 'unit') {
            return this.parentNode.parentNode;
        }
        if(nodeType == 'line') {
            return this.parentNode;
        }
        if(nodeType == 'section') {
            return this;
        }

        return null;
    }

    get L() {
        let nodeType = this.nodeType;
        if(nodeType == 'unit') {
            return this.parentNode;
        }
        if(nodeType == 'line') {
            return this;
        }
        return null;

    }

    get U() {
        let nodeType = this.nodeType;
        if(nodeType!='unit') {
            return null;
        }
        return this;
    }

    getText() {
        return this.text;
    }


    get textContent() {
        let text = this.getText();
        loopNodes(this, (node) => {
            text = text + node.getText();
        });
        return text;
    }
    _updateDirty(flag) {
        this._dirty = flag;
    }
    _setParentNode(pnode) {
        this.parentNode = pnode;
    }
    _setChildNodes(childs) {
        this.childNodes = childs;
    }
    _solveSibling() {
        if (!this.parentNode) return;
        let {
            childNodes
        } = this.parentNode;
        let idx = childNodes.findIndex(node => node == this);
        // console.log(childNodes, 'childrem');
        this.nextSibling = childNodes[idx + 1];
        this.previousSibling = childNodes[idx - 1];

        if (this.nextSibling) {
            this.nextSibling.previousSibling = this;
        }
        if (this.previousSibling) {
            this.previousSibling.nextSibling = this;
        }
    }
    _solveLastChild() {
        this.lastChild = this.childNodes[this.childNodes.length - 1];
    }
    _solveFirstChild() {
        this.firstChild = this.childNodes[0];

    }




    isPlaceholder() {
        return this.textContent == Tabs.space;
    }
    isBlank() {
        
        return this.textContent == '';
    }



    /**
     * 
     * 
     * 
     * ||||||||||||
     * 
     */

    getPreviousSameNodeTypeNode() {
        let _this = this;
        let node = _this.previousSibling;
       
        if (node) return node;
        let level = 0;
        while (node = _this.parentNode) {
            level++;
            if (!node.previousSibling) {
                _this = node;
                // node = _parent.parentNode;
            } else {

                return getProperty(node.previousSibling, new Array(level).fill('lastChild').join('.'))
            }
        }
        return null;


        // let prevParent = node.parentNode.previousSibling;

        // while(!prevParent && node.parentNode) {
        //     node = node.parentNode;
        //     prevParent = node.parentNode


        // }
        // if (prevParent) {
        //     node = prevParent.lastChild;
        // } 



    }
    // 获取range内容的宽高
    getRangeRect() {
        
    }




    // 搜索节点之前所有nodetype一样的node
    getPreviousSameNodeTypeNodes(callback = () => { }) {
        let _this = this;
        let node = _this.previousSibling;
        while (node) {
            callback(node);
            let parentNode = node.parentNode;
            node = node.previousSibling;
            if (!node) {
                let prevParent = parentNode.previousSibling;
                if (prevParent) {
                    node = prevParent.lastChild;
                }
            }
        }
    }

    getNextSameNodeTypeNodes(callback = () => { }) {
        let _this = this;
        let node = _this.nextSibling;
        while (node) {
            callback(node);
            let parentNode = node.parentNode;
            node = node.nextSibling;
            if (!node) {
                let prevParent = parentNode.nextSibling;
                if (prevParent) {
                    node = prevParent.firstChild;
                }
            }
        }
    }

    getTextNodeHeight(node) {
        let textNode = getTextNode(node);
        let height = 0;
        let range = getRange();
        range.selectNodeContents(textNode);
        if (range.getBoundingClientRect) {
            var rect = range.getBoundingClientRect();
            if (rect) {
                height = rect.bottom - rect.top;
            }
        }
        return height;
    };

    emptyChildNodes() {
        this.childNodes = [];
        this.firstChild = null;
        this.lastChild = null;
        return this;
    }

    cloneNode() {

        let node = new this.constructor(this, true);
        node.guid = guid();
        return node;
    }


    

    insertBefore(newNode, referenceNode) {
        let idx = this.childNodes.findIndex(node => node == referenceNode);
        newNode._setParentNode(this)
        this.childNodes.splice(idx, 0, newNode);
        referenceNode._solveSibling();
        newNode._solveSibling();
        this._solveLastChild();
        this._solveFirstChild();

        return newNode;
    }


    appendChild(node) {
        node._setParentNode(this);
        this.childNodes.push(node);
        node._solveSibling();
        this._solveLastChild();
        this._solveFirstChild();
        return node;
    }
    appendChilds(nodes) {
        nodes.map(node => {
            this.appendChild(node);
        });
        return this;
    }
    removeChild(dnode) {
        let idx = this.childNodes.findIndex(node => node == dnode);
        if (idx > -1) {
            let node = this.childNodes.splice(idx, 1);
            let previousSibling = dnode.previousSibling;
            let nextSibling = dnode.nextSibling;
            // console.log(previousSibling&&previousSibling.text, nextSibling&&nextSibling.text, 'vw', dnode.nextSibling.text)
            if (previousSibling) {
                // pr
                previousSibling._solveSibling();
            }
            if (nextSibling) {
                nextSibling._solveSibling();
            }
            // console.log('vw1', dnode.nextSibling.text)
            this._solveLastChild();
            this._solveFirstChild();

            return dnode;
        }
        this._console.error('不存在该节点');
    }

    replaceChild(newChild, oldChild) {
        let idx = this.childNodes.findIndex(node => node == oldChild);
        newChild._setParentNode(this);
        if (idx > -1) {
            let node = this.childNodes.splice(idx, 1);
            this.childNodes.splice(idx, 0, newChild);
            newChild._solveSibling();
            this._solveLastChild();
            this._solveFirstChild();
            return oldChild;
        }
        this._console.error('不存在该节点');
    }





}
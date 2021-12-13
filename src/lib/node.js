import Base from './base';
import {
    guid
} from '../util/index';
import {
    getTextNode
} from "@/util/dom";
import {
    getRange
} from '@/util/range';
export default class Node extends Base {
    constructor(options, update = false) {
        super();
        this.class = '';
        this.nodeName = '';
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
        this.lastChild = this.childNodes[this.childNodes.length-1];
    }
    _solveFirstChild() {
        this.firstChild = this.childNodes[0];
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

import Base from './base';
import { guid } from '../util/index';
import { getTextNode } from "@/util/dom";
import { getRange } from '@/util/range';
export default class Node extends Base {
    constructor(options, update = false) {
        console.log(options, update)
        super();
        this.class = '';
        this.nodeName = '';
        this.style = '';
        this.parentNode = null;
        this.childNodes = [];
        this.nextSibling = null;
        this.previousSibling = null;
        this._dirty = true;
        // dom渲染的时候会进行绑定真实dom
        this.__el__ = null;
        this.guid = guid();
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
        let { childNodes } = this.parentNode;
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

    cloneNode() {

        return new this.constructor(this, true);
    }

    insertBefore(newNode, referenceNode) {
        let idx = this.childNodes.findIndex(node => node == referenceNode);
        newNode._setParentNode(this)
        this.childNodes.splice(idx, 0, newNode);
        referenceNode._solveSibling();
        newNode._solveSibling()

        return newNode;
    }


    appendChild(node) {
        node._setParentNode(this);
        this.childNodes.push(node);
        node._solveSibling();
    }
    removeChild(dnode) {
        let idx = this.childNodes.findIndex(node => node == dnode);
        if (idx > -1) {
            let node = this.childNodes.splice(idx, 1);
            let previousSibling = dnode.previousSibling;
            let nextSibling = dnode.nextSibling;
            if (previousSibling) {
                previousSibling._solveSibling();
            }
            if (nextSibling) {
                nextSibling._solveSibling();
            }

            return node;
        }
        this._console.error('不存在该节点');
    }

    replaceChild(newChild, oldChild) {
        let idx = this.childNodes.findIndex(node => node == oldChild);
        newChild._setParentNode(this);
        if(idx>-1) {
            let node = this.childNodes.splice(idx, 1);
            this.childNodes.splice(idx, 0, newChild);
            newChild._solveSibling();
            return node;
        }
        this._console.error('不存在该节点');
    }




}
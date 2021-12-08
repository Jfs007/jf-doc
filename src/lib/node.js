
import Base from './base';
import { guid } from '../util/index';
export default class Node extends Base {
    constructor(options) {
        super();
        this.class = '';
        this.nodeName = '';
        this.style = '';
        this.parentNode = null;
        this.childNodes = [];
        this.nextSibling = null;
        this.previousSibling = null;
        this._dirty = true;
        this.guid = guid();
        super.init(options);

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
        if(!this.parentNode) return;
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
    

    appendChild(node) {
        node._setParentNode(this);
        this.childNodes.push(node);
        node._solveSibling();
    }
    removeChild(dnode) {
        let idx = this.childNodes.findIndex(node => node == dnode);
        if (idx > -1) {
            let node =  this.childNodes.splice(idex, 1);
            this._solveSibling();
            return node;
        }
        this._console.error('不存在该节点');
    }



}
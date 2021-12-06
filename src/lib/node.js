
import Base from './base';
export default class Node extends Base {
    constructor(options){
        super();
        this.class = '';
        this.nodeName = '';
        this.style = '';
        this.parentNode = null;
        this.childNodes = [];
        super.init(options);
        
    }
    _setParentNode(pnode) {
        this.parentNode = pnode;
    }
    _setChildNodes(childs) {
        this.childNodes = childs;
    }
    appendChild(node) {
        this.childNodes.push(node);
    }
    removeChild(dnode) {
        let idx = this.childNodes.findIndex(node => node == dnode);
        if(idx>-1) {
            return this.childNodes.splice(idex, 1);
        }
        this._console.error('不存在该节点');
    }

  
}
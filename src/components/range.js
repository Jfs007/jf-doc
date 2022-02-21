
import Base from '@/lib/base';
import Node from '@/lib/node';
import { isTextNode, getTextNode } from '@/util/dom';
import { computedRangeClientBoundary } from '@/util/computed';


// import { guid } from '../util/index';
// 选中的定位对象

import Event from '@/lib/events';


let POINTER = {
    TAP: 'mousedown',
    OVER: 'mousemove',
    END: 'mouseup'
}


class SelectionPointer extends Base {
    constructor(params) {
        super();

        this.x = params.clientX;
        this.y = params.clientY;
        this.target = params.target;

    }


}



export default class Range extends Base {
    constructor(options = {}) {


        super(options);
        this.Selection = null;
        this.startNode = null;
        this.startContainerNode = null;
        this.endNode = null;
        this.startOffset = null;
        this.endOffset = null;
        this.endContainerNode = null;
        super.init(options);

    }



    cloneRange() {
        // return new this.con
    }

    setStart(node, offset) {
        this.startNode = node;
        this.startContainerNode = node.parentNode;
        this.startOffset = offset;
    }

    setEnd(node, offset) {
        this.endNode = node;
        this.endOffset = offset;
        this.endContainerNode = node.parentNode;
        
    }




    sectioned(e) {
        let { target } = e;



    }











}
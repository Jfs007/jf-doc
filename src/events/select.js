
import Base from '@/lib/base';
import Node from '@/lib/node';
import Range from '@/components/range';
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



export default class Select extends Event {
    constructor(options = {}) {


        super(options);
        this.$el = document.body;
        this.scope = document.body;
        this.tap = null;
        this.over = null;
        this.end = null;
        this.window = null;
        

        super.init(options);
        this.Selection = this.window.getSelection();;
        this.on(this.$el, POINTER.TAP, this._handleTap.bind(this));
        this.on(this.$el, POINTER.OVER, this._handleOver.bind(this));
        this.on(document.body, POINTER.END, this._handleEnd.bind(this));

    }

    get _Selection() {
        return this.Selection;
    }

    _handleTap(events) {

        this._Selection.removeAllRanges();

        this.tap = new SelectionPointer(events);
        this.Selection = this.window.getSelection();
    }
    _handleOver(events) {
        if (!this.tap) return;
        this.over = new SelectionPointer(events);
        this.matchNode();

    }
    _handleEnd() {

        if (this.over) {
            // this.matchNode();
        }
        this.tap = null;
        this.over = null;
        this.end = null;
        // this.Selection = null;

    }

    isInScoped(target) {
        return this.scope.contains(target)
    }




    draw() {

    }

    cloneRange() {
        // return new this.con
    }


    getNodeByPointer(pointer) {
        let doc = this.window;

        let docEl = doc.__el__;
        
        doc.childNodes.map(node => {
            let el = node.__el__;
            let boundary = el.getBoundingClientRect();
            // boundary
            // boundary.
        })
    }



    /**
     * 
     * @returns 
     * 
     * 
     *  |||||||||||||||||
     * 
     * 
     * 
     */

    boundaryCatch(boundary, reference) {
        boundary


    }

    






    matchNode() {
        let { tap, over } = this;
        if (!over) return;
        let range = new Range();
        let startPoint = null;
        let endPoint = null;
        if (tap.x > over.x && tap.y > over.y) {
            endPoint = tap;
            startPoint = over;
        } else {

            startPoint = tap;
            endPoint = over;
        }




        // 判断是否在scope内
        let startIn = this.isInScoped(startPoint.target);
        if (startIn) {
            let textNode = getTextNode(startPoint.target);
            if (textNode) {
                let boundary = computedRangeClientBoundary(startPoint, textNode);
                range.setStart(textNode, boundary.offset);

            }
        }else {

        }
        let endIn = this.isInScoped(endPoint.target);
        if (endIn) {
            let textNode = getTextNode(endPoint.target);
            if (textNode) {
                let boundary = computedRangeClientBoundary(endPoint, textNode);
                range.setEnd(textNode, boundary.offset);
            }
        }else {
            console.log(endPoint.target, 'target')
        }
        this._Selection.removeAllRanges();
        this._Selection.addRange(range);

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
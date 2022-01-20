
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
        this.$el = document.body;
        this.scope = document.body;
        // this._doc = this.$el.__el__;
        // this.__el__ = this.$e
        // this._doc = options.ctx;
        this.event = new Event();

        this.tap = null;
        this.over = null;
        this.end = null;
        this.startNode = null;
        this.startContainerNode = null;
        this.endNode = null;
        this.startOffset = null;
        this.endOffset = null;
        this.endContainerNode = null;

        console.log(options, 'params')
        super.init(options);
        // let selection = window.getSelection();
        // if (selection) {
        //     let range = selection.getRangeAt(0);
        //     let { startContainer } = range;
        // }

        this.event.on(this.$el, POINTER.TAP, this._handleTap.bind(this));
        this.event.on(this.$el, POINTER.OVER, this._handleOver.bind(this));
        this.event.on(document.body, POINTER.END, this._handleEnd.bind(this));

    }

    _handleTap(events) {

        this.tap = new SelectionPointer(events);
    }
    _handleOver(events) {
        if (!this.tap) return;
        this.over = new SelectionPointer(events);
       
    }
    _handleEnd() {
        
        if(this.over) {
            this.matchNode();
        }
        this.tap = null;
        this.over = null;
        this.end = null;
       
    }

    isInScoped(target) {
        return this.scope.contains(target)
    }




    draw() {

    }




    matchNode() {
        let { tap, over } = this;
        if (!over) return;









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
                this.setStart(textNode, boundary.offset);
                
            }
        }
        let endIn = this.isInScoped(endPoint.target);
        if (endIn) {
            let textNode = getTextNode(endPoint.target);
            if (textNode) {
                let boundary = computedRangeClientBoundary(endPoint, textNode);
                this.setEnd(textNode, boundary.offset);
            }
        }
        // this.addRange(this);
        




        // console.log(v, 'v');


        let _startNode = null;
        let _endNode = null;

        this._each(this.scope.childNodes, node => {
            // console.log(node, 'node');
            let { y, height } = node.getBoundingClientRect();
            // 符合
            if (startPoint.y >= y && startPoint.y <= y + height && !_startNode) {
                _startNode = node;

            }
            // if(endPoint.y )
            if (_startNode && _endNode) return 'break';

        });
        // console.log(this.doc, 'doc')
        let Selection = this.window.getSelection();
        console.log(Selection, 'Selec')
        Selection.addRange(this)


        
        // console.log(_startNode, 'start')


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
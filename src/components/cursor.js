
import Node from '@/lib/node';
import { computedRangeClientBoundary, computedClientBoundaryByOffset } from "@/util/computed";
import { getTextNode, getComputedStyle, getScroll } from "@/util/dom";
import Tabs from '@/lib/tabs.js';
import {
    getRange
} from '@/util/range';

export default class Cursor extends Node {
    constructor(params) {
        super(params);
        this.offset = -1;
        this.left = undefined;
        this.top = undefined;
        this.height = undefined;
        this.width = 2;
        this._boundary = null;
        this.dom = null;
        this.node = null;
        this.composition = '';
        this.input = '';
        this.oldInput = '';
        this.keyCode = '';
        // 当锁的时候，update/set/setCuror将无效
        this.locked = false;
        // 绑定的dom
        this.__el__ = null;
    }
    reset() {
        this.empty();
        this.emptyInput();
        this.closeComposition();
    }
    empty() {
        this._boundary = null;
        this.height = 30;
        this.offset = -1;
        this.left = undefined;
        this.top = undefined;
        this.dom = null;
        this.node = null;
        // this.composition = '';
        this.input = '';
        this.oldInput = '';
        

    }
    closeComposition() {
        this.unlock();
        this.composition = '';
        this.emptyInput();

    }
    emptyInput() {
        if (this.__el__) {
            this.__el__.value = '';
        }
        this.oldInput = '';
        this.input = '';
    }
    updateInput(value) {
        if (!this.composition) {
            value = value.replace(/\s/g, Tabs.space)
        }
        let oldInput = this.oldInput;
        if (value.length > oldInput.length) {
            oldInput = oldInput.replace(/\\/g, '\\\\')
            let dymReg = new RegExp(`${oldInput}(.*)`);
            let rs = value.match(dymReg);
            if (rs) {
                this.input = rs[1]
            }
        }
        this.oldInput = value;
    }
    lock() {
        this.locked = true;
    }
    unlock() {
        this.locked = false;
    }

    update(offset = undefined) {
        if(this.locked) return;
        if (typeof offset == 'number') {
            let textNode = getTextNode(this.dom);
            
            this._boundary = computedClientBoundaryByOffset(textNode, offset);
            console.log(textNode, offset, 'offset', this.dom);
        }
        this.setCursor(this._boundary);
    }
    set(dom, offset) {
        if(this.locked) return;
        this.empty();
        let textNode = getTextNode(dom);
       

        this.offset = offset;
        let boundary = computedClientBoundaryByOffset(textNode, offset);
        this.setByBoundary(boundary);
    }


    setByBoundary(boundary) {
        let { range } = boundary;
        if (range) {
            this.dom = range.startContainer.parentNode;
            this.node = this.dom.__unit__;
            this.node.__cursor__ = this;

            this._boundary = boundary;

            let style = getComputedStyle(this.dom);
            let fontSize = parseInt(style.fontSize);
            // console.log(style.lineHeight, 'lineht')
            fontSize = isNaN(fontSize) ? undefined : fontSize;
            let { height } = boundary.rect;
            let cursor_height = fontSize ? fontSize * (1.2) : height;
            this.height = cursor_height;
            this.setCursor(boundary);
        }
    }

   

    place(e) {
        this.unlock();
        if (this.__el__) {
            this.__el__.value = '';
        }

        this.empty();
        let textNode = getTextNode(e.target);
        let boundary = computedRangeClientBoundary(
            {
                x: e.clientX,
                y: e.clientY,
            },
            textNode
        );
        this.setByBoundary(boundary);
        console.log(e.target.__unit__.textContent)
        this.__el__.focus();



    }


    setCursor(boundary) {
        if(this.locked) return;
        if (!boundary.range) return;
        let { x, y, height } = boundary.rect;
        let scrollTop = document.body.scrollTop || 0;
        let scrollLeft = document.body.scrollLeft || 0;
        let top = (height - this.height) / 2 + y + scrollTop;
        this.left = x + scrollLeft;
        this.top = top;
        this.offset = boundary.offset;



    }

    setCursorAccordWithCursor(cursor, referenceLine) {
       
        let range = getRange();
        let scrollLeft = document.body.scrollLeft || 0;
        let isSet = false;
        let _cursor = null;
        referenceLine.childNodes.find(Unit => {
            if(isSet) return true;
            for(let offset = 0; offset <= Unit.getTextLength(); offset++) {
               
                let textNode = getTextNode(Unit.__el__);
                let {
                    rect
                } = computedClientBoundaryByOffset(textNode, offset, 'right', range);
                let x = rect.x + scrollLeft;

                if(x >= cursor.left) {
                    isSet = true;

                    if(_cursor && (_cursor.diff < x - cursor.left)) {
                        offset = offset - 1 < 0 ? 0 : offset - 1
                    }
                    this.reset();
                    this.set(Unit.__el__, offset)
                    break;
                }
                _cursor = {
                    x,
                    unit: Unit,
                    offset,
                    diff: Math.abs(x-cursor.left)
                }
            }
            // computedClientBoundaryByOffset(Unit.)
        })
        if(!isSet) {
            let lastChild = referenceLine.lastChild;
            this.reset();
            this.set(lastChild.__el__, lastChild.getTextLength());
        }
        
       
    }  




}

import Base from '@/lib/base';
import { computedRangeClientBoundary, computedClientBoundaryByOffset } from "@/util/computed";
import { getTextNode, getComputedStyle, getScroll, isTextNode } from "@/util/dom";
import Tabs from '@/lib/tabs.js';
import {
    getRange
} from '@/util/range';

export default class Cursor extends Base {
    constructor(doc) {
        super();
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
        this.doc = doc;
    }
    focus() {
        this.__el__ && this.__el__.focus();
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
    setNode(node) {
        this.node = node;
    }

    update(offset = undefined) {
        if(this.locked) return;
        if (typeof offset == 'number') {
            // let textNode = getTextNode(this.dom);
            
            this._boundary = computedClientBoundaryByOffset(this.dom, offset);
        }
        this.setCursor(this._boundary);
    }
    set(dom, offset) {
        
        if(this.locked) return;
        this.empty();
        this.offset = offset;
       
        let boundary = computedClientBoundaryByOffset(dom, offset);
        this.setByBoundary(boundary);
        // this.__el__.focus();
        this.__el__.focus();
    }


    setByBoundary(boundary) {
        let { range } = boundary;
        if (range) {
            
            this.dom = isTextNode(range.startContainer) ? range.startContainer.parentNode : range.startContainer;
            // console.log(range.startContainer, 'range.startContainer', this.dom, this.dom.__unit__.text, '---', this.node&&this.node.text)
            this.node = this.dom.__unit__;
            this.node.__cursor__ = this;

            this._boundary = boundary;

            let style = getComputedStyle(this.dom);
            let fontSize = parseInt(style.fontSize);
            fontSize = isNaN(fontSize) ? undefined : fontSize;
            let { height } = boundary.rect;
            let cursor_height = fontSize && this.node.isText() ? fontSize * (1.2) : height;
            this.height = cursor_height;
            this.setCursor(boundary);
        }
    }


   

    place(e) {
        this.unlock();
        if (this.__el__) {
            this.__el__.value = '';
        }
        this.emptyInput();
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
        this.__el__.focus();



    }


    setCursor(boundary) {
        if(this.locked) return;
        if(!boundary) return;
        if (!boundary.range) return;
        // this.emptyInput();
        let { x, y, height } = boundary.rect;
        let scrollTop = this.doc.__el__.scrollTop || 0;
        let scrollLeft = this.doc.__el__.scrollLeft || 0;
        let docRect = this.doc.rect;
        let top = -Math.abs(height - this.height) / 2 + y + scrollTop;
        this.left = x + scrollLeft - docRect.left;
        this.top = top - docRect.top;
        this.offset = boundary.offset;
        



    }

    setCursorAccordWithCursor(cursor, referenceLine) {
       
        let range = getRange();
        let scrollLeft = this.doc.__el__.scrollLeft || 0;
        let isSet = false;
        let _cursor = null;
        referenceLine.childNodes.find(Unit => {
            if(isSet) return true;
            for(let offset = 0; offset <= Unit.getTextLength(); offset++) {
               
                // let textNode = getTextNode(Unit.__el__);
                let {
                    rect
                } = computedClientBoundaryByOffset(Unit.__el__, offset, 'right', range);
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

import Node from '@/lib/node';
import { computedRangeClientBoundary, computedClientBoundaryByOffset } from "@/util/computed";
import { getTextNode, getComputedStyle, getScroll } from "@/util/dom";
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
        // 绑定的dom
        this.__el__ = null;
    }
    closeComposition() {
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
            value = value.replace(/\s/g, '\u00a0')
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

    update(offset = undefined) {
        if (typeof offset == 'number') {
            let textNode = getTextNode(this.dom);
            
            this._boundary = computedClientBoundaryByOffset(textNode, offset);
            console.log(offset, this._boundary)
        }
        this.setCursor(this._boundary);
    }
    set(dom, offset) {
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

    empty() {
        this._boundary = null;
        this.height = 30;
        this.offset = -1;
        this.left = undefined;
        this.top = undefined;
        this.dom = null;
        this.node = null;
        this.composition = '';
        this.input = '';
        this.oldInput = '';
        this.emptyInput();

    }

    place(e) {
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
        this.setByBoundary(boundary)



    }


    setCursor(boundary) {
        if (!boundary.range) return;
        let { x, y, height } = boundary.rect;
        let scrollTop = document.body.scrollTop || 0;
        let scrollLeft = document.body.scrollLeft || 0;
        let top = (height - this.height) / 2 + y + scrollTop;
        this.left = x + scrollLeft;
        this.top = top;
        this.offset = boundary.offset;

    }




}
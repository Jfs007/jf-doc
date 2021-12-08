
import Node from '@/lib/node';
import { computedRangeClientBoundary, computedClientBoundaryByOffset  } from "@/util/computed";
import { getTextNode, getComputedStyle, getScroll } from "@/util/dom";
export default class Section extends Node {
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
        this.input = '';
        this.oldInput = '';
    }
    updateInput(value) {
        // console.log(value, 'value')
        // 道格拉斯·凯奇1 道格拉斯·凯奇12
        // this.oldInput = value;
        let oldInput = this.oldInput;
        if(value.length > oldInput.length) {
            oldInput = oldInput.replace(/\\/g, '\\\\')
            let dymReg = new RegExp(`${oldInput}(.*)`);
            let rs = value.match(dymReg);
            if(rs) {
                this.input = rs[1]
            }
        }
        this.oldInput = value;
    }

    update(offset = undefined) {
        if(typeof offset == 'number') {
            let textNode = getTextNode(this.dom);
            this.offset = this.offset + offset
            this._boundary =  computedClientBoundaryByOffset(textNode, this.offset);
        }
        this.setCursor(this._boundary);
    }
    empty() {
        this._boundary = null;
        this.height = 30;
        this.offset = -1;
        this.left = undefined;
        this.top = undefined;
        this.dom = null;
        this.node = null;
        this.input = '';
    }

    place(e) {
        let textNode = getTextNode(e.target);
        let boundary = computedRangeClientBoundary(
            {
                x: e.clientX,
                y: e.clientY,
            },
            textNode
        );

        let { range } = boundary;
        if(range) {
            this.dom = range.startContainer.parentNode;
            this.node = this.dom.__unit__;
            this.node.__cursor__ = this;
        }
        this._boundary = boundary;

        let style = getComputedStyle(e.target);
        let fontSize = parseInt(style.fontSize);
        fontSize = isNaN(fontSize) ? undefined : fontSize;
        let { height } = boundary.rect;
        let cursor_height = fontSize ? fontSize + 1 : height;
        this.height = cursor_height;
        this.setCursor(boundary);
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
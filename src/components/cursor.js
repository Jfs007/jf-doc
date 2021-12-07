
import Node from '@/lib/node';
import { computedRangeClientBoundary } from "@/util/computed";
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
        this.input = ''
    }
    updateInput(value) {
        this.input = value;
    }

    update(e) {
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

import Node from '@/lib/node';
import { computedRangeBoundary } from "@/util/computed";
import { getTextNode, getComputedStyle, getScroll } from "@/util/dom";
export default class Section extends Node {
    constructor(params) {
        super(params);
    }

    place(e) {
        let textNode = null;
        let boundary = computedRangeBoundary(
            {
                x: e.clientX,
                y: e.clientY,
            },
            textNode
        );
    }


    setCursor(boundary, fontSize) {
        if (!boundary.range) return;
        let { x, y, height } = boundary.rect;
        let scrollTop = document.body.scrollTop || 0;
        let scrollLeft = document.body.scrollLeft || 0;
        let cursor_height = fontSize ? fontSize + 1 : height;
        let top = (height - cursor_height) / 2 + y + scrollTop;
        this.cursor = {
            index: boundary.index,
            _style: {
                left: x + scrollLeft + "px",
                top: top + "px",
                height: cursor_height + "px",
                width: 2 + "px",
            },
        };
    },




}
import Node from '@/lib/node';
// import { guid } from '../util/index';
import {
    getRange
} from '@/util/range';
import {
    computedClientBoundaryByOffset
} from '@/util/computed';
import {
    getTextNode
} from '@/util/dom';
import Base from '../lib/base';

class breakWord extends Base {
    constructor(options) {
        super(options);
        this.breaks = [];
        // overflow / blank
        this.type = '';
        super.init(options);
    }
    push(_break) {
        this.breaks.push(_break);
    }

}
export default class Section extends Node {
    constructor(options, update) {
        // super(params);
        super(options, update);
        this.nodeType = 'section';
        this.class = 'jf-section';
        super.init(options);
    }

    insetLine() {

    }
    breakWord2(cursor) {
        let overOrBlankWidth = 0;

        let range = getRange();
        let node = cursor ? cursor.node : this.childNodes[0].childNodes[0];
        let Line = node.parentNode;
        let lineRect = Line.__el__.getBoundingClientRect();
        let clientWidth = Line.__el__.clientWidth;
        let Section = Line.parentNode;
        let breakword = new breakWord();
        let renderQueue = [];
        // while(Line. )
        // console.log('overflow::', Line.isOverflow(), 'line', Line)
        if (!Line.isOverflow()) {
            let isBlank = true;
            breakword.type = 'blank'
           
            while (isBlank && Line) {
                let nextLine = Line.nextSibling;
                if (nextLine) {
                    let lastChild = Line.lastChild;
                    let offset = lastChild ? lastChild.getTextLength() : 0;
                    let {
                        rect
                    } = computedClientBoundaryByOffset(getTextNode(lastChild.__el__), offset, 'right', range);
                    let blank = clientWidth - (rect.x - lineRect.x);
                    // overOrBlankWidth = blank;
                    let content = nextLine.getAccordWithContentRect(({
                        x
                    }) => {
                        if (x > blank) {
                            return true;
                        }
                    });
                    let prev = content.prev;
                    if (!prev) {
                        isBlank = false;
                        break;
                    };
                    breakword.push(prev);
                    let content_offset = prev.offset;
                    let nodes = prev.nodes.map((node, index) => {
                        if (index == prev.nodes.length - 1) {
                            if (content_offset == node.getTextLength()) {
                                nextLine.removeChild(node);
                                return node;
                            } else {
                                let text = node.text;
                                node.text = text.slice(content_offset);
                                if (node.isBlank()) {
                                    Line.removeChild(node);
                                }
                                let clone = node.cloneNode();
                                clone.guid = node.guid;
                                clone.text = text.slice(0, content_offset);

                                return clone;
                            }
                        } else {
                            nextLine.removeChild(node);
                            return node;
                        }
                    });
                    if (!nextLine.childNodes.length) {
                        Section.removeChild(nextLine);
                    }
                    Line.appendUnits(nodes);
                    Line = Line.nextSibling;
                } else {
                    isBlank = false;
                }
            }
            return breakword;
        } else {
            breakword.type = 'overflow';
            let isOverflow = true;
            while (isOverflow) {
                let nextLine = Line.nextSibling;

                let content = Line.getAccordWithContentRect(({
                    x,
                }) => {
                    if (x + overOrBlankWidth < clientWidth) {
                        return true;
                    }
                }, 'desc');
                // 说明没有发生overflow
                console.log('over');
                if (!content.prev) {
                    isOverflow = false;
                    break;
                }
                breakword.push(content);

                overOrBlankWidth = content.first.x - content.x;
                // console.log(content, 'conten')
                let prev = content;
                let content_offset = prev.offset;
                let nodes = prev.nodes.map((node, index) => {
                    if (index == 0) {
                        if (content_offset == 0) {
                            Line.removeChild(node);
                            return node;
                        } else {
                            let text = node.text;
                            node.text = text.slice(0, content_offset);
                            if (node.isBlank()) {
                                Line.removeChild(node);
                            }
                            let clone = node.cloneNode();
                            clone.guid = node.guid;
                            clone.text = text.slice(content_offset);
                            return clone;
                        }
                    } else {
                        Line.removeChild(node);
                        return node;
                    }
                });
                // isOverflow = false;
                if (!nextLine) {
                    let newLine = Line.cloneNode();
                    newLine.emptyChildNodes();
                    Section.appendChild(newLine);
                    newLine.startInsertUnits(nodes);
                    nextLine = newLine;
                    isOverflow = false;

                } else {
                    renderQueue.push(() => {
                        nextLine.startInsertUnits(nodes);
                    })
                }
                Line = nextLine;
            }

            renderQueue.map(queue => queue());
            return breakword;

        }

    }





}
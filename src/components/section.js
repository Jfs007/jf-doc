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
import LineBase from './line';
import Tabs from '@/lib/tabs.js';


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
    // 在光标指定段落下插入一个段落 并将光标所在段落(该段落的文本)以后的文本剪切到新段落
    insetSection(cursor) {
        let {
            offset,
            node
        } = cursor;
        let Line = node.parentNode;
        let cloneSection = this.cloneNode();
        cloneSection.emptyChildNodes();
        let doc = this.parentNode;
        let cloneLine = Line.cloneNode();
        cloneLine.emptyChildNodes();
        if (offset == 0) {
            Line.removeChild(node);
            let cloneNode = node.cloneNode();
            cloneNode.guid = node.guid;
            cloneLine.appendChild(cloneNode);

        } else {
            // 切割光标所在位置文本
            let text = node.text;
            node.text = text.slice(0, offset);
            let cloneNode = node.cloneNode();
            cloneNode.guid = node.guid;
            cloneNode.text = text.slice(offset);
            if (!cloneNode.isBlank()) {
                cloneLine.appendChild(cloneNode);
            }
            // node = cloneNode;

        }
        node = node.nextSibling;
        while (!!node) {
            let _node_ = node;
            node = node.nextSibling;
            Line.removeChild(_node_);
            cloneLine.appendChild(_node_.cloneNode());
        }
        if (cloneLine.isBlank() && !this.nextSibling) {
            // cloneLine.childNodes[0].text = Tabs.space;
            let clone = cursor.node.cloneNode();
            clone.text = Tabs.space;
            cloneLine.appendChild(clone)
        }
        if (Line.isBlank()) {

            let clone = cursor.node.cloneNode();
            clone.text = Tabs.space;
            Line.appendChild(clone)
        }
        if (cloneLine.childNodes.length) {
            cloneSection.appendChild(cloneLine);
        }

        let cLine = Line.nextSibling;

        //    console.log(cLine)
        while (!!cLine) {
            let _cline_ = cLine;
            cLine = cLine.nextSibling;
            this.removeChild(_cline_);
            cloneSection.appendChild(_cline_);
        }
        if (!this.nextSibling) {
            doc.appendChild(cloneSection);
        } else {
            doc.insertBefore(cloneSection, this.nextSibling);
        }

        return cloneLine;








        // let 


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

        function complement() {
            let isBlank = true;
            breakword.type = 'blank'
            let blank = 0;
            let complement = 0;
            console.info('complement')
            while (isBlank && Line) {
                let nextLine = Line.nextSibling;
                if (nextLine) {
                    let lastChild = Line.lastChild;
                    console.log('%c%s', 'background: green;color: white', 'complement: ',  'lastChild', Line, lastChild)
                    let offset = lastChild ? lastChild.getTextLength() + (lastChild.__offset__ || 0) : 0;
                    let {
                        rect
                    } = computedClientBoundaryByOffset(lastChild.__el__, lastChild.isText() ? offset : 1, 'left', range);
                    blank = clientWidth - (rect.x - complement - lineRect.x);

                    nextLine.getAccordWithContentRect(({
                        x,
                        text,
                        offset,
                        node
                    }) => {
                        if (x > blank) {
                            // console.log(x, '______', text, offset)
                            return true;
                        }
                    });
                    complement = nextLine.rectRange.endX - nextLine.rectRange.startX;
                    // console.log(complement, 'prev')
                    // let prev = content.prev;
                    // console.log('%c%s', 'background: green;color: white', 'complement: ', complement, Line.rectRange.clone(), 'collapsed', Line.rectRange.collapsed, blank);
                    // console.log('%c%s', 'background: green;color: white', 'blank', content, lastChild.__el__, blank)
                    if (nextLine.rectRange.collapsed) {
                        isBlank = false;
                        renderQueue.map(queue => queue());
                        break;
                    };
                    // breakword.push(prev);
                    let content_offset = nextLine.rectRange.endOffset;
                    let nodes = nextLine.rectRange.getRange((node) => {
                        if (!node.isText()) {
                            let clone = node.cloneNode();
                            clone.guid = node.guid;
                            nextLine.removeChild(node);
                            clone.__x__ = complement;
                            renderQueue.push(_ => {
                                clone.__x__ = undefined;
                                clone.__el__.__over__ = undefined;
                                clone.__offset__ = undefined;
                            })
                            return clone;

                        }
                        if (node == nextLine.rectRange.endNode) {
                            if (content_offset == node.getTextLength()) {
                                nextLine.removeChild(node);
                                node.__x__ = complement;
                                renderQueue.push(_ => {
                                    node.__el__.__over__ = undefined;
                                    node.__x__ = undefined;
                                    node.__offset__ = undefined;
                                })
                                return node;
                            } else {
                                let text = node.text;
                                node.text = text.slice(content_offset);
                                if (node.isBlank()) {
                                    nextLine.removeChild(node);
                                }
                                let clone = node.cloneNode();
                                clone.guid = node.guid;
                                clone.text = text.slice(0, content_offset);
                                node.__el__.__over__ = content_offset;
                                clone.__x__ = complement;
                                node.__offset__ = node.__offset__ ? node.__offset__ + content_offset : content_offset;
                                // console.log('%c%s', 'background: black;color: white', node.__offset__)
                                renderQueue.push(_ => {
                                    node.__el__.__over__ = undefined;
                                    clone.__x__ = undefined;
                                    node.__offset__ = undefined;
                                })
                                return clone;
                            }
                        } else {
                            nextLine.removeChild(node);
                            node.__x__ = complement;
                            renderQueue.push(_ => {
                                node.__x__ = undefined;
                            })
                            return node;
                        }
                    });
                    if (!nextLine.childNodes.length) {
                        Section.removeChild(nextLine);
                    }
                    Line.appendUnits(nodes);
                    Line = Line.nextSibling;
                    if (!Line) {
                        renderQueue.map(queue => queue());
                    }


                } else {
                    isBlank = false;
                    overOrBlankWidth = -complement;
                    over();
                }
            }
            return breakword;

        }

        function over() {
            breakword.type = 'overflow';
            let isOverflow = true;
            console.info('overflow');
            let max = 0;
            while (isOverflow) {
                if (max > 100) break;
                let nextLine = Line.nextSibling;
                // if(Line.__new__ == 1) {

                // } 
                // console.log(Line.childNodes.length, 'l')
                (Line).getAccordWithContentRect(({
                    x,
                    offset,
                    text,
                    elx
                }) => {

                    if (x <= clientWidth) {
                        return true;
                    }
                }, 'desc');
                // console.log(Line.rectRange.startNode.text, '-------', Line.rectRange.endNode.text, 'collapsed')
                if (Line.rectRange.collapsed) {
                    isOverflow = false;
                    break;
                }
                // breakword.push(content);
                // let prev = content;
                // overEle = prev[0]
                let content_offset = Line.rectRange.startOffset;
                let nodes = Line.rectRange.getRange((node, index) => {
                    let __x__ = node.__overed__ ? (Line.rectRange.endElx - Line.rectRange.startElx) : -Line.rectRange.startElx;
                    if (node.__x__ && node.__overed__) {
                        __x__ = node.__x__ - Line.rectRange.startX
                    }
                    __x__ = __x__ || 0;
                    // console.log(__x__, '___x___')
                    if (!node.isText()) {
                        let clone = node.cloneNode();
                        clone.guid = node.guid;
                        Line.removeChild(node);
                        clone.__x__ = __x__;
                        renderQueue.push(() => {
                            clone.__x__ = undefined;
                            clone.__overed__ = undefined;
                            clone.__offset__ = undefined;
                        });
                        return clone;
                    }
                    // console.log(node == Line.rectRange.startNode, '幽默')
                    if (node == Line.rectRange.startNode) {
                        if (Line.rectRange.startOffset == 0) {
                            Line.removeChild(node);
                            node.__x__ = __x__;
                            renderQueue.push(() => {
                                node.__x__ = undefined;
                            });
                            return node;
                        } else {
                            // 使用overoffset的意义，由于over node是虚拟的 
                            let text = node.text;
                            node.text = text.slice(0, content_offset);
                            if (node.isBlank()) {
                                Line.removeChild(node);
                            }
                            let clone = node.cloneNode();
                            clone.guid = node.guid;
                            clone.text = text.slice(content_offset);
                            // node.__el__.__overoffset__ = content_offset;
                            renderQueue.push(() => {
                                node.__el__.__overoffset__ = undefined;
                                clone.__x__ = undefined;
                                clone.__offset__ = undefined;
                                clone.__overed__ = undefined;

                            });

                            clone.__offset__ = clone.__offset__ ? clone.__offset__ + content_offset : content_offset;

                            clone.__x__ = __x__;
                            return clone;
                        }
                    } else {
                        Line.removeChild(node);
                        node.__x__ = __x__;
                        renderQueue.push(() => {
                            node.__x__ = undefined;

                        });
                        return node;
                    }
                });
                // console.log(!nextLine, 'nexLine')

                if (!nextLine) {
                    let newLine = Line.cloneNode();
                    newLine.emptyChildNodes();

                    let _units_ = newLine.startInsertUnits(nodes);
                    _units_.map(node => {
                        renderQueue.push(() => {

                            node.__offset__ = undefined;
                        })
                    })
                    Section.appendChild(newLine);
                    // console.log(newLine.childNodes.length, 'nexLinex', [].concat([], nodes))
                    nextLine = newLine;

                    // break;
                } else {
                    // nextLine.__over__ = nodes;
                    // renderQueue.push(() => {
                    //     nextLine.startInsertUnits(nodes);
                    // });
                    nextLine.childNodes.map(node => {
                        // console.log(Line.rectRange.endX - Line.rectRange.startX, 'more than i can say')
                        node.__x__ = (Line.rectRange.endX - Line.rectRange.startX);
                        node.__overed__ = 1;
                        renderQueue.push(() => {
                            node.__overed__ = undefined;
                            node.__x__ = undefined;
                            // console.log(node.__overed__, 'over__')
                        });
                    });
                    let _units_ = nextLine.startInsertUnits(nodes);
                    _units_.map(node => {

                        renderQueue.push(() => {

                            node.__offset__ = undefined;
                        })
                    })


                }
                Line = nextLine;
                max++;
            }

            renderQueue.map(queue => queue());
            return breakword;
        }
        if (!Line.isOverflow()) {
            return complement()
        } else {
            return over();

        }

    }





}
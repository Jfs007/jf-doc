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
            let text = node.text;
            node.text = text.slice(0, offset);
            let cloneNode = node.cloneNode();
            cloneNode.guid = node.guid;
            cloneNode.text = text.slice(offset);
            // node = cloneNode;
            cloneLine.appendChild(cloneNode);
        }
        node = node.nextSibling;
        while (!!node) {
            let _node_ = node;
            node = node.nextSibling;
            Line.removeChild(_node_);
            cloneLine.appendChild(_node_.cloneNode());
        }
        if (cloneLine.childNodes.length == 1 && cloneLine.childNodes[0].isBlank()) {
            cloneLine.childNodes[0].text = Tabs.space;
        }
        if (Line.childNodes.length == 0) {

            let clone = cursor.node.cloneNode();
            clone.text = Tabs.space;
            Line.appendChild(clone)
        }
        cloneSection.appendChild(cloneLine);
        let cLine = Line.nextSibling;
        // console.log(cLine.nextSibling, 'cLine')
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
                    let offset = lastChild ? lastChild.getTextLength() : 0;
                    let {
                        rect
                    } = computedClientBoundaryByOffset(lastChild.__el__, offset, 'right', range);
                    blank = clientWidth - (rect.x - lineRect.x);
                    let content = nextLine.getAccordWithContentRect(({
                        x,
                        text,
                        offset,
                        node
                    }) => {
                        // console.log(x, 'xx')
                        if (x > blank) {
                            return true;
                        }
                    });
                    complement = content.prev ? content.prev.x : 0;
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
                                node.__x__ = complement;
                                renderQueue.push(_ => {
                                    node.__x__ = undefined;
                                })
                                return node;
                            } else {
                                if (!node.isText()) {
                                    let clone = node.cloneNode();
                                    clone.guid = node.guid;
                                    Line.removeChild(node);
                                    clone.__x__ = complement;
                                    renderQueue.push(_ => {
                                        clone.__x__ = undefined;
                                    })
                                    return clone;
                                }
                                let text = node.text;
                                node.text = text.slice(content_offset);
                                if (node.isBlank()) {
                                    Line.removeChild(node);
                                }
                                let clone = node.cloneNode();
                                clone.guid = node.guid;
                                clone.text = text.slice(0, content_offset);
                                node.__el__.__over__ = content_offset;
                                clone.__x__ = complement;
                                renderQueue.push(_ => {
                                    node.__el__.__over__ = undefined;
                                    clone.__x__ = undefined;
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

                    // console.log(Line.childNodes[0].guid, 'text', Line.lastChild.guid, Line.guid, Line.nextSibling);
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
                if (max > 10) break;
                let nextLine = Line.nextSibling;
                // if(Line.__new__ == 1) {

                // } 

                let content = (Line).getAccordWithContentRect(({
                    x,
                    offset,
                    text,
                    elx
                }) => {
                    console.log('%c%s', 'color:white;background: red', text, '___text___', x, '---', elx, text[offset])
                    if (x < clientWidth) {
                        console.log('meimei')
                        return true;
                    }
                }, 'desc');
                // console.log(content, 'content', overOrBlankWidth)
                if (!content.prev) {
                    console.log('完了')
                    isOverflow = false;
                    break;
                }
                breakword.push(content);

                // if (!nextLine) {
                //     overOrBlankWidth = -content.x;

                // } else {
                //     overOrBlankWidth = content.first.x - content.x;
                // }

                let prev = content;
                // overEle = prev[0]
                let content_offset = prev.offset;


                let nodes = prev.nodes.map((node, index) => {

                    let __x__ = node.__overed__ ? (content.first.elx - content.elx) : -content.elx;
                    if (node.__x__ && node.__overed__) {
                        __x__ = node.__x__ - content.x
                    }
                    __x__ = __x__ || 0;
                    // console.log('%c%s', 'color:white;background: red', __x__, content.first.__x__, content.__x__)
                    if (index == 0) {
                        if (content_offset == 0) {
                            Line.removeChild(node);
                            node.__x__ = __x__;
                            renderQueue.push(() => {
                                node.__x__ = undefined;
                            });
                            return node;
                        } else {
                            if (!node.isText()) {
                                let clone = node.cloneNode();
                                clone.guid = node.guid;
                                Line.removeChild(node);
                                clone.__x__ = __x__;
                                renderQueue.push(() => {
                                    clone.__x__ = undefined;
                                });
                                return clone;
                            }
                            // 使用overoffset的意义，由于over node是虚拟的 
                            let text = node.text;
                            node.text = text.slice(0, content_offset);
                            console.log('%c%s', 'color:white;background: green', text, node.__el__.__overoffset__ || 0, content_offset)
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
                            });

                            clone.__offset__ = clone.__offset__ ? clone.__offset__ + content_offset : content_offset;
                            console.log('%c%s', 'color: white;background: black', content_offset || 0, clone.__offset__)
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


                if (!nextLine) {
                    let newLine = Line.cloneNode();
                    newLine.emptyChildNodes();
                    Section.appendChild(newLine);

                    // newLine.startInsertUnits(nodes);


                    let _units_ = newLine.startInsertUnits(nodes);
                    _units_.map(node => {
                        console.log(node, '----')
                        renderQueue.push(() => {

                            node.__offset__ = undefined;
                        })
                    })
                    nextLine = newLine;

                    // break;
                } else {
                    // nextLine.__over__ = nodes;
                    // renderQueue.push(() => {
                    //     nextLine.startInsertUnits(nodes);
                    // });
                    nextLine.childNodes.map(node => {
                        node.__x__ = (content.first.x - content.x);
                        node.__overed__ = 1;
                        renderQueue.push(() => {
                            node.__overed__ = undefined;
                            node.__x__ = undefined;
                        });
                    });
                    console.log(nodes.map(_ => ({
                        ..._
                    })))
                    let _units_ = nextLine.startInsertUnits(nodes);
                    _units_.map(node => {
                        console.log(node, '----')
                        renderQueue.push(() => {

                            node.__offset__ = undefined;
                        })
                    })


                }
                Line = nextLine;
                console.log(Line, 'LIne--')
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
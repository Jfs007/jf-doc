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
        let { offset, node } = cursor;
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
                                return node;
                            } else {
                                if(!node.isText()) {
                                    let clone = node.cloneNode();
                                    clone.guid = node.guid;
                                    Line.removeChild(node);
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
            console.info('overflow')
            while (isOverflow) {
                let nextLine = Line.nextSibling;
                // if(Line.__new__ == 1) {

                // }
                let content = Line.getAccordWithContentRect(({
                    x,
                    text,
                    offset
                }) => {
                    if (x + overOrBlankWidth < clientWidth) {
                      console.log(text[offset], 'offset', overOrBlankWidth)
                        return true;
                    }
                }, 'desc');
                console.log(content, 'content', overOrBlankWidth);
                if (!content.prev) {
                    console.log('完了')
                    // complement();
                    isOverflow = false;                             
                    break;
                }
                breakword.push(content);
                
                if (!nextLine) {
                    overOrBlankWidth = -content.x;
                } else {
                    overOrBlankWidth = content.first.x - content.x;
                }
               
                let prev = content;
                // overEle = prev[0]
                let content_offset = prev.offset;
                

                let nodes = prev.nodes.map((node, index) => {
                    if (index == 0) {

                        if (content_offset == 0) {
                            Line.removeChild(node);
                            return node;
                        } else {
                            if(!node.isText()) {
                                let clone = node.cloneNode();
                                clone.guid = node.guid;
                                Line.removeChild(node);
                                return clone;
                            }
                            let text = node.__el__.textContent;
                            node.text = text.slice(node.__el__.__over__ || 0, content_offset);
                            if (node.isBlank()) {
                                Line.removeChild(node);
                            }
                            let clone = node.cloneNode();
                            clone.guid = node.guid;
                            clone.text = text.slice(content_offset);
                            node.__el__.__over__ = content_offset;
                            renderQueue.push(() => {
                                node.__el__.__over__ = undefined;
                            })
                            return clone;
                        }
                    } else {
                        Line.removeChild(node);
                        return node;
                    }
                });
              
                if (!nextLine) {
                    let newLine = Line.cloneNode();
                    newLine.emptyChildNodes();
                    Section.appendChild(newLine);
 
                    newLine.startInsertUnits(nodes);
                    nextLine = newLine;

                    // break;
                } else {
                    renderQueue.push(() => {
                        nextLine.startInsertUnits(nodes);
                    });
                }
                Line = nextLine;
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
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

    /**
     * 
     * @param {*} cursor 
     * 
     * |||||||||||||||||
     * |||||||||||||||||
     * 
     * 如果编辑行 > 行宽 
     * 多余的文本编辑到下一行
     * 如果编辑行 < 行款
     * 缺失的文本从下一行补充
     * 
     */
    // breakWord2(cursor) {
    //     let range = getRange();
    //     let node = cursor ? cursor.node : this.childNodes[0].childNodes[0];
    //     let Line = node.parentNode;
    //     let lineRect = Line.__el__.getBoundingClientRect();
    //     let clientWidth = Line.__el__.clientWidth;
    //     let Section = Line.parentNode;
    //     let nextLine = Line.nextSibling;
    //     // 没有换行
    //     if (!Line.isOverflow()) {
    //         if (nextLine) {
    //             let lastChild = Line.lastChild;
    //             let offset = lastChild ? lastChild.getTextLength() : 0;
    //             let {
    //                 rect
    //             } = computedClientBoundaryByOffset(getTextNode(lastChild.__el__), offset, 'right', range);
    //             let blank = clientWidth - (rect.x - lineRect.x);
    //             let content = nextLine.getAccordWithContentRect(({
    //                 x
    //             }) => {
    //                 if (x > blank) {
    //                     return true;
    //                 }
    //             });
    //             let prev = content.prev;
    //             let content_offset = prev.offset;
    //             let nodes = prev.nodes.map((node, index) => {
    //                 if (index == prev.nodes.length - 1) {
    //                     if (content_offset == node.getTextLength()) {
    //                         nextLine.removeChild(node);
    //                         return node;
    //                     } else {
    //                         let text = node.text;
    //                         node.text = text.slice(content_offset);
    //                         let clone = node.cloneNode();
    //                         clone.guid = node.guid;
    //                         clone.text = text.slice(0, content_offset);

    //                         return clone;
    //                     }
    //                 } else {
    //                     nextLine.removeChild(node);
    //                     return node;
    //                 }
    //             });
    //             if (!nextLine.childNodes.length) {
    //                 Section.removeChild(nextLine);
    //             }
    //             Line.appendUnits(nodes);
    //         }
    //     } else {

    //         let content = Line.getAccordWithContentRect(({
    //             x,
    //         }) => {
    //             if (x < clientWidth) {
    //                 return true;
    //             }
    //         }, 'desc');
    //         let prev = content;
    //         let content_offset = prev.offset;
    //         let nodes = prev.nodes.map((node, index) => {
    //             if (index == 0) {
    //                 if (content_offset == 0) {
    //                     Line.removeChild(node);
    //                     return node;
    //                 } else {
    //                     let text = node.text;
    //                     node.text = text.slice(0, content_offset);
    //                     let clone = node.cloneNode();
    //                     clone.guid = node.guid;
    //                     clone.text = text.slice(content_offset);
    //                     return clone;
    //                 }
    //             } else {
    //                 Line.removeChild(node);
    //                 return node;
    //             }
    //         });
    //         let newLine = Line.cloneNode();
    //         newLine.childNodes = [];
    //         if (!nextLine) {
    //             Section.appendChild(newLine);
    //             newLine.startInsertUnits(nodes);

    //         } else {
    //             nextLine.startInsertUnits(nodes);
    //         }


    //     }


    // }

    breakWord2(cursor) {
        let overOrBlankWidth = 0;
        let isOverflow = true;
        let range = getRange();
        let node = cursor ? cursor.node : this.childNodes[0].childNodes[0];
        let Line = node.parentNode;
        let lineRect = Line.__el__.getBoundingClientRect();
        let clientWidth = Line.__el__.clientWidth;
        let Section = Line.parentNode;
        let nextLine = Line.nextSibling;
        let renderQueue = [];
        // while(Line. )

        if (!Line.isOverflow()) {
            if (nextLine) {
                let lastChild = Line.lastChild;
                let offset = lastChild ? lastChild.getTextLength() : 0;
                let {
                    rect
                } = computedClientBoundaryByOffset(getTextNode(lastChild.__el__), offset, 'right', range);
                let blank = clientWidth - (rect.x - lineRect.x);
                let content = nextLine.getAccordWithContentRect(({
                    x
                }) => {
                    if (x > blank) {
                        return true;
                    }
                });
                let prev = content.prev;
                let content_offset = prev.offset;
                let nodes = prev.nodes.map((node, index) => {
                    if (index == prev.nodes.length - 1) {
                        if (content_offset == node.getTextLength()) {
                            nextLine.removeChild(node);
                            return node;
                        } else {
                            let text = node.text;
                            node.text = text.slice(content_offset);
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
            }
        } else {

            while (isOverflow) {


                let content = Line.getAccordWithContentRect(({
                    x,
                    text,
                    offset
                }) => {
                    if (x + overOrBlankWidth < clientWidth) {
                        return true;
                    }
                }, 'desc');
                // 说明没有发生overflow
                if (!content.prev) {
                    console.log(isOverflow, 'isO----', overOrBlankWidth)
                    isOverflow = false;
                    break;
                }
                overOrBlankWidth = content.first.x - content.x;
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

                if (!nextLine) {
                    let newLine = Line.cloneNode();
                    newLine.childNodes = [];
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

            renderQueue.map(queue => queue())

        }

    }

    breakWord(cursor) {
        return;
        let node = cursor ? cursor.node : this.childNodes[0].childNodes[0];
        let offset = cursor ? cursor.offset : 0;
        let Line = node.parentNode;
        let Section = Line.parentNode;
        let doc = Section.parentNode;
        let next = Line;
        let LineNexts = [];
        while (next) {
            next = next.nextSibling;
            if (next) {

                LineNexts.push(Section.removeChild(next));
            }
        }
        let prevUnit = node;
        LineNexts.map(LineNext => {
            LineNext.childNodes.map(Unit => {
                // 做一个guid的缓存 保证渲染性能
                Unit.__cache__Line_guid = LineNext.guid;
                if (prevUnit.guid == node.guid) {
                    prevUnit.text = prevUnit.text + Unit.text;
                } else {
                    Line.appendChild(Unit);
                }
                prevUnit = Unit;

            });
        });
        console.log([].concat([], LineNexts), 'lineNext')
        doc.nextTick(_ => {
            let range = getRange();
            let Units = Line.childNodes || [];
            let lineRect = Line.__el__.getBoundingClientRect();
            let clientWidth = Line.__el__.clientWidth;
            let overUnits = [];
            let lineNum = -1;
            for (let i = Units.length - 1; i >= 0; i--) {
                let Unit = Units[i];
                let textNode = getTextNode(Unit.__el__);
                let text = Unit.getText();
                overUnits.unshift(Unit);
                if (!text.length) {
                    // console.log('continue')
                    continue;
                }
                for (let offset = text.length; offset >= 0; offset--) {

                    let {
                        rect
                    } = computedClientBoundaryByOffset(textNode, offset, 'right', range);

                    let x = rect.x - lineRect.x;

                    Unit.__offset__ = offset;
                    let _lineNum = Math.floor(x / clientWidth);
                    console.log(Unit.text, offset, text[offset], rect.x)
                    if (lineNum != -1 && _lineNum != lineNum) {
                        console.log(text[offset], '----切换的文本')
                        if (!Line.nextSibling) {
                            let newLine = Line.cloneNode();
                            newLine.childNodes = [];
                            Section.appendChild(newLine);
                            overUnits.map((unit, index) => {
                                let cloneUnit = unit.cloneNode();
                                cloneUnit.guid = unit.guid;
                                if (index == 0) {
                                    cloneUnit.text = cloneUnit.text.slice(offset);
                                    unit.text = unit.text.slice(0, offset)
                                } else {
                                    Line.removeChild(unit);
                                }
                                if (cloneUnit.__cache__Line_guid) {
                                    newLine.guid = cloneUnit.__cache__Line_guid;
                                }
                                newLine.guid = Line.guid;
                                // ----oicloneUnit.__cache__Line_guid = undefined;
                                newLine.appendChild(cloneUnit)
                            });


                        }
                        overUnits = [];
                    } {


                    }
                    lineNum = _lineNum;

                    //    console.log(value, 'value');
                    //    if(x <= clientWidth) {
                    //     overUnits.unshift(Unit);
                    //     return overUnits;
                    //    }

                }
                // overUnits.unshift(Unit);
            }
        })

    }




}
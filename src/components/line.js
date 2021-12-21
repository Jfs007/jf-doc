import Node from '@/lib/node';
import Base from '@/lib/base';
import RectRange from '@/lib/rectRange';
import {
    getRange
} from '@/util/range';
import {
    computedClientBoundaryByOffset
} from '@/util/computed';
import {
    getTextNode
} from '@/util/dom';
// import { guid } from '../util/index';
export default class Line extends Node {
    constructor(options, update) {
        super(options, update);
        this.class = 'jf-line';
        this.nodeType = 'line';
        this.rectRange = new RectRange();
        super.init(options, update);
    }


    appendUnits(units) {
        let lastChild = this.lastChild
        units.map(unit => {
            if (unit.isBlank()) return;
            if (lastChild) {
                if (lastChild.guid == unit.guid) {
                    lastChild.text = lastChild.text + unit.text;
                } else {
                    this.appendChild(unit);
                }
            } else {
                this.appendChild(unit);
            }
        })
    }
    startInsertUnits(units) {
        let firstChild = this.firstChild;
        let _units_ = [];
        units.map(unit => {
            if (unit.isBlank()) return;
            if (firstChild) {
                if (firstChild.guid == unit.guid) {
                    let ft = firstChild.text;
                    firstChild.text = unit.text + firstChild.text;
                    firstChild.__offset__ = -unit.text.length;
                    _units_.push(firstChild);
                    // firstChild.__x__ = unit.__x__;

                } else {
                    this.insertBefore(unit, firstChild);
                    _units_.push(unit);
                }
                // firstChild = unit;
            } else {
                this.appendChild(unit);
                _units_.push(unit);
            }
        });
        return _units_;

    }


    // 判断是否存在换行
    isOverflow() {
        let el = this.__el__;
        let clientWidth = el.clientWidth;
        let scrollWidth = el.scrollWidth;
        return scrollWidth > clientWidth;

    }

    getOverFlowUnits() {
        let range = getRange();
        let Units = this.childNodes;
        let lineRect = this.__el__.getBoundingClientRect();
        let clientWidth = this.__el__.clientWidth;
        let overUnits = [];
        for (let i = Units.length - 1; i >= 0; i--) {
            let Unit = Units[i];
            // let textNode = getTextNode(Unit.__el__);
            let text = Unit.getText();
            for (let offset = text.length; offset >= 0; offset--) {
                let {
                    rect
                } = computedClientBoundaryByOffset(Unit.__el__, offset, 'right', range);
                let x = rect.x - lineRect.x;
                Unit.__offset__ = offset;
                if (x <= clientWidth) {

                    overUnits.unshift(Unit);
                    return overUnits;
                }

            }
            overUnits.unshift(Unit);
        }
        return overUnits;
    }

    // order = asc/desc
    getAccordWithContentRect(callback = () => { }, order = 'asc', anchorNodes = null) {
        class ContentRect extends Base {
            constructor(options) {
                super(options);
                super.init(options);
            }
        }

        this.rectRange.reset();

        let range = getRange();
        let isAsc = order == 'asc';
        let lineRect = this.__el__.getBoundingClientRect();
        let clientWidth = this.__el__.clientWidth;
        let prevContentRect = null;
        let abountNodes = [];
        let firstContentRect = null;

        for (let i = isAsc ? 0 : this.childNodes.length - 1;
            (isAsc ? i < this.childNodes.length : i >= 0);
            (isAsc ? i++ : i--)) {


            let node = this.childNodes[i];
            let text = node.getText();

            let textLength = node.getTextLength();



            // node.__offset__ = 

            abountNodes[isAsc ? 'push' : 'unshift'](node);

            if (node.isBlank()) {
                continue;
            }
            if (!node.isText()) {
                textLength = 1;
                // offset = 1;
            }

            for (let offset = isAsc ? 0 : textLength;
                (isAsc ? offset <= textLength : offset >= 0);
                (isAsc ? offset++ : offset--)) {


                let _dir = isAsc ? 'left' : 'right'
                if (!node.isText() && !isAsc) {
                    _dir = 'right'
                }
             
                let _boundary = computedClientBoundaryByOffset((node.__el__), offset + (node.__offset__ || 0), _dir, range);

                let x = _boundary.rect.x - lineRect.x;
                let elx = x;

                x = node.__x__ ? x + node.__x__ : x;

                let exec = callback({
                    x: x,
                    clientWidth,
                    text,
                    offset,
                    node,
                    elx

                    // __x__
                });
                if (!(isAsc ? this.rectRange.startNode : this.rectRange.endNode)) {
                    if (isAsc) {
                        this.rectRange.setStart({
                            node,
                            offset,
                            x,
                            elx
                        });
                    } else {
                        this.rectRange.setEnd({
                            node,
                            offset,
                            x,
                            elx
                        });
                    }
                }

                if (exec) {
                  
                    if (isAsc) {
                       

                        if (!prevContentRect) {
                            this.rectRange.setEnd({
                                node: this.rectRange.startNode,
                                offset: this.rectRange.startOffset,
                                x: this.rectRange.startX,
                                elx: this.rectRange.startElx
                            })
                        } else {
                            let {
                                node,
                                offset,
                                x,
                                elx
                            } = prevContentRect;
                            this.rectRange.setEnd({
                                node: node || null,
                                offset: offset || 0,
                                x: x || 0,
                                elx: elx || 0
                            });

                        }

                    } else {
                        // 未加入endNode

                        this.rectRange.setStart({
                            node,
                            offset,
                            x,
                            elx
                        });


                    }
                    let contentRect = new ContentRect({
                        boundary: _boundary,
                        nodes: abountNodes,
                        offset,
                        x,
                        elx,
                        node
                        // __x__

                    });
                    contentRect.prev = prevContentRect;
                    contentRect.first = firstContentRect;
                    return contentRect;
                }

                prevContentRect = new ContentRect({
                    boundary: _boundary,
                    nodes: [].concat(abountNodes),
                    offset,
                    x,
                    elx,
                    node
                });
                // }


                if (!firstContentRect) {
                    firstContentRect = prevContentRect;
                }
            }

        }
        let contentRect = new ContentRect(prevContentRect || {});
        contentRect.prev = prevContentRect;
        contentRect.first = firstContentRect;
        if (!(isAsc ? this.rectRange.endNode : this.rectRange.startNode)) {
            let {
                node,
                offset,
                x,
                elx
            } = prevContentRect || {};
            if (isAsc) {
                this.rectRange.setEnd({
                    node: node || null,
                    offset: offset || 0,
                    x: x || 0,
                    elx: elx || 0
                });
            } else {
                this.rectRange.setStart({
                    node: node || null,
                    offset: offset || 0,
                    x: x || 0,
                    elx: elx || 0
                });
            }
        }


        return contentRect;

    }






}
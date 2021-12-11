import Node from '@/lib/node';
import Base from '@/lib/base';
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
        this.nodeType = 'line'
        super.init(options, update);
    }


    appendUnits(units) {
        let lastChild = this.lastChild
        units.map(unit => {
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

        units.map(unit => {
            if (firstChild) {
                if (firstChild.guid == unit.guid) {
                    firstChild.text = unit.text + firstChild.text;
                } else {
                    this.insertBefore(unit, firstChild);
                }
                firstChild = unit;
            } else {
                this.appendChild(unit)
            }
        })
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
            let textNode = getTextNode(Unit.__el__);
            let text = Unit.getText();
            for (let offset = text.length; offset >= 0; offset--) {
                let {
                    rect
                } = computedClientBoundaryByOffset(textNode, offset, 'right', range);
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
    getAccordWithContentRect(callback = () => {}, order = 'asc', ) {
        class ContentRect extends Base {
            constructor(options) {
                super(options);
                super.init(options);
            }
        }
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
            // console.log(node, 'node', this.childNodes, this.__el__)
            let text = node.getText();
            let textLength = node.getTextLength();
            abountNodes[isAsc ? 'push' : 'unshift'](node);
            for (let offset = isAsc ? 0 : textLength;
                (isAsc ? offset <= textLength : offset >= 0);
                (isAsc ? offset++ : offset--)) {

                let _boundary = computedClientBoundaryByOffset(getTextNode(node.__el__), offset, isAsc ? 'left' : 'right', range);


                let x = _boundary.rect.x - lineRect.x;
                let exec = callback({
                    x: Math.abs(x),
                    clientWidth,
                    text,
                    offset
                });
                if (exec) {
                    let contentRect = new ContentRect({
                        boundary: _boundary,
                        nodes: abountNodes,
                        offset,
                        x
                    });
                    contentRect.prev = prevContentRect;
                    contentRect.first = firstContentRect;
                    return contentRect;
                }
                prevContentRect = new ContentRect({
                    boundary: _boundary,
                    nodes: [].concat(abountNodes),
                    offset,
                    x
                });
                if (!firstContentRect) {
                    firstContentRect = prevContentRect;
                }
            }

        }
        let contentRect = new ContentRect(prevContentRect || {});
        contentRect.prev = prevContentRect;
        contentRect.first = firstContentRect;
        return contentRect;

    }






}
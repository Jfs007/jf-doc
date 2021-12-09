
import Node from '@/lib/node';
import { getRange } from '@/util/range';
import { computedClientBoundaryByOffset } from '@/util/computed';
import { getTextNode } from '@/util/dom';
// import { guid } from '../util/index';
export default class Line extends Node {
    constructor(options, update) {
        super(options, update);
        this.class = 'jf-line';
        // super.init(options, update);
    }


    insetUnit(unit) {
        // this.appendChild()
    }


    // 判断是否存在换行
    isOverflow() {
        let el = this.__el__;
        let clientWidth = el.clientWidth;
        let scrollWidth = el.scrollWidth;
        return scrollWidth >= clientWidth;
       
    }
    getOverFlowUnits() {
        let range = getRange();
        let Units = this.childNodes;
        let lineRect = this.__el__.getBoundingClientRect();
        let clientWidth = this.__el__.clientWidth;
        let overUnits = [];
        for(let i = Units.length - 1; i >=0; i--) {
            let Unit = Units[i];
            let textNode = getTextNode(Unit.__el__);
            let text = Unit.getText();
            for(let offset = text.length; offset >=0; offset--) {
               let { rect } = computedClientBoundaryByOffset(textNode, offset, 'right', range);
               let x = rect.x - lineRect.x;
               Unit.__offset__ = offset; 
               if(x <= clientWidth) {
                overUnits.unshift(Unit);
                return overUnits;
               }
               
            }
            overUnits.unshift(Unit);
        }
        return overUnits;
    }

    



    
}
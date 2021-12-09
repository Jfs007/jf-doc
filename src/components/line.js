
import Node from '@/lib/node';
// import { guid } from '../util/index';
export default class Line extends Node {
    constructor(options, update) {
        super(options, update);
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

    



    
}
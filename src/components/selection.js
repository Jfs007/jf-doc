
import Base from '@/lib/base';
import { isTextNode, getTextNode, getContainerNode } from '@/util/dom';
import { getRange } from '@/util/range';
import { computedClientBoundaryByOffset } from '@/util/computed';
// import { guid } from '../util/index';
// 选中的定位对象

import Event from '@/lib/events';

export default class Range extends Base {
    constructor(options = {}) {
       
        super(options);
        
        super.init(options);
        this.doc = options.window;
      

    }


    addRange(Range) {
        let _range = getRange();
        // let Range
        let { startContainerNode, startOffset, startNode,  endNode, endOffset } = Range;
        let area = {};
        let node = startContainerNode;
        let offset = startOffset;
        let textNode = startNode;
        let boundary = computedClientBoundaryByOffset(node, offset, 'right', _range );
        let startLine = node.__unit__.L;
        let { x, width } = startLine.lastChild.__el__.getBoundingClientRect();
        let { height, x: lineX } = startLine.__el__.getBoundingClientRect();
        area.width = x+width - boundary.rect.x;
        area.x = boundary.rect.x - lineX;
        area.height = height;
        console.log(x + width,  startLine.lastChild.__el__)
        startLine.ranges.push(area);
        


    }




   











}

import Base from '@/lib/base';
import { isTextNode, getTextNode, getContainerNode } from '@/util/dom';
import { getRange } from '@/util/range';
import { computedClientBoundaryByOffset } from '@/util/computed';
// import { guid } from '../util/index';
// 选中的定位对象

import Event from '@/lib/events';

export default class Selection extends Base {
    constructor(options = {}) {
       
        super(options);
        
        super.init(options);
        this.ranges = [];
       

    }

    removeAllRanges() {
        this.window.Selections.map(selection => {
            this.ranges.map(Range => {
                console.log(Range)
                selection.removeRange(Range);
            })
           
        });
       
        this.window.Selections = [];
    }
    removeRange(Range) {
        // this.getLineRange()
        this.getLineRange(Range, line => {
            line.selection = {};
        }, true)
    }


    addRange(Range) {
        this.ranges.push(Range);    
     
        let _range = getRange();
       
        // let Range
        let { startContainerNode, startOffset,  endContainerNode, endOffset } = Range;

        let area = {};
        let node = startContainerNode;
        let offset = startOffset;
        let boundary = computedClientBoundaryByOffset(node, offset, 'right', _range );
        let startLine = node.__unit__.L;
        let endLine = endContainerNode.__unit__.L;
        let startRect = null;
        let startSelection = {};
        let endSelection = {};
        // 在同一行
        if(endLine == startLine) {
            let boundary = computedClientBoundaryByOffset(endContainerNode, endOffset, 'right', _range );
            startRect = boundary.rect;
        } else {
            startRect = startLine.lastChild.__el__.getBoundingClientRect();
            startRect.x = startRect.x + startRect.width;
            let rect = endLine.firstChild.__el__.getBoundingClientRect();
            let { height, x: lineX } = endLine.__el__.getBoundingClientRect();
            let boundary = computedClientBoundaryByOffset(endContainerNode, endOffset, 'right', _range );
           
            endSelection.x = rect.x - lineX;
            endSelection.width = boundary.rect.x - rect.x;
            endSelection.height = height;
            endLine.selection = endSelection;
        }
        let { height, x: lineX } = startLine.__el__.getBoundingClientRect();
        startSelection.width = startRect.x - boundary.rect.x;
        startSelection.x = boundary.rect.x - lineX;
        startSelection.height = height;
        startLine.selection = (startSelection);


        this.getLineRange(Range, line => {
            let lineRect = line.__el__.getBoundingClientRect();
            let startRect = line.firstChild.__el__.getBoundingClientRect();
            let endRect = line.lastChild.__el__.getBoundingClientRect();
            line.selection = {
                x: startRect.x - lineRect.x,
                width: endRect.x + endRect.width - startRect.x,
                height: lineRect.height
            }
        })
        

    }

    getLineRange(Range, callback, include = false) {
        let startLine = Range.startContainerNode.__unit__.L;
        let endLine = Range.endContainerNode.__unit__.L;
        if(include) {
            callback(startLine);
            
        }
        let nextLine = startLine;
        if(startLine == endLine) return;
    
        while(nextLine) {
            let _currentLine = nextLine;
            nextLine = nextLine.nextSibling;
            // console.log(nextLine, endLine, 'eend')
            if(nextLine == endLine) break;
            if(!nextLine) {
                let nextSection = _currentLine.S.nextSibling;
                if(!nextSection) break;
                nextLine = nextSection.firstChild;
            }
            if(!nextLine) break;
            if(nextLine == endLine) {
                if(include) {
                    callback(endLine);
                    
                }
                break;
            };
            callback(nextLine);
        }




       
        
    }



   











}
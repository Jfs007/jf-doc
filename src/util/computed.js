import { getRange } from './range';
import { getTextNode, isTextNode, getTextNodes } from './dom';
import { vSplit } from './index';


export let computedBounday = (rect, e) => {
    let startOffset = rect.x;
    let endOffset = rect.width + startOffset;
    let topOffset = rect.y;
    let bottomOffset = topOffset + rect.height;
    if (e.x >= startOffset && e.x <= endOffset && e.y >= topOffset && e.y <= bottomOffset) {
        return true;
    } else {
        return false;
    }
}
export let boundayIntimateDir = (rect, e) => {
    let startOffset = rect.x;
    let offsetMiddle = startOffset + (rect.width / 2);
    if (e.x < offsetMiddle) return 'left';
    return 'right';
}


export let getRectNodePos = (textNode, pos) => {
    let range = getRange();
    range.setStart(textNode, pos[0]);
    range.setEnd(textNode, pos[1]);
    let rect = range.getBoundingClientRect();
    return rect;
}
export let computedLineFeed = (line, callback = () => {}) => {
    console.time('st')
    let range = getRange();
    let textNodes = getTextNodes(line);
    let LineNumber = 0;
    let Lines = [textNodes];
    let base = null;
    let isLineFeed = (compare) => {
        if (!base) return false;
        return compare.rect.left < base.rect.left;
    }
    let cut = (cutIdx, textIdx, compare, originTextIdx) => {
        let _cutIdx = cutIdx;
        let currentLine = Lines[LineNumber];
        if (base.node != compare.node) {
        } else {
            let [current, cut] = vSplit(base.node.nodeValue, textIdx);
            let cloneNode = base.node.cloneNode(base.node);
            let baseClone = base.node.cloneNode(base.node);
            baseClone.nodeValue = current;
            currentLine[cutIdx].node = baseClone;
            cloneNode.nodeValue = cut;
            cloneNode.textContent = cut;
            cloneNode.innerText = cut;
            currentLine.splice(cutIdx + 1, 0, { node: base.node, start: textIdx, copyNode: cloneNode });
            cutIdx++;
        }
        let [current, cut] = vSplit(currentLine, cutIdx);
        Lines[LineNumber] = current;
        Lines.push(cut);
        callback(_cutIdx, originTextIdx, base, compare, textIdx);
        base = null;
        // console.log(base, 'vase')
        LineNumber++;
    }
    let SingleLineActuator = (Line) => {
        let end = false;
        Line.find(({ node, start, copyNode }, index) => {
            
            if (end) return true;
            let value = node.nodeValue;
            let originStart = start || 0;
            // console.log(copyNode, start, value.length, )
            start = start == undefined ? 0 : start ;
            for (let i = start; i < value.length; i++) {
                range.setStart(node, i);
                range.setEnd(node, i + 1);
        
                let rect = range.getBoundingClientRect();
                let _isLf = isLineFeed({ rect, node });
                // 是否换行
                if (_isLf && base) {
                    cut(index, i, { rect, node },  i - originStart);
                    end = true;
                    SingleLineActuator(Lines[LineNumber])
                  
                    return true;
                    break;
                }

                base = {
                    rect,
                    node
                }; 
            }
        })
    }
    SingleLineActuator(Lines[LineNumber]);
    console.timeEnd('st')
    return Lines;
}




/**
 * 
 * @param {*} line 
 * @param {*} callback 
 * 
 * ||||||||||||||||||||||a||||||||||||||a||||||||||||||
 * 
 * 
 * ||||||||||||||||||
 * |||a|||||||||||||a
 * ||||||||||||||||||
 * 
 * 
 */
export let computedLineFeed2 = (line, callback = () => {}) => {
    // let Line
    
}


export let computedClientBoundaryByOffset = (dom, offset, dir = 'right', range) => {
    let textNode = getTextNode(dom);
    range = range || getRange();
    // console.log(textNode.parentNode, '---')
    if(!textNode || !textNode.textContent.length) {
        let node = dom;
        console.log(dom);
        let rect = node.getBoundingClientRect();
       console.log('computed', dom , dir == 'left' ? rect.x : rect.x + rect.width)
        return {
            dir,
            offset,
            range,
            rect: {
                y: rect.y,
                x: dir == 'left' ? rect.x : rect.x + rect.width,
                height: rect.height
            }
        }
    }

    range.setStart(textNode, offset);
    range.setEnd(textNode, offset);
   
    
    let rect = range.getBoundingClientRect();
    let boundary = {
        dir,
        offset: offset,
        textNode,
        range,
        rect: {
            y: rect.y,
            x: rect.x,
            height: rect.height
        }

    };
    return boundary;
}


export let computedRangeClientBoundary = (e, textNode) => {
    let range = getRange();
    let value = textNode.nodeValue;
    let boundary = {};
    range.setStart(textNode, 0);
    range.setEnd(textNode, value.length);
    let rect = range.getBoundingClientRect();
    if (!computedBounday(rect, e)) {
        let dir = boundayIntimateDir(rect, e);
        boundary = {
            dir,
            offset: dir == 'left' ? 0 : value.length,
            textNode,
            range,
            rect: {
                y: rect.y,
                x: dir == 'left' ? rect.x : rect.x + rect.width,
                height: rect.height,
                _rect: rect
            },
        };
        return boundary;
    }
    for (let i = 0; i < value.length; i++) {
        range.setStart(textNode, i);
        range.setEnd(textNode, i + 1);
        let rect = range.getBoundingClientRect();
        if (computedBounday(rect, e)) {
            let dir = boundayIntimateDir(rect, e);
            boundary = {
                dir,
                offset: dir == 'left' ? i : i + 1,
                textNode,
                range,
                rect: {
                    y: rect.y,
                    x: dir == 'left' ? rect.x : rect.x + rect.width,
                    height: rect.height,
                    _rect: rect
                }

            };
            break;
        }
    }
    return boundary;
}

// export 




export let isTextNode = (node) => {
    return node.nodeType == 3;
}
export let isElementNode = (node) => {
    return node.nodeType == 1;
}

export let getComputedStyle = (node) => {
    if (isElementNode(node)) return window.getComputedStyle(node);
    return {}
}


function arrIndexOf(arr,v){
    for(var i=0;i<arr.length;i++){
        if(arr[i] == v){
            return i;
        }
    }
    return -1;
}


export function addClass(obj, className) {
    //如果原来没有class
    if (obj.className == '') {
        obj.className = className;
    } else {
        //如果原来有class
        var arrClassName = obj.className.split(' ');
        var _index = arrIndexOf(arrClassName, className);
        if (_index == -1) {
            //如果要添加的class在原来的class中不存在
            obj.className += ' ' + className;
        }
        //如果要添加的class在原来的class中存在
    }
}
export function removeClass(obj, className) {
    //如果原来有class
    if (obj.className != '') {
        var arrClassName = obj.className.split(' ');
        var _index = arrIndexOf(arrClassName, className);
        //如果有我们要移除的class
        if (_index != -1) {
            arrClassName.splice(_index, 1);
            obj.className = arrClassName.join(' ');
        }
    }

}


// export let isBlock
export let getTextNode = (el) => {
    let textNode = null;
    if(isTextNode(el)) return el;
    let child = el.childNodes;
    for (let i = 0; i < child.length; i++) {
        let node = child[i];
        if (isTextNode(node)) {
            textNode = node;
            break;
        }else {
          let _node = getTextNode(node);
          if(_node) {
              textNode = _node;
              break;
          }
        }
    }
    return textNode;
}
export let getTextNodes = (el) => {
    let _while = (childNodes, textNodes = []) => {
        if (childNodes && childNodes.length) {
            [...childNodes].map(node => {
                if (isTextNode(node)) {
                    textNodes.push({
                        node,

                    });
                } else {
                    _while(node.childNodes, textNodes)
                }
            });
            return textNodes;

        } else {
            return textNodes;
        }

    }

    return _while(el.childNodes);
}


export let loopNodes = (el, callback = () => {}) => {
    let _while = (childNodes, textNodes = []) => {
        if (childNodes && childNodes.length) {
            [...childNodes].map(node => {
                callback(node);
                if(node.childNodes && node.childNodes.length) {
                    _while(node.childNodes, textNodes)
                } 
            });
           
        }

    }
    return _while(el.childNodes);
}

export let getContainerNode = (textNode) => {
    if (isTextNode(textNode)) {
        return textNode.parentNode;
    }
    return textNode;
    // return textNode;
}
// export let get

export let createElement = (parent, type, options) => {

    let ele = document.createElement(type);
    if (!parent) return ele;
    parent.appendChild(ele);
    return ele;
}

export let getElememt = (node) => {
    if (typeof node == 'string') {
        return document.querySelector(node);
    }
    return node;

}

export let getElememts = (node) => {
    if (typeof node == 'string') {
        return document.querySelectorAll(node);
    }
    return node;

}

export let getScroll = (el) => {
    let isoverFlow = false;

    while (el && !isoverFlow) {
        let elStyle = getComputedStyle(el);
        isoverFlow = elStyle['overflow'] == 'auto' || elStyle['overflow-y'] == 'auto' || (el.style && el.style.overflow == 'auto');
        if (!isoverFlow) {
            el = el.parentNode;
        }

    }
    return el || document.body;

}
// 边界判断

export let boundary = (scrollBox, el) => {

    let { left, right, top, bottom, height } = scrollBox.getBoundingClientRect();
    let { scrollTop, scrollLeft, } = scrollBox;
    if (scrollBox.nodeName == 'BODY') {
        bottom = document.body.clientHeight - document.body.scrollTop;
    }
    let elRect = el.getBoundingClientRect();
    let elTop = elRect.top;
    let elBottom = elRect.bottom;

    let topDiff = elTop - top;
    let bottomDiff = elBottom - bottom;
    if (bottomDiff > 0) {
        return {
            bottom: bottomDiff,
        }
    }
    return {

    }
}






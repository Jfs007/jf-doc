import Node from '../lib/node.js';
import {
    guid,
    vSplit
} from '../util/index';

import Tabs from '@/lib/tabs.js';
import RectRange from '../lib/rectRange.js';
import {
    getRange
} from '@/util/range';
import {
    computedClientBoundaryByOffset
} from '@/util/computed';
// import DocStyle from './doc-style';
export default class Unit extends Node {
    constructor(options = {}, update) {
        super(options, update);

        this.nodeType = 'unit';
        
        this.class = "jf-unit";
        // 评论数组
        this.comments = [...(options.comments || [])];
        // 文本
        this.text = '';
        // 图片地址
        this.url = options.url;
        this.isRange = options.isRange;
        // 类型  text composition表示输入法类型
        this.type = options.type || 'text';
        this.range = null;
        // composition表示正在输入法
        this.is_composition = false;
        // 标记 delete 
        this.remark = options.remark || '';
        this.linespacing = options.linespacing || ''


        // 标注选中时切割的textUnit隶属同一group_id
        this.group_id = options.group_id;
        // 光标，在Cursor产生后会被挂载
        this.__cursor__ = null;
        // this.docStyle = new DocStyle(options.docStyle || {});
        this._copy = [];

        super.init(options, update);
        if (!this.isCarousel()) {
            this.comments = this.comments.filter(_ => _);
        }
        // 场景支持
        this.sceneSupport = [];
        if (this.isText()) {
            this.sceneSupport = ['comment', 'update-text'];
        }
        if (this.isCarousel()) {
            this.sceneSupport = ['comment'];
        }
        this.updateRange();



    }


    isLineFeed() {
        return this.text == '\n'
    }
    isText() {
        return this.type == 'text';
    }
    isComposition() {
        return this.is_composition && this.isText();
    }
    isImage() {
        return this.type == 'image';
    }
    isCarousel() {
        return this.type == 'carousel'
    }
    isBlank() {
        if (this.isImage()) return false;
        return this.text == '';
    }
    isPlaceholder() {
        return this.text == Tabs.space;
    }
    setComments(id, index) {
        if (this.isCarousel() && index != undefined) {
            if (this.comments[index] != id) {
                this.comments[index] = id;
                this.comments = [...this.comments];
            }

        } else {
            let has = this.comments.find(_ => _ == id);
            if (has) return;
            this.comments.push(id);
        }

        // if (index != undefined) {
        //     this.comments[index] = id;
        // } else {
        //     this.comments.push(id);
        // }

    }
    getFissionModal(start, end, text) {
        // let text = this.text || text;
        let textLength = this.getTextLength();
        let progress = [];
        if (start == end) return progress;
        if (start) {
            progress.push({
                sub: [0, start]
            });
        } else {
            start = 0;
        }

        progress.push({
            sub: [start, end ? end - start : textLength - start],
            isRange: true
        });
        if (end && end != textLength) {
            progress.push({
                sub: [end]
            });
        }
        return progress;
    }
    // 分裂器 当进行文本选区的时候自动分裂裁剪成 n 部分 start - 裁剪区 - end

    // start 该unit 文本字符第start开始位置
    // end 该unit 文本字符第end结束位置
    fission(start, end) {
        let text = this.text;
        if (!this.isText()) return [];
        // 如果是段落换行 不再执行分裂
        if (this.isLineFeed()) return [];

        let modal = this.getFissionModal(start, end, text);
        let group_id = guid();
        modal = modal.map(_ => {
            return {
                ..._,
                text: text.substr(..._.sub),
                group_id
            };
        });
        return modal;
    }

    getTextLength() {
        if (this.isText()) {
            return +this.text.length;
        }

        return 0;

    }
    getText() {
        return this.text;
    }

    getOffsetInLine(offset) {
        let Line = this.parentNode;
        let _offset = 0;
        Line.childNodes.find(Unit => {
            if (Unit == this) {
                _offset += offset;
                return true;
            }
            _offset += Unit.getTextLength();
        });
        return _offset;
    }


    placeholder() {
        this.text = Tabs.space;

    }

    typed(type) {
        this.type = type;
        return this;
    }

    appendText(cursor, text) {
        let {
            offset
        } = cursor;
        let [left, right] = vSplit(this.text, offset);
        let value = left + text + right;
        this.text = value;
        this.onRender();
        return value;
    }
    deleteText(cursor, num = 1) {
        let {
            offset
        } = cursor;
        let [left, right] = vSplit(this.text, offset);
        left = left.slice(0, -1 * num);
        let value = left + right;
        this.text = value;
        this.onRender();
        return value;
    }
    // 更新内容 文本变化，或者 图片 形变等
    updateContent(value) {
        this.text = value;
    }

    updateRange() {
        this.startOffset = 0;
        this.endOffset = this.text.length;

    }







    compositioning(cursor, text) {
        let startNode = cursor.range.startNode;
        let range = getRange();
        cursor.range.getRange(node => {
            if (node != startNode.nextSibling && node.is_composition) {
                // console.log(node.text, '__x__', node.__el__.innerText)
                let start = computedClientBoundaryByOffset(node.__el__, 0, 'right', range);
                let end = computedClientBoundaryByOffset(node.__el__, node.getTextLength(), 'right', range);

                let __x__ = end.rect.x - start.rect.x;

                node.L.childNodes.map(node => {
                    node.__x__ = -__x__;
                })
                // 为节点打个标记
                node.L.removeChild(node);


            }
        }, false)
        // let clone = cursor.node.cloneNode();
        // clone.guid = cursor.node.guid;
        // clone.text = text;
        // cursor.range.getRange((node, index) => {
        //     node.L.removeChild(node);
        //     return node;
        // }, false);
        // let startNode = cursor.range.startNode;
        // if (startNode.nextSibling) {

        //     startNode.L.insertBefore(clone, startNode.nextSibling)
        // } else {
        //     startNode.L.appendChild(clone)
        // }
        // return clone;
    }
    compositioning2(cursor, breaks) {
        // ------------ 
        let range = new RectRange();
        breaks.map(_break => {
            // 判断是否为输入法
            if (_break.startNode && _break.startNode.is_composition) {

            }
        })
    }

    updateCompositionRange(cursor) {
        if (!cursor || !cursor.range) return;
        let startNode = cursor.range.startNode;
        if (!startNode) return;
        startNode.getNextSameNodeTypeNodes(node => {

            if (!node.is_composition) {

                cursor.range.setEnd({
                    node,
                    offset: 0
                })
                return 'break';
            }
        })
    }

    composition(cursor) {
        let {
            offset
        } = cursor;
        let range = new RectRange();
        let [left, right] = vSplit(this.text, offset);
        let nodeleft = this.cloneNode();
        nodeleft.text = left
        let noderight = this.cloneNode();
        noderight.text = right;
        let composition = this.cloneNode();
        composition.text = '';
        composition.is_composition = true;
        this.parentNode.insertBefore(nodeleft, this);
        this.parentNode.insertBefore(composition, this);
        this.parentNode.insertBefore(noderight, this);
        this.parentNode.removeChild(this);
        range.setStart({
            node: nodeleft,
            offset: nodeleft.getTextLength()
        });

        range.setEnd({
            node: noderight,
            offset: 0
        });
        cursor.range = range;
        return composition;
        // this.parentNode
    }

    compositionEnd(cursor) {
        // let text = 
        let removeNodes = [];
        let cursorNode = null;
        let offset = 0;
        let startNode = cursor.range.startNode;
        let endNode = cursor.range.endNode;
        if (startNode.L == endNode.L) {
            offset = startNode.getTextLength() + startNode.nextSibling.getTextLength();
        }
        if (startNode.L != endNode.L) {
            endNode.previousSibling && (offset = endNode.previousSibling.getTextLength())

        }

        cursor.range.getRange((node, index) => {
            if (!node.is_composition) {
                if (index == 0 && node.nextSibling) {
                    node.nextSibling.text = node.text + node.nextSibling.text;

                    removeNodes.push(node);
                    cursorNode = node.nextSibling;
                    // this.parentNode.removeChild(node);
                }
                if (index != 0 && node.previousSibling) {
                    node.previousSibling.text = node.previousSibling.text + node.text;
                    removeNodes.push(node);
                    cursorNode = node.previousSibling;

                    // this.parentNode.removeChild(node);
                }

            }
            node.is_composition = false;
        });
        removeNodes.map(node => {
            node.parentNode.removeChild(node);
        });
        removeNodes = [];

        // let nextSibling = this.nextSibling;
        // let previousSibling = this.previousSibling;

        // let leftText = previousSibling ? previousSibling.text : '';
        // let rightText = nextSibling ? nextSibling.text : '';
        // let text = cursor.oldInput;
        // this.parentNode.removeChild(previousSibling);
        // this.parentNode.removeChild(nextSibling);
        // this.text = leftText + text + rightText;
        // this.is_composition = false;
        return {
            node: cursorNode,
            offset
        };
    }







}
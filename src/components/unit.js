
import Node from '../lib/node.js';
import { guid, vSplit } from '../util/index';

import Tabs from '@/lib/tabs.js';
// import DocStyle from './doc-style';
export default class Unit extends Node {
    constructor(options = {}, update) {
        super(options, update);
        
        this.nodeType = 'unit';
        this.class="jf-unit";
        // console.log(options, 'opots')
        // 评论数组
        this.comments = [...(options.comments || [])];
        // 文本
        this.text = options.text;
        // 图片地址
        this.url = options.url;
        this.isRange = options.isRange;
        // 类型  text composition表示输入法类型
        this.type = options.type || 'text';
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
        console.log(this.type, 'options');
        if(!this.isCarousel()) {
            this.comments = this.comments.filter(_ => _);
        }
        // 场景支持
        this.sceneSupport = [];
        if(this.isText()) {
            this.sceneSupport = ['comment', 'update-text'];
        } 
        if(this.isCarousel()) {
            this.sceneSupport = ['comment'];
        }

       

    }

    get safeText() {
        return this.__el__ ? this.__el__.textContent : this.text;
    }
    get safeTextLength() {
        if(this.isText()) {
            return this.safeText.length;
        }
        return 1;
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
        if(this.isImage()) return false;
        return this.text == '';
    }
    isPlaceholder() {
        return this.text == Tabs.space;
    }
    setComments(id, index) {
        if (this.isCarousel() && index!=undefined) {
            if(this.comments[index] !=id) {
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
            progress.push({ sub: [0, start] });
        } else {
            start = 0;
        }

        progress.push({ sub: [start, end ? end - start : textLength - start], isRange: true });
        if (end && end != textLength) {
            progress.push({ sub: [end] });
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
        if(this.isLineFeed()) return [];

        let modal = this.getFissionModal(start, end, text);
        let group_id = guid();
        modal = modal.map(_ => {
            return { ..._, text: text.substr(..._.sub), group_id };
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
            if(Unit == this) {
                _offset+=offset;
                return true;
            }
            _offset+=Unit.getTextLength();
        });
        return _offset;
    }


    placeholder() {
        this.text = Tabs.space;
        // console.log(this.text, 'text');
    }

    appendText(cursor, text) {
        let { offset } = cursor;
        let [left, right] = vSplit(this.text, offset);
        let value = left + text + right;
        this.text = value;
        return value;
    }
    deleteText(cursor, num = 1) {
        let { offset } = cursor;
        let [left, right] = vSplit(this.text, offset);
        left = left.slice(0, -1 * num);
        let value = left + right;
        this.text = value;
        return value;
    }







    compositionOtherEmpty(cursor) {
        let { node } = cursor;
        // 当前编辑的上一个node
        let firstCompositionPrev = node.previousSibling;
        // node.parentNode.removeChild(node);
        node.getPreviousSameNodeTypeNodes(node => {
            if(node.isComposition()) {
                firstCompositionPrev = node.previousSibling;
                node.parentNode.removeChild(node);
            }
        })
        node.getNextSameNodeTypeNodes(node => {
            if(node.isComposition()) {
                node.parentNode.removeChild(node);
            }
        });
        
        
        return firstCompositionPrev;

    }

    composition(cursor) {
        let { offset } = cursor;
        let [left, right] = vSplit(this.text, offset);
        // this.parentNode.removeChild(this);
        
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
        return composition;
        // this.parentNode
    }

    compositionEnd(cursor) {
        let nextSibling = this.nextSibling;
        let previousSibling = this.previousSibling;

        let leftText = previousSibling ? previousSibling.text : '';
        let rightText = nextSibling ? nextSibling.text : '';
        let text = cursor.oldInput;
        this.parentNode.removeChild(previousSibling);
        this.parentNode.removeChild(nextSibling);
        this.text = leftText + text + rightText;
        this.is_composition = false;
        return this;
    }







}
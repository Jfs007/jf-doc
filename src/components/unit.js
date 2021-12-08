
import Node from '../lib/node.js';
import { guid, vSplit } from '../util/index';
// import DocStyle from './doc-style';
export default class Unit extends Node {
    constructor(options = {}, update) {
        super(options, update);
        // console.log(options, 'opots')
        // 评论数组
        this.comments = [...(options.comments || [])];
        // 文本
        this.text = options.text;
        this.isRange = options.isRange;
        // 类型 composition / text composition表示输入法类型
        this.type = options.type || 'text';
        // 标记 delete 
        this.remark = options.remark || '';
        this.linespacing = options.linespacing || ''

        
        // 标注选中时切割的textUnit隶属同一group_id
        this.group_id = options.group_id;
        // 光标，在Cursor产生后会被挂载
        this.__cursor__ = null;
        // this.docStyle = new DocStyle(options.docStyle || {});
        this._copy = [];
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
    isLineFeed() {
        return this.text == '\n'
    }
    isText() {
        return this.type == 'text';
    }
    isImage() {
        return this.type == 'image';
    }
    isCarousel() {
        return this.type == 'carousel'
    }
    setComments(id, index) {
        if (this.isCarousel() && index!=undefined) {
            if(this.comments[index] !=id) {
                this.comments[index] = id;
                this.comments = [...this.comments];
                // console.log(this.comments)
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
        composition.type = 'composition';
        this.parentNode.insertBefore(nodeleft, this);
        this.parentNode.insertBefore(composition, this);
        this.parentNode.insertBefore(noderight, this);
        this.parentNode.removeChild(this);
        // this.parentNode.appendChild(composition);
        // this.parentNode.appendChild(noderight);
        return composition;
        // this.parentNode
    }







}
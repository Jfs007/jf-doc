import Base from './base';
import {
    guid,
    getProperty
} from '../util/index';
import {
    getTextNode,
    loopNodes
} from "@/util/dom";
import renderQueue from './render-queue';
import {
    getRange
} from '@/util/range';
import Tabs from '@/lib/tabs.js';
import RectRange from './rectRange';
export default class Node extends Base {
    constructor(options, update = false) {
        super();
        this.class = '';
        this.nodeName = '';
        this.__text__ = '';
        // this.text = '';
        this.style = '';
        this.parentNode = null;
        this.childNodes = [];
        this.nextSibling = null;
        this.previousSibling = null;
        this.lastChild = null;
        this.firstChild = null;
        this._dirty = true;
        // dom渲染的时候会进行绑定真实dom
        this.__el__ = null;

        // this.__virtual__ = true;

        // 是否处于自动换行中
        this.__wraping__ = false;
        // 在__wraping__存在时发生，记录dom当前js换行的位置 具体见下面注释
        this.__offset__ = undefined;
        // 在__wraping__存在时发生，记录由于换行产生的差值 具体见下面注释
        this.__x__ = undefined;
        // 在__wraping__存在时发生，记录是文本超出还是进行补全 具体见下面注释
        this.__overed__ = undefined;

        //  @提案  在换行时如果发现节点存在__visible__标记 会获取其宽度后将其进行删除
        this.__visible__ = undefined
        

        /**
         * ||||||a|||
         * ||||||
         * a||| 为__overed__ 文本超出 将标记为true
         * |||
         * b||||||
         * b|| 为进行补充 _overed__不会进行标记
         * 
         * 
         * 原文本
         * ||||||||||||||||||a|||||
         * ||||||||||||||||||
         * ||||||||||||||||||
         * 换行推演如下 ()部分表示换行部分
         * ||||||||||||||||||(a|||||)
         * ||||||||||||||||||
         * ||||||||||||||||||
         * =>
         * ||||||||||||||||||
         * (a|||||)||||||||||||(||||||)
         * ||||||||||||||||||
         * =>
         * ||||||||||||||||||
         * (a|||||)||||||||||||
         * (||||||)||||||||||||(||||||)
         * =>
         * ||||||||||||||||||
         * (a|||||)||||||||||||
         * (||||||)||||||||||||
         * (||||||)||||||
         * 
         * 
         * 
         * |||||口|
         * 
         *假设a标记位置发生了换行(标记为__wraping__)，那么将该片段(该片段会继续绑定原始真实dom，并用__offset__记录截取位置)
         补充到下一行并缓存a|||||片段的长度给下一行每个node作为__x__ 为方便下一行进行换行()
        在完成换行后，所有标记将被移除
         * 
         * 
         * 
         * 
         * 
         * 
         */
        this.guid = guid();
        this.areas = [];

        this.mountedList = [];
        this.renderList = [];

        // this.render_id = guid();
        super.init(options);
        if (update) {
            this.guid = guid();
        }


    }
    // 是否处于虚拟节点阶段
    get __virtual__() {
        if (!this.__el__) return true;
        if (this.__wraping__) return true;
        return false;
    }
    get text() {

        return this.__text__;
    }

    set text(value) {
        this.__text__ = value;
        let node = this;
        if (!this.__virtual__) {

            node.__mounted = () => {
                renderQueue.releaseTicks(node);
            }
            renderQueue.push(node, 'text');
        }
        setTimeout(_ => {
            node.__mounted && node.__mounted();
        }, 0)


    }

    get D() {
        let nodeType = this.nodeType;
        if (nodeType == 'unit') {
            return this.parentNode.parentNode.parentNode;
        }
        if (nodeType == 'line') {
            return this.parentNode.parentNode;
        }
        if (nodeType == 'section') {
            return this.parentNode;
        }
        if (nodeType == 'doc') {
            return this;
        }

        return null;

    }
    get S() {
        let nodeType = this.nodeType;
        if (nodeType == 'unit') {
            return this.parentNode.parentNode;
        }
        if (nodeType == 'line') {
            return this.parentNode;
        }
        if (nodeType == 'section') {
            return this;
        }

        return null;
    }

    get L() {
        let nodeType = this.nodeType;
        if (nodeType == 'unit') {
            return this.parentNode;
        }
        if (nodeType == 'line') {
            return this;
        }
        return null;

    }

    get U() {
        let nodeType = this.nodeType;
        if (nodeType != 'unit') {
            return null;
        }
        return this;
    }

    mounted(c) {
        this.mountedList.push(c);

    }

    onMount() {
        this.__wraping__ = false;
        this.__mounted && this.__mounted();
        this.mountedList.map(callback => callback());
        this.mountedList = [];
    }
    onRender(el) {
        if (el) {
            this.__el__ = el;
            this.__el__.__unit__ = this;
        }

    }

    pushMount(node) {
        // let rectRange = new RectRange();
        // rectRange.setStart({ node: node.})
        // let renderObj = {
        //     range
        // }



        if (node.parentNode && !node.parentNode.__virtual__) {
            // 如果是虚拟节点则推入
            if (node.__virtual__) {
                node.__mounted = () => {
                    renderQueue.releaseTicks(node);
                }
                renderQueue.push(node)
            }

        }
    }


    getText() {
        return this.text;
    }


    get textContent() {
        let text = this.getText();
        loopNodes(this, (node) => {
            text = text + node.getText();
        });
        return text;
    }
    _updateDirty(flag) {
        this._dirty = flag;
    }
    _setParentNode(pnode) {
        this.parentNode = pnode;
    }
    _setChildNodes(childs) {
        this.childNodes = childs;
    }
    _solveSibling() {
        if (!this.parentNode) return;
        let {
            childNodes
        } = this.parentNode;
        let idx = childNodes.findIndex(node => node == this);
        this.nextSibling = childNodes[idx + 1];
        this.previousSibling = childNodes[idx - 1];

        if (this.nextSibling) {
            this.nextSibling.previousSibling = this;
        }
        if (this.previousSibling) {
            this.previousSibling.nextSibling = this;
        }
    }
    _solveLastChild() {
        this.lastChild = this.childNodes[this.childNodes.length - 1];
    }
    _solveFirstChild() {
        this.firstChild = this.childNodes[0];

    }



    addArea(area) {
        let isExit = this.areas.find(_area => {
            let relation = _area.getRelation(area);
            if (relation == 'coincide') return true;
        });
        if (!isExit) {
            this.areas.push(area);
        }
    }
    removeArea(area) {
        let index = this.areas.findIndex(_area => _area == area);
        this.splice(index, 1);
    }




    isPlaceholder() {
        return this.textContent == Tabs.space;
    }
    isBlank() {

        return this.textContent == '';
    }



    /**
     * 
     * 
     * 
     * ||||||||||||
     * 
     */

    getPreviousSameNodeTypeNode() {
        let _this = this;
        let node = _this.previousSibling;

        if (node) return node;
        let level = 0;
        while (node = _this.parentNode) {
            level++;
            if (!node.previousSibling) {
                _this = node;
                // node = _parent.parentNode;
            } else {

                return getProperty(node.previousSibling, new Array(level).fill('lastChild').join('.'))
            }
        }
        return null;


        // let prevParent = node.parentNode.previousSibling;

        // while(!prevParent && node.parentNode) {
        //     node = node.parentNode;
        //     prevParent = node.parentNode


        // }
        // if (prevParent) {
        //     node = prevParent.lastChild;
        // } 



    }
    // 获取range内容的宽高
    getRangeRect(area) {

    }




    // 搜索节点之前所有nodetype一样的node
    getPreviousSameNodeTypeNodes(callback = () => { }) {
        let _this = this;
        let node = _this.previousSibling;
        while (node) {
            let rs = callback(node);
            if (rs == 'break') {
                break;
            }
            let parentNode = node.parentNode;
            node = node.previousSibling;
            if (!node) {
                let prevParent = parentNode.previousSibling;
                if (prevParent) {
                    node = prevParent.lastChild;
                }
            }
        }
    }

    getNextSameNodeTypeNodes(callback = () => { }) {
        let _this = this;
        let node = _this.nextSibling;
        while (node) {
            let rs = callback(node);
            if (rs == 'break') {
                break;
            }
            let parentNode = node.parentNode;
            node = node.nextSibling;
            if (!node) {
                let prevParent = parentNode.nextSibling;
                if (prevParent) {
                    node = prevParent.firstChild;
                }
            }
        }
    }
    getNextNodes(callback = () => { }) {
        let _this = this;
        let node = _this.nextSibling;
        while (node) {
            callback(node);
            node = node.nextSibling;
        }
    }
    getPreviousNodes(callback = () => { }) {
        let _this = this;
        let node = _this.previousSibling;
        while (node) {
            callback(node);
            node = node.previousSibling;
        }
    }

    getTextNodeHeight(node) {
        let textNode = getTextNode(node);
        let height = 0;
        let range = getRange();
        range.selectNodeContents(textNode);
        if (range.getBoundingClientRect) {
            var rect = range.getBoundingClientRect();
            if (rect) {
                height = rect.bottom - rect.top;
            }
        }
        return height;
    };

    emptyChildNodes() {
        this.childNodes = [];
        this.firstChild = null;
        this.lastChild = null;
        return this;
    }

    cloneNode() {
        let node = new this.constructor(this, true);
        node.guid = guid();
        // node.__virtual__ = true;
        node.__el__ = null;
        return node;
    }




    insertBefore(newNode, referenceNode) {
        let idx = this.childNodes.findIndex(node => node == referenceNode);
        newNode._setParentNode(this)
        this.childNodes.splice(idx, 0, newNode);
        referenceNode._solveSibling();
        newNode._solveSibling();
        this._solveLastChild();
        this._solveFirstChild();
        this.pushMount(newNode);

        return newNode;
    }


    appendChild(node) {
        node._setParentNode(this);
        this.childNodes.push(node);
        node._solveSibling();
        this._solveLastChild();
        this._solveFirstChild();

        this.pushMount(node);
        return node;
    }
    appendChilds(nodes) {
        nodes.map(node => {
            this.appendChild(node);
        });
        return this;
    }
    removeChild(dnode) {
        let idx = this.childNodes.findIndex(node => node == dnode);
        if (idx > -1) {
            let node = this.childNodes.splice(idx, 1);
            let previousSibling = dnode.previousSibling;
            let nextSibling = dnode.nextSibling;
            if (previousSibling) {
                // pr
                previousSibling._solveSibling();
            }
            if (nextSibling) {
                nextSibling._solveSibling();
            }
            this._solveLastChild();
            this._solveFirstChild();
            this.pushMount(dnode);
            setTimeout(() => {
                dnode.__mounted && dnode.__mounted();
            }, 0);
            return dnode;
        }
        this._console.error('不存在该节点');
    }

    replaceChild(newChild, oldChild) {
        let idx = this.childNodes.findIndex(node => node == oldChild);
        newChild._setParentNode(this);
        if (idx > -1) {
            let node = this.childNodes.splice(idx, 1);
            this.childNodes.splice(idx, 0, newChild);
            newChild._solveSibling();
            this._solveLastChild();
            this._solveFirstChild();
            this.pushMount(newChild);
            return oldChild;
        }
        this._console.error('不存在该节点');
    }





}
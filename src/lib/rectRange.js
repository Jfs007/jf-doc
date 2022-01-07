import Base from './base';

export default class RectRange extends Base {
    constructor(options) {
        super(options);
        this.startNode = null;
        this.endNode = null;
        this.startOffset = 0;
        this.endOffset = 0;
        this.endX = 0;
        this.endElx = 0;
        this.startX = 0;
        this.startElx = 0;

        super.init(options);
    }
    get collapsed() {
        return this.startNode == this.endNode && this.startOffset == this.endOffset;
    }
    reset() {
        this.startNode = null;
        this.endNode = null;
        this.startOffset = 0;
        this.endOffset = 0;
        this.endX = 0;
        this.endElx = 0;
        this.startX = 0;
        this.startElx = 0;
    }
    setStart({
        node,
        offset,
        x,
        elx
    }) {
        this.startNode = node;
        this.startOffset = offset;
        this.startX = x;
        this.startElx = elx;
    }
    setEnd({
        node,
        offset,
        x,
        elx
    }) {
        this.endNode = node;
        this.endOffset = offset;
        this.endX = x;
        this.endElx = elx;
    }
    clone() {
        let range = new this.constructor(this);

        return range;
    }
    getRelation(area) {

        if (area.startNode == this.startNode && area.endNode == this.endNode) {
            if (area.startOffset == this.startOffset && area.endOffset == this.endOffset) {
                return 'conincide'
            }
            if (area.startOffset >= this.startOffset && area.endOffset <= this.endOffset) {
                return 'included'
            }
            if (area.startOffset <= this.startOffset && area.endOffset >= this.endOffset) {
                return 'contain'
            }
            return 'overlap'
        };
        return 'difference'

    }

    getRange(callback = (node) => { }, include = true) {
        let startNode = this.startNode;
        let endNode = this.endNode;
        let index = 0;
        let nodes = [];
        // let collapsed
        // 如果在同一个节点
        if (startNode == endNode && this.endOffset == 0) return [];
        if (include) {
            let node = callback(startNode, index, this);
            if (node) nodes.push(node);
        }
        index++;
        if (startNode == endNode) return nodes;
        startNode = startNode.nextSibling;
        while (startNode) {
            // if (startNode == endNode && this.endOffset == 0) break;
            if (!(startNode == endNode && !include)) {
                let node = callback(startNode, index, this);
                if (node) nodes.push(node);
            }
            index++;
            if (startNode == endNode) break;
            let L = startNode.L;
            startNode = startNode.nextSibling;
            // 切换到下一行
            if (!startNode && L) {
                startNode = L.nextLine ? L.nextLine.firstChild : null
            }
        };
        return nodes;
    }
}
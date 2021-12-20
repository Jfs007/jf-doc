
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
    setStart({ node, offset, x, elx }) {
        this.startNode = node;
        this.startOffset = offset;
        this.startX = x;
        this.startElx = elx;
    }
    setEnd({ node, offset, x, elx }) {
        this.endNode = node;
        this.endOffset = offset;
        this.endX = x;
        this.endElx = elx;
    }
    clone() {
        let range = new this.constructor(this);
       
        return range;
    }
}
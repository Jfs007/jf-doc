import Base from "./base";
import RectRange from "./rectRange";
class renderQueue extends Base {
    constructor(options) {
        super(options);
        this.lists = [];
        this.ticks = [];
        super.init(options);
    }

    push(node, type) {
        let range = new RectRange();
        range.setStart({ node: node.previousSibling });
        range.setEnd({ node: node.nextSibling });
        let renderObj = {
            range,
            node
        }
        let has = this.lists.find((render, index) => {
            if (render.range.getRelation(renderObj.range) == 'conincide') {
                this.lists.splice(index, 1)
                return true;
            }

        });
        if (!has && type!='text') {
            this.lists.push(renderObj);
        }

    }
    releaseTicks(node) {
        this.lists.find((render, index) => {
            let NODE = render.node;
            if (NODE == node) {
                render.node = undefined;
                this.lists.splice(index, 1);
                return true;
            };
        });
        if (this.lists.length == 0) {
            this.ticks.map(tick => {
                tick();
            });
            this.ticks = [];
        }
        console.log(this.lists)
    }
    nextTick(f) {
        this.ticks.push(f);
    }
}


let RenderQueue = new renderQueue();

export default RenderQueue;


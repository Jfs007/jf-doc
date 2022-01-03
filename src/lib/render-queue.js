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
        if(type == 'text') {
            this.lists.push(renderObj);
            return;
        }
        let has = this.lists.find((render, index) => {
            if (render.range.getRelation(renderObj.range) == 'conincide') {
                this.lists.splice(index, 1)
                return true;
            }

        });
        if (!has) {
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

        // bug 跑完当前tick后 tick里面加入新tick， 但是当前tick会移除所有tick 
        if (this.lists.length == 0) {
            this.constructor.Target = null;
            this.ticks.map(tick => {
                tick();
                
            });
            this.ticks = [];
        }
        
        
    }
    nextTick(f) {
       console.log('push')
        this.ticks.push(f);
    }
}


let RenderQueue = new renderQueue();

export default RenderQueue;


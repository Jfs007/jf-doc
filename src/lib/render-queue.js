import Base from "./base";

class renderQueue extends Base {
    constructor(options) {
        super(options);
        this.lists = [];
        this.ticks = [];
        super.init(options);
    }

    push(render) {
        this.lists.push(render);
    }
    releaseTicks(node) {
        this.lists.find((render, index) => {
            let NODE = render.NODE;
            if (NODE == node) {
                render.NODE = undefined;
                console.log('update')
                this.lists.splice(index, 1);
                return true;
            };
        });
        console.log(this.lists, 'lists');
        if (this.lists.length == 0) {
            this.ticks.map(tick => {
                tick();
            });
            this.ticks = [];
        }
        // console.log(node, this.lists)
    }
    nextTick(f) {
        this.ticks.push(f);
    }
}


let RenderQueue = new renderQueue();

export default RenderQueue;


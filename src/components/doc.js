
import Base from '@/lib/base';
import Range from './range';
import History from '@/lib/history';
import Section from './section';
import Cursor from './cursor';
import Events from '@/lib/events';

// import { guid } from '../util/index';
export default class Section extends Base {
    constructor(config = {}) {
        super();
        this.history = new History();
        this.range = new Range();
        this.sections = [new Section()];
        this.cursor = new Cursor();
        this.events = new Events();
        super.init(config);
        this.registered(config.Components);
    }

    registered() {

    }
    init(config) {
        let { doc } = config;
        doc.map(section => {
            
        })
    }



    
}
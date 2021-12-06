
import Base from '@/lib/base';
import Range from './range';
import History from '@/lib/history';
import Section from './section';
import Cursor from './cursor';
import Events from '@/lib/events';
import textUnit from './unit';


/**
 * [{  s: '', lid: 1  }]
 * 
 * 段落对象
 * 行对象
 * 节点对象
 * 
 * 
 * 
 * 
 */

// import { guid } from '../util/index';
export default class Doc extends Base {
    constructor(config = {}) {
        super();
        this.history = new History();
        this.range = new Range();
        this.sections = [new Section()];
        this.cursor = new Cursor();
        this.events = new Events();
        super.init(config);
        this.registered(config.Components);
        this.init(config);
    }

    registered() {

    }
    buildSections() {

        let lineFeedIndex = 0;
        let prevUnit = {
            isLineFeed: () => false
        };
        // for (let index = doc.length - 1; index >= 0; index--) {
        //     let unit = new textUnit(doc[index]);
        //     if (unit.isLineFeed()) {
        //         unit.line_feed = 1;
        //         this.paragragh.unshift(unit);
        //         lineFeedIndex = this.number;
        //         this.number++;
        //         if (prevUnit.isLineFeed()) {
        //             this.spans.unshift([unit]);
        //         }
        //     } else {
        //         if (!this.spans[lineFeedIndex]) {
        //             this.spans.unshift([])
        //         }
        //         this.spans[0].unshift(unit);
        //     }
        //     prevUnit = unit;
        // }
       
    }

    init(config) {
        let { doc } = config;
        let sections = this.buildSections(doc||[]);
        console.log(sections, 'sections');
        // let sections 
    }




}
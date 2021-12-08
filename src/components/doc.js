
import Node from '@/lib/node';
import Range from './range';
import History from '@/lib/history';
import Section from './section';
import Cursor from './cursor';
import Events from '@/lib/events';
import Unit from './unit';
import Line from './line';
import { isTextNode } from '@/util/dom';
import keyCode from '@/lib/keyCode';

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

export default class Doc extends Node {
    constructor(config = {}) {
        super();
        this.history = new History();
        this.range = null;
        // this.sections = [];
        this.cursor = new Cursor();
        this.events = new Events();
        this.$el = null;


        this.events.on(document, 'mouseup', (e) => {
            if (this.cursor.composition == 'start') {
                this.cursor.node.parentNode.removeChild(this.cursor.node);
                this.cursor.empty();

            }
            // this.range = new Range();
            if (this.$el.contains(e.target)) {
                this.cursor.place(e);
            } else {
                this.cursor.empty();
            }

        });
        this.events.on(document, 'scroll', (e) => {
            this.cursor.update();
        });
        this.events.on(document, 'keyup', (e) => {

            let { composition } = this.cursor;
            let offset = 0;
            if (keyCode[e.keyCode] == 'Delete') {
                offset = -1;
                this.cursor.node.deleteText(this.cursor, Math.abs(offset))
            } else if (keyCode[e.keyCode] == 'Enter') {


            } else {
                offset = this.cursor.input.length;
                if (composition == 'update') {
                    this.cursor.node.text = this.cursor.oldInput;
                    this.cursor.offset = 0;
                    offset = this.cursor.oldInput.length;
                } else {
                    this.cursor.node.appendText(this.cursor, this.cursor.input);
                }
            }
            if (composition == 'end') {
                this.cursor.node.type = 'text';
                this.cursor.node.text = this.cursor.oldInput;
                this.cursor.composition = '';
                this.cursor.offset = 0;
                offset = this.cursor.oldInput.length;
                // this.empty();
            }
            this.nextTick(_ => {
                if (composition == 'update') {
                    this.cursor.set(this.cursor.node.__el__, offset + this.cursor.offset);
                } else {
                    this.cursor.update(offset + this.cursor.offset);
                }
            })


        });
        this.events.on(document, 'compositionstart', (e) => {
            let composition = this.cursor.node.composition(this.cursor);
            this.cursor.composition = 'start';
            this.cursor.node = composition;
            this.cursor.offset = 0;
        });
        this.events.on(document, 'compositionupdate', (e) => {
            this.cursor.composition = 'update';
        })
        this.events.on(document, 'compositionend', (e) => {
            this.cursor.composition = 'end';
            // this.cursor.node.type = 'text';
            // this.cursor.
            // this.cursor.node.type = 'text';
            // this.cursor.empty();
        })
        super.init(config);
        this.registered(config.Components);
        this.init(config);
    }

    nextTick(callback = () => { }) {
        setTimeout(callback, 0)
    }

    registered() {

    }
    buildSections() {
        let section1 = new Section({ class: 'jf-section' })
        let line1 = new Line({ class: 'jf-line' });
        let unit1 = new Unit({ class: 'jf-unit', text: '烦不烦' });
        let unit2 = new Unit({ class: 'jf-unit', text: '我还要睡觉呢' });
        let unit3 = new Unit({ class: 'jf-unit', text: '吵死了' });


        let section2 = new Section({ class: 'jf-section' })
        let line2 = new Line({ class: 'jf-line' });
        let unit21 = new Unit({ class: 'jf-unit', text: 'JDs 风' });
        let unit22 = new Unit({ class: 'jf-unit', text: '两份cash' });
        let unit23 = new Unit({ class: 'jf-unit', text: '吵死了' });
        line1.appendChild(unit1);
        line1.appendChild(unit2);
        line1.appendChild(unit3);
        section1.appendChild(line1);


        line2.appendChild(unit21);
        line2.appendChild(unit22);
        line2.appendChild(unit23);
        section1.appendChild(line2);
        this.appendChild(section2);
        this.appendChild(section1);
        return section1;
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
        let sections = this.buildSections(doc || []);
        // let sections 
    }


    render(el) {
        this.$el = el;
    }


    insertSection() {

    }


    getNodeByDom(dom) {




        // if(!isTextNode(dom)) {

        // }
        // let node = dom.parentNode;
        // while(node) {
        //     if(isTextNode(node)) {

        //     } 
        // }

        // console.log(dom.__unit__, '__unit__')

    }




}
// Doc.Line(component, )
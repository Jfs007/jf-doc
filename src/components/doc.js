import Node from '@/lib/node';
import Range from './range';
import History from '@/lib/history';
import Section from './section';
import Cursor from './cursor';
import Events from '@/lib/events';
import Unit from './unit';
import Line from './line';
import {
    isTextNode
} from '@/util/dom';
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
        this.__el__ = null;


        this.events.on(document, 'mouseup', (e) => {
            if (this.cursor.composition) {
                this.cursor.node.parentNode.removeChild(this.cursor.node);
                this.cursor.empty();
            }
            if (this.__el__.contains(e.target)) {
                this.cursor.place(e);
                let Line = this.cursor.node.parentNode;
                console.log(Line.isOverflow(), 'line');

            } else {
                this.cursor.closeComposition();
                this.cursor.empty();
            }

        });
        this.events.on(document, 'scroll', (e) => {
            this.cursor.update();
        });

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
        let section1 = new Section({
            class: 'jf-section'
        })
        let line1 = new Line({
            class: 'jf-line'
        });
        let unit1 = new Unit({
            class: 'jf-unit',
            text: '这是一个自定义编辑器'
        });
        let unit2 = new Unit({
            class: 'jf-unit',
            text: '这个东西包含原生Range'
        });
        let unit3 = new Unit({
            class: 'jf-unit',
            text: '富含自定义ui组件'
        });


        let section2 = new Section({
            class: 'jf-section'
        })
        let line2 = new Line({
            class: 'jf-line'
        });
        let unit21 = new Unit({
            class: 'jf-unit',
            text: 'JDs 风'
        });
        let unit22 = new Unit({
            class: 'jf-unit',
            text: '两份cash'
        });
        let unit23 = new Unit({
            class: 'jf-unit',
            text: '吵死撒可代发收款的风景阿斯利康代发价奥斯卡的发安防监控是的发酵是的圣诞afaf是的发酵安抚巾节饭卡健身房发酵撒旦法卡萨丁解放军酵氨基酸开发举案说法了'
        });
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

    }

    init(config) {
        let {
            doc
        } = config;
        let sections = this.buildSections(doc || []);
        // let sections 
    }


    render({
        doc,
        cursor
    }) {
        this.__el__ = doc;
        this.cursor.__el__ = cursor;
        this.bind()
    }
    bind() {
        let cursor = this.cursor.__el__;

        // 
        this.events.on(cursor, 'keydown', (e) => {
           
            let {
                composition
            } = this.cursor;
            let offset = 0;

            let KeyCodeName = keyCode[e.keyCode];
            let previousSibling = this.cursor.node.previousSibling;
            let nextSibling = this.cursor.node.nextSibling;
            console.log('keydown')
            if (KeyCodeName == 'Delete') {
                this.cursor.emptyInput();
                offset = -1;
                if (!composition) {
                    if (this.cursor.offset == 0) {
                        if (previousSibling) {
                            if (this.cursor.node.text == '') {
                                this.cursor.node.parentNode.removeChild(this.cursor.node);
                            }
                            this.cursor.set(previousSibling.__el__, previousSibling.text.length);
                        }
                    }
                    this.cursor.node.deleteText(this.cursor, Math.abs(offset));
                }

            } else if (KeyCodeName == 'Enter') {


            } else if (KeyCodeName == 'ArrowLeft' || KeyCodeName == 'ArrowRight') {
                this.cursor.emptyInput();
                let _offset = this.cursor.offset;
                if (KeyCodeName == 'ArrowLeft') {
                    if (_offset > 0) {
                        offset = -1;
                    } else {
                        if (previousSibling) {
                            this.cursor.set(previousSibling.__el__, previousSibling.text.length - 1);
                        }
                    }

                }
                if (KeyCodeName == 'ArrowRight') {
                    if (_offset < this.cursor.node.text.length) {
                        offset = 1;
                    } else {
                        if (nextSibling) {
                            this.cursor.set(nextSibling.__el__, 1)
                        }
                    }

                }

            }

            this.nextTick(_ => {
                if (composition == 'update') {
                    this.cursor.set(this.cursor.node.__el__, this.cursor.node.text.length);
                } else {
                    this.cursor.update(offset + this.cursor.offset);
                }
            })
        })
        this.events.on(cursor, 'input', (e) => {
            let {
                composition
            } = this.cursor;
            let offset = 0;

            offset = this.cursor.input.length;
            console.log('input')
            if (composition == 'update') {
                this.cursor.node.text = this.cursor.oldInput;
                offset = 0;
            } else {
                this.cursor.node.appendText(this.cursor, this.cursor.input);
            }

            if (composition == 'end') {
                // let previousSibling = this.cursor.node.previousSibling;
                // this.cursor.composition = '';
                // this.cursor.offset = 0;
                // offset = this.cursor.oldInput.length + (previousSibling ? previousSibling.text.length : 0);
                // this.cursor.node.compositionEnd(this.cursor);
                // this.cursor.closeComposition();
            }
            this.nextTick(_ => {
                if (composition == 'update') {
                    this.cursor.set(this.cursor.node.__el__, this.cursor.node.text.length);
                } else {
                    this.cursor.update(offset + this.cursor.offset);
                }
            })


        });
        this.events.on(cursor, 'compositionstart', (e) => {
            let composition = this.cursor.node.composition(this.cursor);
            this.cursor.composition = 'start';
            this.cursor.node = composition;
            this.cursor.offset = 0;
        });
        this.events.on(cursor, 'compositionupdate', (e) => {
            this.cursor.composition = 'update';
        })
        this.events.on(cursor, 'compositionend', (e) => {
            console.log('compositionend')
            this.cursor.composition = 'end';
            let previousSibling = this.cursor.node.previousSibling;
            this.cursor.composition = '';
            this.cursor.offset = 0;
            let offset = this.cursor.oldInput.length + (previousSibling ? previousSibling.text.length : 0);
            this.cursor.node.compositionEnd(this.cursor);
            this.cursor.closeComposition();
            this.nextTick(_ => {
                this.cursor.update(offset);
            })
        })

    }


    insertSection() {

    }


    getNodeByDom(dom) {


    }




}
// Doc.Line(component, )
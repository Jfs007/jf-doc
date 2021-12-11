import Node from '@/lib/node';
import Range from './range';
import History from '@/lib/history';
import Section from './section';
import Cursor from './cursor';
import Events from '@/lib/events';
import Unit from './unit';
import Line from './line';
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
        this.nodeType = 'doc';
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

    nextTick(callback = () => {}) {
        setTimeout(callback, 0)
    }

    registered() {

    }
    buildSections() {
        let section1 = new Section({

        })
        let line1 = new Line({

        });
        let unit1 = new Unit({

            text: '这是一个自定义编辑器'
        });
        let unit2 = new Unit({

            text: '这个东西包含原生Range'
        });
        let unit3 = new Unit({

            text: '富含自定义ui组件'
        });


        let section2 = new Section({
            class: 'jf-section'
        })
        let line2 = new Line({

        });
        let unit21 = new Unit({

            text: 'JDs 风'
        });
        let unit22 = new Unit({

            text: '两份cash'
        });
        let unit23 = new Unit({

            text: '吵董小姐，你从没忘记你的微笑，就算你和我一样，渴望着衰老，所以那些可能都不是真的，董小姐，你才不是一个没有故事的女同学'
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
                        } else {
                            // return;
                        }
                    }

                    this.cursor.node.deleteText(this.cursor, Math.abs(offset));
                    if (this.cursor.offset == 0 && !previousSibling) {
                        return;
                    }
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
                this.cursor.node.parentNode.parentNode.breakWord2(this.cursor);
            })
        })
        this.events.on(cursor, 'input', (e) => {
            let {
                composition
            } = this.cursor;
            let offset = 0;
            offset = this.cursor.input.length;
            if (composition == 'update') {
                this.cursor.node.text = this.cursor.oldInput;
                offset = 0;
            } else {
                this.cursor.node.appendText(this.cursor, this.cursor.input);
            }

            this.nextTick(_ => {
                if (composition == 'update') {
                    this.cursor.set(this.cursor.node.__el__, this.cursor.node.text.length);
                } else {
                    this.cursor.update(offset + this.cursor.offset);
                }

                // this.cursor.node.parentNode.parentNode.breakWord(this.cursor);
                
                this.cursor.node.parentNode.parentNode.breakWord2(this.cursor);
                return;
                let Line = this.cursor.node.parentNode;
                let overUnits = Line.getOverFlowUnits();
                let hasNext = Line.nextSibling;
                let newLine = Line.nextSibling ? Line.nextSibling : Line.cloneNode();
                if (!Line.nextSibling) {
                    newLine.childNodes = [];
                    Line.parentNode.appendChild(newLine);
                }
                let _offset = overUnits[0].__offset__;
                overUnits.map(unit => {
                    Line.removeChild(unit);
                    let clone = unit.cloneNode();
                    clone.guid = unit.guid;
                    if (!newLine.childNodes.length) {
                        newLine.appendChild(clone);
                    } else {
                        if (newLine.childNodes[0].guid == clone.guid) {
                            newLine.childNodes[0].text = clone.text.slice(_offset) + newLine.childNodes[0].text;
                        } else {
                            newLine.insertBefore(newLine.childNodes[0], clone);
                        }

                    }
                });

                let clone1 = overUnits[0];
                clone1.text = clone1.text.slice(0, _offset);
                if (!hasNext) {
                    newLine.childNodes[0].text = newLine.childNodes[0].text.slice(_offset)
                }

                Line.appendChild(clone1);
                // console.log(this.cursor)

            })


        });
        this.events.on(cursor, 'compositionstart', (e) => {
            this.cursor.emptyInput()
            let composition = this.cursor.node.composition(this.cursor);
            this.cursor.composition = 'start';
            this.cursor.node = composition;
            this.cursor.offset = 0;
        });
        this.events.on(cursor, 'compositionupdate', (e) => {
            this.cursor.composition = 'update';
        })
        this.events.on(cursor, 'compositionend', (e) => {
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
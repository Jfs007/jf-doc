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
        this.rect = null;
        // this.sections = [];
        this.cursor = new Cursor(this);
        // this.cursor.doc = this;

        this.events = new Events();
        this.__el__ = null;


        this.events.on(document, 'mouseup', (e) => {
            if (this.cursor.composition) {
                this.cursor.node.parentNode.removeChild(this.cursor.node);
                this.cursor.empty();
            }
            if (this.__el__.contains(e.target)) {
                let __unit__ = e.target.__unit__;
                if (__unit__ && __unit__.nodeType != 'unit') {
                    
                    let unit = __unit__.lastChild;
                    if (unit.nodeType == 'unit') {
                        let offset = unit.getTextLength();
                        if (unit.L.isPlaceholder()) {
                            offset = 0;
                        }
                        this.cursor.set(unit.__el__, offset);
                        this.cursor.emptyInput()
                    }
                } else {
                   
                    this.cursor.place(e);
                }
            } else {
                this.cursor.closeComposition();
                this.cursor.emptyInput();
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

        })
        let line1 = new Line({

        });
        let unit1 = new Unit({

            text: '这是一个自定义编辑器'
        });
        let unit2 = new Unit({

            text: '这个东西包含原生Range'
        });
        let unit4 = new Unit({
            type: 'image',
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

            text: 'JDs\u00a0风'
        });
        let unit22 = new Unit({

            text: '两份一样，渴望着'
        });
        let unit23 = new Unit({

            text: '吵董小姐，你从没忘记你的微这首歌深夜写给黄淮，我用那无悔时光来填满，看着那无忧无互的神火，抹布洗，啦啦啦，这是一首简单的小情歌，唱着人们心中的白鸽'
        });
        line1.appendChild(unit1);
        line1.appendChild(unit2);
        line1.appendChild(unit4);
        line1.appendChild(unit3);
        section1.appendChild(line1);
        line2.appendChild(unit21);
        line2.appendChild(unit22);
        line2.appendChild(unit23);
        section1.appendChild(line2);
        this.appendChild(section1);
        // this.appendChild(section1);
        // return section1;

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
        this.breakWord();
        this.drawRect();
        this.bind();

    }
    drawRect() {
        this.rect = this.__el__.getBoundingClientRect();
    }
    breakWord() {
        this.childNodes.map(section => {
            section.breakWord2()
        })
    }
    bind() {
        let cursor = this.cursor.__el__;

        // 
        this.events.on(cursor, 'keydown', (e) => {

            let {
                composition
            } = this.cursor;
            let offset = 0;
            console.log('keycode')
            let KeyCodeName = keyCode[e.keyCode];
            let previousSibling = this.cursor.node.previousSibling;
            let nextSibling = this.cursor.node.nextSibling;
            let stopBreakWord = false;
            let accord = false;
            if (KeyCodeName == 'Delete') {
                this.cursor.emptyInput();
                accord = true;
                if (composition) {
                    stopBreakWord = true;
                }
                offset = -1;
                if (!composition) {
                    if (this.cursor.offset == 0) {
                        // 判断上一个node是否存在
                        if (previousSibling) {
                            // 删除当前的，move到上一个node位置
                            if (this.cursor.node.isBlank()) {
                                this.cursor.node.L.removeChild(this.cursor.node);
                            }
                            this.cursor.set(previousSibling.__el__, previousSibling.text.length);
                        } else {
                            // 不存在move至上一行
                            let node = this.cursor.node.getPreviousSameNodeTypeNode();

                            if (node) {
                                // 如果为占位符行 (空行) 则依旧在当前行 不换行
                                if (node.L.isPlaceholder()) {
                                    node.D.removeChild(node.S);
                                    offset = 0;
                                    this.cursor.offset = 0;
                                    if (this.cursor.node.L.isBlank()) {
                                        this.cursor.node.placeholder();
                                    }
                                } else {
                                    if (this.cursor.node.L.isPlaceholder()) {
                                        this.cursor.node.S.removeChild(this.cursor.node.L)
                                    }
                                    this.cursor.set(node.L.lastChild.__el__, node.L.lastChild.getTextLength());
                                }
                            } else {
                                offset = 0;
                                this.cursor.node.placeholder();
                            }
                        }
                    }
                    // 不是占位符行(空行)
                    this.cursor.node.deleteText(this.cursor, Math.abs(offset));
                    if (this.cursor.node.L.isBlank()) {
                        this.cursor.node.placeholder()
                    }
                }

            } else if (KeyCodeName == 'Enter') {
                accord = false;
                stopBreakWord = true;
                let Line = this.cursor.node.S.insetSection(this.cursor);
                this.nextTick(_ => {
                    this.cursor.reset();
                    this.cursor.set(Line.childNodes[0].__el__, 0);

                    this.cursor.node.S.breakWord2(this.cursor);
                })

            } else if (KeyCodeName == 'ArrowLeft' || KeyCodeName == 'ArrowRight') {
                stopBreakWord = true;
                accord = true;
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

            } else if (KeyCodeName == 'ArrowUp' || KeyCodeName == 'ArrowDown') {
                stopBreakWord = true;
                accord = true;
                if (KeyCodeName == 'ArrowUp') {

                    let Line = this.cursor.node.parentNode;
                    if (!Line.previousSibling) {
                        let Section = Line.parentNode;
                        Line = Section.previousSibling ? Section.previousSibling.lastChild : null;
                    } else {
                        Line = Line.previousSibling;
                    };
                    this.cursor.setCursorAccordWithCursor(this.cursor, Line);
                }
                if (KeyCodeName == 'ArrowDown') {
                    let Line = this.cursor.node.parentNode;

                    if (!Line.nextSibling) {
                        let Section = Line.parentNode;
                        if (Section.nextSibling) {
                            Line = Section.nextSibling ? Section.nextSibling.firstChild : null;
                        }

                    } else {
                        Line = Line.nextSibling;
                    };
                    if (Line) {
                        this.cursor.setCursorAccordWithCursor(this.cursor, Line);
                    }
                }
            }


            this.nextTick(_ => {

                if (!accord) return;
                if (composition != 'update') {
                    this.cursor.update(offset + this.cursor.offset);
                }
                if (!stopBreakWord) {
                    this.cursor.node.S.breakWord2(this.cursor);
                }

            })
        })
        this.events.on(cursor, 'input', (e) => {
            let {
                composition
            } = this.cursor;
            console.log('input')
            let offset = 0;
            offset = this.cursor.input.length;
            let firstCompositionPrev = null;
            if (composition == 'update') {
                this.cursor.node.text = this.cursor.oldInput;
                offset = 0;
                // 清空其余的composition 文档只允许存在一个composition?
                // firstCompositionPrev = this.cursor.node.compositionOtherEmpty(this.cursor);

            } else {
                this.cursor.node.appendText(this.cursor, this.cursor.input);
            }

            this.nextTick(_ => {
                let update_offset = offset + this.cursor.offset;
                if (composition == 'update') {
                    this.cursor.set(this.cursor.node.__el__, this.cursor.node.text.length);
                    // this.cursor.unlock();
                } else {
                   
                    this.cursor.update(update_offset);

                }
                let _cursor = this.cursor;
                let breakword = this.cursor.node.S.breakWord2(_cursor);
                if (breakword.breaks.length) {
                    let _break = breakword.breaks[0];
                    let first = _break.nodes[0];
                    if (_break.offset == this.cursor.offset - 1 && first == this.cursor.node) {
                        this.nextTick(() => {
                            this.cursor.emptyInput();
                            this.cursor.set(this.cursor.node.L.nextSibling.childNodes[0].__el__, 1)
                        })

                    }else {
                        this.nextTick(() => {
                            this.cursor.update(update_offset);
                        })
                        
                        
                    }
                }
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
            // console.log(e.locale, 'locale')
        })
        this.events.on(cursor, 'compositionend', (e) => {
            console.log('end');
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
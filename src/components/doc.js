import Node from '@/lib/node';
import Range from './range';
import History from '@/lib/history';
import Version from '@/lib/version'
import Section from './section';
import Cursor from './cursor';
import Events from '@/lib/events';
import Unit from './unit';
import Line from './line';
import keyCode from '@/lib/keyCode';
import UIs from '@/ui/ui.js';
import RenderQueue from '../lib/render-queue';


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

class Doc extends Node {
    // static Components() {
    //     return 
    // }
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
        this.version = new Version();
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
                        // this._console.warn('错误的进行了emptyInput')
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
        // RenderQueue.nextTick(callback);
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

            text: '又是一个安静的晚上，一个人窝在摇椅里乘凉，我承认这样真的很安详，和楼下老爷爷一样'
        });
        let unit2 = new Unit({

            text: '听说你还在搞什么原创，搞来搞去好像也就这样，不如花点时间想想，琢磨一下模样'
        });
        let unit4 = new Unit({
            type: 'image',
            url: 'http://doc2.tongmingmedia.com/uploads/201811/avatar_1566a6c28504c915#_small.jpeg'
            // text: '1'
        });
        let unit5 = new Unit({
            type: 'image',
            url: 'https://starorange.xingju.top/static/img/login_logo.3c478d98.png',
            // text: '2'
        })
        let unit3 = new Unit({

            text: '今夜化了美美的妆(我相信是很美美的妆)，'
        });


        let section2 = new Section({
            class: 'jf-section'
        })
        let line2 = new Line({

        });
        let unit21 = new Unit({

            text: '我摇晃在舞池中央(那种体态可以想象)，'
        });
        let unit22 = new Unit({

            text: '我做我的改变\u00a0又何必纠结，那就拜托别和我碰面'
        });
        let unit23 = new Unit({

            text: '如果再看你一眼，是否还会有感觉，当年素面朝天要多纯洁就有多纯洁，不画扮熟的眼线，不用抹匀粉底液'
        });
        line1.appendChild(unit1);
        line1.appendChild(unit2);
        line1.appendChild(unit4);
        line1.appendChild(unit3);
        section1.appendChild(line1);
        line2.appendChild(unit21);
        line2.appendChild(unit22);
        line2.appendChild(unit5);
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
        });
        // this.replaceText()
    }
    bind() {
        let cursor = this.cursor.__el__;

        // 
        this.events.on(cursor, 'keydown', (e) => {
            // return;

            let {
                composition
            } = this.cursor;
            let offset = 0;
            this._console.info('====正在keycode===')
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

                if (!Line.childNodes.length) {
                    this.cursor.set(Line.nextSibling.childNodes[0].__el__, 0);
                    return;
                }

                // this.cursor.node.S.breakWord2(this.cursor);

                // return;
                this.nextTick(_ => {
                    this.cursor.reset();
                    Line.childNodes[0].S.breakWord2({ node: Line.childNodes[0] });
                    this.nextTick(() => {
                        this.cursor.set(Line.childNodes[0].__el__, 0);
                    })
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
            this._console.info('====正在input===')
            let offset = 0;
            offset = this.cursor.input.length;
            // let firstCompositionPrev = null;
            if (!composition) {

                this.cursor.node.appendText(this.cursor, this.cursor.input);

            }
            // return
            this.nextTick(_ => {
                let update_offset = offset + this.cursor.offset;
                let composition = this.cursor.composition;
                if (!composition) {
                    this.cursor.update(update_offset);
                    let _cursor = this.cursor;

                    // if()
                    let breakwords = this.cursor.node.S.breakWord2(_cursor);
                    // this.cursor.node.updateCompositionRange(_cursor);
                    this._console.info('breaks', breakwords.breaks);
                    // this.cursor.node.compositioning2(_cursor, breakwords.breaks)
                    if (breakwords.breaks.length) {
                        let breakword = breakwords.breaks;
                        let _break = breakword[0];
                        let startNode = _break.startNode;
                        let startOffset = _break.startOffset;
                        if (startOffset <= this.cursor.offset - 1 && startNode == this.cursor.node) {
                            this.nextTick(() => {
                                let offset = composition == 'update' ? this.cursor.node.L.nextSibling.firstChild.getTextLength() : 1;
                                if (!composition) {
                                    this.cursor.emptyInput();
                                    this.cursor.set(this.cursor.node.L.nextSibling.firstChild.__el__, offset)
                                }

                            })

                        } else {
                            this.nextTick(() => {
                                // this.cursor.update(update_offset);
                            })


                        }
                    }
                }
            })
        });

        let compositionupdate = e => {
            this.cursor.range.startNode.nextSibling.text = e.data;
            this.nextTick(_ => {
                this.cursor.node.compositioning(this.cursor);
                let breakwords = this.cursor.node.S.breakWord2(this.cursor);
                this.cursor.node.updateCompositionRange(this.cursor);
                // this.nextTick(_ => {
                if (this.cursor.composition == 'end') {
                    let _cursor = this.cursor.node.compositionEnd(this.cursor);
                    this.cursor.closeComposition();
                    this.nextTick(_ => {
                        if(_cursor.node) {
                            this.cursor.set(_cursor.node.__el__, _cursor.offset)
                        }
                    })

                }


                // })

            })

        }

        this.events.on(cursor, 'compositionstart', (e) => {
            // 防止回流导致的compositionstart事件二次触发
            if (this.cursor.composition == 'update') return;
            this.cursor.emptyInput()
            let composition = this.cursor.node.composition(this.cursor);
            this.cursor.composition = 'start';
            this.cursor.node = composition;
            this.cursor.offset = 0;
        });
        this.events.on(cursor, 'compositionupdate', (e) => {
            this.cursor.composition = 'update';
            compositionupdate(e);

        });
        this.events.on(cursor, 'compositionend', (e) => {
            this.cursor.composition = 'end';
            // compositionupdate(e) 

        })

    }


    insertSection() {

    }



    getNodeByDom(dom) {


    }




}
// Doc.Line(component, )
Doc.UIs = UIs;

export default Doc
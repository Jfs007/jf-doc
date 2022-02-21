
import Base from '@/lib/base';
var EventEmitter = require('events')


// import { guid } from '../util/index';
export default class Events extends Base {
    constructor(doc, params) {
        super(params);
        this.doc = doc;
        this._listener = [];
        this.e = new EventEmitter();
        
    }
    

    on(dom, name, callback) {
        if(typeof dom == 'object') {
            let listen = this._listener.find(listen => listen.dom == dom);
            if(!listen) {
                listen = {
                    dom,
                    list: []
                };
                this._listener.push(listen);
            }
            listen.list.push(callback)
            dom.addEventListener(name, callback);
        }else {
            let _callback = name;
            callback = _callback;
            name = dom;
            this.e.on(name, callback);
        }
    }
    emit(name, value) {
        this.e.emit(name, value);
    }



    
}
import Validate from "./validate";
import Console from './console';
import { each } from '@/util/index.js';
export default class Base {
    constructor(options) {
        // this.init(options)
        this._validate = new Validate();
        this._console = new Console();
    }
    init(options) {
        for (let key in options) {
            this[key] = options[key];
        }
       
    }


    _each(...args) { return each(...args) }

    

}
// Base.prototype.util = Util;
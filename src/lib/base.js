import Validate from "./validate";
import Console from './console';
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
}
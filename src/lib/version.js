import Base from "./base";

export default class Version extends Base{
    constructor() {
        super();
        this.v = '1.0.0';
        this.name = 'JF-DOC'
        this._console.info(`${this.name} ${this.v}`)
        
    }
   
}
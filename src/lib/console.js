export default class Console {
    constructor() {}
    error(msg) {
        new Error(msg)
    }
}
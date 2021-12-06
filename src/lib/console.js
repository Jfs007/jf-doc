export default class Validate {
    constructor() {}
    error(msg) {
        new Error(msg)
    }
}
export default class Console {
    constructor() {}
    error(msg) {
        new Error(msg)
    }
    info(name, ...message) {
        console.log('%c%s', 'background: green;color: white', name, ...message);
    }
}
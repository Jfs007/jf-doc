export default class Console {
    constructor() {}
    error(msg) {
        new Error(msg)
    }
    info(name, ...message) {
        console.log('%c%s', 'background: green;color: white', name, ...message);
    }
    warn(name, ...message) {
        console.log('%c%s', 'background: orange;color: white', name, ...message);
    }
    error(name, ...message) {
        console.log('%c%s', 'background: red;color: white', name, ...message);
    }
}
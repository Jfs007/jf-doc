function guid() {
    return ((((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1));
}
function getProperty(obj, name) {
    name = Array.isArray(name) ? [...name] : (name + '').split(".");
    for (var i = 0; i < name.length - 1; i++) {
        obj = obj[name[i]];
        if (typeof obj !== "object" || !obj) return;
    }
    return obj[name.pop()];
}

function setProperty(obj, name, value) {
    name = Array.isArray(name) ? [...name] : (name + '').split(".");
    for (var i = 0; i < name.length - 1; i++) {
        if (typeof (obj[name[i]]) !== "object" || !obj[name[i]]) obj[name[i]] = {};
        obj = obj[name[i]];
    }
    obj[name.pop()] = value;
}

function isMobile() {
    let isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    return isMobile;
}
// index 表示需要分割的index 左侧位置 
function vSplit(array, index) {
    if (Array.isArray(array)) {
        array = [].concat([], array);
    }
    return [array.slice(0, index), array.slice(index)]
}


function each(array, callback = () => { }) {
    if (Object.prototype.toString.call(array) != '[object Object]') {
        for (let i = 0; i <= array.length - 1; i++) {
            let rs = callback(array[i], i);
            if (rs == 'break') {
                break;
            }
        }
    } else {
        for (let key in array) {
            let rs = callback(array[key], key);
            if (rs == 'break') {
                break;
            }
        }
    }
}

export {
    each,
    isMobile,
    getProperty,
    guid,
    setProperty,
    vSplit

}
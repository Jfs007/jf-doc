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
    if(Array.isArray(array)) {
        array = [].concat([], array);
    }
    return [array.slice(0, index), array.slice(index)]
}


export {
    isMobile,
    getProperty,
    guid,
    setProperty,
    vSplit

}
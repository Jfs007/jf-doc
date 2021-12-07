let getRange = () => {
    let range = document.createRange();
    return range;
}

let getSelection = (range) => {
    const selection = window.getSelection();
    return selection
    // 添加光标选择的范围
    // selection.addRange(range);
};
let emptyRange = () => {
    let body = document.getElementsByTagName("body")[0];
    const selection = window.getSelection();
    selection.collapse(body, 0)
}

let addRange = (range) => {
    const selection = window.getSelection();
    // 添加光标选择的范围
    selection.addRange(range);
};


export {
    getSelection,
    getRange,
    addRange,
    emptyRange
}

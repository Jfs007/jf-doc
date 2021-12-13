
import Base from '@/lib/base';
// import { guid } from '../util/index';
// 选中的定位对象
export default class Range extends Base {
    constructor(options = {}) {
        super(options);

        super.init(options);
        let selection = window.getSelection();
        if (selection) {
            let range = selection.getRangeAt(0);
            let { startContainer } = range;
        }

    }









}
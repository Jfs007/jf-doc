

import Text from './text.vue';
import Line from './line.vue';

let UIs = {
    
}
export let register = (Components) => {
    Components.map(cp => {
        UIs[cp.name] = cp;
    })
   
}
register([Text, Line]);

export default UIs;


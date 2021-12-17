

import Text from './text.vue';
import Image from './image.vue'
import Line from './line.vue';

let UIs = {
    
}
export let register = (Components) => {
    Components.map(cp => {
        UIs[cp.name] = cp;
    })
   
}
register([Text, Line, Image]);

export default UIs;


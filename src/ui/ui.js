

import Text from './text.vue';
import Image from './image.vue'
import Line from './line.vue';
import Section from './section.vue';

let UIs = {
    
}
export let register = (Components) => {
    Components.map(cp => {
        UIs[cp.name] = cp;
    })
   
}
register([Text, Line, Section, Image]);

export default UIs;


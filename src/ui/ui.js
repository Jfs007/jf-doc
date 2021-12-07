

import Text from './text.vue';

let UIs = {
    
}
export let register = (Components) => {
    Components.map(cp => {
        UIs[cp.name] = cp;
    })
   
}
register([Text]);

export default UIs;


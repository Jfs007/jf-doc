
import UIs from './ui';

export default {
    name: 'vessel',
    props: {
        type: {
            default: 'text'
        },
        unit: {
            default() {
                return {}
            }
        }
    },
    mounted() {
        // console.log(this.$el, '绑定' );
        this.$el.__unit__ = this.unit;
        this.unit.__el__ = this.$el;
        console.log(this.unit.isComposition(), 'isComposition')
        this.unit.onMount();   
        
    },
    beforeDestroy() {
        // console.log(this.$el, '解绑', this.unit.parentNode == this.unit)
        // this.$el.__unit__ = null;
        // this.unit.__el__ = null;
    },
    render(h) {
       this.unit.onRender();  
       let unit = this.unit;
        return h(UIs['ui-' + this.type], {
            attrs: {
                'data-id': `${unit.guid}`,
                'data-__virtual__': `${unit.__virtual__}`,
               
            },
            class: unit.class,
            props: {
                type: this.type,
                unit
            }
        }, this.$slots.default)

    }

}
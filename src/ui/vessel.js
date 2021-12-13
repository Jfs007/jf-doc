
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
        console.log(this.$el, '绑定', this.unit.parentNode);
        this.$el.__unit__ = this.unit;
        this.unit.__el__ = this.$el;
        
        
        
    },
    beforeDestroy() {
        console.log(this.$el, '解绑', this.$el.__unit__ == this.unit)
        // this.$el.__unit__ = null;
        // this.unit.__el__ = null;
    },
    render(h) {
       let unit = this.unit;
        return h(UIs['ui-' + this.type], {
            attrs: {
                'data-id': `${unit.guid}`,
            },
            class: unit.class,
            props: {
                type: this.type,
                unit
            }
        }, this.$slots.default)

    }

}
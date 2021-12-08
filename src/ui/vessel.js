
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
        this.$el.__unit__ = this.unit;
        this.unit.__el__ = this.$el;
    },
    beforeDestroy() {
        this.$el.__unit__ = null;
        this.unit.__el__ = null;
    },
    render(h) {
       let unit = this.unit;
        return h(UIs['ui-' + this.type], {
            attrs: {
                'data-id': `${unit.guid}`,
            },
            class: 'jf-unit',
            props: {
                type: this.type,
                unit
            }
        })

    }

}
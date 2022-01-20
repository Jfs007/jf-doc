import UIs from './ui';

export default {
    name: 'vessel',
    props: {
        type: {
            default: 'text'
        },
        unit: {
            default () {
                return {}
            }
        }
    },
    mounted() {
        this.$el.__unit__ = this.unit;
        this.unit.__el__ = this.$el;
        this.unit.onMount();
      

    },
    beforeDestroy() {
    },
    render(h) {
        this.unit.onRender(this.$el);
        let unit = this.unit;
        return h(UIs['ui-' + this.type], {
            attrs: {
                'data-id': `${unit.guid}`,
                'data-__virtual__': `${unit.__virtual__}`,
                'data-is_composition': `${unit.is_composition}`,

            },
            style: {
                'z-index': 1,
                position: 'relative'
            },
            class: unit.class,
            props: {
                type: this.type,
                unit
            }
        }, this.$slots.default)

    }

}
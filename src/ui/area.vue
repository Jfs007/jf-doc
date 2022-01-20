<template>
    <div class="jf-ui-area" :style="areaStyle">
       
    </div>
</template>
<script>
export default {
    props: {
        range: {
            default() {
                return {}
            }
        }
    },
    computed: {
        areaStyle() {
            let range = this.range;
            return {
                width: range.width + 'px',
                left: range.x + 'px',
                top: 0,
                height: range.height + 'px'
            }
        }
    }
}
</script>
<style scoped lang="less">
.jf-ui-area {
    position: absolute;
    height: 100%;
   background-color: rgba(86, 235, 227, 0.6);
   z-index: 0;
}
</style>
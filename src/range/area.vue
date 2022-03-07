<template>
  <div class="jf-ui-area" :style="areaStyle"></div>
</template>
<script>

export default {
  props: {
    selection: {
      default() {
        return {};
      },
    },
  },
  computed: {
    areaStyle() {
      let selection = this.selection || {};
      return {
        width: selection.width + "px",
        left: selection.x + "px",
        top: 0,
        height: selection.height + "px",
      };
    },
  },
};
</script>
<style scoped lang="less">
.jf-ui-area {
  position: absolute;
  height: 100%;
  background-color: rgba(86, 235, 227, 0.6);
  z-index: -1;
  transition: width 0.05s;
}
</style>
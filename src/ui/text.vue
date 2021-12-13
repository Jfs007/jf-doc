
<style lang="less" scoped>
.jf-unit--composition {
  border-bottom: 1px solid rgba(0, 255, 182);
  // background: rgba(0, 255, 182, 0.2);
}
</style>
<template>
  <span :class="[unit.type == 'composition' ? 'jf-unit--composition' : '']">{{ unit.text }}<br v-if="unit.isLineFeed()" /></span>
</template>
<script>
export default {
  props: {
    unit: {
      default() {
        return {};
      },
    },
  },
  name: "ui-text",
  created() {
     
  }
};
</script>

<style lang="less" scoped>
</style>
<template>
  <div>
    <slot></slot>
  </div>
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
  name: "ui-line",
  created() {},
};
</script>

<style lang="less" scoped>
.jf-unit--composition {
  border-bottom: 1px solid #0c63fa;
}
</style>
<template>
  <span :class="[unit.type == 'composition' ? 'jf-unit--composition' : '']">{{ unit.text }}</span>
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
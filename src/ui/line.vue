
<style lang="less" scoped>
.jf-line {
  position: relative;
}
</style>
<template>
  <div class="jf-line">
    <ui-area :selection="unit.selection" v-if="unit.selection" />
    <slot></slot>
  </div>
</template>
<script>
import UiArea from '@/range/area.vue';

export default {

  components: {
    UiArea
  },
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


<style lang="less" scoped>
.jf-line {
  position: relative;
}
</style>
<template>
  <div class="jf-line">
    <ui-area v-for="item in unit.ranges" :range="item"/>
    <slot></slot>
  </div>
</template>
<script>
import UiArea from './area.vue';
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

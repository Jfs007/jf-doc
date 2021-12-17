
<style lang="less" scoped>
.ui-image {
  display: inline-block;
}
</style>
<template>
  <span class="ui-image"><img :src="unit.url" @click="cursor"/></span>
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
  name: "ui-image",
  created() {
     
  },
  methods: {
    cursor() {

    }
  }
};
</script>
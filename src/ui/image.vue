
<style lang="less" scoped>
.ui-image {
  display: inline-block;
  position: relative;
  font-size: 0;
  cursor: initial;
  .ui-image__squarehandleselectionbox {
    border: 1px solid #0096fd;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .ui-image-container:hover {
    box-shadow: 0 0 0 2px rgba(48, 98, 242, 40%);
  }
}
</style>
<template>
  <span class="ui-image">
    <div class="ui-image__squarehandleselectionbox" v-if="isSelect">
      <span class="ui-image__squarehandleselectionbo-handle"></span>
      <span class="ui-image__squarehandleselectionbo-handle"></span>
      <span class="ui-image__squarehandleselectionbo-handle"></span>
      <span class="ui-image__squarehandleselectionbo-handle"></span>
    </div>
    <div class="ui-image-container">
      <img :src="unit.url" @click="cursor" />
    </div>
  </span>
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
  data() {
    return {
      isSelect: false,
    };
  },
  created() {
    this.load();
  },
  watch: {
    "unit.url"() {
      this.load();
    },
  },
  methods: {
    load() {
      this.$nextTick((_) => {
        let image = new Image();
        image.src = this.unit.url;
        image.onload = () => {
          this.unit.S.breakWord2({ node: this.unit });
        };
        image.onerror = () => {
          this.unit.S.breakWord2({ node: this.unit });
        };
      });
    },
    cursor() {},
  },
};
</script>
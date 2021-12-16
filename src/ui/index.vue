
<style lang="less" scoped>
.jf-doc-wrapper {
  height: 400px;
  width: 400px;
  overflow-y: overlay;
  position: relative;
  color: #606266;
  background-color: #fff;
  background-image: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 8px;

}
.jf-doc {
  font-size: 22px;
  line-height: 1.5;
  font-family: Arial, "Microsoft YaHei", "微软雅黑", "黑体", Heiti, sans-serif,
    SimSun, "宋体", serif;
  color: #333333;
  background-color: transparent;
  font-weight: normal;
  font-style: normal;
  font-variant: normal;
  text-decoration: none;
  vertical-align: baseline;
  user-select: none;
  // word-wrap: break-word;
  // white-space: normal;
  // word-break: break-all;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  cursor: text;
}
</style>
<template>
  <div class="jf-doc-wrapper" id="jf-doc-wrapper">
    <div class="jf-doc" id="jf-doc">
      <ui-cursor :cursor="doc.cursor" :doc="doc" ref="cursor"></ui-cursor>
      <div
        :key="section.guid"
        v-for="section in doc.childNodes"
        :class="[section.class]"
      >
        <Vessel
          :key="line.guid"
          type="line"
          :unit="line"
          v-for="line in section.childNodes"
        >
          <Vessel
            :key="unit.guid"
            :unit="unit"
            v-for="unit in line.childNodes"
          ></Vessel>
        </Vessel>
      </div>
    </div>
  </div>
</template>

<script>
// import test from '@/test';
import Doc from "@/index";
import Cursor from "./cursor.vue";
import Vessel from "./vessel";
export default {
  name: "Index",
  data() {
    return {
      doc: null,
    };
  },
  components: {
    Vessel,
    uiCursor: Cursor,
  },
  methods: {
    // test
  },
  created() {
    let doc = new Doc();
    this.doc = doc;
    this.$nextTick(() => {
      doc.render({ doc: this.$el, cursor: this.$refs["cursor"].getInput() });
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

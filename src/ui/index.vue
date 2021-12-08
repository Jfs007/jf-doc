
<style lang="less" scoped>
.jf-doc {
  user-select: none;
}
</style>
<template>
  <div class="jf-doc" id="jf-doc">
      <ui-cursor :cursor="doc.cursor" :doc="doc"></ui-cursor>
      <div :key="section.guid" v-for="section in doc.childNodes" :class="[ section.class ]">
        <div :key="line.guid" :class="[line.class]" v-for="line in section.childNodes">
          <Vessel :key="unit.guid" :unit="unit" v-for="unit in line.childNodes"></Vessel>
        </div>
      </div>
  </div>
</template>

<script>
// import test from '@/test';
import Doc from '@/index';
import Cursor from './cursor.vue';
import Vessel from './vessel';
export default {
  
  name: 'Index',
  data() {
    return {
      doc: null
    }
  },
  components: {
    Vessel,
    uiCursor: Cursor
  },
  methods: {
    // test
  },
  created() {
    let doc = new Doc();
    this.doc = doc;
    this.$nextTick(() => {
      doc.render(this.$el);
    })
  }
}
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

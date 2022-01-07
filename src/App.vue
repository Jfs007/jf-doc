<template>
  <div id="app">
    <doc style="width: 430px;height: 400px;margin: 20px auto;">
      <ui-section>
        <ui-text>我改动一下好多东西</ui-text>
        <ui-text>我真的好烦啊看撒短发开始看</ui-text>
      </ui-section>
      <ui-section>
        <ui-text>第二行哈哈哈哈哈</ui-text>
        <ui-text>上飞机阿斯顿激发绝地反击啊大煞风景</ui-text>
      </ui-section>
    </doc>
  </div>
</template>

<script>
import doc from './ui/index.vue';
export default {
  name: 'App',
  components: {
    doc,

    [doc.UIs['ui-section'].name]: doc.UIs['ui-section'],
    [doc.UIs['ui-text'].name]: doc.UIs['ui-text']
  }
}
</script>

<style>
html, body {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 30px;

}
</style>

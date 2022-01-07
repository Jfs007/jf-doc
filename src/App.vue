<template>
  <div id="app">
    <div style="text-align: center">demo版本 换行出现问题，尝试刷新解决(移动端未做兼容)</div>
    <doc style="width: 340px;height: 400px;margin: 20px auto;">
     
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

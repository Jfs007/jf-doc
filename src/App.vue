<template>
  <div id="app">
    <div>又是一个安静的晚上，一个人窝在摇椅里乘凉，我承认这样真的很安详，和楼下老爷爷一样听说你还在搞什么原创，搞来搞去好像也就这样，不如花点时间想想，琢磨一下模样12今夜化了美美的妆(我相信是很美美的妆)，</div>
    <div>我摇晃在舞池中央(那种体态可以想象)，我做我的改变 又何必纠结，那就拜托别和我碰面如果再看你一眼，是否还会有感觉，当年素面朝天要多纯洁就有多纯洁，不画扮熟的眼线，不用抹匀粉底液</div>
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

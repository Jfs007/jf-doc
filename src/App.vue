<template>
  <div id="app">
    <index style="width: 400px;height: 400px;margin: 20px auto;"/>
  </div>
</template>

<script>
import index from './ui/index.vue';

export default {
  name: 'App',
  components: {
    index
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

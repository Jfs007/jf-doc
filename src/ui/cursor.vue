<style lang="less" scoped>
@keyframes cursor {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.jf-editor__cursor {
  opacity: 1;
  position: fixed;
  background: rgba(0, 255, 182);
  animation: cursor 1.3s infinite;
  animation-fill-mode: forwards;
  overflow: hidden;
  .jf-editor__cursor--input {
    outline: none;
    border: none;
    background: none;
    position: relative;
    left: 200px;
    width: 2px;
    color: transparent;
  }
}
</style>
<template>
  <i class="jf-editor__cursor" :style="place" v-show="cursor.offset > -1">
    <input class="jf-editor__cursor--input" ref="input" @input="updateInput" @keydown="keyDown"/>
  </i>
</template>
<script>
// import { }

export default {
  name: "ui-cursor",
  props: {
    cursor: {
      default() {
        return {}
      }
    },
    doc: {}
  },
  data() {
    return {
      
    };
  },
  watch: {
    'cursor.offset'(v) {
      if(v > -1) {
        this.$nextTick(() => {
           this.$refs['input'].focus()
        })
       
      }
    }
    
  },
  computed: {
    place() {
      let { width, height, left, top } = this.cursor;
      return {
        width: width + 'px',
        height: height + 'px',
        left: left + 'px',
        top: top + 'px'
      }
    }
  },
  mounted() {
    // console.log(this.$refs['input'])
    this.doc.cursor.__el__ = this.$refs['input'];
  },
  methods: {
    updateInput(e) {
      let value = e.target.value;
      this.cursor.updateInput(value);
    },
    keyDown(e) {
      this.cursor.keyCode = e.keyCode;
      // console.log(value, 'e');
    },
    getInput() {
      return this.$refs['input'];
    },
    
   
  },
};
</script>
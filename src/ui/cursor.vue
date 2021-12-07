<style lang="scss" scoped>
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
  background: rgba(199, 29, 36, 0.8);
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
  }
}
</style>
<template>
  <i class="jf-editor__cursor" :style="cursor._style" v-if="cursor.index > -1">
    <input class="jf-editor__cursor--input" ref="input" />
  </i>
</template>
<script>
// import { }
import { computedRangeBoundary } from "@/util/computed";
import { getTextNode, getComputedStyle, getScroll } from "@/util/dom";

export default {
  name: "jf-cursor",
  data() {
    return {
      cursor: {
        index: -1,
        _style: {},
      },
    };
  },
  created() {
    // console.log("ci");
    // document.addEventListener("click", this.bindClick);
  },
  beforeDestroy() {
    // document.removeEventListener("click", this.bindClick);
  },
  methods: {
    bindClick(e) {
      this.place(e);
    },
    place(e) {
      let textNode = getTextNode(e.target);
      if (textNode) {
        let boundary = computedRangeBoundary(
          {
            x: e.clientX,
            y: e.clientY,
          },
          textNode
        );
        let cs = getComputedStyle(e.target);
        let fontSize = parseInt(cs.fontSize);
        fontSize = isNaN(fontSize) ? undefined : fontSize;
        this.setCursor(boundary, fontSize);
        this.$nextTick(() => {
            this.$refs['input'].focus();
        })
        
      }
    },
    setCursor(boundary, fontSize) {
      if (!boundary.range) return;
      let { x, y, height } = boundary.rect;
      let scrollTop = document.body.scrollTop || 0;
      let scrollLeft = document.body.scrollLeft || 0;
      let cursor_height = fontSize ? fontSize + 1 : height;
      let top = (height - cursor_height) / 2 + y + scrollTop;
      this.cursor = {
        index: boundary.index,
        _style: {
          left: x + scrollLeft + "px",
          top: top + "px",
          height: cursor_height + "px",
          width: 2 + "px",
        },
      };
    },
  },
};
</script>
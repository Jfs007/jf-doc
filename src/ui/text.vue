<template>
  <span>{{ unit.text }}</span>
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
  name: "ui-text",
  created() {
     
  }
};
</script>
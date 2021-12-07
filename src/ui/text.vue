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
  name: "text",
  created() {
     
  }
};
</script>
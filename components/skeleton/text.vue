<template>
  <text class="uni-primary-bg uni-radius" style="opacity: 0.1; display: inline-block; height: 1em" :style="{width: width}"></text>
</template>

<script>
export default {
  name: "skeleton-text",
  props: {width: {type: String, default: '100px'}}
}
</script>

<style scoped>

</style>

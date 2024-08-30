<template>
  <view>
    <web-view v-if="src" :webview-styles="webviewStyles" :src="src"></web-view>
  </view>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {onLoad} from "@dcloudio/uni-app";

const webviewStyles = reactive({
  progress: {
    color: '#FF3333'
  }})

const src = ref('');
onLoad(query => {
  if (query && query.src) {
    src.value = query.src;
  }
  console.log(src.value)
})



</script>

<style scoped>

</style>
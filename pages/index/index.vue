<template>
	<view class="container">
		<swipe-cptcha ref="swipeCptchaRef"></swipe-cptcha>
	</view>
</template>

<script setup lang="ts">
	import { ref, nextTick } from 'vue';
	const swipeCptchaRef = ref(null);
	nextTick(() => {
		swipeCptchaRef.value.open();
	});
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>

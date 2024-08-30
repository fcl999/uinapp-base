<template>
	<view class="bg-white uni-pa-6 uni-body bg-white text-gray-500">
		<uni-forms ref="baseForm" :border="true" >
			<uni-forms-item>
				<template v-slot:label>
					<text>账户:</text>
				</template>
				<uni-easyinput class="uni-mt-5" trim="all" v-model="uname" placeholder="请输入账户"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item>
				<template v-slot:label>
					<text>密码:</text>
				</template>
				<uni-easyinput type="password" v-model="password" placeholder="请输入密码"></uni-easyinput>
			</uni-forms-item>
			<view class="h-4 w-full"></view>
			<uni-row>
				<text @click="clickRegister" class="uni-warning" style="float: right">立即注册</text>

			</uni-row>
			<uni-forms-item>
				<button class="uni-primary-bg"
                :loading="loginLoading"
                :disabled="loginLoading"
                @click="clickLogin">登 录</button>
			</uni-forms-item>
		</uni-forms>
		<view class="fixed text-center w-full safe-padding text-gray-500" style="bottom: 0;left: 0; font-size: 12px">
			<view>成都寒峰科技 版权所有</view>
			<view>川公网安备51019002000988号 蜀ICP备17027863号</view>
		</view>
		<swipe-cptcha ref="verify" @move-end="moveEnd"></swipe-cptcha>
	</view>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import { useAuthStore } from "../../stores/auth";
import { encryptEcpPassword } from "../../utils/other";

const loginLoading = ref(false);
const verify = ref<any>(null);

const uname = ref('');
const password = ref('');
watch(uname, (v) => {
  uni.setStorageSync('ecpUname', v)
})

onMounted(() => {
  uname.value = uni.getStorageSync('ecpUname') || '';
  password.value = '';
});

function clickLogin() {
  // 滑动验证码
  verify.value.open();
}
async function moveEnd(e: {
  x: number,
  w: number,
  codeId: string,
  token: string,
  aesCode: string,
}) {
	loginLoading.value = true;
  try {
	useAuthStore().login({
      userno: uname.value,
      pwd: await encryptEcpPassword(password.value),// 加密
      validCode: '',
      autoLogin: true,
      is_phone: 1,
      codeId: e.codeId,
      aesCode: e.aesCode,
      token: e.token,
    })
  } catch (e) {
	console.error(e)
  }
  loginLoading.value = false;
}

function clickRegister(){
  // todo 跳转注册页
  uni.navigateTo({
    url: "/pages/register/register"
  })
}
</script>

<style scoped>

</style>
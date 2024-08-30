<template>
  <view class="bg-white uni-pa-6 uni-body bg-white text-gray-500">
    <uni-forms ref="baseForm" :modelValue="form" :border="true" >
      <uni-forms-item>
        <template v-slot:label>
          <uni-icons class="uni-pa-3" custom-prefix="iconfont" type="icon-qiyexinxi" color="#6B7280"></uni-icons>
        </template>
        <uni-easyinput v-model="form.companyName" placeholder="店铺/企业名称" :inputBorder="false" both />
      </uni-forms-item>
      <uni-forms-item>
        <template v-slot:label>
          <uni-icons class="uni-pa-3" custom-prefix="iconfont" type="icon-shoujihao" color="#6B7280"></uni-icons>
        </template>
        <uni-easyinput v-model="form.uname" placeholder="请输入手机号" :inputBorder="false" both />
      </uni-forms-item>
      <uni-forms-item>
        <template v-slot:label>
          <uni-icons class="uni-pa-3" custom-prefix="iconfont" type="icon-yanzhengma" color="#6B7280"></uni-icons>
        </template>
        <view style="width: 60%">
          <uni-easyinput v-model="form.randomCode" placeholder="请输入验证码" :inputBorder="false" both />
        </view>
        <view class="relative">
          <button :loading="getRandomCodeIng"
                  :disabled="getRandomCodeIng || getRandomCodeTimer > 0"
                  class="absolute uni-warning-bg"
                  @click="clickGetRandomCode"
                  style="top:-34px; right: 0; font-size: 12px">{{getRandomCodeTimer || '获取验证码' }}</button>
        </view>
      </uni-forms-item>
      <uni-forms-item>
        <template v-slot:label>
          <uni-icons class="uni-pa-3" custom-prefix="iconfont" type="icon-password" color="#6B7280"></uni-icons>
        </template>
        <uni-easyinput v-model="form.password" placeholder="请输入密码" :inputBorder="false" both />
      </uni-forms-item>
      <uni-forms-item>
        <template v-slot:label>
          <uni-icons class="uni-pa-3" custom-prefix="iconfont" type="icon-querenmima" color="#6B7280"></uni-icons>
        </template>
        <uni-easyinput v-model="form.rePassword" placeholder="请确认密码" :inputBorder="false" both />
      </uni-forms-item>
      <uni-forms-item>
        <button class="uni-primary-bg"
                :loading="registering"
                :disabled="registering"
                @click="clickRegister">注 册</button>
        <view class="text-center uni-py-6" style="font-size: 12px;">
          <checkbox-group @change="agreeAgreementChange">
            <label>
              <checkbox :checked="agreeAgreement"
                        value="agreeAgreement"
                        color="#52718e"
                        style="transform:scale(0.6); vertical-align: bottom"></checkbox>
              点击“注册”按钮表示您同意
            </label>
            <text @click="jumpAgreement" style="color: rgb(14, 118, 225);">《用户协议》</text>
            和
            <text @click="jumpPrivacy" style="color: rgb(14, 118, 225);">《隐私政策》</text>
          </checkbox-group>
        </view>
      </uni-forms-item>
    </uni-forms>
    <view class="fixed text-center w-full safe-padding text-gray-500" style="bottom: 0;left: 0; font-size: 12px">
      <view>成都寒峰科技 版权所有</view>
      <view>川公网安备51019002000988号 蜀ICP备17027863号</view>
    </view>
    <swipe-cptcha
        ref="verify"
        @move-end="moveEnd"
    ></swipe-cptcha>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { toast } from "../../utils/prompt";
import { encryptEcpPassword } from "../../utils/other";
import { apiUserInitGetSMSCode, apiUserInitInit } from "../../utils/services/api/userInit";

const mobileReg=/^1(3|4|5|6|7|8|9)\d{9}$/;
const passwordReg = /^[a-zA-Z0-9_]{6,15}$/;

const form = reactive({
  companyName: "",
  uname: "",
  randomCode: "",
  password: "",
  rePassword: "",
})
const agreeAgreement = ref(false);
function agreeAgreementChange(e: {detail: {value: string[]}}) {
  agreeAgreement.value = e.detail.value.indexOf('agreeAgreement') !== -1
}
function jumpAgreement() {
  uni.navigateTo({
    url: '/pages/web-view/web-view?src=' + 'https://www.zhijianjxc.com/tv_agreement.html'
  })
}
function jumpPrivacy() {
  uni.navigateTo({
    url: '/pages/web-view/web-view?src=' + 'https://www.zhijianjxc.com/tv_privacy.html'
  })
}

const verify = ref<any>(null);
const getRandomCodeIng = ref(false);
const getRandomCodeTimer = ref(0);
function clickGetRandomCode() {
  if (!mobileReg.test(form.uname)) {
    return toast('请填写手机号,再获取验证码');
  }
  if (getRandomCodeIng.value) {
    return toast('正在请求验证码');
  }
  if (getRandomCodeTimer.value > 0) {
    return toast(`请等待${getRandomCodeTimer.value}s后再试`);
  }
  verify.value.open();
}
async function moveEnd(e: {
  x: number,
  w: number,
  codeId: string,
  token: string,
  aesCode: string,
}) {
  try {
    getRandomCodeIng.value = true;
    const res = await apiUserInitGetSMSCode({
      uname: form.uname,
      codeId: e.codeId,
      token: e.token,
      aesCode: e.aesCode,
    })
    toast(res.msg);
    // 验证码已发送
    if (res.status === 200) {
      getRandomCodeTimer.value = 60;
      let timer = setInterval(() => {
        getRandomCodeTimer.value = getRandomCodeTimer.value - 1
        if (getRandomCodeTimer.value === 0) {
          clearInterval(timer);
        }
      }, 1000)
    }
  }catch(e) {
    console.log(e)
  }
  getRandomCodeIng.value = false
}

const registering = ref(false)
async function clickRegister() {
  if (registering.value) {
    return toast("注册中...");
  }
  if (!agreeAgreement.value) {
    return toast("注册需同意寒峰科技用户服务和隐私保密协议");
  }
  if(!form.companyName){
    return toast('请输入店铺/企业名称');
  }
  if(!form.uname){
    return toast('请输入手机号');
  }
  if(!mobileReg.test(form.uname)) {
    return toast('请输入正确的手机号');
  }
  if(!form.randomCode){
    return toast('请输入验证码');
  }
  if(!form.password){
    return toast('请输入密码');
  }
  if(!passwordReg.test(form.password)){
    return toast("密码只允许输入6-10位数字,英文或下划线");
  }
  if(!form.rePassword){
    return toast('请确认密码');
  }
  if(form.rePassword !== form.password){
    return toast('两次密码不一样');
  }

  try {
    registering.value = true;
    await apiUserInitInit({
      uname: form.uname,
      random_code: form.randomCode,
      company_name: form.companyName,
      password: await encryptEcpPassword(form.password),
    })
    toast('注册成功', )
    saveUname(form.uname)
    setTimeout(() => {uni.navigateBack()}, 1000)
  }catch (e) {

  }
  registering.value = false
}

function saveUname(uname: string) {
  uni.setStorageSync('ecpUname', uname)
}
</script>

<style scoped>

</style>
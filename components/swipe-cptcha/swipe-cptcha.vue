<template>
  <uni-popup ref="dialog" style="position: relative;" type="dialog">
    <view class="tf-Box-Bg">
      <view class="tf-Box">
        <view class="tf-Box-title">
          {{ loading ? 'Loading...' : '请完成安全验证' }}
          <view class="tf-close" @click.stop="close"></view>
        </view>
        <view :style="{ width: canvasW + 'px', height: canvasH + 'px' }" class="tf-Box-center relative">
          <image :src="bgImage"
                 style="width: 100%; height: 100%"></image>
          <image :src="moveImage"
                 :style="{
                  left: canvasX-8 + 'px',
                  top: y-4 + 'px',
                  width: moveImageSize + 'px',
                  height: moveImageSize + 'px'}"
                 class="absolute"></image>
        </view>
        <movable-area v-if="!loading" :style="{ width: canvasW + 'px'}" class="tf-Box-BtnBox">
          <view class="tf-Box-BtnBox-text">滑动滑块完成拼图</view>
          <movable-view :x="0"
                        class="tf-Box-BtnNei"
                        direction="horizontal"
                        @change="changePath"
                        @mouseup="endTouch"
                        @touchend="endTouch">
            <view :style="{backgroundColor: '#8cb6e555'}" class="tf-Box-BtnNei-leftBox"></view>
          </movable-view>
        </movable-area>
      </view>
    </view>
  </uni-popup>

</template>

<script lang="ts" setup>

import {ref} from "vue";
import {onLoad} from "@dcloudio/uni-app";
import CryptoJS from "crypto-js/index";
import {apiPreIndex} from "../../utils/services/api/preIndex.api";
import {apiValidCodeJpgs} from "../../utils/services/api/validCode.api";

function encryptAES(value: string) { //加密
  const key = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';  //密钥
  const iv = '1234567812345678';
  const encrypted = CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse(key),
    {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  return encrypted.toString();
}

const CANVAS_WIDTH = 580
const CANVAS_HEIGHT = 290

const dialog = ref<any>(null);
let isOpen = false;
const canvasW = ref(0)
const canvasH = ref(0)
const canvasX = ref(0) // 图像位置
const moveImageSize = ref(0)
const loading = ref(false) // 加载中
const bgImage = ref<string | null>(null)
const moveImage = ref<string | null>(null)
let y = ref<number>(0)

const emit = defineEmits(['onclose', 'move-end'])

onLoad(() => {
  canvasW.value = uni.upx2px(CANVAS_WIDTH)
  canvasH.value = uni.upx2px(CANVAS_HEIGHT)
  moveImageSize.value = uni.upx2px(120)
})

let token: string | null = null;
let unionId: string | null = null;
let codeId: string | null = null;

async function init() {
  canvasX.value = 0
  // 获取缓存 toke 与 unionId
  token = uni.getStorageSync('verify-token');
  unionId = uni.getStorageSync('verify-union-id');
  // 没有则重新获取
  if (!token || !unionId) {
    const e = await apiPreIndex();
    token = e.data.token;
    unionId = e.data.unionId;
    uni.setStorageSync('verify-token', token);
    uni.setStorageSync('verify-union-id', unionId);
  }
  // 获取图片验证码
  await getImage(unionId)
}

async function getImage(unionId: string) {
  const e = await apiValidCodeJpgs({unionId, codeId: ''});
  bgImage.value = e.data.image1;
  moveImage.value = e.data.image2;
  y.value = uni.upx2px(e.data.y * 2);
  codeId = e.data.codeId
}

function close() {
  dialog.value.close();
  isOpen = false;
  emit('onclose')
}

function endTouch() {
  // 将坐标传递出去
  const x = canvasX.value / canvasW.value * 280
  const w = 280
  emit('move-end', {
    x,
    w,
    codeId,
    token,
    aesCode: encryptAES((Math.floor(x) + 5) + ';' + w)
  })
  close()
}

function changePath(e: any) {
  canvasX.value = e.detail.x;
}

async function open() {
  if (isOpen) return
  dialog.value.open()
  isOpen = true;

  loading.value = true
  // 初始化
  try {
    await init()
  } catch (e) {
    close()
  }
  setTimeout(() => {
    loading.value = false
  }, 300)

}

defineExpose({open, close})
</script>

<style lang="sass">
.tf-Box-Bg
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 100
  background-color: rgba(0, 0, 0, .3)
  display: flex
  align-items: center
  justify-content: center

  .tf-Box
    width: 640upx
    height: 584upx
    background-color: #fff
    border-radius: 6upx
    box-shadow: 0 0 50upx 0upx rgba(0, 0, 0, .2)

    .tf-Box-title
      height: 100upx
      line-height: 1
      padding: 0 32upx
      font-size: 32upx
      border-bottom: 1px solid #E1E3E9
      display: flex
      align-items: center
      justify-content: space-between

      .tf-close
        width: 28upx
        height: 28upx
        background-image: url(img/close.png)
        background-size: 100% 100%

    .tf-Box-center
      margin: 30upx auto
      border-radius: 6upx

    .tf-Box-BtnBox
      margin: 30upx auto
      //width: 580upx
      height: 75upx
      line-height: 75upx
      text-align: center
      font-size: 28upx
      border-radius: 6upx
      border: 1px solid #E1E3E9
      background-color: #F7F8F9
      overflow: hidden
      position: relative

      .tf-Box-BtnBox-text
        width: 100%
        height: 75upx
        position: absolute
        top: 0
        left: 0
        color: #424649
        text-align: center

      .tf-Box-BtnNei
        position: absolute
        top: 0
        left: 0
        height: 75upx
        width: 75upx
        background-color: #fff
        box-shadow: 0 0 10upx 0upx rgba(0, 0, 0, .2)
        background-image: url(img/arrows.png)
        background-size: 34upx
        background-position: center
        background-repeat: no-repeat

        .tf-Box-BtnNei-leftBox
          position: absolute
          top: 0
          left: -580upx
          width: 580upx
          height: 100%

</style>

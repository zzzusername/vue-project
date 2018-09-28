<template>
  <div>
    <org-hand></org-hand>
    <br>
    <x-button type="primary" @click.native="start1()" >测试裁剪</x-button>
    <image-corppie ref="icorp" v-on:crop="crop" width="10" height="10" type="canvas"></image-corppie>
    <br>
    <img v-bind:src="cropped" >
    <br>
    <image-qrcode ref="iqr" v-bind:src="cropped" :x="250" :y="250" value="http://www.sq3q.com/user/index.html" :size="100" ></image-qrcode>
   
    <detail-tabbar :backLink="{name:'userIndex'}"></detail-tabbar>
  </div>
</template>
<script>
import { XButton } from 'vux'
import ImageCorppie from '@/components/ImageCroppie.vue'
import ImageQrcode from '@/components/ImageQrcode.vue'
import OrgHand from '@/feature/org/components/OrgHand.vue'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  data() {
    return {
      cropped: null
    }
  },
  methods: {
    start1 () {
      this.$refs.icorp.start()
    },
    start2 () {
      this.$refs.iqr.start()
    },
    crop(data) {
      console.log(data)
      this.cropped = data
      let that = this
      this.$nextTick(function () {
        that.$refs.iqr.start()
      })
    }
  },
  components: {
    XButton, ImageCorppie, OrgHand, DetailTabbar, ImageQrcode
  }
}
</script>


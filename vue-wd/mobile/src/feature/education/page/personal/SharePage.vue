<template>
  <div>
    <p class="hint-title"></p>
    <div class="share-img">
      <img :src="imgData">
    </div>
    <canvas ref="img_canvas" style="display:none"></canvas>
    <qriously v-show="false" ref="qriously" level="M" :value="value" :size="120" :backgroundAlpha="1.0" background="white" foreground="black" />
    <div style="padding: 10px;width: 70%;margin: auto">
      <p>使用说明</p>
      <p style="text-indent:1em">长按上图保存图片，或发送给朋友</p>
      <p style="text-indent:1em">图中二维码是您专属邀请码</p>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import Vue from 'vue'
import DetailTabbar from '@/components/DetailTabbar.vue'
import {mapGetters} from 'vuex'
import VueQriously from 'vue-qriously'
Vue.use(VueQriously)
export default {
  components: {
    DetailTabbar
  },
  data() {
    return {
      imgData: null,
      value: 'hhhhhhh'
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted() {
    let cav = this.$refs.img_canvas
    let context = cav.getContext('2d')
    let imgBg = new Image()
    imgBg.setAttribute('crossOrigin', 'Anonymous')
    imgBg.onload = () => {
      cav.width = imgBg.width
      cav.height = imgBg.height
      context.drawImage(imgBg, 0, 0)
      let avatar = new Image()
      avatar.setAttribute('crossOrigin', 'Anonymous')
      var index = location.href.indexOf('#')
      this.value = location.href.substring(0, index + 1) + '/edu/join_us/' + this.userInfo.userId
      avatar.onload = () => {
        context.save()
        context.arc(122, 1227, 72, 0, 2 * Math.PI)
        context.clip()
        context.drawImage(avatar, 50, 1155)
        context.restore()
        context.font = '24px Arial'
        context.fillText(this.userInfo.userName, 212, 1212)
        context.font = '20px Arial'
        context.fillText('向您推荐一款', 212, 1240)
        context.fillText('班级微信群管理神器', 212, 1262)
        let qriously = this.$refs.qriously
        let qrcode = new Image()
        qrcode.setAttribute('crossOrigin', 'Anonymous')
        qrcode.onload = () => {
          context.drawImage(qrcode, 582, 1169)
          context.fillText('长按识别二维码', 575, 1310)
          this.imgData = cav.toDataURL('image/jpeg')
        }
        qrcode.src = qriously.qrious.toDataURL()
      }
      avatar.src = this.tools.cdn(this.userInfo.userIcon, 'head.png', 144)
    }
    imgBg.src = this.tools.cdn('/help/yaoqingka2.png')
  },
  methods: {
    share() {
    }
  }
}
</script>

<style lang="less" scoped>
.share-img {
  width: 65vw;
  height: auto;
  margin: auto;
  img {
    width: 100%;
  }
}
.hint-title {
  text-align: center;
  padding: 14px;

}
</style>


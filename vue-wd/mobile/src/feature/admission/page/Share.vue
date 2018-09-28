<template>
  <div style="position:fixed;height:100%;width:100%;margin:0 auto;text-align:center;background:#fff">
    <img :src="tools.cdn(userInfo.userIcon, 'logo.png', 128)" style="width:36px;height:36px;border-radius:18px;margin-top:15px">
    <div style="font-size:16px;color:#525252">{{userInfo.userName}}</div>
    <div style="text-align:left;font-size:16px;width:90%;margin:0 auto; margin-top:5px;color:#525252; text-align:center">你好，欢迎成为我们的形象大使 <br> <span v-show="deputyInfo.isHavingReward">分享下图，即可获得丰厚奖励</span> <span v-show="deputyInfo.isHavingReward" style="color:#0033CC" @click="goAwards">查看奖项</span> </div>
    <div style="width:90%;margin:0 auto;font-size:14px;color:#a2a2a2;text-align:left; text-align:center;margin-bottom:5px"> 有效期至：2018-12-22 </div>
    <div :style="'width:90vw;backgroud:#f2f2f2;position:relative;margin:0 auto;height:'+height">
      <image-qrcode class="admission-share" :src="tools.cdn(deputyInfo.deputyInviteImg)" :x="x" :y="y" :value="link" :size="size" ></image-qrcode>
    </div>
    <span style="width:100vw;height:40px;position:absolute;bottom:60px;margin:0 auto;text-align:center;left:0px;font-size:14px">长按上图发送给朋友和微信群<br>或者下载保存到手机然后分享到朋友圈</span>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import ImageQrcode from '@/components/ImageQrcode.vue'
import { mapGetters } from 'vuex'
import api from '@/feature/admission/api'
// import {} from 'vux'
export default {
  components: {
    DetailTabbar, ImageQrcode
  },
  data () {
    return {
      height: '55vh',
      deputyInfo: {},
      link: '',
      x: 0,
      y: 0,
      size: 0
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    this.height = (window.innerHeight - 180 - 50 - 45) + 'px'
    api.signDeputy({orgId: this.$route.params.orgId, guideId: this.$route.params.admissionId, inviteDeputyId: this.$route.params.inviteDeputyId}, (data) => {
      var index = location.href.indexOf('#')
      this.link = location.href.substring(0, index + 1) + '/app/' + this.$route.params.orgId + '/admission/detail/' + this.$route.params.admissionId + '/invite/' + data.deputyId
      var arr = data.deputyInviteQrcodePosition.split(',')
      if (arr.length === 3) {
        this.x = parseInt(arr[0])
        this.y = parseInt(arr[1])
        this.size = parseInt(arr[2])
      }
      if (data.isHavingReward === false) {
        this.height = (window.innerHeight - 150 - 50 - 45) + 'px'
      }
      this.deputyInfo = data
    }, () => {})
  },
  methods: {
    goAwards () {
      this.$router.push({name: 'admissionAwards'})
    }
  }
}
</script>

<style>
.admission-share img{
  width:inherit;
  max-width: 100%;
  max-height: 100%;
  display:block;
  position:absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>


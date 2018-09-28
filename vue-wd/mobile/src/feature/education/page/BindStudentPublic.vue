<template>
  <div>
    <img class="bind_user_icon" style="margin-top:30px;" :src="tools.cdn(userInfo.userIcon)">
    <p style="textAlign:center;fontSize: 16px">{{userInfo.userName}}</p>
    <p style="textAlign:center;fontSize: 16px">您好！欢迎使用【校和家】</p>
    <div v-if="showFocusQrcode">
      <p style="textAlign:center;fontSize: 16px">您是【 {{userInfo.schoolName}}】的【学生】</p>
      <p style="textAlign:center;fontSize: 14px;margin: 20px 20px">请长按识别下面的二维码，关注并进入［校和家］公众号，并根据公众号的提示，开启您的家校互通之旅。</p>
      <div style="margin: 20px 0px 5px">
        <qrcode style="text-align: center" :value="userInfo.bindStudentQrUrl" type="img"></qrcode>
      </div>
    </div>
    <div v-if="showErrorHint" style="marginTop: 50px">
      <p style="border: 1px solid #FF6D56;textAlign: center;width: 12em;color: #FF6D56;margin: auto;padding: 10px;fontSize: 16px">您无权访问此页面</p>
    </div>
    <div v-if="userInfo.isWechatUser == false" style="marginTop:80px;">
      <p style="textAlign: center;margin: auto;padding: 10px;fontSize: 14px">如果您是本校成员，请 <span style="color:#0033CC" @click="onShare">点击此处</span> <br> 并按照页面提示操作，申请权限</p>
    </div>
  </div>
</template>

<script>
import { Qrcode } from 'vux'
import api from '../api'
export default {
  data () {
    return {
      showFocusQrcode: false,
      showErrorHint: false,
      userInfo: {}
    }
  },
  components: {
    Qrcode
  },
  // watch: {
  //   userInfo(newValue, old) {
  //     if (newValue.isSubscribe) {
  //       if (newValue.isStudent === false) {
  //         this.$router.replace({name: 'index'})
  //       } else {
  //         this.$router.replace({name: 'educationStudentHome'})
  //       }
  //     } else {
  //       if (newValue.isStudent === false) {
  //         this.showErrorHint = true
  //       } else {
  //         this.showFocusQrcode = true
  //       }
  //     }
  //   }
  // },
  mounted () {
    api.getUserSchoolSetting({schoolId: this.$route.params.schoolId}, (data) => {
      this.userInfo = data
      if (data.isSubscribe) {
        if (data.isStudent === false) {
          this.$router.replace({name: 'index'})
        } else {
          this.$router.replace({name: 'educationStudentHome'})
        }
      } else {
        if (data.isStudent === false) {
          this.showErrorHint = true
        } else {
          this.showFocusQrcode = true
        }
      }
    }, (er) => {
      this.showErrorHint = true
    })
  },
  methods: {
    onShare () {
      this.$store.commit('updateShowUserShareView', {showUserShareView: false})
      setTimeout(() => {
        this.$store.commit('updateShowUserShareView', {showUserShareView: true})
      }, 200)
    }
  }
}
</script>

<style>
.bind_user_icon {
  height: 50px;
  width: 50px;
  border-radius: 25px;
  display: block;
  margin: 10px auto 5px;
}
</style>

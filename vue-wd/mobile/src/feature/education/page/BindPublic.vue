<template>
  <div>
    <img class="bind_user_icon" style="margin-top:30px;" :src="tools.cdn(userInfo.userIcon)">
    <p style="textAlign:center;fontSize: 16px">{{userInfo.userName}}</p>
    <p style="textAlign:center;fontSize: 16px">您好！欢迎使用【校和家】</p>
    <div v-if="showFocusQrcode">
      <p style="textAlign:center;fontSize: 16px">您正在绑定为【 {{userInfo.schoolName}}】的【教师】</p>
      <p style="textAlign:center;fontSize: 14px;margin: 20px 20px">说明：请长按识别下面的二维码，关注并进入［校和家］公众号，并根据公众号给您的提示，完善您的个人资料，完成最终绑定</p>
      <div style="margin: 20px 0px 5px">
        <qrcode style="text-align: center" :value="qrcodeUrl" type="img"></qrcode>
      </div>
      <p style="textAlign:center;fontSize: 16px;color: #FF6D56;margin: 5px 20px">注：请务必完成最终绑定，否则您无法使用所有功能</p>
    </div>
    <div v-if="showErrorHint" style="marginTop: 50px">
      <p style="border: 1px solid #FF6D56;textAlign: center;width: 12em;color: #FF6D56;margin: auto;padding: 10px;fontSize: 16px">您无权限完善此信息</p>
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
  components: {
    Qrcode
  },
  data() {
    return {
      showFocusQrcode: false,
      qrcodeUrl: '',
      userInfo: {},
      showErrorHint: false
    }
  },
  mounted() {
    api.getUserSchoolSetting({schoolId: this.$route.params.schoolId}, (data) => {
      this.userInfo = data
      api.examineTeacherBindPublic({ schoolId: this.$route.params.schoolId, teacherId: this.$route.params.teacherId }, (status) => {
        if (status.status === 1) {
          this.showFocusQrcode = true
          this.qrcodeUrl = status.url
        } else if (status.status === 2) {
          if (status.teacherAvailableStatus === 1) {
            this.$router.replace({name: 'educationTeacherHome'})
            return
          }
          this.$router.replace({name: 'educationEditTeacherInfo'})
        } else {
          this.$router.replace({name: 'schoolIndex', params: {schoolId: this.$route.params.schoolId}})
          // this.showErrorHint = true
        }
      }, (er) => {
        this.error(er)
      })
    }, (er) => {
      this.error(er)
    })
  },
  methods: {
    error(val) {
      if (val.toUser !== undefined && val.toUser) {
        this.tools.warnToast(val.message)
      }
    },
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

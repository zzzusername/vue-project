<template>
  <div>
    <div :style="{'font-size': '16px', 'padding': '10px 20px', 'fontSize':'16px', 'color':'#222222', 'background':'#fff', 'height':height+'px'}"><!--, 'height':hintHeight+'px'-->
      <img class="fail_user_icon" :src="tools.cdn(userInfo.userIcon)">
      <p style="textAlign:center;fontSize: 16px">{{userInfo.userName}}</p>
      <p style="margin-top:1.2em;">您好！欢迎使用【校和家】</p>
      <p style="margin-top:1.2em">您当前还不是［{{userInfo.schoolName}}］的成员，所以无法访问本校的任何页面！请根据您的身份，选择下列操作：</p>
      <div>
        <p style="margin-top:0.8em; color:#222">1、请加入学校微信群（家长微信群或者教师群）；</p>
        <p style="margin-top:0.8em; color:#222">2、如果您已加入学校微信群，请将本页面分享到您所在班级微信群里，以便核实您的身份；<span style="color:blue" @click="onShare">立即分享</span> </p>
        <p style="margin-top:2.2em; color:#626262; font-size:14px;">实用技巧：如果您是家长，且您不希望加入家长微信群，可以联系已经绑定您子女的其他家长，打开家长首页，点击“添加家长”，帮您完成绑定授权。</p>
        <p style="margin-top:14px;color:#666666;text-align:left;font-size:14px;"><strong style="color:#222">如遇到问题，请联系客服人员（微信号：jiaxiaoshequn）</strong></p>
      </div>
     </div>
     <div v-transfer-dom>
      <x-dialog v-model="showQrcode" class="dialog-demo" hide-on-blur>
        <div class="img-box">
          <p style="textAlign:center;fontSize: 14px;margin: 20px 20px">说明：请长按识别下面的二维码，关注并进入［校和家］公众号，并根据公众号给您的提示，完善您的个人资料，完成最终绑定</p>
          <div style="margin: 20px 0px 5px">
            <qrcode style="text-align: center" :value="qrcodeUrl" type="img"></qrcode>
          </div>
          <p style="textAlign:center;fontSize: 16px;color: #FF6D56;margin: 5px 20px">注：请务必完成最终绑定，否则您无法使用所有功能</p>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Qrcode, XDialog, TransferDomDirective as TransferDom } from 'vux'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    XDialog, Qrcode
  },
  data () {
    return {
      showQrcode: false,
      qrcodeUrl: '',
      height: 0
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  // watch: {
  //   '$route' (to, from) {
  //     this.$store.commit('updateWechatQrcode', {isShowWechatQrcode: false})
  //   }
  // },
  mounted () {
    this.height = window.innerHeight - 20
  },
  methods: {
    onBindParents () {
      if (this.userInfo.isSubscribe) {
        this.$router.replace({name: 'educationApplyBindParents', params: {schoolId: this.$route.params.schoolId}})
      } else {
        this.getCode('parent', (data) => {
          this.qrcodeUrl = data.url
          this.showQrcode = true
        })
      }
    },
    onBindTeacher () {
      if (this.userInfo.isSubscribe) {
        this.$router.replace({name: 'educationApplyBindTeacher', params: {schoolId: this.$route.params.schoolId}})
      } else {
        this.getCode('teacher', (data) => {
          this.qrcodeUrl = data.url
          this.showQrcode = true
        })
      }
    },
    getCode (type, cb) {
      api.getApplyTeacherOrParent({schoolId: this.$route.params.schoolId, type: type}, (data) => {
        cb(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取失败，请稍后重试')
        }
      })
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
.fail_user_icon {
  height: 50px;
  width: 50px;
  border-radius: 25px;
  display: block;
  margin: 10px auto 5px;
}
.dialog-demo .weui-dialog{
  border-radius: 8px;
  padding-bottom: 8px;
}
.dialog-demo .dialog-title {
  line-height: 30px;
  color: #666;
}
.dialog-demo .img-box {
  height: 350px;
  overflow: hidden;
}
</style>

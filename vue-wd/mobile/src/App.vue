<template>
  <div id="app" >
    <div style='margin:0 auto;display:none;'>
      <img :src="tools.cdn(orgInfo.orgLogo)" width="300px" height="300px" />
    </div>
    <div v-transfer-dom>
      <!--<loading v-model="isLoading"></loading>-->
      <loading v-model="isLoading" text="加载中..."></loading>
      <toast v-model="isShowToast" :type="toastType" :text="toastTitle" :width="toastWidth" @on-hide="onHideToast" position="middle"></toast>
    </div>
    <router-view></router-view>

    <!-- 已经弃用-->
    <!-- <div v-transfer-dom @click="hideOrgQrcode">
      <popup v-model="isShowOrgQrcode" height="100%" style="background-color:#fff">
        <div class="app_join_org_popup"> -->
          <!--<span class="iconfont icon-jinggao" style="font-size:25vw;color:#e2e"></span>-->
          <!-- <div style="width:100%;text-align:center"><icon type="warn" is-msg style="margin: 0 auto;font-size:70px"></icon></div>
          <div style="display:inline-block;margin:0 auto;margin-top:3vw">
            <p class="app_join_org_des" style="font-size:18px" >对不起，您没有访问该页面的权限</p>
            <p class="app_join_org_des" style="text-align:left;margin-top:2vw">可能原因</p>
            <p style="text-align:left;font-size:12px">※您的用户等级过低</p>
            <p style="text-align:left;font-size:12px">※您没有得到管理员的授权</p>
            <p class="app_join_org_des" style="margin-top:2vw;text-align:left">请联系管理员协助解决</p> -->
            <!--<p style="text-align:left;font-size:12px">管理员微信二维码</p>-->
            <!-- <img class="app_join_org_qrcode" :src="orgQrcode">
            <p class="app_join_org_des" style="font-size:12px;margin-bottom:5vw">长按识别二维码</p>
            <div style="margin:0 auto; border: 1px solid #c2c2c2;height:60px;width:65vw">
              <p class="app_join_org_des" style="font-size:12px; margin-top:10px;color:#a2a2a2">如果你已是本群成员，请 <span style="color:#0033CC" @click="onShare">点击此处</span> <br> 并按照页面提示操作，申请权限</p>
            </div>
          </div>
        </div>
      </popup> -->
    <!-- </div> -->
    <!-- 已经弃用-->

    <div @click="hideWechatQrcode">
      <popup v-model="isShowWechatQrcode" is-transparent height="100%">
        <div class="app_join_wechat_popup">
          <p class="app_join_wechat_des" >请关注服务号，开启消息推送服务!</p>
          <img class="app_join_wechat_qrcode" :src="wechatQrcode">
          <p class="app_join_wechat_des">长按识别二维码</p>
        </div>
      </popup>
    </div>
    <x-dialog v-model="isShowUserShareView" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '100%', 'background-color': 'transparent'}" @click.native="closeDialog">
      <div style="color:#fff;text-align:top;padding-right:30px;padding-left:30px;" >
          <img :src="require('@/assets/wechat-share.png')" style="width:282px;height:200px;float:right;"/>
      </div>
    </x-dialog>
    <alert v-model="isShowLogoutAlert" button-text="重新登录" @on-hide="reLogin">
      <p slot="default" style="color:#222;font-size:20px;">用户未登录</p>
    </alert>
  </div>
</template> 

<script>
import { Loading, Toast, Popup, Icon, XDialog, Alert, TransferDom } from 'vux'
import { mapState, mapGetters } from 'vuex'
import userApi from '@/feature/user/api'
// import orgApi from '@/feature/org/api'
import wechatApi from '@/api/wechat.api'
import schoolApi from '@/feature/education/api'
// import eruda from 'eruda'
export default {
  directives: {
    TransferDom
  },
  name: 'app',
  computed: {
    ...mapState({
      isLoading: state => state.isLoading,
      isShowToastTemp: state => state.isShowToast,
      toastTitle: state => state.toastTitle,
      toastType: state => state.toastType,
      toastWidth: state => state.toastWidth,
      isShowOrgQrcode: state => state.isShowOrgQrcode,
      orgQrcode: state => state.orgQrcode,
      orgName: state => state.orgName,
      isShowWechatQrcode: state => state.isShowWechatQrcode,
      wechatQrcode: state => state.wechatQrcode,
      logoutStatus: state => state.logoutStatus,
      showUserShareView: state => state.showUserShareView
    }),
    ...mapGetters({
      orgInfo: 'orgInfo',
      userInfo: 'userInfo'
    }),
    isShowToast: {
      get: function () {
        return this.isShowToastTemp
      },
      set: function (newValue) {
      }
    }
  },
  data () {
    return {
      count: 0,
      isAllowCloseWechatPopup: process.env.IS_SHOW_SWITCH_USER,
      // isAllowCloseWechatPopup: false,
      showDialogStyle: false,
      isShowLogoutAlert: false,
      isShowUserShareView: false
    }
  },
  watch: {
    isShowOrgQrcode(newValue, old) {
      if (newValue === true && this.count === 0) {
        this.count ++
      } else if (newValue === true) {
        this.$store.commit('updateOrgQrcode', {isShowOrgQrcode: false, orgQrcode: this.orgQrcode})
      }
      // 如果是邀请链接，不弹关注窗口
      if (this.$route.fullPath.indexOf('/invite/') >= 0 || this.$route.fullPath.indexOf('/authfeature/') >= 0) {
        this.$store.commit('updateOrgQrcode', {isShowOrgQrcode: false, orgQrcode: this.orgQrcode})
      }
    },
    isShowWechatQrcode(newValue, old) {
      // 如果是邀请链接，不弹关注窗口
      if (this.$route.fullPath === '/' || this.intercept(this.$route.fullPath)) {
        this.$store.commit('updateWechatQrcode', {isShowWechatQrcode: false, orgQrcode: this.orgQrcode})
        return
      }
      var arr = location.href.match(/authStatus=(\S*)#/)
      if (newValue === true && (arr == null || (arr !== null && arr[1] !== 'true'))) {
        this.$store.commit('updateWechatQrcode', {isShowWechatQrcode: false, orgQrcode: this.orgQrcode})
        // console.log('http://www.sq3q.com/user' + '/wechat/push/auth.html')
        // orgApi.getUserInfo({orgId: this.$route.params.orgId}, userInfo => {
        //   window.location = process.env.API_URL + '/wechat/push/auth.html?backUrl=' + encodeURIComponent(this.$route.path) + '&type=' + userInfo.type
        // }, () => {})
        if (window.__wxjs_environment === 'miniprogram') {
          return
        }
        window.location = process.env.API_URL + '/wechat/push/auth.html?backUrl=' + encodeURIComponent(this.$route.path) + '&type=SCHOOL'
      }
    },
    userInfo(newValue, old) {
      if (newValue.teacherStatus === 2) {
        this.$store.commit('updateWechatQrcode', {isShowWechatQrcode: false, orgQrcode: this.orgQrcode})
        // 完善老师资料并绑定页面
        schoolApi.getOneselfIdentity({schoolId: newValue.schoolId}, (data) => {
          if (!this.tools.isNull(data.teacher)) {
            this.$router.replace({name: 'educationBindPublic', params: {teacherId: newValue.teacherId}})
          }
        }, () => {})
      } else if (newValue.parentStatus === 2) {
        this.$store.commit('updateWechatQrcode', {isShowWechatQrcode: false, orgQrcode: this.orgQrcode})
        // 完善家长资料并绑定页面
        schoolApi.getOneselfIdentity({schoolId: newValue.schoolId}, (data) => {
          if (!this.tools.isNull(data.student)) {
            this.$router.replace({name: 'educationParentBindPublic', params: {parentId: newValue.parentId, studentId: data.student.studentId}})
          }
        }, () => {})
      }
    },
    logoutStatus(newValue, old) {
      if (newValue === true) {
        this.isShowLogoutAlert = newValue
      }
    },
    showUserShareView(newValue, old) {
      if (newValue === true) {
        this.onShare()
      }
    }
  },
  mounted () {
    var wx = this.$wechat
    wechatApi.configWechat({jsApiList: ['hideOptionMenu', 'scanQRCode', 'chooseImage', 'showOptionMenu', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQZone', 'onMenuShareQQ', 'onMenuShareWeibo', 'startRecord', 'stopRecord', 'playVoice', 'stopVoice', 'uploadVoice', 'uploadImage'], wx}, () => {
      console.log('初始化微信接口')
    }, () => {})
  },
  methods: {
    intercept (currentPath) {
      let paths = ['agent/publicity', '/pay/success/', '/pay/error/', '/bind_student', '/parent_bind_public/', '/bind_public/']
      let isIntercept = false
      paths.forEach(element => {
        if (this.$route.fullPath.indexOf(element) >= 0) {
          isIntercept = true
        }
      })
      return isIntercept
    },
    onHideToast () {
      this.$store.commit('showToast', {isShowToast: false, toastTitle: this.toastTitle, toastType: this.toastType, toastWidth: this.toastWidth})
    },
    hideOrgQrcode () {
      if (this.isAllowCloseWechatPopup) {
        this.$store.commit('updateOrgQrcode', {isShowOrgQrcode: false, orgQrcode: this.orgQrcode})
      }
    },
    hideWechatQrcode () {
      this.$store.commit('updateWechatQrcode', {isShowWechatQrcode: false, wechatQrcode: this.wechatQrcode})
    },
    onShare () {
      userApi.getBindKey((data) => {
        let schoolLogo = !this.tools.isNull(data.schoolLogo) ? (process.env.CDN_DOMAIN + '/' + data.schoolLogo) : (process.env.CDN_DOMAIN + '/school/school-icon.png')
        var link = location.href.replace(this.$route.path, '') + 'edu/auth_share/' + this.$route.params.schoolId + '/key/' + data.bindKey
        this.tools.shareWechat({title: '家校空间', desc: '点击即可查看', link: link, imgUrl: schoolLogo})
        this.isShowUserShareView = true
      }, () => {})
    },
    closeDialog () {
      this.isShowUserShareView = false
    },
    reLogin () {
      console.log(this.$route.path)
      if (window.__wxjs_environment === 'miniprogram') {
        let self = this
        this.$wechat.miniProgram.getEnv(res => {
          console.log(res.miniProgram)
          if (res.miniprogram) {
            self.$wechat.miniProgram.redirectTo({url: '/pages/login/login?backUrl=' + this.$route.path})
            console.log('post miniprograme message', this.$route.href)
          }
        })
        return
      }
      if (process.env.NODE_ENV === 'production') {
        location.reload()
      } else {
        this.$router.push({name: 'userLoginList'})
      }
    }
  },
  components: {
    Loading, Toast, Popup, Icon, XDialog, Alert
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/close.less';
@import '../src/assets/basecss.css';

html,body{
  height: 100%
}
div{
  -webkit-touch-callout:none;  /*系统默认菜单被禁用*/
  -webkit-user-select:none; /*webkit浏览器*/ 
  user-select:none;   
}
.app_join_org_qrcode {
  display: block;
  width: 150px;
  margin: 2vw auto;
}
.app_join_org_popup {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  text-align:center;
}
.app_join_org_des {
  /*display: block;*/
  text-align: center;
  color: #000;
  font-size:16px;
}

.app_join_wechat_qrcode {
  display: block;
  width: 200px;
  margin: 2vw auto;
}
.app_join_wechat_popup {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
}
.app_join_wechat_des {
  /*display: block;*/
  text-align: center;
  color: #fff;
  font-size:17px;
}
</style>

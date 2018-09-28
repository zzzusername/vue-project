<template>
  <div style="background-color:#85e2da;position:fixed;height:100%;width:100%;">
    <img src="../../../assets/invate_head.png" style="width:92%;margin:4vw;">
    <div style="backgroud-color:#222;position:absolute;top: 17vw;width:100%;text-align:center">
      <img src="../../../assets/invate_text.png" style="width:40vw;height:13vw;">
    </div>
    <div style="background-color:#fff;width:90%;height:68%;margin:0 auto;border-radius:7px;text-align:center">
      <img :src="tools.cdn(inviteInfo.creator.userIcon, 'logo.png', 128)" style="width:50px;height:50px;border-radius:25px;margin-top:40px">
      <div style="font-size:18px;margin-top:5px;color:#525252">{{inviteInfo.creator.userName}}</div>
      <div style="text-align:left;font-size:20px;width:90%;margin:0 auto; margin-top:18vw;color:#525252">尊敬的 {{inviteInfo.creator.userId==inviteInfo.me.userId?'XXX':inviteInfo.me.userName}}</div>
      <div style="width:90%;margin:0 auto; margin-top:10px;font-size:18px;color:#a2a2a2;text-align:left;">我是联盟［{{leagueInfo.leagueName}}］的创始人{{inviteInfo.creator.userName}}，特此邀请您出任本联盟 <span v-for="item in listName" style="color:#FF6D56">[{{item}}] </span> 的管理员。致谢！ </div>
      <div v-if="inviteInfo.creator.userId!=inviteInfo.me.userId" class="invate-button" style="width:120px;height:33px;margin-top:10vw;line-height: 33px;-webkit-tap-highlight-color:rgba(0,0,0,0)" v-on:click="onAgree">接受邀请</div>
      <div v-else class="invate-button" style="width:120px;height:33px;margin-top:10vw;line-height: 33px;-webkit-tap-highlight-color:rgba(0,0,0,0)" v-on:click="onInvate">发送邀请卡</div>
    </div>
    <img src="../../../assets/invate_bottom.png" style="width:121px;height:50px;margin-top:10px;position:absolute;bottom:10px;left:5vw">
    <x-dialog v-model="showDialogStyle" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '100%', 'background-color': 'transparent'}" @click.native="closeDialog">
      <div style="background-color:#FF6D56;color:#fff;text-align:top;" >
          <span style="font-size:18px;">点击右上角图标进行分享</span>
          <span class="iconfont icon-arrowupright2"></span>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { Checklist, Tabbar, TabbarItem, XButton, Blur, XDialog } from 'vux'
import api from '@/feature/league/api'

export default {
  components: {
    Checklist,
    Tabbar,
    TabbarItem,
    XButton,
    Blur,
    XDialog
  },
  data () {
    return {
      inviteId: 0,
      inviteCode: '',
      isShowButton: true,
      submitBtnText: '提交',
      list: [],
      listValue: [],
      listName: [],
      inviteInfo: {},
      showDialogStyle: false,
      leagueInfo: {}
    }
  },
  mounted () {
    if (typeof (this.$route.params.inviteId) !== 'undefined') {
      this.inviteId = this.$route.params.inviteId
    }
    if (typeof (this.$route.params.inviteCode) !== 'undefined') {
      this.inviteCode = this.$route.params.inviteCode
    }
    api.getInviteInfo({inviteId: this.inviteId, inviteCode: this.inviteCode}, (data) => {
      this.inviteInfo = data
      data.featureList.forEach((item) => {
        this.listName.push(item.fName)
      })
    }, () => {
      this.tools.warnToast('此邀请卡已失效')
      // this.$router.push({name: 'index'})
    })
    api.getLeagueInfo({leagueId: this.$route.params.leagueId}, (data) => {
      this.leagueInfo = data
      this.initWechat(data)
    }, () => {})
  },
  methods: {
    onAgree () {
      api.agreeInvite({inviteId: this.inviteId, inviteCode: this.inviteCode}, (data) => {
        // 同意后返回联盟id
        this.$router.replace({name: 'leagueManageList'})
        this.tools.successToast('请等待盟主审核')
      }, (errorData) => {
        this.tools.warnToast(errorData.message)
        this.$router.push({name: 'index'})
      })
    },
    onInvate () {
      this.showDialogStyle = true
    },
    closeDialog () {
      this.showDialogStyle = false
    },
    initWechat (leagueInfo) {
      this.tools.shareWechat({title: '邀请卡', desc: ('邀请您成为' + leagueInfo.leagueName + '的管理员'), imgUrl: (process.env.CDN_DOMAIN + '/' + leagueInfo.leagueLogo + '?imageView2/1/w/128/h/128')})
    }
  }
}
</script>

<style>
.invate-button {
  background:#fff url("../../../assets/invate_button.png") no-repeat;
  background-size: 100% 100% !important;
  color:#fff;
  margin:0 auto
}
</style>

<template>
  <div style="background-color:#85e2da;position:fixed;height:100%;width:100%;">
    <img src="../../../assets/invate_head.png" style="width:92%;margin:4vw;">
    <div style="backgroud-color:#222;position:absolute;top: 17vw;width:100%;text-align:center">
      <img src="../../../assets/invate_text.png" style="width:40vw;height:13vw;">
    </div>
    <div style="background-color:#fff;width:90%;height:68%;margin:0 auto;border-radius:7px;text-align:center">
      <div style="text-align:center;font-size:20px;width:90%;margin:0 auto; color:#525252;height:10px"></div>
      <div style="text-align:center;font-size:20px;width:90%;margin:0 auto; color:#525252;margin-top:6vw">诚意邀请 {{userInfo.userId==leagueInfo.masterId?'xxx':userInfo.userName}}</div>
      <div style="width:90%;margin:0 auto; margin-top:1vw;font-size:18px;color:#525252;text-align:center;">加入 <strong>[{{leagueInfo.leagueName}}]</strong> 联盟</div>
      <div v-if="leagueInfo.leagueIntroduce!=null" style="width:90%;margin:0 auto; margin-top:4vw;font-size:16px;color:#525252;text-align:left;" class='invite-desc-text'><strong>简介：</strong>{{leagueInfo.leagueIntroduce}}</div>
      <div style="width:90%;margin:0 auto; margin-top:4vw;font-size:16px;color:#626262;text-align:left;"><strong>联盟发起人：</strong>{{leagueInfo.masterName}} </div>
      <div style="width:90%;margin:0 auto; margin-top:1vw;font-size:16px;color:#626262;text-align:left;"><strong>成立时间：</strong>{{getDateTime(leagueInfo.createDate)}} </div>
      <div style="width:90%;margin:0 auto; margin-top:1vw;font-size:16px;color:#626262;text-align:left;"><strong>成员群数：</strong>{{leagueInfo.orgNum}} </div>
      <div style="width:90%;margin:0 auto; margin-top:1vw;font-size:16px;color:#626262;text-align:left;"><strong>费用：</strong>{{(leagueInfo.joinCost===null||leagueInfo.joinCost===0)?'免费':leagueInfo.joinCost}} </div>
      <div v-if="leagueInfo.masterId!=userInfo.userId" class="invate-button" style="width:120px;height:33px;margin-top:10vw;line-height: 33px;-webkit-tap-highlight-color:rgba(0,0,0,0)" v-on:click="onAgree">加入联盟</div>
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
import { Tabbar, TabbarItem, XDialog, dateFormat } from 'vux'
import api from '@/feature/league/api'
import { mapGetters } from 'vuex'

export default {
  components: {
    Tabbar,
    TabbarItem,
    XDialog
  },
  data () {
    return {
      leagueInfo: {},
      showDialogStyle: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    isMaster() {
      if (typeof (this.userInfo.userId) === 'undefined' || this.leagueInfo === null || typeof (this.leagueInfo.masterId) === 'undefined') {
        return false
      } else if (this.userInfo.userId === this.leagueInfo.masterId) {
        return true
      }
    }
  },
  mounted () {
    api.getLeagueInfo({leagueId: this.$route.params.leagueId}, (data) => {
      this.leagueInfo = data
      this.tools.shareWechat({title: '邀请卡', desc: ('邀请您加入' + this.leagueInfo.leagueName), imgUrl: (process.env.CDN_DOMAIN + '/' + this.leagueInfo.leagueLogo + '?imageView2/1/w/128/h/128')})
    }, () => {})
  },
  methods: {
    getDateTime (time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    onAgree () {
      var leagueId = this.$route.params.leagueId
      this.$router.push({name: 'leagueAuthOrgList', params: {leagueId}})
    },
    onInvate () {
      this.showDialogStyle = true
    },
    closeDialog () {
      this.showDialogStyle = false
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
.invite-desc-text {
  word-break:break-all;
  display:-webkit-box;
  -webkit-line-clamp:3;
  -webkit-box-orient:vertical;
  overflow:hidden;
}
</style>

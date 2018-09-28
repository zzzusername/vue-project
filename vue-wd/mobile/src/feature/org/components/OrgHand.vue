<template>
  <div style="position:relative;">
    <div class="orgHand" v-bind:style="{'background-image':'url('+orgImgUrl+')'}">
      <div style="width:100%;height:100%;overflow:hidden;background-color: rgba(0, 0, 0, 0.5);">
        <div class="org-info">
          <h2 class="org-info-title">{{title}}</h2>
          <div class="org-info-content">
            <img :src="tools.cdn(orgInfo.orgLogo)"  class="org-info-logo">
            <div class="org-info-box">
              <p class="org-info-name">{{orgInfo.orgName}} </p> 
              <!--<rater :value=1 slot="value" :font-size="15" :max="5" disabled></rater>-->
              <p class="org-info-desc">成员：{{orgInfo.memberNum}}人</p>
            </div>
            <!--<div v-if="!isManager" style="width:100%;text-align:right;margin-right:2vw">
              <x-button mini type="primary" style="width:56px;font-size:12px;" class="jhy-background-success" @click.native="">关注</x-button>
              <x-button mini type="primary" style="width:56px;font-size:12px;" class="jhy-background-success" @click.native="addToOrg">加群</x-button>
            </div>-->
            <div style="width:350px;text-align:right;margin-right:2vw;margin-top:4vw">
              <x-button v-show="subscribe.isSubscribe==false" mini type="primary" style="width:56px;font-size:12px;" class="jhy-background-success" @click.native="addToWechat">关注</x-button>
              <x-button v-show="userInfo.isMember==false&&isManager==false" mini type="primary" style="width:56px;font-size:12px;" class="jhy-background-success" @click.native="addToOrg">加群</x-button>
              <div v-show="isManager==true" class="jhy-background-success" v-on:click="onManage" style="display:inline;width:64px;color:#fff;text-align:center;font-size:12px;padding: 5px 5px 5px 5px;border-radius: 5px;"><span class="iconfont icon-qunshezhi" style="color:#fff;font-size:13px"></span><span style="margin-left:3px">{{fName}}管理</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-transfer-dom @click="hideJoinOrgBox">
      <popup v-model="joinOrg" is-transparent height="100%">
        <div class="join_org_popup">
          <p class="join_org_des" >请加群主为好友，并发送‘申请入群’<br>的好友申请。通过后，群主会拉你您入群!</p>
          <img class="join_org_qrcode" :src="orgQrcode">
          <p class="join_org_des">长按识别二维码</p>
        </div>
      </popup>
    </div>
    <div v-transfer-dom @click="hideJoinWechatBox">
      <popup v-model="joinWechat" is-transparent height="100%">
        <div class="join_org_popup">
          <p class="join_org_des" >请关注服务号，开启消息推送服务!</p>
          <img class="join_org_qrcode" :src="subscribe.wechatQRUrl">
          <p class="join_org_des">长按识别二维码</p>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/feature/org/api'
// import * as types from '../types'
import { XButton, Blur, Rater, Popup, TransferDom } from 'vux'
export default {
  // data: function () {
  //   return {
  //     backUrl: 'http://oixsxsqu7.bkt.clouddn.com/activity/38/activityImg'
  //   }
  // },
  props: ['title', 'manageLink', 'featureCode'],
  directives: {
    TransferDom
  },
  components: {
    Blur,
    XButton,
    Rater,
    Popup
  },
  mounted () {
    api.getOrgSetting({orgId: this.$route.params.orgId}, setting => {
      this.setting = setting
    }, () => {})
    api.getSubscribeStatus({type: this.userInfo.type}, (data) => {
      this.subscribe = data
    }, () => {})
  },
  data () {
    return {
      joinOrg: false,
      joinWechat: false,
      setting: {},
      fManagerOrgUrl: '',
      fName: '',
      subscribe: {}
    }
  },
  watch: {
    userInfo: function (val) {
      api.getSubscribeStatus({type: this.userInfo.type}, (data) => {
        this.subscribe = data
      }, () => {})
    }
  },
  computed: {
    ...mapGetters({
      orgInfo: 'orgInfo',
      userInfo: 'userInfo'
    }),
    isManager() {
      var isShow = false
      if (this.featureCode !== undefined) {
        if ((this.userInfo.isManager || this.userInfo.isMaster) && this.featureCode === 'HOME') {
          isShow = true
          this.fName = '群'
          this.fManagerOrgUrl = '{"name": "orgManagement"}'
        } else if (this.userInfo.featureList !== undefined && this.userInfo.featureList !== null) {
          this.userInfo.featureList.forEach(function(element) {
            if (element.fCode === this.featureCode && element.isExist === true) {
              this.fManagerOrgUrl = element.fManagerOrgUrl
              if (element.fCode === 'JIFENSHANGCHENG') {
                this.fName = '商城'
              } else {
                this.fName = element.fName
              }
              isShow = true
            }
          }, this)
        }
        return isShow
      } else {
        return isShow
      }
    },
    orgImgUrl () {
      if (this.orgInfo.orgImgUrl) {
        if (this.orgInfo.orgImgUrl.indexOf('data:') === 0) {
          return this.orgInfo.orgImgUrl
        } else {
          return this.tools.cdn(this.orgInfo.orgImgUrl)
        }
      }
    },
    orgQrcode () {
      return this.tools.cdn(this.setting.orgMasterQrcode)
    }
  },
  methods: {
    addToOrg () {
      this.joinOrg = true
    },
    hideJoinOrgBox () {
      this.joinOrg = false
    },
    addToWechat () {
      this.joinWechat = true
    },
    hideJoinWechatBox () {
      this.joinWechat = false
    },
    onManage () {
      var link = JSON.parse(this.fManagerOrgUrl)
      link.params = {orgManagementId: this.$route.params.orgId}
      this.$router.push(link)
    }
  }
  // 初始路由不会检测到变化
  // watch: {
  //   '$route': 'changeOrgInfo'
  // },
  // methods: {
  //   changeOrgInfo () {
  //     // 如果新的orgId与页面不符获取新的群信息
  //     var orgId = Number(this.$route.params.orgId)
  //     console.log(orgId)
  //     if (this.orgInfo.orgId !== orgId) {
  //       this.$store.dispatch(types.GET_ORG_INFO, {orgId})
  //     }
  //   }
  // },
  // created () {
  //   console.log('created')
  //   this.changeOrgInfo()
  // }
}
</script>

<style>
.orgHand{
  width:100%;
  height:30vw;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.org-info{
  position:absolute;
  bottom: 10px;
  width: 100%;
}
.org-info-logo{
  width: 3rem;
  height: 3rem;
  vertical-align: middle;
  margin-left: 15px;
  border-radius: 10rem;
  min-width:3rem;
  min-height:3rem;
  border:1px solid #e5e5e5;
}
.org-info-content{
  align-items:center;
  display: flex;
  flex-grow:3;
}
.org-info-title{
  text-align: center;
  color : #fff;
  /*text-shadow: 0 0 1px #000;*/
  margin-top : 1vw;
}
.org-info-box{
  margin-left: 15px;
  width:100%;
}
.org-info-name{
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 10em;
  /*text-shadow: 0 0 1px #000;*/
}
.org-info-desc{
  color: #fff;
  font-size: 12px;
  /*text-shadow: 0 0 1px #000;*/

}
.join_org_qrcode {
  display: block;
  width: 200px;
  margin: 3vw auto;
}
.join_org_popup {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
}
.join_org_des {
  /*display: block;*/
  text-align: center;
  color: #fff;
  font-size:17px;
}

</style>

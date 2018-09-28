<template>
  <div>
    <div id="iframe-box">
      <iframe id="ifram" style="border:0px;width:100vw;" :height="height" src="//doc.qunxiaozhu.com/index.php?s=/page/49" frameborder="0" scrolling="yes"></iframe>
    </div>
    <tabbar v-transfer-dom style="position:fixed">
      <tabbar-item @on-item-click="help()">
        <span slot="label" >
          <span class="iconfont icon-bangzhu publicity-text-big" style="color:#a2d268;"></span>
          <span slot="label" style="font-size:17px">查看帮助</span>
        </span>
      </tabbar-item>
      <tabbar-item @on-item-click="free()">
        <div slot="label">
          <span class="iconfont icon-free publicity-text-big" style="color:#a2d268;"></span>
          <span slot="label" style="font-size:17px">创建学校</span>
        </div>
      </tabbar-item>
    </tabbar>
    <!-- <div v-transfer-dom @click="hideWechatQrcode">
      <popup v-model="isShowWechatQrcode" is-transparent height="100%">
        <div class="app_join_wechat_popup">
          <p class="app_join_wechat_des" >请先关注服务号，并创建学校!</p>
          <div style="text-align:center;padding:10px;">
            <qrcode :value="userInfo.createSchoolQrUrl" type="img" :size="150"></qrcode>
          </div>
          <p class="app_join_wechat_des">长按识别二维码</p>
        </div>
      </popup>
    </div> -->
    <div v-transfer-dom>
      <x-dialog v-model="isShowWechatQrcode">
        <div style="padding: 10px 0;">
          <p style="textAlgin: center;padding: 10px 15px;fontSize: 14px;">请长按识别二维码，进入公众号，并根据公众号的提示创建您的学校。</p>
          <qrcode :value="userInfo.createSchoolQrUrl" type="img" :size="150"></qrcode>
          <p style="margin: 5px 20px 0px;fontSize: 16px;">校和家</p>
        </div>
        <div style="padding: 10px;" @click="isShowWechatQrcode=false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, Popup, XDialog, TransferDomDirective as TransferDom, Qrcode } from 'vux'
import indexApi from '../../index/api'
import api from '../api'
import { mapGetters } from 'vuex'
export default {
  directives: {
    TransferDom
  },
  components: {
    Tabbar, TabbarItem, Popup, TransferDom, Qrcode, XDialog
  },
  data () {
    return {
      height: '100vh',
      url: '',
      orgId: 1,
      isShowWechatQrcode: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    if (!this.tools.isNull(this.$route.params.salesmanId)) {
      api.salesmanBindUser({salesmanId: this.$route.params.salesmanId}, () => {
      }, () => {})
    }
    this.height = window.innerHeight + 'px'
    this.tools.shareWechat({desc: '亲爱的老师，您再也不用为管理学校的班级群而烦恼了！我们帮您搞定一切！', imgUrl: 'http://img.qunxiaozhu.com/help/agent-1.6.jpeg?imageView2/1/w/300/h/300', link: location.href})
    indexApi.getOwnOrJoinOrgFirst((orgData) => {
      this.orgId = orgData.orgId
    }, () => {})
    this.$nextTick(() => {
      setTimeout(function() {
        // let ifram = document.getElementById('ifram')
        if (navigator.userAgent.match(/iPad|iPhone/i)) {
          let box = document.getElementById('iframe-box')
          box.style.width = 100 + '%'
          box.style.overflowX = 'hidden'
          // box.style.overflowY = 'scroll'
          // aaaa.style.webkitOverflowScrolling = 'touch'
          // ifram.setAttribute('scrolling', 'yes')
          // box.appendChild(ifram)
        }
      }, 1500)
    })
  },
  methods: {
    help () {
      location.href = '//doc.qunxiaozhu.com/index.php?s=/page/57'
    },
    free () {
      // this.isShowWechatQrcode = true
      // 处理代理商下线业务
      if (this.userInfo.isSubscribe === true) {
        // 创建学校页面
        this.$router.push({name: 'educationCreateSchool'})
        // this.$router.push({name: 'industryListForSalesman', params: {orgId: this.orgId, salesmanId: this.$route.params.salesmanId}})
      } else {
        this.isShowWechatQrcode = true
        // this.userInfo.createSchoolQrUrl
      }
    }
  }
}
</script>

<style>
.publicity-text-big {
  font-size: 18px!important;
}
#ifram {
  border: 0;
  width: 1px;
  min-width: 100%;
  *width: 100%;
}
</style>
<style lang="less" scoped>
@import '~vux/src/styles/close';
.dialog-demo {
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>

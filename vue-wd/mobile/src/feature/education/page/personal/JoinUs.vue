<template>
  <div>
    <div id="iframe-box">
      <iframe id="ifram" style="border:0px;width:100vw;" :height="height" src="//doc.qunxiaozhu.com/index.php?s=/page/97" frameborder="0" scrolling="yes"></iframe>
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
          <span slot="label" style="font-size:17px">创建班级</span>
        </div>
      </tabbar-item>
    </tabbar>
    <div v-transfer-dom>
      <x-dialog v-model="isShowWechatQrcode">
        <div style="padding: 10px 0;">
          <p style="textAlgin: center;padding: 10px 15px;fontSize: 14px;">请长按识别二维码，进入公众号，并根据公众号的提示创建您的学校。</p>
          <qrcode :value="qrUrl" type="img" :size="150"></qrcode>
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
import { mapGetters } from 'vuex'
import api from '../../personalApi'
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
      qrUrl: '',
      isShowWechatQrcode: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    this.height = window.innerHeight + 'px'
    this.tools.shareWechat({desc: '亲爱的老师，您再也不用为管理学校的班级群而烦恼了！我们帮您搞定一切！', imgUrl: 'http://img.qunxiaozhu.com/help/agent-1.6.jpeg?imageView2/1/w/300/h/300', link: location.href})
    this.$nextTick(() => {
      setTimeout(function() {
        if (navigator.userAgent.match(/iPad|iPhone/i)) {
          let box = document.getElementById('iframe-box')
          box.style.width = 100 + '%'
          box.style.overflowX = 'hidden'
        }
      }, 1500)
    })
  },
  methods: {
    help () {
      location.href = '//doc.qunxiaozhu.com/index.php?s=/page/103'
    },
    free () {
      if (this.userInfo.isSubscribe === false) {
        api.getPersonalQr({inviteUserId: this.$route.params.inviteUserId}, (data) => {
          this.qrUrl = data.url
          this.isShowWechatQrcode = true
        }, () => {})
      } else {
        if (this.tools.isNull(this.$route.params.inviteUserId)) {
          this.$router.push({name: 'educationCreatedClass', params: {inviteUserId: this.$route.params.inviteUserId}})
        } else {
          this.$router.push({name: 'educationInviteCreatedClass', params: {inviteUserId: this.$route.params.inviteUserId}})
        }
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

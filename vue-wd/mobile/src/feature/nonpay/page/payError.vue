<template>
  <div>
    <msg :title="title" :description="description" :buttons="buttons" :icon="icon"></msg>
  </div>
</template>

<script>
import { Msg, Divider, XButton } from 'vux'

export default {
  components: {
    Msg,
    Divider,
    XButton
  },
  methods: {
    closeWxWindow () {
      this.$wechat.closeWindow()
    },
    setErrorMsg () {
      var errorCode = this.$route.params.errorCode
      if (errorCode === '10010103') {
        this.title = '开通失败'
        this.description = '只允许获取链接的用户使用此页面'
      } else if (errorCode === '10010104') {
        this.title = '获群信息失败'
        this.description = '请重新邀请群助手入群并重新获取开通连接，请在10分钟之内完成支付'
      } else if (errorCode === '10010102') {
        this.title = '无效的链接'
        this.description = '此群已开通'
      } else if (errorCode === '10010105') {
        this.title = '开通失败'
        this.description = '用户同步失败请重新授权登陆'
      } else if (errorCode === '98020101') {
        this.title = '开通失败'
        this.description = '开通单号已过期，请重新邀请群助手入群并重新获取开通连接，请在10分钟之内完成支付'
      } else if (errorCode === '98020102') {
        this.title = '开通失败'
        this.description = '开通单号不存在，请重新邀请群助手入群并重新获取开通连接，请在10分钟之内完成支付'
      } else {
        this.title = '开通失败'
        this.description = '请联系管理员'
      }
      console.log(errorCode)
    }
  },
  created () {
    this.setErrorMsg()
  },
  data () {
    return {
      icon: 'waiting',
      title: '',
      description: '',
      buttons: [{
        type: 'default',
        text: '关闭',
        onClick: this.closeWxWindow.bind(this)
      }]
    }
  }
}
</script>

<style>

</style>

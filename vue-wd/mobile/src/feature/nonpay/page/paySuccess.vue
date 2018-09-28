<template>
  <div>
    <msg title="开通成功" description="已为您开群助手功能" :buttons="buttons" :icon="icon"></msg>
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
    toOrgSetting () {
      this.$router.replace({name: 'orgManagement', params: {orgManagementId: this.$route.params.orgId}})
    }
  },
  data () {
    return {
      icon: 'success',
      buttons: [{
        type: 'primary',
        text: '开启我的群管理之旅',
        onClick: this.toOrgSetting.bind(this)
      }, {
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

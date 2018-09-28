<template>
  <div>
    <org-hand></org-hand>
    <cell title="title"
          value="value">
    </cell>
    <detail-tabbar :backLink="{name:'userIndex'}"></detail-tabbar>
  </div>
</template>

<script>
// import '@/components/RongIMLib-2.2.5.js'
import { Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import OrgHand from '@/feature/org/components/OrgHand.vue'
export default {
  created () {
    this.initRong()
  },
  methods: {
    initRong () {
      this.tools.loadRongImJs((RongIMLib) => {
        RongIMLib.RongIMClient.init('e7x8xycsx6flq')
        var token = 'mKmyKqTSf7aNDinwAFMnz7NXKILeV3X0+CCRBOxmtOApmvQjMathViWrePIfq0GuTu9jELQqsckv4AhfjCAKgQ=='
        RongIMLib.RongIMClient.connect(token, {
          onSuccess: function (userId) {
            console.log('Login successfully.' + userId)
          },
          onTokenIncorrect: function () {
            console.log('token无效')
          },
          onError: function (errorCode) {
            var info = ''
            switch (errorCode) {
              case RongIMLib.ErrorCode.TIMEOUT:
                info = '超时'
                break
              case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                info = '未知错误'
                break
              case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                info = '不可接受的协议版本'
                break
              case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                info = 'appkey不正确'
                break
              case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                info = '服务器不可用'
                break
            }
            console.log(errorCode)
            console.log(info)
          }
        })
      })
    }
  },
  components: {
    Cell, DetailTabbar, OrgHand
  }
}
</script>

<style>

</style>

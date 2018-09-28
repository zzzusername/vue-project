<template>
  <div>
    <x-button type="primary" @click.native="pay">支付</x-button>
  </div>
</template>

<script>
import { XButton } from 'vux'
import api from '../api.js'
export default {
  components: {
    XButton
  },
  methods: {
    pay() {
      api.testPay(data => {
        /*eslint-disable */
          WeixinJSBridge.invoke (
            'getBrandWCPayRequest', 
            data,
            (res) => {
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                this.tools.successToast('支付成功')
              } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                this.tools.cancelToast('支付取消')
              } else {
                // 支付失败!
                this.tools.warnToast('支付失败')
              }
            }
          )
          /*eslint-enable */
      }, er => {})
    }
  }
}
</script>

<style>

</style>

<template>
  <div>
    <!--<span>{{orderId}}</span>-->
    <card :header="{title:'支付方式'}" style="font-size:16px">
      <cell slot="content" title="微信支付">
        <x-img slot="icon" :src="require('@/assets/weixinpay.png')" style="width:15px;margin-right:5px;margin-top:4px"></x-img>
        <x-icon style="fill: #8ebf52" type="ios-checkmark"></x-icon>
      </cell>
    </card>
    <card :header="{title:'详细信息'}" style="font-size:16px">
      <cell slot="content" :title="orderInfo.orderDetail"></cell>
      <cell slot="content" title="应付金额" :value="'￥' + orderInfo.price"></cell>
      <cell slot="content" title="实付金额" :value="'￥' + orderInfo.price"></cell>
    </card>
    <p class="jhy-margin">
      <x-button type="primary" class="jhy-background-success" style="margin-top:40px" @click.native="payAction">确认付款</x-button>
    </p>
  </div>
</template>

<script>
  import { XButton, Card, Cell, XImg } from 'vux'
  import api from '@/feature/pay/api'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      XButton, Card, Cell, XImg
    },
    data () {
      return {
        orderId: '',
        orderInfo: {
          price: '0.00'
        },
        successLink: null
      }
    },
    computed: {
      ...mapGetters({
        payInfo: 'payInfo'
      })
    },
    mounted () {
      this.orderId = this.$route.params.orderId
      api.getOrderInfo({orderId: this.orderId}, (data) => {
        if (data.toUser) {
          this.tools.warnToast(data.message, '180px')
        } else {
          this.orderInfo = data
        }
      }, (errorData) => {
        if (errorData.toUser) {
          this.tools.warnToast(errorData.message, '180px')
        } else {
          this.tools.warnToast('查询订单失败', '180px')
        }
      })
      if (typeof (this.payInfo.successLink) !== 'undefined' && this.payInfo.successLink != null) {
        this.successLink = {...this.payInfo.successLink}
      }
      this.tools.setPaySuccessLink(null)
    },
    methods: {
      payAction () {
        api.getWxPay({orderId: this.orderId}, (data) => {
          /*eslint-disable */
          WeixinJSBridge.invoke (
            'getBrandWCPayRequest', 
            data,
            (res) => {
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                this.tools.successToast('支付成功')
                if (this.successLink === null) {
                  this.$router.go(-1)
                } else {
                  this.$router.replace(this.successLink)
                }
              } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                this.tools.cancelToast('支付取消')
                // if (this.successLink === null) {
                //   this.$router.go(-1)
                // } else {
                //   this.$router.replace(this.successLink)
                // }
              } else {
                // 支付失败!
                this.tools.warnToast('支付失败')
              }
            }
          )
          /*eslint-enable */
        }, (data) => {
          if (data.toUser) {
            this.tools.warnToast(data.message)
          } else {
            this.tools.warnToast('支付失败')
          }
        })
      }
    }
  }
</script>

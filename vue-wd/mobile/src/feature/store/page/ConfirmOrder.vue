<template>
  <div v-if="productInfo !== null">
    <group gutter="0">
      <cell v-if="addressInfo !== null" :title="'收件人: ' + addressInfo.saName + ' ' + addressInfo.saPhone" :inline-desc="'地址: ' + addressInfo.saProvince + addressInfo.saCity + addressInfo.saArea + addressInfo.saDetail" is-link :link="{name: 'storeDeliverAddress'}"></cell>
      <cell v-if="addressInfo === null" title="请添加收货地址" value="添加" is-link :link="{name: 'storeDeliverAddress'}"></cell>
    </group>
    <group gutter="5px">
      <div style="padding:15px 10px;overflow:hidden;">
        <div :style="{'background-image':'url('+ tools.cdn(productInfo.psgMainImg)+')'}" class="confirm_product_img"></div>
        <div style="position:relative;height:70px;float:left;width:65%;">
          <p style="fontSize:16px;overflow:hidden;text-overflow:ellipsis;word-break:break-all;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">{{productInfo.psgName}}</p>
          <p style="fontSize:12px;position:absolute;left:0;bottom:0;overflow:hidden;color:#f36d21;">
            <span v-if="productInfo.psgCostPrice !== 0 || (productInfo.psgCostPrice == 0 && productInfo.psgPoints == 0)">¥ {{productInfo.psgCostPrice}}</span>
            <span v-if="productInfo.psgPoints !== 0 && productInfo.psgCostPrice !== 0"> + </span>
            <span v-if="productInfo.psgPoints !== 0">{{productInfo.psgPoints}} 积分</span>
          </p>
        </div>
      </div>
    </group>
    <group gutter="5px" style="overflow:hidden;">
      <x-number style="fontSize:16px;" title="兑换数量" :min="1" :max="productInfo.singleBuyCount>0&&productInfo.singleBuyCount<productInfo.psgCount?productInfo.singleBuyCount:productInfo.psgCount" v-model="productNum" :fillable="true" @on-change="changePsgCount"></x-number>
      <cell style="fontSize:16px;" title="支付积分">
        <p style="color:#f36d21;">{{productNum * productInfo.psgPoints}}</p>
      </cell>
      <cell style="fontSize:16px;" title="商品金额">
        <p style="color:#f36d21;">{{(productNum * productInfo.psgCostPrice).toFixed(2)}}</p>
      </cell>
      <cell style="fontSize:16px;" title="运费">
        <p style="color:#f36d21;">{{productInfo.psgCourierPrice}}</p>
      </cell>
    </group>
    <p style="position:relative;padding:10px;overflow:hidden;height:24px;backgroundColor:#fff;" class="jhy-1px-b">
      <span style="position:absolute;right:0;marginRight:15px;fontSize:16px;">实付款:  <span style="color:#f36d21;">¥ {{(productNum * productInfo.psgCostPrice + productInfo.psgCourierPrice).toFixed(2)}}</span></span>
    </p>
    <detail-tabbar :actionLink="submitOrder" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
  import { Group, Cell, XNumber } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/store/api'
  import { mapGetters, mapActions } from 'vuex'
  import * as types from '../types'
  export default {
    components: {
      Group, Cell, XNumber, DetailTabbar
    },
    data () {
      return {
        productNum: 1,
        productInfo: null,
        addressInfo: null,
        actions: [{
          name: '提交订单',
          code: 'confirm'
        }]
      }
    },
    computed: {
      ...mapGetters({
        productOrderInfo: types.PRODUCT_ORDER_INFO
      })
    },
    mounted () {
      var psgId = this.$route.params.productId
      api.getProductInfo({psgId}, (info) => {
        this.productInfo = info
      }, () => {})

      // 判断是否有全局缓存，如果有则使用
      if (this.productOrderInfo.productId === psgId) {
        this.productNum = this.productOrderInfo.productNum === undefined ? 1 : this.productOrderInfo.productNum
      } else {
        this.setProductOrderInfo({})// 清空缓存
      }
      if (this.productOrderInfo.addressInfo !== undefined) {
        this.addressInfo = this.productOrderInfo.addressInfo
      } else {
        api.getDefaultAddress((addressInfo) => {
          this.addressInfo = addressInfo
        }, () => {})
      }
    },
    methods: {
      ...mapActions({
        setProductOrderInfo: types.SET_PRODUCT_ORDER_INFO
      }),
      submitOrder() {
        if (this.addressInfo === null) {
          this.tools.warnToast('请添加收货地址', '160px')
          return
        }
        var orgId = this.$route.params.orgId
        var psoNum = this.productNum
        var psgId = this.productInfo.psgId
        var saId = this.addressInfo.saId
        api.submitOrder({orgId, psoNum, psgId, saId}, (val) => {
          if (val !== null && val.psoSn !== undefined && val.psoSn !== '') {
            if (val.psoStatus === 'nopay') {
              var psoSn = val.psoSn
              api.orderPay({orgId, psoSn}, (val) => {
                if (val !== null && val.wxOrderId !== undefined) {
                  this.$router.replace({name: 'payIndex', params: {orderId: val.wxOrderId}})
                }
              }, () => {})
            } else if (val.psoStatus === 'pay') {
              this.$router.replace({name: 'storeOrderList'})
            }
          }
          if (val !== null && val.rs !== undefined && val.rs !== 1) {
            this.tools.warnToast(val.message, '180px')
          }
        }, (val) => {
          this.tools.warnToast(val.message, '180px')
        })
      },
      changePsgCount (val) {
        this.setProductOrderInfo({productId: this.$route.params.productId, productNum: val})
      }
    }
  }
</script>

<style>
.confirm_product_img {
  width: 30%;
  height: 70px;
  margin-right:5px;
  float: left;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
</style>


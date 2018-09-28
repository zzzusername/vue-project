<template>
  <div v-if="productInfo !== null">
    <group gutter="0">
      <cell :title="'订单编号: ' + productInfo.psoSn" :inline-desc="'下单时间: '+ formateDate(productInfo.psoTime)"></cell>
    </group>
    <group gutter="5px">
      <cell v-if="productInfo.saName !== null" :title="'收件人: ' + productInfo.saName + ' ' + productInfo.saPhone">
        <p slot="after-title" style="fontSize:14px;color:#666;">{{'地址: ' + productInfo.saProvince + productInfo.saCity + productInfo.saArea + productInfo.saDetail}}<br><span v-if="productInfo.psoCourierName !== null && productInfo.psoCourierSn !== null" style="color:#f36d21;">{{productInfo.psoCourierName + ' 单号：' + productInfo.psoCourierSn}}</span></p>
      </cell>
    </group>
    <group gutter="5px">
      <div style="padding:15px 10px;overflow:hidden;" @click="skipProductInfo">
        <div :style="{'background-image':'url('+ tools.cdn(productInfo.psgMainImg)+')'}" class="confirm_product_img"></div>
        <div style="position:relative;height:70px;float:left;width:60%;">
          <p style="fontSize:16px;overflow:hidden;">{{productInfo.psgName}}</p>
          <p style="fontSize:14px;position:absolute;left:0;bottom:0;overflow:hidden;color:#f36d21;"><span v-if="productInfo.psoGoodsPoints !== 0">{{productInfo.psoGoodsPoints}}积分</span><span v-if="productInfo.psoGoodsPoints !== 0 && productInfo.psoGoodsPrice !== 0"> + </span><span v-if="productInfo.psoGoodsPrice !== 0">¥ {{productInfo.psoGoodsPrice}}</span></p>
        </div>
      </div>
    </group>
    <group gutter="5px" style="overflow:hidden;">
      <cell style="fontSize:16px;" title="兑换数量">
        <p style="color:#f36d21;">{{productInfo.psoNum}}</p>
      </cell>  
      <cell style="fontSize:16px;" title="支付积分">
        <p style="color:#f36d21;">{{productInfo.psoPointsTotal}}</p>
      </cell>
      <cell style="fontSize:16px;" title="商品金额">
        <p style="color:#f36d21;">{{productInfo.psoPriceTotal.toFixed(2)}}</p>
      </cell>
      <cell style="fontSize:16px;" title="运费">
        <p style="color:#f36d21;">{{productInfo.psoGoodsCourierPrice.toFixed(2)}}</p>
      </cell>
    </group>
    <p style="position:relative;padding:10px;overflow:hidden;height:24px;backgroundColor:#fff;" class="jhy-1px-b">
      <span style="position:absolute;right:0;marginRight:15px;fontSize:16px;">实付款:  <span style="color:#f36d21;">¥ {{(productInfo.psoPriceTotal + productInfo.psoGoodsCourierPrice).toFixed(2)}}</span></span>
    </p>
    <div v-show="productInfo.psoStatus==='nopay'" style="margin-left:5px;margin-top:10px">请在20分钟内完成支付，过期将自动关闭订单</div>
    <group v-if="productInfo.psoStatus === 'return'" title="退货信息" style="overflow:hidden;">
      <cell style="fontSize:16px;" title="快递公司">
        <p style="color:#f36d21;">{{productInfo.psoReturnCourierName}}</p>
      </cell>  
      <cell style="fontSize:16px;" title="快递单号">
        <p style="color:#f36d21;">{{productInfo.psoReturnCourierSn}}</p>
      </cell>
    </group>
    <div v-if="productInfo.psoStatus === 'nopay'" class="jhy-1px-t" style="position:fixed;bottom:0;left:0;height:50px;width:100%;backgroundColor:#F7F7FA;color:#999;">
      <div style="position:relative;width:100%;height:100%;">
        <div @click="() => {$router.go(-1)}" style="position:relative;float:left;left:0;width:33.3%;textAlign:center;height:100%;">
          <span style="display:block;margin:auto;lineHeight:50px;"><span class="iconfont icon-fanhui1" style="marginRight:5px;color:#a2d268"></span>返回</span>
        </div>
        <div @click="cancelOrder()" style="position:relative;float:left;left:0;width:33.3%;textAlign:center;height:100%;backgroundColor:rgb(245, 99, 100)">
          <span style="display:block;margin:auto;lineHeight:50px;color:#fff;">取消订单</span>
        </div>
        <div @click="submitOrder()" style="position:relative;float:left;left:0;width:33.3%;textAlign:center;height:100%;backgroundColor:#8ebf52">
          <span style="display:block;margin:auto;lineHeight:50px;color:#fff;">去支付</span>
        </div>
      </div>
    </div>
    <div v-else-if="productInfo.psoStatus === 'pay'" class="jhy-1px-t" style="position:fixed;bottom:0;left:0;height:50px;width:100%;backgroundColor:#F7F7FA;color:#999;">
      <div style="position:relative;width:100%;height:100%;">
        <div @click="() => {$router.go(-1)}" style="position:relative;float:left;left:0;width:50%;textAlign:center;height:100%;">
          <span style="display:block;margin:auto;lineHeight:50px;"><span class="iconfont icon-fanhui1" style="marginRight:5px;color:#a2d268"></span>返回</span>
        </div>
        <div @click="moneyReturn()" style="position:relative;float:left;left:0;width:50%;textAlign:center;height:100%;backgroundColor:#8ebf52">
          <span style="display:block;margin:auto;lineHeight:50px;color:#fff;">取消订单</span>
        </div>
      </div>
    </div>
    <div v-else-if="productInfo.psoStatus === 'send'" class="jhy-1px-t" style="position:fixed;bottom:0;left:0;height:50px;width:100%;backgroundColor:#F7F7FA;color:#999;">
      <div style="position:relative;width:100%;height:100%;">
        <div @click="() => {$router.go(-1)}" style="position:relative;float:left;left:0;width:33.3%;textAlign:center;height:100%;">
          <span style="display:block;margin:auto;lineHeight:50px;"><span class="iconfont icon-fanhui1" style="marginRight:5px;color:#a2d268"></span>返回</span>
        </div>
        <div @click="orderRefunds()" style="position:relative;float:left;left:0;width:33.3%;textAlign:center;height:100%;backgroundColor:rgb(245, 99, 100)">
          <span style="display:block;margin:auto;lineHeight:50px;color:#fff;">申请退货</span>
        </div>
        <div @click="confirmOrder()" style="position:relative;float:left;left:0;width:33.3%;textAlign:center;height:100%;backgroundColor:#8ebf52">
          <span style="display:block;margin:auto;lineHeight:50px;color:#fff;">确认收货</span>
        </div>
      </div>
    </div>
    <detail-tabbar v-else></detail-tabbar>
    <popup v-model="show" height="34%">
      <group label-width="4em" label-margin-right="1em" label-align="right">
        <selector placeholder="请选择" v-model="courierName" title="快递公司" :options="courierList"></selector>
        <x-input v-model="courierNo" title="快递单号" type="tel" placeholder="请填写快递单号" keyboard="number"></x-input>
      </group>
      <x-button type="primary" style="width:180px; margin-top:20px" @click.native="onReturn">申请退货</x-button>
    </popup>
  </div>
</template>

<script>
  import { Group, Cell, XNumber, dateFormat, Popup, XButton, Selector, XInput } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/store/api'
  export default {
    components: {
      Group, Cell, XNumber, DetailTabbar, Popup, XButton, Selector, XInput
    },
    data () {
      return {
        productInfo: null,
        show: false,
        courierList: [],
        courierName: '',
        courierNo: ''
      }
    },
    mounted () {
      var psoSn = this.$route.params.productSN
      var orgId = this.$route.params.orgId
      api.getOrderInfo({orgId, psoSn}, (val) => {
        this.productInfo = val
      }, () => {})
    },
    methods: {
      submitOrder() {
        var orgId = this.$route.params.orgId
        var psoSn = this.$route.params.productSN
        api.orderPay({orgId, psoSn}, (val) => {
          if (val !== null && val.wxOrderId !== undefined) {
            this.$router.replace({name: 'payIndex', params: {orderId: val.wxOrderId}})
          }
        }, (val) => {
          this.tools.toast(val.message)
        })
      },
      cancelOrder() {
        var orgId = this.$route.params.orgId
        var psoSn = this.productInfo.psoSn
        api.cancelOrder({orgId, psoSn}, (val) => {
          if (val.rs === 1 && val.message === 'ok') {
            this.$router.go(-1)
            if (this.productInfo.psoStatus !== 'nopay') {
              this.tools.toast('取消订单成功，请等待审核')
            } else {
              this.tools.toast('取消订单成功')
            }
          } else {
            this.tools.toast('取消失败')
          }
        }, (val) => {
          this.tools.toast(val.message)
        })
      },
      moneyReturn () {
        api.moneyReturn({orgId: this.$route.params.orgId, psoSn: this.productInfo.psoSn}, (val) => {
          if (val.rs === 1 && val.message === 'ok') {
            this.$router.go(-1)
            this.tools.toast('取消订单成功，请等待审核')
          } else {
            this.tools.toast('取消失败')
          }
        }, (val) => {
          this.tools.toast(val.message)
        })
      },
      orderRefunds() {
        this.show = true
        this.courierName = ''
        this.courierNo = ''
        api.getCourierList((data) => {
          data.forEach(function(element) {
            this.courierList.push(element.exName)
          }, this)
        }, () => {})
      },
      onReturn () {
        if (this.courierName === '' || this.courierNo === '') {
          this.tools.warnToast('快递信息不完整', '140px')
          return
        }
        var orgId = this.$route.params.orgId
        var psoSn = this.productInfo.psoSn
        api.orderRefunds({orgId, psoSn, psoReturnCourierSn: this.courierNo, psoReturnCourierName: this.courierName}, (val) => {
          if (val.rs === 1 && val.message === 'ok') {
            this.$router.go(-1)
            this.tools.toast('退货申请成功，请等待审核')
          } else {
            this.tools.toast('退货申请失败')
          }
        }, (val) => {
          this.tools.toast(val.message)
        })
      },
      skipProductInfo () {
        this.$router.push({name: 'storeProductInfo', params: {productId: this.productInfo.psgId}})
      },
      confirmOrder () {
        // 确认收货
        api.confirmProduct({orgId: this.$route.params.orgId, psoSn: this.productInfo.psoSn}, (val) => {
          if (val.rs === 1 && val.message === 'ok') {
            this.tools.toast('确认收货成功')
            this.productInfo.psoStatus = 'over'
          }
        }, (val) => {
          this.tools.toast(val.message)
        })
      },
      formateDate(time) {
        return dateFormat(time, 'YYYY-MM-DD HH:mm:ss')
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


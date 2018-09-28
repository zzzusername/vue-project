<template>
  <div>
    <group label-width="5em" label-margin-right="1em" label-align="right" >
      <cell title="订单编号" :value="orderInfo.psoSn" value-align="left"></cell>
      <cell title="订单时间" :value="orderInfo.psoTime" value-align="left"></cell>
      <cell title="商品名称" :value="orderInfo.psgName" value-align="left"></cell>
      <!--<cell title="商品ID" :value="orderInfo.psgId" value-align="left"></cell>-->
      <cell title="商品图片" value-align="left">
        <img slot="default" :src="tools.cdn(orderInfo.psgMainImg, 'logo.png', 128)" class="jhy-cell-img"></img>
      </cell>
      <cell title="商品数量" :value="orderInfo.psoNum" value-align="left"></cell>
      <cell title="商品价格" :value="'¥ '+orderInfo.psoGoodsPrice" value-align="left"></cell>
      <cell title="运费" :value="orderInfo.psoGoodsCourierPrice==0?'包邮':'¥ '+orderInfo.psoGoodsCourierPrice" value-align="left"></cell>
      <cell v-show="orderInfo.psoPointsTotal>0" title="实消费积分" :value="orderInfo.psoPointsTotal+' 积分'" value-align="left"></cell>
      <cell title="实付款（含运费）" value-align="left">
        <span slot="value" style="color:#f36d21">{{'¥ '+orderInfo.psoPay.toFixed(2)}}</span>
      </cell>
      <cell title="买家" :value="orderInfo.userName" value-align="left"></cell>
      <cell title="收货人" :value="orderInfo.saName" value-align="left"></cell>
      <cell title="收货电话" :value="orderInfo.saPhone" value-align="left"></cell>
      <cell title="收货地址" :value="orderInfo.saAddress" value-align="left"></cell>
      <cell title="订单状态" :value="orderInfo.orderType" value-align="left"></cell>
      <cell v-if="orderInfo.psoCourierName!=undefined&&orderInfo.psoCourierName!=null" title="发货信息" :value="orderInfo.psoCourierName + '（' + orderInfo.psoCourierSn + '）'" value-align="left"></cell>
      <cell v-if="orderInfo.psoReturnCourierName!=undefined&&orderInfo.psoReturnCourierName!=null" title="退货信息" :value="orderInfo.psoReturnCourierName + '（' + orderInfo.psoReturnCourierSn + '）'" value-align="left"></cell>
    </group>
    <popup v-model="show" height="34%">
      <group label-width="4em" label-margin-right="1em" label-align="right">
        <selector placeholder="请选择" v-model="courierName" title="快递公司" :options="courierList"></selector>
        <x-input v-model="courierNo" title="快递单号" type="tel" placeholder="请填写快递单号" keyboard="number"></x-input>
      </group>
      <x-button type="primary" style="width:180px; margin-top:20px" @click.native="onSend">发货</x-button>
    </popup>
    <detail-tabbar :actionLink="onAction" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
  import { Group, Cell, Tabbar, TabbarItem, XImg, Popup, XInput, XButton, Selector } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/store/api'
  export default {
    components: {
      Group, Cell, Tabbar, TabbarItem, XImg, DetailTabbar, Popup, XInput, XButton, Selector
    },
    data () {
      return {
        orderInfo: {},
        actions: [],
        show: false,
        courierList: [],
        courierName: '',
        courierNo: ''
      }
    },
    mounted () {
      this.getManageDetail()
    },
    methods: {
      getManageDetail () {
        api.getManageDetail({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, psoSn: this.$route.params.psoSn}, (data) => {
          this.orderInfo = data
          this.orderInfo.saAddress = data.saProvince + data.saCity + data.saArea + data.saDetail
          this.orderInfo.saPhone = data.saPhone
          this.orderInfo.saName = data.saName
          this.actions = []
          if (this.orderInfo.psoStatus === 'pay') {
            this.orderInfo.orderType = '待发货'
            this.actions = [{
              name: '发货',
              code: 'deliver'
            }]
          } else if (this.orderInfo.psoStatus === 'send') {
            this.orderInfo.orderType = '待确认'
          } else if (this.orderInfo.psoStatus === 'return') {
            this.orderInfo.orderType = '退货中'
            this.actions = [{
              name: '确认退货',
              code: 'return'
            }]
          } else if (this.orderInfo.psoStatus === 'return_money') {
            this.orderInfo.orderType = '退款中'
            this.actions = [{
              name: '确认退款',
              code: 'return_money'
            }]
          } else if (this.orderInfo.psoStatus === 'over_return') {
            this.orderInfo.orderType = '退货完成'
          } else if (this.orderInfo.psoStatus === 'over_return_money') {
            this.orderInfo.orderType = '退款完成'
          } else if (this.orderInfo.psoStatus === 'cancel') {
            this.orderInfo.orderType = '订单已取消'
          } else if (this.orderInfo.psoStatus === 'over') {
            this.orderInfo.orderType = '交易完成'
          }
        }, () => {})
      },
      onAction (code) {
        if (code === 'deliver') {
          this.show = true
          this.courierName = ''
          this.courierNo = ''
          api.getCourierList((data) => {
            data.forEach(function(element) {
              this.courierList.push(element.exName)
            }, this)
          }, () => {})
        } else if (code === 'return') {
          api.checkReturn({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, psoSn: this.orderInfo.psoSn, psoStatus: 'over_return'}, () => {
            this.getManageDetail()
            this.tools.successToast('退货完成')
          }, () => {})
        } else if (code === 'return_money') {
          api.checkReturn({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, psoSn: this.orderInfo.psoSn, psoStatus: 'over_return_money'}, () => {
            this.getManageDetail()
            this.tools.successToast('退款完成')
          }, () => {})
        }
      },
      onSend () {
        if (this.courierName === '' || this.courierNo === '') {
          this.tools.warnToast('快递信息不完整', '140px')
          return
        }
        api.sendProduct({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, psoSn: this.orderInfo.psoSn, psoCourierSn: this.courierNo, psoCourierName: this.courierName}, (data) => {
          this.show = false
          this.getManageDetail()
          this.tools.successToast('发货成功')
        }, () => {})
      }
    }
  }
</script>

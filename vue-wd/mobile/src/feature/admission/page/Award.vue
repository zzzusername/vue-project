<template>
  <div>
    <group>
      <cell :title="'可用'+(deputyInfo==null?'':deputyInfo.deputyRewardUnit)" :value="deputyInfo.invitePointsTotal"></cell>
    </group>
    <div v-show="commonList !== null && commonList.length==0" style="margin:15px;color:#FF6D56">无可兑换奖项</div>
    <group v-show="commonList.length>0" title="选择兑换奖项">
      <checklist :options="commonList" v-model="checklist" :max=1 ></checklist>
    </group>
    <group v-show="commonList.length>0" title="填写兑换信息">
      <x-input title="兑换数量" placeholder="请输入兑换数量" v-model="guideRewardCount"></x-input>
      <cell v-if="addressInfo !== null" :title="'收件人: ' + addressInfo.saName + ' ' + addressInfo.saPhone" :inline-desc="'地址: ' + addressInfo.saProvince + addressInfo.saCity + addressInfo.saArea + addressInfo.saDetail" is-link :link="{name: 'storeDeliverAddress', params: {productId: 22}}"></cell>
      <cell v-if="addressInfo === null" title="请添加收货地址" value="添加" is-link :link="{name: 'storeDeliverAddress', params: {productId: 22}}"></cell>
    </group>
    <group v-show="deputyInfo.isDeputyJoinOrg == true" title="入群二维码">
      <div style="width:90vw;backgroud:#f2f2f2;position:relative;margin:0 auto;height:200px;margin-top:10px;margin-bottom:20px">
        <img class="admission_award_qrcode_img" :src="tools.cdn(deputyInfo.deputyOrgQrcode, 'logo.png')">
      </div>
      <span style="width:100vw;position:absolute;margin:0 auto;text-align:center;left:0px;font-size:14px;bottom:0px;">长按识别二维码</span>
    </group>
    <detail-tabbar :actionLink="onAction" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import {Cell, Group, Checklist, XInput} from 'vux'
import api from '@/feature/admission/api'
import { mapGetters, mapActions } from 'vuex'
import * as types from '../../store/types'
import storeApi from '@/feature/store/api'
export default {
  components: {
    Cell, Group, Checklist, XInput, DetailTabbar
  },
  data () {
    return {
      deputyInfo: null,
      actions: [
        {
          name: '确认兑奖',
          code: 'apply'
        }
      ],
      commonList: null,
      checklist: [],
      addressInfo: null,
      guideRewardCount: 1
    }
  },
  computed: {
    ...mapGetters({
      productOrderInfo: types.PRODUCT_ORDER_INFO
    })
  },
  mounted () {
    if (this.productOrderInfo.addressInfo !== undefined) {
      this.addressInfo = this.productOrderInfo.addressInfo
      console.log(this.addressInfo)
    } else {
      storeApi.getDefaultAddress((addressInfo) => {
        this.addressInfo = addressInfo
        console.log(this.addressInfo)
      }, () => {})
    }
    api.deputyRedeem({orgId: this.$route.params.myOrgId, guideId: this.$route.params.admissionId}, (data) => {
      if (data.reward !== null) {
        this.commonList = []
        data.reward.forEach((element) => {
          var item = {
            key: element.id,
            value: element.rewardName,
            inlineDesc: element.pointsNum + data.deputyRewardUnit + '可兑换'
          }
          this.commonList.push(item)
        }, this)
      }
      this.deputyInfo = data
    }, () => {})
  },
  methods: {
    ...mapActions({
      setProductOrderInfo: types.SET_PRODUCT_ORDER_INFO
    }),
    onAction (code) {
      if (code === 'myAwards') {
        this.$router.push({name: 'admissionMyAwards'})
      } else {
        var guideRewardId = null
        if (this.checklist.length > 0) {
          guideRewardId = this.checklist[0]
        }
        var saId = null
        if (this.addressInfo !== null) {
          saId = this.addressInfo.saId
        }
        api.addRedeem({orgId: this.$route.params.myOrgId, guideId: this.$route.params.admissionId, guideRewardCount: this.guideRewardCount, guideRewardId, saId}, (data) => {
          this.tools.successToast('兑换成功，待审核')
          this.$router.back()
        }, (data) => {
          if (data.toUser) {
            this.tools.warnToast(data.message, '170px')
          } else {
            this.tools.warnToast('兑换失败')
          }
        })
      }
    }
  }
}
</script>

<style>
.admission_award_qrcode_img{
  /*width:inherit;*/
  max-width: 100%;
  max-height: 100%;
  display:block;
  position:absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>

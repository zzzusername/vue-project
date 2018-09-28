<template>
  <div v-transfer-dom>
    <popup v-model="isShowPopup" height="90vh">
      <div>
        <group label-width="5em" label-margin-right="0.7em" label-align="right">
          <cell title="代表姓名" :value="defaultData.userName" value-align="left"></cell>
          <cell title="兑换奖项" :value="info.rewardName" value-align="left"></cell>
          <cell title="兑换数量" :value="info.guideRewardCount" value-align="left"></cell>
          <cell title="收件人姓名" :value="info.saName" value-align="left"></cell>
          <cell title="收件人电话" :value="info.saPhone" value-align="left"></cell>
          <cell title="收件地址" :value="info.saDetail==null?'':info.saProvince + info.saCity + info.saArea + info.saDetail" value-align="left"></cell>
          <cell v-show="info.checkStatus==3&&!tools.isNull(info.courierName)" title="快递公司" :value="info.courierName" value-align="left"></cell>
          <cell v-show="info.checkStatus==3&&!tools.isNull(info.courierSn)" title="快递单号" :value="info.courierSn" value-align="left"></cell>
        </group>
        <group v-show="info.checkStatus==1" label-width="4em" label-margin-right="1em" label-align="right">
          <selector placeholder="请选择" v-model="courierName" title="快递公司" :options="courierList"></selector>
          <x-input v-model="courierSn" title="快递单号" type="tel" placeholder="请填写快递单号" keyboard="number"></x-input>
        </group>
      </div>
      <tabbar style="position:fixed">
        <tabbar-item @on-item-click="goBack">
          <span slot="label" >取消</span>
        </tabbar-item>
        <tabbar-item style="background-color:#FF6D56" v-show="info.checkStatus==1">
          <span slot="label" style="color:#fff" @click="onRefuse">拒绝</span>
        </tabbar-item>
        <tabbar-item style="background-color:#8ebf52" v-show="info.checkStatus==1">
          <span slot="label" style="color:#fff" @click="onDone">通过</span>
        </tabbar-item>
        <tabbar-item style="background-color:#bbb" v-show="info.checkStatus==3">
          <span slot="label" style="color:#fff">已兑奖</span>
        </tabbar-item>
        <tabbar-item style="background-color:#bbb" v-show="info.checkStatus==2">
          <span slot="label" style="color:#fff">已拒绝</span>
        </tabbar-item>
      </tabbar>
    </popup>
  </div>
</template>

<script>
import {TransferDom, Popup, Tabbar, TabbarItem, Group, XButton, XInput, Cell, Actionsheet, Selector} from 'vux'
import api from '@/feature/admission/api'
import storeApi from '@/feature/store/api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Popup, Tabbar, TabbarItem, Group, XButton, XInput, Cell, Actionsheet, Selector
  },
  props: ['isShow', 'goBack', 'returnData', 'defaultData'],
  data () {
    return {
      isShowPopup: false,
      info: {},
      courierList: [],
      courierName: null,
      courierSn: null
    }
  },
  watch: {
    isShow(newValue, old) {
      this.isShowPopup = newValue
      if (newValue === true) {
        api.getAwardAuditInfo({orgId: this.defaultData.orgId, leagueId: this.defaultData.leagueId, guideId: this.defaultData.guideId, deputyGiveRewardId: this.defaultData.deputyGiveRewardId}, (data) => {
          this.info = data
          storeApi.getCourierList((data) => {
            data.forEach(function(element) {
              this.courierList.push(element.exName)
            }, this)
          }, () => {})
        }, () => {})
      }
    },
    isShowPopup(newValue, old) {
      if (newValue === false) {
        this.goBack()
      }
    }
  },
  methods: {
    onButtonClick (index) {
      if (index === 0 || index === 1) {
        return
      }
      this.showActionSheet = true
      this.currentIndex = index
    },
    onDone () {
      api.auditRewards({orgId: this.defaultData.orgId, leagueId: this.defaultData.leagueId, guideId: this.defaultData.guideId, deputyGiveRewardId: this.defaultData.deputyGiveRewardId, auditStatus: true, courierSn: this.courierSn, courierName: this.courierName}, () => {
        this.tools.successToast('兑奖审核通过成功')
        this.isShowPopup = false
        this.returnData(this.defaultData.deputyGiveRewardId)
      }, (data) => {
        if (data.toUser) {
          this.tools.warnToast(data.message, '170px')
        } else {
          this.tools.warnToast('兑奖审核通过失败')
        }
      })
    },
    onRefuse () {
      api.auditRewards({orgId: this.defaultData.orgId, leagueId: this.defaultData.leagueId, guideId: this.defaultData.guideId, deputyGiveRewardId: this.defaultData.deputyGiveRewardId, auditStatus: false}, () => {
        this.tools.successToast('兑奖审核拒绝成功')
        this.isShowPopup = false
        this.returnData(this.defaultData.deputyGiveRewardId)
      }, (data) => {
        if (data.toUser) {
          this.tools.warnToast(data.message, '170px')
        } else {
          this.tools.warnToast('兑奖审核拒绝失败')
        }
      })
    }
  }
}
</script>

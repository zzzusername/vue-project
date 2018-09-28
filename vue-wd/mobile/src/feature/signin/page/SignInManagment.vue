<template>
  <div>
    <group>
      <cell style="fontSize:16px;" v-for="(item, index) in manageList" v-if="item.type === 'router'" :title="item.name" :value="item.value" :key="index" is-link :link="item.router"></cell>
      <x-switch style="fontSize:16px;" v-else-if="item.type === 'switch'" :title="item.name" v-model="item.value" @on-change="val => {switchChange(val, index)}" :key="index"></x-switch>
      <datetime style="fontSize:16px;" v-else-if="showDateRange && item.type === 'date'" v-model="item.value" format="HH:mm" :min-hour="0" :max-hour="23" @on-change="val => {onDateChange(val, index)}" :title="item.name" :key="index" hour-row="{value} 点" minute-row="{value} 分" confirm-text="完成" cancel-text="取消"></datetime>
      <x-input style="fontSize:16px;" v-else-if="item.type === 'text'" :title="item.name" :key="index" :placeholder="item.hint" v-model="item.value" text-align="left"></x-input>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, XSwitch, Datetime, XInput, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/signin/api'
export default {
  components: {
    Group, Cell, XSwitch, Datetime, XInput, DetailTabbar
  },
  data() {
    return {
      orgId: this.$route.params.orgManagementId,
      startDate: dateFormat(new Date(), 'YYYY-MM-DD'),
      manageList: [
        {
          name: '允许签到的用户组',
          type: 'router',
          router: { name: 'signInUserGroup' }
        },
        // {
        //   name: '开启积分兑换',
        //   type: 'switch',
        //   value: false,
        //   code: 'isOpenConvert'
        // },
        {
          name: '开启签到时间限制',
          type: 'switch',
          value: false,
          code: 'isOpenTime'
        },
        {
          name: '开始时间',
          type: 'date',
          value: '',
          code: 'signStartTime'
        },
        {
          name: '结束时间',
          type: 'date',
          value: '',
          code: 'signEndTime'
        },
        {
          name: '签到奖励积分',
          type: 'router',
          code: 'signBaseScore',
          router: { name: 'signSetBasePoints' }
        },
        {
          name: '签到前N名额外奖励积分',
          type: 'router',
          router: { name: 'signExtraPoints' }
        },
        {
          name: '特殊用户组签到获得积分倍数',
          type: 'router',
          router: { name: 'signPointsMultiple' }
        },
        {
          name: '连续签到奖励积分设置',
          type: 'router',
          router: { name: 'signContinuesPoints' }
        }
      ],
      showDateRange: false,
      isOpenConvert: false,
      firstLoadFinish: false
    }
  },
  mounted() {
    var orgId = this.orgId
    api.getSignInManageSetting({ orgId }, (val) => {
      if ((val !== null && val.isOpenConvert !== null && val.isOpenConvert !== '') ||
        (val !== null && val.isOpenTime !== null && val.isOpenTime !== '') ||
        (val !== null && val.signStartTime !== null && val.signStartTime !== '') ||
        (val !== null && val.signEndTime !== null && val.signEndTime !== '')) {
        for (var i = 0; i < this.manageList.length; i++) {
          if (this.manageList[i].code !== undefined && this.manageList[i].code === 'isOpenConvert') {
            this.manageList[i].value = val.isOpenConvert
            this.isOpenConvert = true
          } else if (this.manageList[i].code !== undefined && this.manageList[i].code === 'isOpenTime') {
            this.manageList[i].value = val.isOpenTime
          } else if (this.manageList[i].code !== undefined && this.manageList[i].code === 'signStartTime') {
            this.manageList[i].value = dateFormat(val.signStartTime === 0 ? 1 : val.signStartTime, 'HH:mm')
          } else if (this.manageList[i].code !== undefined && this.manageList[i].code === 'signEndTime') {
            this.manageList[i].value = dateFormat(val.signEndTime === 0 ? 1 : val.signEndTime, 'HH:mm')
          } else if (this.manageList[i].code !== undefined && this.manageList[i].code === 'signBaseScore') {
            this.manageList[i].value = val.baseScore
          }
        }
      }
      this.$nextTick(() => {
        this.firstLoadFinish = true
      })
    }, () => { })
  },
  methods: {
    switchChange(val, index) {
      var signSetting = []
      if (this.manageList[index].code === 'isOpenTime') {
        this.showDateRange = val
        signSetting.push({ name: 'isOpenTime', value: val })
      } else if (this.manageList[index].code === 'isOpenConvert') {
        signSetting.push({ name: 'isOpenConvert', value: val })
      }
      this.submitSetting(signSetting)
    },
    onDateChange(val, index) {
      var signSetting = []
      if (this.manageList[index].code === 'signStartTime') {
        signSetting.push({ name: 'signStartTime', value: val })
      } else if (this.manageList[index].code === 'signEndTime') {
        signSetting.push({ name: 'signEndTime', value: val })
      }
      this.submitSetting(signSetting)
    },
    submitSetting(signSetting) {
      if (this.firstLoadFinish) {
        var orgId = this.orgId
        api.setSignInManageSetting({ orgId, signSetting }, (val) => {
          if (val.rs === 1) {
            this.tools.successToast('保存成功')
          }
        }, () => { })
      }
    }
  }
}
</script>

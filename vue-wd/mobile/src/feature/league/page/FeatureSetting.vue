<template>
  <div>
    <group title="为联盟开启功能，并设置联盟属性">
      <x-switch v-for="(item, index) in list" :key="index" :title="item.fName" :value="item.isExist" v-model="item.isExist" @on-change="val=>{changeSwitchStatus(val,item.featureId,item.fCode,index)}"></x-switch>
    </group>
    <popup v-model="huodongPopup" height="100%" @on-show="initActivityDividendSetting">
        <div class="popup1">
            <group title="" titleColor="#8ebf52">
              <x-switch title="按百分比分成" v-model="activityType1" @on-change="val=>{changeActivityType(val,1)}"></x-switch>
              <x-input title="分成百分比"  placeholder="必填" type="number" :show-clear="true" :min="1" v-show="activityType1" v-model="incomePercentage">
                <span slot="right" >%</span>
              </x-input>
              <x-input title="最大分成金额"  placeholder="必填" type="number" :show-clear="true" :min="1" v-show="activityType1" v-model="maxIncome">
                <span slot="right" >元</span>
              </x-input>
            </group>
            <group title="" titleColor="#8ebf52">
              <x-switch title="固定金额分成" v-model="activityType2" @on-change="val=>{changeActivityType(val,2)}"></x-switch>
              <x-input title="分成金额"  placeholder="必填,每报名一人分成金额" type="number" :show-clear="true" :min="1" v-show="activityType2" v-model="fixedIncome">
                <span slot="right" >元</span>
              </x-input>
            </group>
            <div style='margin:4vw'>
              <x-button type="primary" @click.native="saveHuodongSetting">保存</x-button>
              <x-button @click.native="hideHuodongPopup" >取消</x-button>
            </div>
        </div>
    </popup>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import { XSwitch, Group, Popup, XInput, XButton } from 'vux'
  import api from '@/feature/league/api'
  import DetailTabbar from '@/components/DetailTabbar.vue'

  export default {
    components: {
      XSwitch, Group, DetailTabbar, Popup, XInput, XButton
    },
    data () {
      return {
        list: [],
        huodongPopup: false,
        activityType1: false,
        activityType2: false,
        dividendType: 0,
        incomePercentage: 0,
        maxIncome: 0,
        fixedIncome: 0,
        huodongIndex: -1,
        isLoadFinish: false // 防止switch自动调用方法
      }
    },
    mounted () {
      var leagueId = this.$route.params.leagueId
      api.getLeagueInfo({leagueId: this.$route.params.leagueId}, (leagueInfo) => {
        api.getLeagueFeatureList({leagueId}, (data) => {
          if (leagueInfo.isPublic) {
            for (var i = data.length - 1; i >= 0; i--) {
              var element = data[i]
              if (element.fCode === 'JIFENSHANGCHENG') {
                data.splice(i, 1)
                continue
              }
            }
          }
          this.list = data
        }, () => {})
      }, () => {})
      this.$nextTick(() => {
        this.isLoadFinish = true
      })
    },
    methods: {
      changeSwitchStatus (isExist, featureId, fCode, index) {
        var isShow = false
        if (fCode === 'HUODONG' && isExist === true) {
          this.huodongPopup = true
          this.huodongIndex = index
        } else {
          isShow = true
        }
        if (isShow && this.isLoadFinish) {
          this.saveSetting(featureId, isExist)
        }
      },
      saveSetting (featureId, isExist) {
        var leagueId = this.$route.params.leagueId
        api.saveFeature({leagueId, featureId, isExist}, (data) => {
          if (isExist) {
            this.tools.successToast('设置成功')
          } else {
            this.tools.successToast('取消成功')
          }
        }, () => {})
      },
      initActivityDividendSetting () {
        var leagueId = this.$route.params.leagueId
        api.getLeagueActivityDividendSetting({leagueId}, (data) => {
          if (data.dividendType === 1) {
            this.activityType1 = true
            this.activityType2 = false
            this.incomePercentage = data.incomePercentage
            this.maxIncome = data.maxIncome
            this.fixedIncome = 0
          } else if (data.dividendType === 2) {
            this.activityType2 = true
            this.activityType1 = false
            this.fixedIncome = data.fixedIncome
            this.incomePercentage = 0
            this.maxIncome = 0
          }
          this.dividendType = data.dividendType
        }, () => {})
      },
      saveHuodongSetting () {
        var featureId = this.list[this.huodongIndex].featureId
        var leagueId = this.$route.params.leagueId
        var dividendType = this.dividendType
        var incomePercentage = this.incomePercentage
        var maxIncome = this.maxIncome
        var fixedIncome = this.fixedIncome
        if (incomePercentage > 100) {
          this.tools.warnToast('分成百分比最大为100%')
          return
        }
        api.saveLeagueActivityDividendSetting({leagueId, dividendType, incomePercentage, maxIncome, fixedIncome}, (data) => {
          this.saveSetting(featureId, true)
          // this.isLoadFinish = false
          this.huodongPopup = false
          // this.list[this.huodongIndex].isExist = true
          // this.$nextTick(() => {
          //   this.isLoadFinish = true
          // })
        }, () => {})
      },
      hideHuodongPopup () {
        this.isLoadFinish = false
        this.huodongPopup = false
        this.list[this.huodongIndex].isExist = false
        this.$nextTick(() => {
          this.isLoadFinish = true
        })
      },
      changeActivityType (val, type) {
        if (val === true) {
          this.dividendType = type
          if (type === 1) {
            this.activityType1 = true
            this.activityType2 = false
            this.fixedIncome = 0
          } else if (type === 2) {
            this.activityType2 = true
            this.activityType1 = false
            this.incomePercentage = 0
            this.maxIncome = 0
          }
        } else {
          if (type === 1) {
            this.activityType1 = false
            this.incomePercentage = 0
            this.maxIncome = 0
          } else if (type === 2) {
            this.activityType2 = false
            this.fixedIncome = 0
          }
        }
      }
    }
  }
</script>

<style>
.popup1 {
  width:100%;
  height:100%;
  }
</style>

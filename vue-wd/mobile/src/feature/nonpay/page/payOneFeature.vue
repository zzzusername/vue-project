<template>
  <div>
    <card>
      <p slot="content" class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-text" >
        <img :src="tools.cdn(userInfo.userIcon,'logo.png')"  class="pay-user-info-logo jhy-text-middle">
        <span style="color:#a2d268">{{userInfo.userName}}</span>
      </p>
    </card>
    <group>
      <p class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-text-xs jhy-border-color jhy-border-bottom jhy-link-muted" >
        可选套餐
      </p>
      <checker  type="radio" default-item-class="feature-item" selected-item-class="feature-item-selected" v-model="selectedFeature" @on-change="changeFeatureList">
        <div  v-show="showfeatrue || index < 3" v-for="(featureItem, index) in featureList" >
          <div v-if="featureItem.features.length == 1" class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-text jhy-border-color jhy-border-bottom" style="overflow: hidden;">
            <span v-bind:class="featureItem.features[0].fIcon" class="feature-icon iconfont  jhy-inline-block jhy-fl jhy-margin-right-xs" v-bind:style="{ background:featureItem.features[0].fColor}"></span>
            <checker-item :value="featureItem" class="jhy-fr">
                <span class="iconfont icon-xuanze-1" ></span>
            </checker-item>
            <span class="jhy-block">
              {{featureItem.features[0].fName}}
            </span>
            <span class="jhy-link-muted jhy-text-xs jhy-block">价格：{{featureItem.monthPrice}}元/月/群</span>
          </div>
          <div v-if="featureItem.features.length > 1" class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-text jhy-border-color jhy-border-bottom" >
            <p>
              {{featureItem.packageName}}
              <checker-item :value="featureItem" class="jhy-fr">
                <span class="iconfont icon-xuanze-1" ></span>
              </checker-item>
            </p>
              <span class="jhy-link-muted jhy-text-xs">价格：{{featureItem.monthPrice}}元/月/群</span>
            <div class="jhy-padding-horizontal-xl jhy-link-muted jhy-text-xs">
                说明：{{featureItem.packageDesc}}
                <flexbox :gutter="0" wrap="wrap">
                      <flexbox-item :span="1/3" :key="index" v-for="(featureItem, index) in featureItem.features ">
                        <div class="flex-demo jhy-flex-demo jhy-text-left">
                          <span v-bind:class="featureItem.fIcon" class="iconfont" v-bind:style="{ color:featureItem.fColor}"></span>
                          <span>{{featureItem.fName}}</span>
                        </div>
                      </flexbox-item>
                </flexbox>
            </div>
          </div>
        </div>
        <p v-show="showloadmore" class="jhy-padding-vertical-sm jhy-padding-horizontal jhy-text-xs jhy-text-center jhy-link-muted" @click="loadmorefeature(false)">
          <span class="iconfont icon-gengduogongneng  jhy-margin-right-xs jhy-text-middle jhy-text-xs"></span>
          更多功能
        </p>
      </checker>
      <p class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-text-xs jhy-border-color jhy-border-bottom jhy-link-muted" >
        购买方式
      </p>
      <p class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-link-muted jhy-text" style="overflow: hidden;">
          <checker v-model="payitems"  default-item-class="pay-date-item " selected-item-class="pay-date-item-selected " disabled-item-class="pay-date-item-selected " style="overflow: hidden;" class="jhy-padding-left-xl">
            <span class="jhy-block jhy-margin-top-sm">
              <checker-item value="month" class="jhy-margin-right-xs" @on-item-click="onItemClick" :disabled="monthdisabled">
                <span class="iconfont icon-xuanze-"></span>
              </checker-item>
              <span>按月购买（<span>{{paymonthsum}}</span>元/月）</span>
              <checker-item value="month" class="jhy-fr" @on-item-click="onItemClick" >
                <com-number :min="0" :max="9" width="25px" class="jhy-inline-block jhy-text-middle" v-model="monthValue"></com-number>
                <span>月</span>
              </checker-item>
            </span>
            <span class="jhy-block jhy-margin-top-sm">
              <checker-item value="year" class="jhy-margin-right-xs" @on-item-click="onItemClick" :disabled="yeardisabled">
                <span class="iconfont icon-xuanze-"></span>
              </checker-item>
              <span>按年购买（<span>{{payyearsum}}</span>元/年）</span>
              <checker-item value="year" class="jhy-fr" @on-item-click="onItemClick">
                <com-number :min="0" :max="3" width="25px" class="jhy-inline-block jhy-text-middle" v-model="yearValue"></com-number>
                <span>年</span>
              </checker-item>
            </span>
          </checker>
          <x-button type="primary" action-type="button" class="jhy-background-warning jhy-text jhy-margin-vertical-xl" @click.native="openFeature()" :disabled="payButtonDisabled">
            总计¥<span>{{paysum}}</span> 立即支付
          </x-button>
          <toast v-model="showToastValue" position="bottom"  :time="1500" type="text"><span class="jhy-text">{{showToastText}}</span></toast>
      </p>
     </group>
  </div>
</template>

<script>
import ComNumber from '@/components/ComNumber.vue'
import { mapGetters } from 'vuex'
import { XButton, Card, Group, Cell, Flexbox, FlexboxItem, Checker, CheckerItem, XNumber, Toast } from 'vux'
import api from '../api'
export default {
  watch: {
    monthValue (newValue, old) {
      this.$nextTick(() => {
        this.paysum = (this.monthValue * this.paymonthsum).toFixed(2)
        if ((this.monthValue > 0 || this.yearValue > 0) && this.paysum > 0) {
          this.payButtonDisabled = false
        } else {
          this.payButtonDisabled = true
        }
      })
    },
    yearValue (newValue, old) {
      this.$nextTick(() => {
        this.paysum = (this.yearValue * this.payyearsum).toFixed(2)
        if ((this.monthValue > 0 || this.yearValue > 0) && this.paysum > 0) {
          this.payButtonDisabled = false
        } else {
          this.payButtonDisabled = true
        }
      })
    }
  },
  methods: {
    changeFeatureList () {
      var selectedFeature = this.selectedFeature
      var monthSum = 0
      var yearSum = 0
      monthSum = (monthSum + selectedFeature.monthPrice).toFixed(2)
      yearSum = (yearSum + selectedFeature.yearPrice).toFixed(2)
      if (isNaN(monthSum)) {
        this.paymonthsum = 0
      } else {
        this.paymonthsum = monthSum
      }
      if (isNaN(yearSum)) {
        this.payyearsum = 0
      } else {
        this.payyearsum = yearSum
      }
      var paysum = 0
      if (this.yearValue > 0) {
        paysum = (this.yearValue * this.payyearsum).toFixed(2)
      } else if (this.monthValue > 0) {
        paysum = (this.monthValue * this.paymonthsum).toFixed(2)
      }
      if (isNaN(paysum)) {
        this.paysum = 0
      } else {
        this.paysum = paysum
      }
      if ((this.monthValue > 0 || this.yearValue > 0) && this.paysum > 0) {
        this.payButtonDisabled = false
      } else {
        this.payButtonDisabled = true
      }
    },
    onItemClick (value, disabled) {
      if (value === 'month') {
        this.monthdisabled = true
        this.yeardisabled = false
        this.yearValue = 0
      } else if (value === 'year') {
        this.monthdisabled = false
        this.yeardisabled = true
        this.monthValue = 0
      }
    },
    openFeature () {
      var monthValue = this.monthValue
      var yearValue = this.yearValue
      var packageId = this.selectedFeature.packageId
      var orgId = this.$route.params.orgId
      api.openFeature({orgId, packageId, yearValue, monthValue}, map => {
        var orderId = map.orderId
        this.tools.setPaySuccessLink(null)
        this.$router.replace({name: 'payIndex', params: { orderId: orderId }})
      },
      (error) => {
        if (error.errorCode !== 99999999) {
          this.showToastText = error.message
          this.toastWidth = '20em'
          this.showToastValue = true
        } else {
          this.$router.replace({name: 'payError', params: { errorCode: 99999999 }})
        }
      })
    },
    loadmorefeature (flage) {
      if (flage) {
        if (this.featureList.length <= 3) {
          this.showloadmore = false
          this.showfeatrue = true
        } else {
          this.showloadmore = true
          this.showfeatrue = false
        }
      } else {
        this.showloadmore = false
        this.showfeatrue = true
      }
    }
  },
  computed: mapGetters({
    userInfo: 'userInfo'
  }),
  created () {
    var orgId = this.$route.params.orgId
    var featureId = this.$route.params.featureId
    document.title = '开通群功能'
    api.getPackageListByFeatureId({orgId, featureId}, list => {
      this.featureList = list
      this.loadmorefeature(true)
    },
    () => {
      this.showToastText = '功能列表加载失败，请刷新重试'
      this.toastWidth = '20em'
      this.showToastValue = true
    })
  },
  components: {
    XButton, Card, Group, Cell, Flexbox, FlexboxItem, Checker, CheckerItem, XNumber, ComNumber, Toast
  },
  data () {
    return {
      showfeatrue: false,
      showloadmore: false,
      payButtonDisabled: true,
      yearValue: 0,
      monthValue: 0,
      paymonthsum: 0,
      payyearsum: 0,
      paysum: 0,
      selectedFeature: {},
      featureList: [],
      toastWidth: '7.6em',
      showToastValue: false,
      showToastText: '',
      payitems: '',
      monthdisabled: false,
      yeardisabled: false
    }
  }
}
</script>

<style>
.pay-user-info-logo{
  width: 8vw;
  height: 8vw;
  border-radius: 10rem;
  min-width:8vw; 
  min-height:8vw;
  border:1px solid #e5e5e5;
}
.feature-item{
  color: #cecece;
}
.feature-item-selected{
  color: #a2d268;
}
.feature-icon {
    margin: auto;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 5rem;
    text-align: center;
    line-height: 2.5rem;
    font-size: 1.5rem;
    color: #fff;
}
.pay-date-item{
    color: #999999!important;
}
.pay-date-item-selected{
    color: #f36d21!important;
}
</style>

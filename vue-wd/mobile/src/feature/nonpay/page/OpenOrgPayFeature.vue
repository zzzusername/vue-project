<template>
  <div>
    <card>
      <p slot="content" class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-text" >
        <img :src="tools.cdn(userInfo.userIcon,'logo.png')"  class="pay-user-info-logo jhy-text-middle">
        <span style="color:#a2d268">{{userInfo.userName}}</span>
      </p>
    </card>
    <group>
      <div class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-text jhy-border-color jhy-border-bottom" >
        您正在为［<span>{{chatRoomInfo.chatroomName||'微信群'}}</span>］开通群管理服务。
      </div>
      <div class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-text-xs jhy-border-color jhy-border-bottom jhy-link-muted" >
        基础服务（必选）
      </div>
      <checker  type="checkbox" default-item-class="feature-item" selected-item-class="feature-item-selected" v-model="isRequireFeatureList" @on-change="changeFeatureList">
        <div v-for="featureItem in featureItems" class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-text jhy-border-color jhy-border-bottom" v-if="featureItem.isRequire && featureItem.features.length > 1">
          <p>
            {{featureItem.packageName}}
            <span class="jhy-link-muted jhy-text-xs">价格：{{featureItem.monthPrice}}元/月/群</span>
            <checker-item :value="featureItem" class="jhy-fr" disabled>
              <span class="iconfont icon-xuanze-1" ></span>
            </checker-item>
          </p>
          <div class="jhy-link-muted jhy-text-xs">
              说明：{{featureItem.packageDesc}}
              <flexbox :gutter="0" wrap="wrap">
                <flexbox-item :span="1/3" v-for="(featureItem,index) in featureItem.features " :key="index" >
                  <div class="flex-demo jhy-flex-demo jhy-text-left">
                    <span v-bind:class="featureItem.fIcon" class="iconfont" v-bind:style="{ color:featureItem.fColor}"></span>
                    <span>{{featureItem.fName}}</span>
                  </div>
                </flexbox-item>
              </flexbox>
           </div>
        </div>
        <div v-for="featureItem in featureItems" class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-text jhy-border-color jhy-border-bottom" style="overflow: hidden;" v-if="featureItem.isRequire && featureItem.features.length == 1">
          <span v-bind:class="featureItem.features[0].fIcon" class="feature-icon iconfont  jhy-inline-block jhy-fl jhy-margin-right-xs" v-bind:style="{ background:featureItem.features[0].fColor}"></span>
          <checker-item :value="featureItem" class="jhy-fr" disabled>
              <span class="iconfont icon-xuanze-1" ></span>
          </checker-item>
          <span class="jhy-block">
            {{featureItem.features[0].fName}}
          </span>
          <span class="jhy-link-muted jhy-text-xs jhy-block">价格：{{featureItem.monthPrice}}元/月/群</span>
        </div>
      </checker>
      <p class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-text-xs jhy-border-color jhy-border-bottom jhy-link-muted" >
        高级功能
      </p>
      <checker  type="checkbox" default-item-class="feature-item" selected-item-class="feature-item-selected" v-model="ckeckFeatureList" @on-change="changeFeatureList">
        <div  v-show="showfeatrue || index < 3" v-for="(featureItem, index) in noRequireFeatureList" >
          <div v-if="featureItem.isRequire==false && featureItem.features.length == 1" class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-text jhy-border-color jhy-border-bottom" style="overflow: hidden;">
            <span v-bind:class="featureItem.features[0].fIcon" class="feature-icon iconfont  jhy-inline-block jhy-fl jhy-margin-right-xs" v-bind:style="{ background:featureItem.features[0].fColor}"></span>
            <checker-item :value="featureItem" class="jhy-fr">
                <span class="iconfont icon-xuanze-1" ></span>
            </checker-item>
            <span class="jhy-block">
              {{featureItem.features[0].fName}}
            </span>
            <span class="jhy-link-muted jhy-text-xs jhy-block">价格：{{featureItem.monthPrice}}元/月/群</span>
          </div>
          <div v-if="featureItem.isRequire==false && featureItem.features.length > 1" class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-text jhy-border-color jhy-border-bottom" >
            <p>
              {{featureItem.packageName}}
              <span class="jhy-link-muted jhy-text-xs">价格：{{featureItem.monthPrice}}元/月/群</span>
              <checker-item :value="featureItem" class="jhy-fr">
                <span class="iconfont icon-xuanze-1" ></span>
              </checker-item>
            </p>
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
          <checker v-model="payitems" type="radio" default-item-class="pay-date-item " disabled-item-class="pay-date-item-selected " selected-item-class="pay-date-item-selected " style="overflow: hidden;" class="jhy-padding-left-xl">
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
          <div class="jhy-padding-horizontal jhy-margin-vertical-lg">
            <x-button v-show="isShowSchoolPay" plain type="default" action-type="button" class="jhy-text custom-primary-red jhy-margin-vertical-sm" @click.native="openBySchool()" style="color:#f36d21;border-color:#f36d21;" >
              使用学校授权(剩余 {{schoolRemainOrgNum}} 个)
            </x-button>
            <x-button type="primary" action-type="button" class="jhy-background-warning jhy-text jhy-margin-vertical-sm"  @click.native="openChatRoom({randomId: $route.params.randomId})" :disabled="payButtonDisabled">
              总计¥<span>{{paysum}}</span> 立即支付
            </x-button>
          </div>
          <toast v-model="showToastValue" position="bottom"  :time="1500" type="text"><span class="jhy-text">{{showToastText}}</span></toast>
      </p>
     </group>
  </div>
</template>

<script>
import ComNumber from '@/components/ComNumber.vue'
import { mapGetters, mapActions } from 'vuex'
import { XButton, Card, Group, Cell, Flexbox, FlexboxItem, Checker, CheckerItem, XNumber, Toast } from 'vux'
import * as types from '../types'
import api from '../api'
import userApi from '../../user/api'
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
    ...mapActions({
      getChatRoomInfo: types.GET_CHAT_ROOM_INFO
    }),
    openChatRoom (randomId) {
      var monthValue = this.monthValue
      var yearValue = this.yearValue
      var isRequireFeatureList = this.isRequireFeatureList
      var ckeckFeatureList = this.ckeckFeatureList
      api.openChatRoom({randomId, monthValue, yearValue, isRequireFeatureList, ckeckFeatureList}, map => {
        var orgId = map.orgId
        var orderId = map.orderId
        this.tools.setPaySuccessLink({name: 'paySuccess', params: { orgId: orgId }})
        this.$router.replace({name: 'payIndex', params: { orderId: orderId }})
      },
      (error) => {
        if (error.errorCode === '100001') {
          this.showToastText = '群已经存在'
          this.toastWidth = '20em'
          this.showToastValue = true
        } else {
          if (error.errorCode !== 99999999) {
            this.showToastText = error.message
            this.toastWidth = '20em'
            this.showToastValue = true
          } else {
            this.$router.replace({name: 'payError', params: { errorCode: 99999999 }})
          }
        }
      })
    },
    getUserInfo () {
      userApi.getUserInfo(userInfo => {
        this.userInfo = userInfo
      },
      () => {
      })
    },
    getFeatureList () {
      api.getFeatureList(list => {
        this.featureItems = list
        this.loadmorefeature(true)
        this.initFeatureList()
      },
      () => {
        this.showToastText = '功能列表加载失败，请刷新重试'
        this.toastWidth = '20em'
        this.showToastValue = true
      })
    },
    checkUser (randomId) {
      api.checkUser({randomId}, data => {
      },
      (error) => {
        var errcode = error.errCode
        this.$router.replace({name: 'payError', params: { errorCode: errcode }})
      })
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
    loadmorefeature (flage) {
      if (flage) {
        if (this.featureItems.length <= 3) {
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
    },
    changeFeatureList () {
      var featureList = this.ckeckFeatureList
      var monthSum = 0
      var yearSum = 0
      featureList.forEach(feature => {
        monthSum = monthSum + feature.monthPrice
        yearSum = yearSum + feature.yearPrice
      })
      this.paymonthsum = (monthSum + this.isRequiremonthsum).toFixed(2)
      this.payyearsum = (yearSum + this.isRequireyearsum).toFixed(2)
      if (this.yearValue > 0) {
        this.paysum = (this.yearValue * this.payyearsum).toFixed(2)
      } else if (this.monthValue > 0) {
        this.paysum = (this.monthValue * this.paymonthsum).toFixed(2)
      }
    },
    initFeatureList () {
      var featureItems = this.featureItems
      var noRequireFeatures = []
      var isRequireFeatures = []
      var monthSum = 0
      var yearSum = 0
      featureItems.forEach(feature => {
        if (!feature.isRequire) {
          noRequireFeatures.push(feature)
        } else {
          monthSum += feature.monthPrice
          yearSum += feature.yearPrice
          isRequireFeatures.push(feature)
        }
      })
      this.paymonthsum = monthSum
      this.payyearsum = yearSum
      this.isRequiremonthsum = monthSum
      this.isRequireyearsum = yearSum
      this.noRequireFeatureList = noRequireFeatures
      this.isRequireFeatureList = isRequireFeatures
    },
    checkSchoolPay () {
      api.getSchoolRemainOrgNum(data => {
        if (data.result > 0) {
          this.schoolRemainOrgNum = data.result
          this.isShowSchoolPay = true
        } else {
          this.isShowSchoolPay = false
        }
      })
    },
    openBySchool () {
      api.openBySchool({randomId: this.$route.params.randomId},
        data => {
          this.$router.replace({name: 'paySuccess', params: { orgId: data.result }})
        },
        er => {
          var errcode = er.errCode
          this.$router.replace({name: 'payError', params: { errorCode: errcode }})
        })
    }
  },
  computed: {
    ...mapGetters({
      chatRoomInfo: types.CHAT_ROOM_INFO,
      errorCode: types.GET_CHAT_ROOM_ERROR,
      userInfo: 'userInfo'
    })
  },
  created () {
    document.title = '开通群服务'
    this.getChatRoomInfo({
      randomId: this.$route.params.randomId,
      cb: cb => {
      },
      er: er => {
        var errcode = er.errCode
        this.$router.replace({name: 'payError', params: { errorCode: errcode }})
      }
    })
    this.getFeatureList()
    this.getUserInfo()
    this.checkSchoolPay() // 检查是否出现学校授权按钮
  },
  components: {
    XButton, Card, Group, Cell, Flexbox, FlexboxItem, Checker, CheckerItem, XNumber, ComNumber, Toast
  },
  data () {
    return {
      payitems: '',
      monthValue: 0,
      yearValue: 0,
      showfeatrue: false,
      showloadmore: false,
      paymonthsum: 0,
      payyearsum: 0,
      isRequiremonthsum: 0,
      isRequireyearsum: 0,
      paysum: 0,
      payButtonDisabled: true,
      ckeckFeatureList: [],
      toastWidth: '7.6em',
      isRequireFeatureList: [],
      noRequireFeatureList: [],
      featureItems: [],
      showToastValue: false,
      showToastText: '',
      monthdisabled: false,
      yeardisabled: false,
      userInfo: {},
      isShowSchoolPay: false,
      schoolRemainOrgNum: 0
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

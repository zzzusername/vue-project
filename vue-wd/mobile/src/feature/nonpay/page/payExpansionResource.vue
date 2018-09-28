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
      <checker  type="radio" default-item-class="feature-item" selected-item-class="feature-item-selected" v-model="selectedFeature" @on-change="changeExpansionList">
        <div v-show="showfeatrue || index < 3" v-for="(resourceItem, index) in resourceList" :key="index">
          <div class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-text jhy-border-color jhy-border-bottom" >
            <p>
              <span v-bind:class="resourceItem.resourcesIcon" class="feature-icon iconfont  jhy-inline-block jhy-fl jhy-margin-right-xs" v-bind:style="{ background:resourceItem.resourcesColor}"></span>
              {{resourceItem.resourcesName}}
              <checker-item :value="resourceItem" class="jhy-fr">
                <span class="iconfont icon-xuanze-1" ></span>
              </checker-item>
            </p>
              <span class="jhy-link-muted jhy-text-xs">价格：{{resourceItem.resourcesPrice}}</span>
            <div class="jhy-padding-horizontal-xl jhy-link-muted jhy-text-xs">
                说明：{{resourceItem.resourcesDes}}
            </div>
          </div>
          
        </div>
         <p v-show="showloadmore" class="jhy-padding-vertical-sm jhy-padding-horizontal jhy-text-xs jhy-text-center jhy-link-muted" @click="loadmorefeature(false)">
          <span class="iconfont icon-gengduogongneng  jhy-margin-right-xs jhy-text-middle jhy-text-xs"></span>
          更多功能
        </p>
      </checker>
      <p class="jhy-padding-vertical-xs jhy-padding-horizontal jhy-link-muted jhy-text" style="overflow: hidden;">
          <x-button type="primary" action-type="button" class="jhy-background-warning jhy-text jhy-margin-vertical-xl" @click.native="payExpansion()" :disabled="payButtonDisabled">
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
  methods: {
    payExpansion () {
      var packageId = this.selectedFeature.id
      api.payExpansion({packageId}, map => {
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
    changeExpansionList () {
      var selectedFeature = this.selectedFeature
      var paysum = selectedFeature.resourcesPrice
      if (isNaN(paysum)) {
        this.paysum = 0
      } else {
        this.paysum = paysum
      }
      if (this.paysum > 0) {
        this.payButtonDisabled = false
      } else {
        this.payButtonDisabled = true
      }
    },
    loadmorefeature (flage) {
      if (flage) {
        if (this.resourceList.length <= 3) {
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
    initList () {
      if (this.resourceList.length > 3) {
        this.loadmorefeature(true)
      }
    }
  },
  computed: mapGetters({
    userInfo: 'userInfo'
  }),
  created () {
    document.title = '购买扩展资源包'
    var type = this.$route.params.type
    api.getExpansionResPackageList({type}, list => {
      this.resourceList = list
      this.initList()
    },
    () => {
      this.showToastText = '列表加载失败，请刷新重试'
      this.toastWidth = '20em'
      this.showToastValue = true
    })
  },
  components: {
    XButton, Card, Group, Cell, Flexbox, FlexboxItem, Checker, CheckerItem, XNumber, ComNumber, Toast
  },
  data () {
    return {
      selectedFeature: {},
      resourceList: [],
      payButtonDisabled: true,
      paysum: 0,
      showToastValue: false,
      showToastText: '',
      toastWidth: '7.6em',
      showfeatrue: false,
      showloadmore: false
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

<template>
  <div>
    <group title="产品线下交易支持手动开通">
      <cell v-for="(item,index) in list" :key="index" :title="item.schoolName" @click.native="onItemClick(item)" :is-link="item.payStatus !== true">
        <p slot="inline-desc">学校名称：{{item.attach.schoolName}}</p>
        <p slot="inline-desc" v-if="item.attach.isExperience">购买套餐：10个群：<span style="color:#FF6D56;">体验／15天</span></p>
        <p slot="inline-desc" v-else-if="!item.attach.isExperience">购买套餐：{{item.attach.orgNum}}个群：{{item.orderPrice}}元{{item.attach.year + item.attach.month}}</p>
        <p class="agent-copy-p" slot="inline-desc"><span>购买人：{{item.userName}}&nbsp;&nbsp;&nbsp;</span><span>业务员：{{item.salesmanName}}</span></p>
        <p slot="value" v-if="item.payStatus==false" style="color:#FF6D56">未开通</p>
        <p slot="value" v-else-if="item.payStatus==true" style="color:#8ebf52">已开通</p>
      </cell>
    </group>
    <p v-if="isShowDefaultText" style="text-align:center;font-size: 16px;padding: 20px 15px;fontSize:16px;color:#a2a2a2">没有客户购买记录</p>
    <confirm v-model="isShow"
      :title="'您确定开通['+schoolName+']吗？'"
      @on-confirm="onConfirm">
        <p style="text-align:center;">购买人：{{currentItem.userName}}</p>
        <p style="text-align:center;color:#FF6D56;margin-top:.3rem;">代理商抵扣金额：¥{{currentItem.agentDeductionMoney}}</p>
      </confirm>
  </div>
</template>

<script>
import { Group, Cell, Confirm } from 'vux'
import api from '../api'
export default {
  components: {
    Group, Cell, Confirm
  },
  data () {
    return {
      list: [],
      isShow: false,
      currentItem: {},
      isShowDefaultText: false,
      dateTime: {},
      schoolName: ''
    }
  },
  mounted () {
    api.getCommunityProductList((data) => {
      data.forEach((element) => {
        element.attach = JSON.parse(element.attach)
        if (element.attach.packageMonth / 12 !== 0) {
          element.attach.year = '/' + parseInt(element.attach.packageMonth / 12) + '年'
        } else {
          element.attach.year = ''
        }
        if (element.attach.packageMonth % 12 !== 0) {
          element.attach.month = '/' + element.attach.packageMonth % 12 + '月'
        } else {
          element.attach.month = ''
        }
      })
      this.list = data
      if (this.list.length === 0) {
        this.isShowDefaultText = true
      }
    }, () => {
      this.isShowDefaultText = true
    })
  },
  methods: {
    onItemClick (item) {
      if (item.payStatus === true) {
        return
      }
      this.currentItem = item
      this.schoolName = this.currentItem.attach.schoolName
      this.isShow = true
    },
    onConfirm () {
      api.openCommunityProduct({orderId: this.currentItem.orderId}, (data) => {
        this.tools.successToast('开通成功')
        this.currentItem.payStatus = true
      }, (err) => {
        if (err.toUser) {
          this.tools.warnToast(err.message, '180px')
        } else {
          this.tools.warnToast('开通失败')
        }
      })
    }
  }
}
</script>

<style>
.agent-copy-p{
  -webkit-touch-callout:default !important;  /*系统默认菜单被禁用*/
  -webkit-user-select:all !important; /*webkit浏览器*/ 
  user-select:all !important;   
}
</style>

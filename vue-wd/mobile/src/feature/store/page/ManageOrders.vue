<template>
  <div>
    <flexbox style='height:50px;background:#fff;border-bottom:1px solid #EDEDED' :gutter="0">
      <flexbox-item :span="159/320" @click.native="onTabClick" style="-webkit-tap-highlight-color:rgba(0,0,0,0)!important"><div class="tab-item">商品管理</div></flexbox-item>
      <flexbox-item style="minWidth: 1px;"><div class="tab-divider"></div></flexbox-item>
      <flexbox-item :span="160/320"><div class="tab-item-sel">订单管理</div></flexbox-item>
    </flexbox>
    <group style="height:40px;background-color:#fff;">
      <div class="store-tab-div" v-bind:style="{ color:divColor1}" v-on:click="onTab('untreated_all')">全部待办</div>
      <div class="store-tab-div" v-bind:style="{ color:divColor2}" v-on:click="onTab('pay')">待发货</div>
      <div class="store-tab-div" v-bind:style="{ color:divColor3}" v-on:click="onTab('send')">已发货</div>
      <div class="store-tab-div" v-bind:style="{ color:divColor4}" v-on:click="onTab('over_all')">已完成</div>
    </group>
    <scroller use-pullup lock-x height="-160" ref="scroller" @on-pullup-loading="loadMore" v-model="status">
      <div>
        <cell style="background-color:#fff" v-for="(item,index) in list" :key="index" :title="item.psgName" is-link @click.native="onManage(item)">
          <div slot="after-title" style="color:#666;font-size:12px;margin-top:3px">买家：{{item.userName}}  </br> <span style="margin-left:0px">订单号：</span><span style="color:#A2D268">{{item.psoSn}}</span></div>
          <span v-if="currentOrderStatus=='untreated_all'" slot="value" style="font-size:12px">{{getStatusName(item.psoStatus)}}</span>
          <x-img slot="icon" :src="tools.cdn(item.psgMainImg, 'logo.png', 128)" class="jhy-cell-img"></x-img>
        </cell>
      </div>
      <div slot="pullup" style="position: absolute; width: 100%; height: 40px; margin-top:5px; text-align: center; font-size:16px;">
        <span v-show="status.pullupStatus === 'default'">{{ pullupStatusText }}</span>
        <span v-show="status.pullupStatus === 'loading'">加载中...</span>
      </div>
    </scroller>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import {Flexbox, FlexboxItem, Group, Cell, Scroller, XImg, Actionsheet} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/store/api'
export default {
  components: {
    DetailTabbar,
    Flexbox,
    FlexboxItem,
    Group,
    Cell,
    Scroller,
    XImg,
    Actionsheet
  },
  data () {
    return {
      divColor1: '#8ebf52',
      divColor2: '#666',
      divColor3: '#666',
      divColor4: '#666',
      list: [],
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      pullupStatusText: '',
      currentOrderStatus: 'untreated_all'
    }
  },
  mounted () {
    this.getOrders('untreated_all')
  },
  methods: {
    onManage (item) {
      if (this.$route.params.orgManagementId !== undefined) {
        this.$router.push({name: 'storeOrgManageOrderDetail', params: {psoSn: item.psoSn}})
      } else {
        this.$router.push({name: 'storeLeagueManageOrderDetail', params: {psoSn: item.psoSn}})
      }
    },
    onTab (status) {
      this.currentOrderStatus = status
      this.tabColor(status)
      this.list = []
      this.getOrders(status)
    },
    tabColor (status) {
      this.divColor1 = '#666'
      this.divColor2 = '#666'
      this.divColor3 = '#666'
      this.divColor4 = '#666'
      if (status === 'untreated_all') {
        this.divColor1 = '#8ebf52'
      } else if (status === 'pay') {
        this.divColor2 = '#8ebf52'
      } else if (status === 'send') {
        this.divColor3 = '#8ebf52'
      } else if (status === 'over_all') {
        this.divColor4 = '#8ebf52'
      }
    },
    onTabClick () {
      if (this.$route.params.orgManagementId !== undefined) {
        this.$router.replace({name: 'storeOrgManageProducts', params: {orgManagementId: this.$route.params.orgManagementId}})
      } else {
        this.$router.replace({name: 'storeLeagueManageProducts', params: {leagueId: this.$route.params.leagueId}})
      }
    },
    getOrders (status) {
      api.getManageOrders({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, psoStatus: status, rowStart: this.list.length, rowCount: 20}, (data) => {
        var refresh = false
        if (this.list.length === 0) {
          refresh = true
        }
        this.list.push(...data)
        if (this.list.length === 0) {
          this.pullupStatusText = '暂无相关订单'
        } else if (data.length === 0) {
          this.pullupStatusText = '没有更多了'
        } else {
          this.pullupStatusText = ''
        }
        this.$nextTick(() => {
          if (refresh) {
            this.$refs.scroller.donePullup()
            this.$refs.scroller.reset({top: 0})
          } else {
            this.$refs.scroller.reset()
          }
        })
      }, () => {})
    },
    loadMore () {
      this.getOrders(this.currentOrderStatus)
    },
    getStatusName (status) {
      if (status === 'pay') {
        return '待发货'
      } else if (status === 'return_money') {
        return '退款中'
      } else if (status === 'return') {
        return '退货中'
      }
    }
  }
}
</script>

<style>
.tab-item-sel {
  text-align: center;
  color: #A2D268;
  font-size: 16px;
}
.tab-item {
  text-align: center;
  color: #000;
  font-size: 16px;
}
.store-tab-div{
  display:table-cell;
  font-size: 15px;
  height: 40px;
  line-height:40px;
  padding-left:15px;
  -webkit-tap-highlight-color:rgba(0,0,0,0)!important;
}
</style>

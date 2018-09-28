<template>
  <div>
    <div style="background-color:#fff;border-bottom:1px solid #ededed">
      <tab :line-width="3" style='width:120px;' >
        <tab-item style="background-size:100% 0px!important" selected @on-item-click="onItemClick(1)">全部</tab-item>
        <tab-item style="background-size:100% 0px!important" @on-item-click="onItemClick(2)" >昨日</tab-item>
      </tab>
    </div>
    <scroller use-pullup lock-x height="-50" ref="scroller" @on-pullup-loading="loadMore" v-model="status">
      <div>
        <cell style="font-size:16px;background:#fff" v-for="(item, index) in list" :key="index" :title="item.description" :inline-desc="getDateTime(item.createTime)">
          <b style="font-size:18px;color:#222">{{item.payType === 1 ? '-' + item.payPrice : '+' + item.payPrice}}</b>
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
  import {Group, Cell, Scroller, dateFormat, Tab, TabItem} from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/wallet/api'
  export default {
    components: {
      Group,
      Cell,
      Scroller,
      DetailTabbar,
      Tab,
      TabItem
    },
    data () {
      return {
        rowCount: 20,
        list: [],
        pullupStatusText: '',
        status: {
          pullupStatus: 'default',
          pulldownStatus: 'default'
        },
        isHasMore: true
      }
    },
    mounted () {
      this.getBillFlow()
    },
    methods: {
      getBillFlow (date) {
        api.getBillFlow({rowStart: this.list.length, rowCount: this.rowCount, date}, (data) => {
          if (data.length === 0) {
            this.pullupStatusText = '没有更多了'
            this.isHasMore = false
          }
          this.list.push(...data)
          this.$nextTick(() => {
            this.$refs.scroller.donePullup()
            this.$refs.scroller.reset()
          })
        }, () => {})
      },
      loadMore () {
        if (this.isHasMore) {
          this.getBillFlow()
        } else {
          this.pullupStatusText = '没有更多了'
          this.$nextTick(() => {
            this.$refs.scroller.donePullup()
            this.$refs.scroller.reset()
          })
        }
      },
      getDateTime(time) {
        return dateFormat(time, 'YYYY/MM/DD HH:mm')
      },
      onItemClick (type) {
        this.$refs.scroller.reset({top: 0})
        if (type === 1) {
          this.list = []
          this.getBillFlow()
        } else if (type === 2) {
          this.list = []
          var day = new Date()
          day.setTime(day.getTime() - 24 * 60 * 60 * 1000)
          this.getBillFlow(dateFormat(day, 'YYYY-MM-DD'))
        }
      }
    }
  }
</script>

<style>
</style>


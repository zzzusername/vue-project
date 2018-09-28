<template>
  <div>
    <scroller use-pullup lock-x height="-90" ref="scroller" v-show="list.length > 0" @on-pullup-loading="loadMore" v-model="status"
      :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中...'}">
      <div>
        <div v-for="(item, index) in list" :key="index">
          <div class="org_user_list_item">
            <img class="org_user_list_icon" :src="tools.cdn(item.hand, 'head.png', 128)">
            <div class="org_user_list_info jhy-text-default"><span>{{tools.getLength(item.nickName)>20?tools.subStr(item.nickName,20):item.nickName}}</span></div>
            <span class="org_user_list_integral jhy-link-muted">消息数：{{item.count}}</span>
          </div>
        </div>
      </div>
      <div slot="pullup" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'">{{ pullupStatusText }}</span>
        <span v-show="status.pullupStatus === 'loading'">加载中...</span>
      </div>
    </scroller>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import { Scroller } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/count/api'
  export default {
    components: {
      DetailTabbar,
      Scroller
    },
    data() {
      return {
        list: [],
        status: {
          pullupStatus: 'default',
          pulldownStatus: 'default'
        },
        pullupStatusText: '',
        dateType: this.$route.params.countDateType,
        date: this.$route.params.countDate,
        apiType: this.$route.params.listType,
        rowCount: 20
      }
    },
    mounted () {
      this.getUserList()
    },
    methods: {
      vipClass (index) {
        return 'user-vip' + index
      },
      getUserList () {
        api.getOrgUserList({orgId: this.$route.params.orgId, type: this.dateType, date: this.date, rowStart: this.list.length, rowCount: this.rowCount, apiType: this.apiType}, (data) => {
          this.list.push(...data.result)
          if (data.result.length === 0) {
            this.pullupStatusText = '没有更多了'
          }
          this.$nextTick(() => {
            this.$refs.scroller.reset()
            this.$refs.scroller.donePullup()
          })
        }, () => {})
      },
      loadMore () {
        this.getUserList()
      }
    }
  }
</script>

<style>
  .org_user_list_icon {
    height: 50px;
    width: 50px;
    float: left;
    top: 0;
    left: 0;
    background-position: center center;
    background-size: cover; 
  }
  .org_user_list_info{
    overflow: hidden;
    margin-left: 60px;
  }
  .org_user_list_integral{
    margin-left: 10px;
    margin-top:5px;
    float: left;
  }
  .org_user_list_item {
    overflow: hidden;
    position:relative;
    padding: 10px 10px;
    border-bottom: #efeff4 solid 1px;
    background-color: #fff;
  }
  .user-vip1 {
    background-color:#6ce8e1;
    color:white;
    padding: 0px 3px 0px 3px;
    border-radius:2px;
    font-size:9px;
    vertical-align:middle;
  }
  .user-vip2 {
    background-color:#fec12d;
    color:white;
    padding: 0px 3px 0px 3px;
    border-radius:2px;
    font-size:9px;
    vertical-align:middle;
  }
  .user-vip3 {
    background-color:#ff595a;
    color:white;
    padding: 0px 3px 0px 3px;
    border-radius:2px;
    font-size:9px;
    vertical-align:middle;
  }
  .user-level {
    background-color:#A2D268;
    color:white;
    padding: 0px 3px 0px 3px;
    border-radius:2px;
    font-size:9px;
    vertical-align:middle;
  }
</style>


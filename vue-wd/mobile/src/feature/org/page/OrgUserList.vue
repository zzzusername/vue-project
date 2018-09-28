<template>
  <div>
    <tab custom-bar-width="80px">
      <!--<tab-item @on-item-click="onTabClick">昨日排名</tab-item>
      <tab-item @on-item-click="handler">月排名</tab-item>-->
      <tab-item selected @on-item-click="onRunk(3)">总排名</tab-item>
      <tab-item @on-item-click="onRunk(4)">VIP用户</tab-item>
    </tab>
    <scroller use-pullup lock-x height="-90" ref="scroller" v-if="list.length > 0" @on-pullup-loading="loadMore" v-model="status"
      :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中...'}">
      <div>
        <div v-for="(item, index) in list" :key="index">
          <div class="org_user_list_item">
            <img class="org_user_list_icon" :src="tools.cdn(item.userIcon, 'head.png', 128)">
            <div class="org_user_list_info jhy-text-default"><span>{{tools.getLength(item.userName)>20?tools.subStr(item.userName,20):item.userName}}</span>&nbsp;<span v-if="item.levelName !== null" class="user-level">{{item.levelName}}</span>&nbsp;<span v-if="item.vipName !== null" :class="vipClass(item.vipId)">{{item.vipName}}</span></div>
            <span class="org_user_list_integral jhy-link-muted">积分：{{item.score}}</span>
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
import { Tab, TabItem, Scroller } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/org/api'
export default {
  components: {
    Tab,
    TabItem,
    Scroller,
    DetailTabbar
  },
  data () {
    return {
      list: [],
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      rowStart: 0,
      pullupStatusText: '',
      isVip: false,
      isRefresh: false
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
      api.getUserList({orgId: this.$route.params.orgId, rowStart: this.list.length, rowCount: 20, order: 'score', isVip: this.isVip}, (data) => {
        this.list.push(...data)
        if (data.length === 0) {
          this.pullupStatusText = '没有更多了'
        }
        this.$nextTick(() => {
          this.isRefresh = false
          if (this.isRefresh) {
            this.$refs.scroller.reset({top: 0})
          } else {
            this.$refs.scroller.reset()
          }
          this.$refs.scroller.donePullup()
        })
      }, () => {})
    },
    loadMore () {
      this.getUserList()
    },
    onRunk (index) {
      this.list = []
      this.isRefresh = true
      if (index === 3) {
        this.isVip = false
      } else if (index === 4) {
        this.isVip = true
      }
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


<template>
  <div>
    <scroller lock-x height="-50" ref="scroller" use-pullup :pullup-config="pullUpConfig" @on-pullup-loading="loadMore">
      <div>
        <org-hand :title="$route.meta.title" featureCode="QIANDAO"></org-hand>
        <div v-if="signInfo !== null" style="backgroundColor:#fff;overflow:hidden;paddingTop:10px;">
          <img style="display:block;width:50px;height:50px;borderRadius:25px;margin:0 auto 5px;" :src="tools.cdn(signInfo.userInfo.userIcon)">
          <p style="textAlign:center;fontSize:14px">{{signInfo.userInfo.userName}}</p>
          <p style="textAlign:center;fontSize:12px;">
            <span v-if="signInfo.userInfo.levelName!=null" style="backgroundColor: #FDBF4B;padding:3px;borderRadius:3px;color:#fff;">{{signInfo.userInfo.levelName}}</span>&nbsp;
            <span>积分:{{signInfo.userInfo.score}}</span>
          </p>
          <p style="textAlign:center;fontSize:12px;margin:5px 0 10px;">{{signInfo.signInfo.description}}</p>
          <!--<p style="textAlign:center;fontSize:12px;margin:5px 0 10px;">恭喜您签到获得<span style="color:red">8</span>积分，连续签到<span>2</span>天奖励<span>6</span>积分</p>-->
        </div>
        <div v-if="signInfo !== null" style="overflow:hidden;marginTop:1px;backgroundColor:#fff;padding:10px">
          <div style="float:left;width:33.33%;">
            <p style="overflow:hidden;textAlign:center;fontSize:14px;">{{signInfo.signInfo.totalNum}}</p>
            <p style="overflow:hidden;textAlign:center;fontSize:12px;color:#999">累计签到</p>
          </div>
          <div style="float:left;width:33.33%;">
            <p style="overflow:hidden;textAlign:center;fontSize:14px;">{{signInfo.signInfo.todayNo}}</p>
            <p style="overflow:hidden;textAlign:center;fontSize:12px;color:#999">今日排名</p>
          </div>
          <div style="float:left;width:33.33%;">
            <p style="overflow:hidden;textAlign:center;fontSize:14px;">{{signInfo.signNum}}</p>
            <p style="overflow:hidden;textAlign:center;fontSize:12px;color:#999">今日已签</p>
          </div>
        </div>
        <div style="overflow:hidden;marginTop:10px;backgroundColor:#fff;padding:10px">
          <p style="float:left;width:49.5%;textAlign:center;border-right:1px #d9d9d9 solid" @click="$router.push({name: 'SignSetInfo'})">
            <span class="icon-qunqiandao iconfont" style="fontSize:14px;color:#FDBF4B;marginRight:5px;"></span>签到规则</p>
          <p style="float:left;width:50%;textAlign:center" @click="skipPointsStore">
            <span class="icon-add-point iconfont" style="fontSize:14px;color:#FA7072;marginRight:5px;"></span>积分换礼</p>
        </div>
        <tab style="marginTop: 10px;" :line-width="1" custom-bar-width="60px">
          <tab-item selected @on-item-click="onItemClick('today')">今日排名</tab-item>
          <tab-item @on-item-click="onItemClick('month')">本月排名</tab-item>
          <tab-item @on-item-click="onItemClick('total')">总排名</tab-item>
        </tab>
        <div v-if="rankingList.length>0" v-for="(item, index) in rankingList" :key="index" style="overflow:hidden;padding:10px;backgroundColor:#fff;" class="jhy-1px-b">
          <span v-if="index === 0" class="iconfont icon-xunzhang" style="fontSize:20px;color:rgb(242,192,86);marginRight:5px;lineHeight:30px;float:left"></span>
          <span v-else-if="index === 1" class="iconfont icon-xunzhang" style="fontSize:20px;color:rgb(233,233,216);marginRight:5px;lineHeight:30px;float:left"></span>
          <span v-else-if="index === 2" class="iconfont icon-xunzhang" style="fontSize:20px;color:rgb(186,110,64);marginRight:5px;lineHeight:30px;float:left"></span>
          <span v-else class="iconfont icon-vip" style="fontSize:20px;color:#fff;marginRight:5px;lineHeight:30px;float:left"></span>
          <img width="30px" height="30px" style="borderRadius:15px;float:left" :src="tools.cdn(item.userIcon)">
          <p style="float:left;lineHeight:30px;marginLeft:5px;fontSize:14px;">{{item.userName}}</p>
          <p style="float:right;lineHeight:30px;color:#999;fontSize:12px;">{{formateDate(item.signDate, item.monthNum, item.totalNum)}}</p>
        </div>
        <div v-if="rankingList.length==0" style="textAlign:center;marginTop:30px;color:#999;">快来签到吧～</div>
      </div>
    </scroller>
    <detail-tabbar :actionLink="signIn" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
import OrgHand from '@/feature/org/components/OrgHand.vue'
import { Scroller, Tab, TabItem, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/signin/api'
import { mapGetters } from 'vuex'

export default {
  components: {
    OrgHand, Scroller, Tab, TabItem, DetailTabbar
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  data() {
    return {
      signInfo: null,
      rankingList: [],
      orderbyTodayList: [],
      orderbyMonthList: [],
      orderbyTotalList: [],
      pullUpConfig: {
        content: '',
        downContent: '松开进行加载',
        upContent: '上拉加载更多',
        loadingContent: '加载中...'
      },
      currentTab: 'today',
      actions: [{
        name: '签到',
        code: 'sign'
      }]
    }
  },
  mounted() {
    var orgId = this.$route.params.orgId
    api.getUserSignInfo({ orgId }, (info) => {
      if (info.isTodaySign) {
        this.actions = [
          {
            name: '已签到',
            code: 'signed',
            color: 'rgb(181, 181, 181)'
          }
        ]
      } else {
        this.actions = [{
          name: '签到',
          code: 'sign'
        }]
      }
      this.signInfo = info
      this.getRanking('today', 0, (val) => {
        this.orderbyTodayList = val
        this.rankingList = val
        if (val.length >= 0 && val.length < 20) {
          this.$refs.scroller.disablePullup()
        } else {
          this.$refs.scroller.donePullup()
        }
        this.resetScroller()
      })
    }, () => { })
  },
  methods: {
    skipPointsStore() {
      if (this.userInfo.isHaveStore) {
        this.$router.push({ name: 'storeHome' })
      } else {
        this.tools.toast('群主还未开通积分商城', '180px')
      }
    },
    onItemClick(val) {
      this.currentTab = val
      this.$refs.scroller.enablePullup()
      this.rankingList = []
      switch (val) {
        case 'today':
          this.getRanking(val, 0, (list) => {
            this.orderbyTodayList = list
            this.rankingList = this.orderbyTodayList
            if (list.length >= 0 && list.length < 20) {
              this.$refs.scroller.disablePullup()
            } else {
              this.$refs.scroller.donePullup()
            }
            this.resetScroller()
          })
          break
        case 'month':
          this.getRanking(val, 0, (list) => {
            this.orderbyMonthList = list
            this.rankingList = this.orderbyMonthList
            if (list.length >= 0 && list.length < 20) {
              this.$refs.scroller.disablePullup()
            } else {
              this.$refs.scroller.donePullup()
            }
            this.resetScroller()
          })
          break
        case 'total':
          this.getRanking(val, 0, (list) => {
            this.orderbyTotalList = list
            this.rankingList = this.orderbyTotalList
            if (list.length >= 0 && list.length < 20) {
              this.$refs.scroller.disablePullup()
            } else {
              this.$refs.scroller.donePullup()
            }
            this.resetScroller()
          })
          break
      }
    },
    loadMore() {
      console.log('loadmore')
      this.$refs.scroller.enablePullup()
      var rowStart = 0
      var val = this.currentTab
      switch (val) {
        case 'today':
          rowStart = this.orderbyTodayList.length
          this.getRanking(val, rowStart, (list) => {
            this.orderbyTodayList = this.orderbyTodayList.concat(list)
            this.rankingList = this.orderbyTodayList
            if (list.length >= 0 && list.length < 20) {
              this.$refs.scroller.disablePullup()
            } else {
              this.$refs.scroller.donePullup()
            }
            this.resetScroller()
          })
          break
        case 'month':
          rowStart = this.orderbyMonthList.length
          this.getRanking(val, rowStart, (list) => {
            this.orderbyMonthList = this.orderbyMonthList.concat(list)
            this.rankingList = this.orderbyMonthList
            if (list.length >= 0 && list.length < 20) {
              this.$refs.scroller.disablePullup()
            } else {
              this.$refs.scroller.donePullup()
            }
            this.resetScroller()
          })
          break
        case 'total':
          rowStart = this.orderbyTotalList.length
          this.getRanking(val, rowStart, (list) => {
            this.orderbyTotalList = this.orderbyTotalList.concat(list)
            this.rankingList = this.orderbyTotalList
            if (list.length >= 0 && list.length < 20) {
              this.$refs.scroller.disablePullup()
            } else {
              this.$refs.scroller.donePullup()
            }
            this.resetScroller()
          })
          break
      }
    },
    signIn (code) {
      if (code === 'signed') {
        return
      }
      api.userSignIn({ orgId: this.$route.params.orgId }, (val) => {
        if (val !== null && val.rs !== undefined && val.rs === 1) {
          this.tools.successToast('签到成功')
          this.actions = [
            {
              name: '已签到',
              code: 'signed',
              color: 'rgb(181, 181, 181)'
            }
          ]
          var orgId = this.$route.params.orgId
          api.getUserSignInfo({ orgId }, (info) => {
            this.signInfo = info
            this.getRanking('today', 0, (val) => {
              this.orderbyTodayList = val
              this.rankingList = val
              if (val.length >= 0 && val.length < 20) {
                this.$refs.scroller.disablePullup()
              } else {
                this.$refs.scroller.donePullup()
              }
              this.resetScroller()
            })
          }, () => { })
        }
      }, (val) => {
        if (val.toUser !== undefined && val.toUser) {
          this.tools.warnToast(val.message, '180px')
        }
      })
    },
    getRanking(order, rowStart, callback) {
      api.getSignInRanking({ orgId: this.$route.params.orgId, order, rowStart, rowCount: 20 }, (list) => {
        callback(list)
      }, () => { })
    },
    formateDate(time, monthNum, totalNum) {
      var current = this.currentTab
      var formateTime = ''
      switch (current) {
        case 'today':
          formateTime = dateFormat(time, 'HH:mm') + '签到'
          break
        case 'month':
          formateTime = '签到' + monthNum + '次'
          break
        case 'total':
          formateTime = '签到' + totalNum + '次'
          break
      }
      return formateTime
    },
    resetScroller() {
      this.$nextTick(() => {
        this.$refs.scroller.reset()
      })
    }
  }
}
</script>

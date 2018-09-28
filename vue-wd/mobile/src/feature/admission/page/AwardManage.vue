<template>
  <div> 
    <tab custom-bar-width="120px">
      <tab-item selected @on-item-click="onItemClick">待审核兑奖</tab-item>
      <tab-item @on-item-click="onItemClick">已完成兑奖</tab-item>
    </tab>
    <scroller v-show="tabIndex==0" lock-x height="-100" use-pullup :pullup-config="pullUpConfig" @on-pullup-loading="loadMore" ref="scroller">
      <div>
        <group v-if="delayList.length>0" gutter="-1px">
          <cell v-for="(item, index) in delayList" :key="index" :title="item.userName" @click.native="onAudit(item)" value="审核" is-link>
            <div slot="icon" class="admission_awardmanage_usericon" :style="{'background-image':'url('+tools.cdn(item.userIcon)+')'}" src=""></div>
            <p slot="inline-desc" style="color:#666;fontSize:12px;">{{item.rewardName}}</p>
            <p slot="inline-desc" style="color:#666;fontSize:12px;">兑奖时间：{{getFormateTime(item.applyTime)}}</p>
          </cell>
        </group>
        <p v-if="delayList.length==0" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">没有待审核兑奖信息～</p>
      </div>
    </scroller>
    <scroller v-show="tabIndex==1" lock-x height="-100" use-pullup :pullup-config="pullUpConfig" @on-pullup-loading="loadMore" ref="scroller2">
      <div>
        <group v-if="alreadyList.length>0" gutter="-1px">
          <cell v-for="(item, index) in alreadyList" :key="index" :title="item.userName" @click.native="onAudit(item)" is-link>
            <div slot="icon" class="admission_awardmanage_usericon" :style="{'background-image':'url('+tools.cdn(item.userIcon)+')'}" src=""></div>
            <p slot="inline-desc" style="color:#666;fontSize:12px;">{{item.rewardName}}</p>
            <p slot="inline-desc" style="color:#666;fontSize:12px;">{{item.checkStatus==3?'已兑奖':'已拒绝'}}</p>
          </cell>
        </group>
        <p v-if="alreadyList.length==0" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">没有已审核兑奖信息～</p>
      </div>
    </scroller>
    <redeemInfo :isShow="isShowRedeemInfo" :goBack="goBack" :returnData="returnData" :defaultData="defaultData"></redeemInfo>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import {Tab, TabItem, Scroller, Cell, Group, dateFormat} from 'vux'
import RedeemInfo from '../components/RedeemInfo'
import api from '@/feature/admission/api'
export default {
  components: {
    Tab, TabItem, DetailTabbar, Scroller, Cell, Group, dateFormat, RedeemInfo
  },
  data () {
    return {
      delayList: [],
      alreadyList: [],
      pullUpConfig: {
        content: '',
        downContent: '松开进行加载',
        upContent: '上拉加载更多',
        loadingContent: '加载中...'
      },
      tabIndex: 0,
      isShowRedeemInfo: false,
      defaultData: {}
    }
  },
  mounted () {
    this.loadMore()
  },
  methods: {
    getFormateTime (time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    loadMore () {
      if (this.tabIndex === 0) {
        this.loadDelayList()
      } else if (this.tabIndex === 1) {
        this.loadAlreadyList()
      }
    },
    loadDelayList () {
      // 1待审核 2 已拒绝 3 已发奖
      api.getAwardAuditList({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.$route.params.admissionId, auditStatus: 1, rowStart: this.delayList.length, rowCount: 20}, (data) => {
        this.delayList.push(...data)
        this.$nextTick(() => {
          this.$refs.scroller.reset()
        })
        if (data.length === 0 || data.length < 20) {
          this.$refs.scroller.disablePullup()
        } else {
          this.$refs.scroller.donePullup()
        }
      }, () => {})
    },
    loadAlreadyList () {
      api.getAwardAuditList({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.$route.params.admissionId, auditStatus: 2, rowStart: this.alreadyList.length, rowCount: 20}, (data) => {
        this.alreadyList.push(...data)
        this.$nextTick(() => {
          this.$refs.scroller.reset()
        })
        if (data.length === 0 || data.length < 20) {
          this.$refs.scroller.disablePullup()
        } else {
          this.$refs.scroller.donePullup()
        }
      }, () => {})
    },
    onItemClick (index) {
      this.delayList = []
      this.alreadyList = []
      this.tabIndex = index
      this.loadMore()
    },
    onAudit (item) {
      this.defaultData.orgId = this.$route.params.orgManagementId
      this.defaultData.leagueId = this.$route.params.leagueId
      this.defaultData.guideId = this.$route.params.admissionId
      this.defaultData.deputyGiveRewardId = item.id
      this.defaultData.userName = item.userName
      this.isShowRedeemInfo = true
    },
    goBack () {
      this.isShowRedeemInfo = false
    },
    returnData (id) {
      if (this.tabIndex === 0) {
        var index = -1
        for (var i = 0; i < this.delayList.length; i++) {
          var item = this.delayList[i]
          if (item.id === id) {
            index = i
            break
          }
        }
        if (index >= 0) {
          this.delayList.splice(index, 1)
        }
      }
    }
    // skipDetail (item) {
    //   // inviteDeputyId
    //   this.$router.push({name: 'admissionMyCount', params: {myOrgId: item.orgId, admissionId: item.guideId}})
    // },
    // skipAdmissionDetail (item) {
    //   this.$router.push({name: 'admissionMyDetail', params: {myOrgId: item.orgId, admissionId: item.guideId}})
    // }
  }
}
</script>
<style>
.admission_awardmanage_usericon {
  width: 50px;
  height: 50px;
  display: block;
  margin: 0 auto;
  background-position: center center;
  background-size: cover;
  margin-right:5px;
}
</style>

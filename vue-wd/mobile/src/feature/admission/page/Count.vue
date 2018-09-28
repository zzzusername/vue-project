<template>
  <div :style="{'height': listHeight + 'px', 'position': 'relative'}">
    <scroller :on-infinite="infinite" ref="count_scroller">
      <!-- <p v-for="i in 20" :key="i">{{i}}</p> -->
      <div style="backgroundColor:#fff;" ref="count_top">
        <div class="admission_user_icon" :style="{'background-image':'url('+tools.cdn(deputyInfo.userIcon)+')'}"></div>
        <p style="textAlign:center;">
          <span>{{deputyInfo.userName}}</span>&nbsp;
          <!-- <span style="backgroundColor:red;">{{deputyInfo}}</span> -->
        </p>
        <p style="textAlign:center;">【
          <span>{{deputyInfo.guideTitle}}</span>】招生代表</p>
        <p style="textAlign:center;">{{deputyInfo.deputyRewardUnit+": "+deputyInfo.invitePointsTotal}}</p>
        <div>
          <div style="display:flex;margin: 5px 10px;">
            <p style="flex:1;textAlign:center;">报名人数: {{deputyInfo.applyNum}}</p>
            <p style="flex:1;textAlign:center;">核实报名: {{deputyInfo.verifyApplyNum}}</p>
          </div>
        </div>
        <tab custom-bar-width="5em">
          <tab-item selected @on-item-click="handler(0)">报名人</tab-item>
          <tab-item @on-item-click="handler(1)">下级代理</tab-item>
          <tab-item @on-item-click="handler(2)">兑奖记录</tab-item>
        </tab>
        <group gutter="0" v-if="currentItem === 0">
          <cell style="backgroundColor:#fff" v-for="(item, index) in studentList" :key="index" :title="item.applyUserName">
            <p style="marginTop:5px;" slot="inline-desc">
              <!-- <span>{{item.applyStatus}}</span>&nbsp; -->
              <span>{{item.checkStatus}}</span>
            </p>
            <div slot="icon" class="count_user_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon)+')'}"></div>
          </cell>
        </group>
        <group gutter="0" v-if="currentItem === 1">
          <cell style="backgroundColor:#fff" v-for="(item, index) in deputyList" :key="index" :title="item.userName">
            <p style="marginTop:5px;" slot="inline-desc">
              <span>下级：{{item.subDeputyNum}}</span>&nbsp;
              <span>报名：{{item.applyNum}}</span>&nbsp;
              <span>审核：{{item.verifyApplyNum}}</span>
            </p>
            <div slot="icon" class="count_user_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon)+')'}"></div>
          </cell>
        </group>
        <group gutter="0" v-if="currentItem === 2">
          <cell style="backgroundColor:#fff" v-for="(item, index) in exchangeList" :key="index" :title="item.rewardName" :value="exchangeStatus(item.checkStatus)">
            <p slot="inline-desc">
              <span>{{formatTime(item.applyTime)}}</span>
            </p>
            <p>{{item.checkStatus === 1 ? '待审核' : item.checkStatus === 2 ? '已拒绝' : item.checkStatus === 3 ? '已发奖' : ''}}</p>
          </cell>
        </group>
        <detail-tabbar></detail-tabbar>
      </div>
    </scroller>
  </div>
</template>

<script>
import { Tab, TabItem, Cell, Group, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Tab, TabItem, DetailTabbar, Cell, Group
  },
  data() {
    return {
      listHeight: 0,
      deputyInfo: {},
      currentItem: 0,
      studentList: [],
      deputyList: [],
      exchangeList: []
    }
  },
  mounted() {
    this.listHeight = window.innerHeight - 100
    api.getDeputyInfo({ orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.$route.params.admissionId, deputyId: this.$route.params.deputyId }, (data) => {
      this.deputyInfo = data
    }, (er) => { })
    this.getDeputySignUpList(0, (data) => {
      this.studentList = data
    })
  },
  methods: {
    handler(index) {
      this.currentItem = index
      this.$refs.count_scroller.resize()
      switch (index) {
        case 0:
          this.getDeputySignUpList(0, (data) => {
            this.studentList = data
          })
          break
        case 1:
          this.getDeputySubDeputyList(0, (data) => {
            this.deputyList = data
          })
          break
        case 2:
          this.getExchangeList(0, (data) => {
            this.exchangeList = data
          })
          break
      }
    },
    infinite(done) {
      if (this.studentList.length === 0 && this.currentItem === 0) {
        done(true)
        return
      } else if (this.deputyList.length === 0 && this.currentItem === 1) {
        done(true)
        return
      } else if (this.exchangeList.length === 0 && this.currentItem === 2) {
        done(true)
        return
      }
      switch (this.currentItem) {
        case 0:
          this.getDeputySignUpList(this.studentList.length, (data) => {
            if (data === null || data.length === 0) {
              done(true)
              return
            }
            this.studentList = this.studentList.concat(data)
            done()
          })
          break
        case 1:
          this.getDeputySubDeputyList(this.deputyList.length, (data) => {
            if (data === null || data.length === 0) {
              done(true)
              return
            }
            this.deputyList = this.deputyList.concat(data)
            done()
          })
          break
        case 2:
          this.getExchangeList(this.exchangeList.length, (data) => {
            if (data === null || data.length === 0) {
              done(true)
              return
            }
            this.exchangeList = this.exchangeList.concat(data)
            done()
          })
          break
      }
    },
    formatTime(time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    exchangeStatus(status) {
      var str = ''
      switch (status) {
        case 1:
          str = '待审核'
          break
        case 2:
          str = '已拒绝'
          break
        case 3:
          str = '已发奖'
          break
      }
      return str
    },
    getDeputySignUpList(rowStart, callback) {
      api.getDeputySignUpList({ orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.$route.params.admissionId, deputyId: this.$route.params.deputyId, rowStart, rowCount: 20 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser) {
          this.tools.toast(er.message)
        }
      })
    },
    getDeputySubDeputyList(rowStart, callback) {
      api.getDeputySubDeputyList({ orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.$route.params.admissionId, userId: this.$route.params.userId, rowStart, rowCount: 20 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser) {
          this.tools.toast(er.message)
        }
      })
    },
    getExchangeList(rowStart, callback) {
      api.getExchangeList({ orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.$route.params.admissionId, deputyId: this.$route.params.deputyId, rowStart, rowCount: 20 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser) {
          this.tools.toast(er.message)
        }
      })
    }
  }
}
</script>

<style>
.admission_user_icon {
  width: 60px;
  height: 60px;
  display: block;
  margin: 5px auto;
  background-position: center center;
  background-size: cover;
  border-radius: 30px;
}

.count_user_icon {
  width: 50px;
  height: 50px;
  display: block;
  margin-right: 5px;
  background-position: center center;
  background-size: cover;
}
</style>

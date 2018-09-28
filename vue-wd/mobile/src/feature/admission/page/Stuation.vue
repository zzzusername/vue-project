<template>
  <!-- 判断是否有招生代表的状态 -->
  <div :style="{'height': listHeight + 'px', 'position': 'relative'}">
    <!-- :on-refresh="refresh" :style="{'top': listMarginTop + 'px', 'height': listHeight + 'px'}"  -->
    <!--:style="{'height': listHeight + 'px', backgroundColor: '#fff'}"  -->
    <scroller :on-infinite="infinite" ref="stuation_scroller" style="overflow:hidden">
      <div style="backgroundColor:#fff;">
        <p style="textAlign:center;fontSize:16px;paddingTop:10px;">{{stuationInfo===null || stuationInfo.guideTitle === '' ? '标题' : stuationInfo.guideTitle}}</p>
        <p style="textAlign:center;">截止日期：
          <span>{{formateTime(stuationInfo.closeDate)}}</span>&nbsp;
          <span :style="{'backgroundColor': stuationInfo.guideStatus === 1 ? '#A2D268' : '#FF6D56', 'padding': '1px 3px', 'border-radius': '5px', 'color': '#fff', 'fontSize': '12px'}">{{stuationInfo.guideStatus === 1 ? '进行中' : stuationInfo.guideStatus === 2 ? '已结束' : ''}}</span>
        </p>
        <div style="display: flex;margin: 0 10px;">
          <div style="flex:1;textAlign:center;padding: 5px 0;margin:5px;border: 1px solid rgb(162, 210, 104);borderRadius:3px;">
            <p>招生代表</p>
            <p>{{stuationInfo === null || stuationInfo.deputyCount === null? 0 : stuationInfo.deputyCount}}</p>
          </div>
          <div style="flex:1;textAlign:center;padding: 5px 0;margin:5px;border: 1px solid rgb(162, 210, 104);borderRadius:3px;">
            <p>报名学生</p>
            <p>{{stuationInfo === null || stuationInfo.applyCount === null ? 0 : stuationInfo.applyCount}}</p>
          </div>
          <div style="flex:1;textAlign:center;padding: 5px 0;margin:5px;border: 1px solid rgb(162, 210, 104);borderRadius:3px;">
            <p>审核通过</p>
            <p>{{stuationInfo === null || stuationInfo.applyPassCount === null ? 0 : stuationInfo.applyPassCount}}</p>
          </div>
        </div>
        <tab custom-bar-width="5em" v-if="stuationInfo.isPowerDeputy">
          <tab-item selected @on-item-click="handler(0)">招生代表</tab-item>
          <tab-item @on-item-click="handler(1)">报名学生</tab-item>
        </tab>
      </div>
      <group v-if="currentItem === 0 && stuationInfo.isPowerDeputy" gutter='-1px'>
        <cell v-for="(item, index) in deputyList" :key="index" :title="item.userName" is-link @click.native="skipCount(item.deputyId, item.userId)">
          <p style="fontSize:14px;marginTop: 5px;" slot="inline-desc">
            <span>下级代表：{{item.subDeputyNum}} 人</span>&nbsp;
            <span>招生：{{item.applyNum}} 人</span>
          </p>
          <div slot="icon" class="stuation_user_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon)+')'}"></div>
        </cell>
      </group>
      <group v-else-if="!(stuationInfo.isPowerDeputy) || currentItem === 1" gutter='-1px'>
        <cell v-for="(item, index) in signUpList" :key="index" :title="item.userName" isLink @click.native="skipStudentDes(item.userId)">
          <p style="fontSize:14px;marginTop: 5px;" slot="inline-desc">
            <span>{{item.subject}}</span>
          </p>
          <div slot="icon" class="stuation_user_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon)+')'}"></div>
          <p style="fontSize:14px;">{{item.checkStatus === 1 ? '待审核' : item.checkStatus === 2 ? '已拒绝' : item.checkStatus === 3 ? '已通过' : ''}}</p>
        </cell>
      </group>
    </scroller>
    <detail-tabbar v-if="stuationInfo.isPowerDeputy" :actionLink="awardReview" :actions="actions"></detail-tabbar>
    <detail-tabbar v-else></detail-tabbar>
    <student-detail :show="showPopu" :studentId="studentId" :callback="changeStatus"></student-detail>
  </div>
</template>

<script>
import { Group, Tab, TabItem, Cell, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import StudentDetail from '../components/StudentDetail.vue'
import api from '../api'
export default {
  components: { Group, Tab, TabItem, DetailTabbar, Cell, StudentDetail },
  data() {
    return {
      actions: [{ name: '兑奖审核' }],
      listHeight: 0,
      stuationInfo: null,
      deputyList: [],
      signUpList: [],
      currentItem: 0,
      showPopu: false,
      studentId: null
    }
  },
  mounted() {
    this.listHeight = window.innerHeight - 100
    api.getStuationInfo({ orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.$route.params.admissionId }, (data) => {
      this.stuationInfo = data
      if (data.isPowerDeputy) {
        this.getDeputyList(0, (data) => {
          this.deputyList = data
          if (data.length < 20) {
            this.$refs.stuation_scroller.finishInfinite()
          } else {
            this.$refs.stuation_scroller.finishInfinite(true)
          }
        }, (er) => {
          this.tools.warnToast(er.message)
        })
      } else {
        this.getSignUpList(0, (data) => {
          this.signUpList = data
          if (data.length < 20) {
            this.$refs.stuation_scroller.finishInfinite()
          } else {
            this.$refs.stuation_scroller.finishInfinite(true)
          }
        }, (er) => {
          if (er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      }
    }, (er) => { })
  },
  methods: {
    changeStatus(data) {
      for (var i = 0; i < this.signUpList.length; i++) {
        if (this.signUpList[i].userId === data.userId) {
          this.signUpList[i].checkStatus = data.status
        }
      }
    },
    awardReview() {
      if (this.$route.params.orgManagementId !== undefined) {
        this.$router.push({ name: 'admissionOrgAwardManage', params: { orgManagementId: this.$route.params.orgManagementId, admissionId: this.$route.params.admissionId } })
      }
      if (this.$route.params.leagueId !== undefined) {
        this.$router.push({ name: 'admissionLeagueAwardManage', params: { leagueId: this.$route.params.leagueId, admissionId: this.$route.params.admissionId } })
      }
      // this.$router.push({ name: 'admissionAwardManage', params: {} })
    },
    handler(index) {
      this.currentItem = index
      switch (index) {
        case 0:
          this.getDeputyList(0, (data) => {
            this.deputyList = data
            if (data.length < 20) {
              this.$refs.stuation_scroller.finishInfinite(false)
            } else {
              this.$refs.stuation_scroller.finishInfinite(true)
            }
          }, (er) => {
            this.tools.toast('请求失败')
          })
          break
        case 1:
          this.getSignUpList(0, (data) => {
            this.signUpList = data
            if (data.length < 20) {
              this.$refs.stuation_scroller.finishInfinite(false)
            } else {
              this.$refs.stuation_scroller.finishInfinite(true)
            }
          }, (er) => {
            this.tools.toast('请求失败')
          })
          break
      }
    },
    skipCount(deputyId, userId) {
      if (this.$route.params.orgManagementId !== undefined) {
        this.$router.push({ name: 'admissionOrgCount', params: { orgManagementId: this.$route.params.orgManagementId, admissionId: this.$route.params.admissionId, deputyId: deputyId, userId: userId } })
      }
      if (this.$route.params.leagueId !== undefined) {
        this.$router.push({ name: 'admissionLeagueCount', params: { leagueId: this.$route.params.leagueId, admissionId: this.$route.params.admissionId, deputyId: deputyId, userId: userId } })
      }
    },
    skipStudentDes(id) {
      this.studentId = id
      this.showPopu = !this.showPopu
    },
    formateTime(time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    infinite(done) {
      if (this.deputyList.length === 0 && this.currentItem === 0) {
        done(true)
        return
      } else if (this.signUpList.length === 0 && this.currentItem === 1) {
        done(true)
        return
      }
      switch (this.currentItem) {
        case 0:
          this.getDeputyList(this.deputyList.length, (data) => {
            if (data.length === 0) {
              done(true)
              return
            }
            this.deputyList = this.deputyList.concat(data)
            this.bottom = this.deputyList.length
            done()
          }, (er) => {
            this.tools.toast('请求失败')
          })
          break
        case 1:
          this.getSignUpList(this.signUpList.length, (data) => {
            if (data.length === 0) {
              done(true)
              return
            }
            this.signUpList = this.signUpList.concat(data)
            this.bottom = this.signUpList.length
            done()
          }, (er) => {
            this.tools.toast('请求失败')
          })
          break
      }
    },
    getDeputyList(rowStart, cb, er) {
      api.getDeputyList({ orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.$route.params.admissionId, rowStart, rowCount: 20 }, (data) => {
        cb(data)
      }, (error) => {
        er(error)
      })
    },
    getSignUpList(rowStart, cb, er) {
      api.getSignUpList({ orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.$route.params.admissionId, rowStart, rowCount: 20 }, (data) => {
        cb(data)
      }, (error) => {
        er(error)
      })
    }
  }
}
</script>

<style>
.stuation_user_icon {
  width: 50px;
  height: 50px;
  display: block;
  margin-right: 5px;
  background-position: center center;
  background-size: cover;
}
</style>


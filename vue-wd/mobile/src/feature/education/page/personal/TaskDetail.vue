<template>
  <div>
    <group gutter="0">
      <cell v-if="$route.params.type == 1">
        <div slot="title">{{teacherPacketInfo.firstMoney}}元 (首次使用奖励)</div>
        <p slot="inline-desc" style="margin: 5px 0 0;">{{firstPacketHint}}</p>
      </cell>
      <cell v-if="$route.params.type == 2">
        <div slot="title">{{teacherPacketInfo.secondMoney}}元 (本月活跃奖励)</div>
        <p slot="inline-desc" style="margin: 5px 0 0;">{{secondPacketHint}}</p>
      </cell>
      <cell v-if="$route.params.type == 3">
        <div slot="title">{{teacherPacketInfo.thirdMoney}}元 (次月活跃奖励)</div>
        <p slot="inline-desc" style="margin: 5px 0 0;">{{thirdPacketHint}}</p>
      </cell>
    </group>
    <group title="任务进度" v-if="teacherPacketInfo.model && $route.params.type == 1">
      <flow orientation="vertical" style="height:350px;padding: 10px 15px;float: left">
        <flow-state style="text-align:center" state="0" title="创建班级" is-done></flow-state>
        <flow-line :is-done="teacherPacketInfo.model.taskStudent" tip="进行中" tip-direction="right"></flow-line>

        <flow-state state="1" :title="'至少添加'+teacherPacketInfo.studentNum+'个学生'" :is-done="teacherPacketInfo.model.taskStudent"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.taskStudent" tip="进行中" tip-direction="right" :is-done="teacherPacketInfo.model.taskParent"></flow-line>
        <flow-line v-else></flow-line>

        <flow-state state="2" :title="'至少有'+teacherPacketInfo.parentNum+'个家长完善信息'" :is-done="teacherPacketInfo.model.taskParent"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.taskParent" :is-done="teacherPacketInfo.model.taskFirstActive" :tip="'已活跃'+teacherPacketInfo.model.firstActiveNum+'天'" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>

        <flow-state state="3" :is-done="teacherPacketInfo.model.taskFirstActive">
          <p slot="title"><span>使用作业、成绩、公告、考勤、评语、留言<br>中的任意一项功能</span></p>
        </flow-state> 
        <!-- <flow-line v-if="teacherPacketInfo.model.taskParent" :is-done="teacherPacketInfo.model.taskFirstActive" :tip="'已活跃'+teacherPacketInfo.model.firstActiveNum+'天'" tip-direction="right"></flow-line> -->
        <flow-line :is-done="teacherPacketInfo.model.taskFirstActive"></flow-line>

        <flow-state state="4" title="完成" :is-done="teacherPacketInfo.model.taskFirstActive"></flow-state>
      </flow>
    </group>
    <group title="任务进度" v-if="teacherPacketInfo.model && $route.params.type == 2">
      <flow orientation="vertical" style="height:500px;padding: 10px 15px;float: left">
        <flow-state style="text-align:center" state="0" :title="'开始'" is-done></flow-state>
        <flow-line :is-done="teacherPacketInfo.model.secondActiveNum >= 1" tip="进行中" tip-direction="right"></flow-line>
        <flow-state style="text-align:center" state="1" :title="'活跃1天'" :is-done="teacherPacketInfo.model.secondActiveNum >= 1"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.secondActiveNum >= 1" :is-done="teacherPacketInfo.model.secondActiveNum >= 2" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="2" :title="'活跃2天'" :is-done="teacherPacketInfo.model.secondActiveNum >= 2"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.secondActiveNum >= 2" :is-done="teacherPacketInfo.model.secondActiveNum >= 3" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="3" :title="'活跃3天'" :is-done="teacherPacketInfo.model.secondActiveNum >= 3"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.secondActiveNum >= 3" :is-done="teacherPacketInfo.model.secondActiveNum >= 4" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="4" :title="'活跃4天'" :is-done="teacherPacketInfo.model.secondActiveNum >= 4"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.secondActiveNum >= 4" :is-done="teacherPacketInfo.model.secondActiveNum >= 5" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="5" :title="'活跃5天'" :is-done="teacherPacketInfo.model.secondActiveNum >= 5"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.secondActiveNum >= 5" :is-done="teacherPacketInfo.model.secondActiveNum >= 6" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="6" :title="'活跃6天'" :is-done="teacherPacketInfo.model.secondActiveNum >= 6"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.secondActiveNum >= 6" :is-done="teacherPacketInfo.model.secondActiveNum >= 7" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="7" :title="'活跃7天'" :is-done="teacherPacketInfo.model.secondActiveNum >= 7"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.secondActiveNum >= 7" :is-done="teacherPacketInfo.model.secondActiveNum >= 8" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="8" :title="'活跃8天'" :is-done="teacherPacketInfo.model.secondActiveNum >= 8"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.secondActiveNum >= 8" :is-done="teacherPacketInfo.model.secondActiveNum >= 9" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="9" :title="'活跃9天'" :is-done="teacherPacketInfo.model.secondActiveNum >= 9"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.secondActiveNum >= 9" :is-done="teacherPacketInfo.model.secondActiveNum >= 10" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="9" :title="'活跃10天'" :is-done="teacherPacketInfo.model.secondActiveNum >= 10"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.secondActiveNum >= 10" :is-done="teacherPacketInfo.model.secondActiveNum >= 10" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state state="10" title="完成" :is-done="teacherPacketInfo.model.secondActiveNum == 10"></flow-state>
      </flow>
    </group>
    <group title="任务进度" v-if="teacherPacketInfo.model && $route.params.type == 3">
      <flow orientation="vertical" style="height:500px;padding: 10px 15px;float: left">
        <flow-state style="text-align:center" state="0" :title="'开始'" is-done></flow-state>
        <flow-line :is-done="teacherPacketInfo.model.thirdActiveNum >= 1" tip="进行中" tip-direction="right"></flow-line>
        <flow-state style="text-align:center" state="1" :title="'活跃1天'" :is-done="teacherPacketInfo.model.thirdActiveNum >= 1"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.thirdActiveNum >= 1" :is-done="teacherPacketInfo.model.thirdActiveNum >= 2" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="2" :title="'活跃2天'" :is-done="teacherPacketInfo.model.thirdActiveNum >= 2"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.thirdActiveNum >= 2" :is-done="teacherPacketInfo.model.thirdActiveNum >= 3" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="3" :title="'活跃3天'" :is-done="teacherPacketInfo.model.thirdActiveNum >= 3"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.thirdActiveNum >= 3" :is-done="teacherPacketInfo.model.thirdActiveNum >= 4" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="4" :title="'活跃4天'" :is-done="teacherPacketInfo.model.thirdActiveNum >= 4"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.thirdActiveNum >= 4" :is-done="teacherPacketInfo.model.thirdActiveNum >= 5" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="5" :title="'活跃5天'" :is-done="teacherPacketInfo.model.thirdActiveNum >= 5"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.thirdActiveNum >= 5" :is-done="teacherPacketInfo.model.thirdActiveNum >= 6" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="6" :title="'活跃6天'" :is-done="teacherPacketInfo.model.thirdActiveNum >= 6"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.thirdActiveNum >= 6" :is-done="teacherPacketInfo.model.thirdActiveNum >= 7" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="7" :title="'活跃7天'" :is-done="teacherPacketInfo.model.thirdActiveNum >= 7"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.thirdActiveNum >= 7" :is-done="teacherPacketInfo.model.thirdActiveNum >= 8" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="8" :title="'活跃8天'" :is-done="teacherPacketInfo.model.thirdActiveNum >= 8"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.thirdActiveNum >= 8" :is-done="teacherPacketInfo.model.thirdActiveNum >= 9" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="9" :title="'活跃9天'" :is-done="teacherPacketInfo.model.thirdActiveNum >= 9"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.thirdActiveNum >= 9" :is-done="teacherPacketInfo.model.thirdActiveNum >= 10" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state style="text-align:center" state="9" :title="'活跃10天'" :is-done="teacherPacketInfo.model.thirdActiveNum >= 10"></flow-state>
        <flow-line v-if="teacherPacketInfo.model.thirdActiveNum >= 10" :is-done="teacherPacketInfo.model.thirdActiveNum >= 10" tip="进行中" tip-direction="right"></flow-line>
        <flow-line v-else></flow-line>
        <flow-state state="10" title="完成" :is-done="teacherPacketInfo.model.thirdActiveNum == 10"></flow-state>
      </flow>
    </group>
    <detail-tabbar v-if="$route.params.type == 1" :actionLink="goTask" :actions="actions"></detail-tabbar>
    <detail-tabbar v-if="$route.params.type == 2 || $route.params.type == 3"></detail-tabbar>
    <div>
      <alert v-model="showAlert" title="提示"> {{ alertHint }}</alert>
    </div>
  </div>
</template>

<script>
import {Group, Cell, Flow, FlowState, FlowLine, Alert, dateFormat} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../personalApi'
export default {
  components: {
    Group, Cell, Flow, FlowState, FlowLine, Alert, DetailTabbar
  },
  data() {
    return {
      teacherPacketInfo: {},
      firstPacketHint: '',
      secondPacketHint: '',
      thirdPacketHint: '',
      actions: [{name: '去完成任务'}],
      alertHint: '',
      showAlert: false
    }
  },
  mounted() {
    api.taskRedPackets(data => {
      this.teacherPacketInfo = data
      this.setFirstPacketHint(data.model.paymentFirstStatus, data.model.taskApprovalStatus, data.firstDayNum)
      this.setSecondPacketHint(data.model.paymentSecondStatus, data.model.taskApprovalStatus, data.secondDayNum)
      this.setThirdPacketHint(data.model.paymentThirdStatus, data.model.taskApprovalStatus, data.thirdDayNum)
    }, er => {
      if (er.toUser) {
        this.tools.warnToast(er.toUser)
      }
    })
  },
  methods: {
    goTask(key) {
      if (key === 'task') {
        this.showAlert = true
        if (!this.teacherPacketInfo.model.taskStudent) {
          this.alertHint = '请切换到首页，进入学生管理添加学生'
          return
        }
        if (!this.teacherPacketInfo.model.taskParent) {
          this.alertHint = '请切换到首页，进入学生管理为学生绑定家长。并等待家长完善资料'
          return
        }
        if (!this.teacherPacketInfo.model.taskFirstActive) {
          this.alertHint = '请切换到首页，您每天至少操作并完成考勤、作业、评语、请假中的一项'
          return
        }
      }
    },
    setFirstPacketHint(paymentStatus, taskApprovalStatus, num) {
      switch (taskApprovalStatus) {
        case 0:
          this.firstPacketHint = '查看红包任务完成进度'
          this.actions = [{name: '去完成', code: 'task'}]
          break
        case 1:
          this.firstPacketHint = '红包审核中'
          this.actions = [{name: '待审核', color: '#b2b2b2'}]
          break
        case 2:
          if (paymentStatus === 1) {
            this.firstPacketHint = '点击领取红包'
          } else if (paymentStatus === 2) {
            this.firstPacketHint = '已领取红包'
            this.actions = [{name: '已领取', color: '#b2b2b2'}]
          }
          break
        case 3:
          this.firstPacketHint = '红包审核不通过'
          this.actions = [{name: '审核未通过', color: '#b2b2b2'}]
          break
      }
    },
    setSecondPacketHint(paymentStatus, taskApprovalStatus, num) {
      if (paymentStatus === 2) {
        this.secondPacketHint = '已领取红包'
      } else {
        this.secondPacketHint = '累积' + num + '天使用作业、成绩、公告、考勤、评语、留言中的任意一项功能'
      }
    },
    setThirdPacketHint(paymentStatus, taskApprovalStatus, num) {
      if (paymentStatus === 2) {
        this.thirdPacketHint = '已领取红包'
      } else {
        let date = dateFormat(this.teacherPacketInfo.thirdStartDate, 'MM月DD日')
        this.thirdPacketHint = '从' + date + '起累积' + num + '天使用作业、成绩、公告、考勤、评语、留言中的任意一项功能'
      }
    }
  }
}
</script>

<style>

</style>

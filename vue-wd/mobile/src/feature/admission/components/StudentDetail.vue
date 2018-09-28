<template>
  <div v-transfer-dom>
    <popup v-model="showPopu" height="90%" @on-hide="hide">
      <div style="backgroundColor:#fff; paddingTop:5px;">
        <div class="admission_student_icon" :style="{'background-image':'url('+tools.cdn(info.userIcon)+')'}"></div>
        <p style="textAlign:center;fontSize:16px;">{{info.userName}}</p>
        <p v-if="info.fromDeputy !== null" style="textAlign:center;">来自代表：{{info.fromDeputy}}</p>
        <!-- <p v-else style="textAlign:center;">直接报名</p> -->
        <p style="textAlign:center;fontSize:12px;color:rgb(153,153,153)">报名时间：{{formatTime(info.signDate)}}</p>
        <!-- <p style="fontSize:16px;margin: 5px 15px;" v-for="item in userInfo" :key="item">
                          <span>{{item.name}}：</span>{{item.value}}</p> -->
      </div>
      <group v-if="info !== null && info.subjectName === null" gutter="10px" label-width="4.5em" label-margin-right="2em" label-align="right">
        <cell style="fontSize:16px;" value-align="left" title="报名专业" :value="info.subjectName"></cell>
      </group>
  
      <group gutter="10px" label-width="4.5em" label-margin-right="2em" label-align="right">
        <cell style="fontSize:16px;" value-align="left" v-for="item in userInfo" :key="item" :title="item.key" :value="item.value"></cell>
      </group>
      <div style="height:50px;"></div>
      <!-- <detail-tabbar :actionLink="review" :actions="tabbarStatus === 1 ? actions : tabbarStatus === 2 ? actions1 : tabbarStatus === 3 ? actions2 : actions"></detail-tabbar> -->
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showPopu = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div v-if="tabbarStatus === 1 || tabbarStatus === 2" :style="{'flex': '1','backgroundColor': tabbarStatus === 2 ? '#bbb' :'#FF6D56'}" @click="review('fail')">
          <p style="line-height: 50px; textAlign: center;color: #fff;">审核拒绝</p>
        </div>
        <div v-if="tabbarStatus === 1 || tabbarStatus === 3" :style="{'flex': '1','backgroundColor': tabbarStatus === 3 ? '#bbb':'#8ebf52'}" @click="review('pass')">
          <p style="line-height: 50px; textAlign: center;color: #fff;">审核通过</p>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import { TransferDom, Popup, Group, Cell, dateFormat } from 'vux'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: { Popup, Group, Cell, DetailTabbar },
  props: {
    show: Boolean,
    studentId: String
  },
  data() {
    return {
      userInfo: [],
      info: {},
      tabbarStatus: 1,
      showPopu: false
    }
  },
  mounted() {
  },
  watch: {
    show(val) {
      console.log(val + '=======')
      this.loadData()
      this.showPopu = true
    }
  },
  methods: {
    hide() {
      console.log('hide......')
    },
    loadData() {
      api.getStudentReviewInfo({ orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.$route.params.admissionId, applyUserId: this.studentId }, (data) => {
        this.info = data
        if (this.userInfo.length === 0) {
          this.userInfo = this.userInfo.concat(JSON.parse(data.applyExt))
        }
        this.tabbarStatus = data.checkStatus
      }, (er) => { })
    },
    review(action) {
      if (this.tabbarStatus === 1) {
        switch (action) {
          case 'fail':
            this.reviewStudent(false)
            break
          case 'pass':
            this.reviewStudent(true)
            break
        }
      }
    },
    formatTime(time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    reviewStudent(status) {
      console.log(status)
      api.reviewStudent({ orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.$route.params.admissionId, applyId: this.info.applyId, auditStatus: status }, (data) => {
        var backData = {userId: this.studentId}
        if (data.rs === 1 && (data.toUser === undefined || data.toUser === null)) {
          if (status === true) {
            data.status = 3
            this.tabbarStatus = 3
          } else {
            data.status = 2
            this.tabbarStatus = 2
          }
        } else {
          data.status = 1
          this.tabbarStatus = 1
        }
        this.$emit('callback', backData)
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  }
}
</script>

<style>
.admission_student_icon {
  width: 60px;
  height: 60px;
  display: block;
  margin: 0 auto;
  background-position: center center;
  background-size: cover;
  border-radius: 30px;
}
</style>

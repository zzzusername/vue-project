<template>
  <div>
    <group gutter="0" v-if="studentInfo != null">
      <cell :title="studentInfo.studentName">
        <div slot="icon" class="student_head_img" :style="{'background-image':'url('+tools.cdn(studentInfo.userIcon, 'head.png', 128)+')'}" src=""></div>
      </cell>
    </group>
    <group gutter="10px">
      <cell v-for="(item, index) in vacationList" :key="index" is-link @click.native="goRemoveVacation(item)">
        <span slot="title">{{item.vacationType | filterType}}</span>
        <span slot="inline-desc" style="vertical-align: middle;display:inline-block;width:200px;font-size:14px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">事由：{{item.vacationDescribe}}</span>
        <p slot="inline-desc" style="font-size:14px;width:200px;display:inline-block;">
          <!-- <span slot="inline-desc" style="margin-right:10px;">{{item.startDate | filterTime}}</span> -->
          <span slot="inline-desc" style="margin-right:10px;">{{item.createDate | filterTime}}</span>
          <span slot="inline-desc" style="color:rgb(142, 191, 82);float:right;" v-if="item.vacationStatus === 2">已批准</span>
        </p>
        <span slot="default">{{item.vacationStatus | filterStatus}}</span>
      </cell>
    </group>
    <p style="text-align:center;font-size: 16px;padding: 20px 15px;fontSize:16px;color:#a2a2a2" v-show="vacationList.length == 0">没有请假记录</p>
    <detail-tabbar :actionLink="submitVacation" :actions="actions"></detail-tabbar>
  </div>
</template>
<script>
  import { Group, Cell, dateFormat } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../../api'
  export default{
    components: {Cell, Group, DetailTabbar},
    data () {
      return {
        actions: [
          {
            name: '请假'
          }
        ],
        vacationList: [],
        studentInfo: null
      }
    },
    mounted () {
      if (!this.tools.isNull(this.$route.params.studentId)) {
        api.queryStudentInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId}, (data) => {
          this.studentInfo = data
        }, () => {})
      }
      api.queryVacationListByStudentId({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId}, (data) => {
        this.vacationList = data
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取请假信息列表失败')
        }
      })
    },
    methods: {
      submitVacation () {
        console.log(this.$route.params)
        if (this.$route.params.studentId) {
          this.$router.push({name: 'educationParentVacation', params: {studentId: this.$route.params.studentId}}) // 家长请假
        } else {
          this.$router.push({name: 'educationStudentVacation'}) // 学生请假
        }
      },
      goRemoveVacation (item) {
        this.$router.push({name: 'educationVacationDetails', params: {vacationId: item.vacationId}})
      }
    },
    filters: {
      filterTime: function (val) {
        if (val) {
          return dateFormat(val, 'YYYY-MM-DD HH:mm')
        }
      },
      filterType: function (val) {
        if (val === 1) {
          return '事假'
        } else if (val === 2) {
          return '病假'
        } else {
          return '其它'
        }
      },
      filterStatus: function (val) {
        if (val === 1) {
          return '待批准'
        } else if (val === 2) {
          return '立即销假'
        } else if (val === 3) {
          return '已销假'
        } else if (val === 4) {
          return '未批准'
        } else if (val === 5) {
          return '已取消'
        }
      }
    }
  }
</script>
<style>
.student_head_img {
  width: 30px;
  height:30px;
  display: inline-block;
  border-radius: 6px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
</style>


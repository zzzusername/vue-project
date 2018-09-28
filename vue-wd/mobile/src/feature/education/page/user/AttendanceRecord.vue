<template>
  <div>
    <group v-if="studentInfo != null" gutter="0">
      <cell :title="studentInfo.studentName">
        <div slot="icon" class="student_head_img" :style="{'background-image':'url('+tools.cdn(studentInfo.userIcon, 'head.png', 128)+')'}" src=""></div>
      </cell>
    </group>
    <tab custom-bar-width="6em">
      <tab-item selected @on-item-click="tabClick(1)">全部考勤</tab-item>
      <tab-item @on-item-click="tabClick(2)">异常考勤</tab-item>
      <!-- <tab-item @on-item-click="tabClick(3)">考勤周报</tab-item> -->
    </tab>
    <cell-box v-if="tabIndex != 3" style="backgroundColor: #fff;" class="attendance_cellbox">
      <flexbox :gutter="0">
        <flexbox-item :span="1/4">
          <div>课程名</div>
        </flexbox-item>
        <flexbox-item :span="1/4">
          <div>教师</div>
        </flexbox-item>
        <flexbox-item :span="1/4">
          <div>日期</div>
        </flexbox-item>
        <flexbox-item :span="1/4">
          <div  style="text-align:center">状态</div>
        </flexbox-item>
      </flexbox>
    </cell-box>
    <div v-if="tabIndex === 1" :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="attendance_scroller" no-data-text="没有更多考勤～">
        <div style="height: 10px" v-if="allRecordList.length==0"></div>
        <cell-box v-for="(item, index) in allRecordList" :key="index" style="backgroundColor:#fff">
          <flexbox :gutter="0">
            <flexbox-item :span="1/4">
              <div>{{item.lessonName === null ? '全天' : item.lessonName}}</div>
            </flexbox-item>
            <flexbox-item :span="1/4">
              <div>{{item.teacherName}}</div>
            </flexbox-item>
            <flexbox-item :span="1/4">
              <div>{{formateTime(item.checkDate)}}</div>
            </flexbox-item>
            <flexbox-item :span="1/4">
              <div  style="text-align:center">{{getStatus(item.checkStatus)}}</div>
            </flexbox-item>
          </flexbox>
        </cell-box>
      </scroller>
    </div>
    <div v-else-if="tabIndex === 2" :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="attendance_scroller" no-data-text="没有更多考勤～">
        <div style="height: 10px" v-if="exceptionRecordList.length==0"></div>
        <cell-box v-for="(item, index) in exceptionRecordList" :key="index" style="backgroundColor:#fff">
          <flexbox :gutter="0">
            <flexbox-item :span="1/4">
              <div>{{item.lessonName === null ? '全天' : item.lessonName}}</div>
            </flexbox-item>
            <flexbox-item :span="1/4">
              <div>{{item.teacherName}}</div>
            </flexbox-item>
            <flexbox-item :span="1/4">
              <div>{{formateTime(item.checkDate)}}</div>
            </flexbox-item>
            <flexbox-item :span="1/4">
              <div  style="text-align:center">{{getStatus(item.checkStatus)}}</div>
            </flexbox-item>
          </flexbox>
        </cell-box>
      </scroller>
    </div>
    <div v-else-if="tabIndex === 3" :style="{'height': weeklyScrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="attendance_scroller">
        <cell style="backgroundColor: #fff;" v-for="(item, index) in weeklyReportList" :key="index" is-link @click.native="skipWeeklyDetail(item)">
          <p slot="title">{{formateAllTime(item.weeklyEndDate)+' 周报'}}</p>
          <p slot="inline-desc">{{item.className}}</p>
          <p>{{item.studentStatus == 0 ? '全勤' : '未全勤'}}</p>
        </cell>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Tab, TabItem, Cell, Flexbox, FlexboxItem, CellBox, dateFormat, Group } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Tab, TabItem, Cell, Flexbox, FlexboxItem, CellBox, DetailTabbar, Group
  },
  data() {
    return {
      scrollerHeight: 0,
      weeklyScrollerHeight: 0,
      tabIndex: 1,
      exceptionRecordList: [],
      allRecordList: [],
      studentInfo: null,
      weeklyReportList: []
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 94 - 42
    this.weeklyScrollerHeight = window.innerHeight - 94
    var studentId = this.$route.params.studentId
    if (studentId !== undefined && studentId !== null) {
      api.queryStudentInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId}, (data) => {
        this.studentInfo = data
        this.scrollerHeight = window.innerHeight - 94 - 50 - 42
        this.weeklyScrollerHeight = window.innerHeight - 94 - 50
      }, () => {})
    }
  },
  methods: {
    skipWeeklyDetail (val) {
      let studentId = this.$route.params.studentId
      if (studentId !== undefined) {
        this.$router.push({name: 'educationParentsWeeklyDetail', params: {studentId: this.$route.params.studentId, weeklyId: val.weeklyId}})
      } else {
        this.$router.push({name: 'educationStudentWeeklyDetail', params: {weeklyId: val.weeklyId}})
      }
    },
    tabClick(index) {
      this.tabIndex = index
      switch (index) {
        case 1:
          break
        case 2:
          if (this.exceptionRecordList.length === 0) {
            this.$refs.attendance_scroller.finishInfinite()
          }
          break
        // case 3:
        //   if (this.weeklyReportList.length === 0) {
        //     this.$refs.attendance_scroller.finishInfinite()
        //   }
        //   break
      }
    },
    infinite(done) {
      if (this.tabIndex === 1) {
        this.getAttendanceRecord(this.allRecordList.length, (data) => {
          this.allRecordList = this.allRecordList.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      } else if (this.tabIndex === 2) {
        this.getExceptionRecord(this.exceptionRecordList.length, (data) => {
          this.exceptionRecordList = this.exceptionRecordList.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      } else if (this.tabIndex === 3) {
        this.getUserWeeklyReport(this.weeklyReportList.length, (data) => {
          this.weeklyReportList = this.weeklyReportList.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      }
    },
    getAttendanceRecord(rowStart, callback) {
      api.getAttendanceRecord({ schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, rowStart: rowStart, rowCount: 20 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getExceptionRecord (rowStart, callback) {
      api.getExceptionAttendanceRecord({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, rowStart: rowStart, rowCount: 20}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getUserWeeklyReport(rowStart, callback) {
      api.getUserWeeklyReport({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, rowStart: rowStart, rowCount: 20}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    formateTime(time) {
      return dateFormat(time, 'MM/DD HH:mm')
    },
    formateAllTime(time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    getStatus (val) {
      var str = ''
      switch (val) {
        case 1:
        case null:
          str = '已到'
          break
        case 2:
          str = '未到'
          break
        case 3:
          str = '请假'
          break
        case 4:
          str = '迟到'
          break
        case 5:
          str = '早退'
          break
        case 6:
          str = '旷课'
          break
      }
      return str
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
.attendance_cellbox::before {
  border-top: 0px !important;
}
</style>

<template>
  <div :style="{'position': 'relative', height: contentHeight + 'px'}">
    <scroller :on-infinite="infinite" no-data-text="没有更多数据了～">
      <flexbox v-if="isAuth" style="margin-top:20px;margin-bottom:10px;">
        <flexbox-item><x-button plain style="font-size:15px;width:120px;color:#2E84D4; border: 1px solid #2E84D4;background:#fff" @click.native="studentEvaluate('student')">学生操行评定</x-button></flexbox-item>
        <flexbox-item><x-button plain style="font-size:15px;width:120px;color:#2E84D4; border: 1px solid #2E84D4;background:#fff" @click.native="studentEvaluate('history')">操行评定记录</x-button></flexbox-item>
      </flexbox>
      <group v-if="reportList.length > 0" title="操行报告">
        <cell v-for="(item, index) in reportList" :key="index" :title="item.reportName" is-link @click.native="reportItem(item)">
          <p slot="inline-desc"><span>{{tools.formateTime(item.reportStartDate, 'YYYY-MM-DD')}}</span> - <span>{{tools.formateTime(item.reportEndDate, 'YYYY-MM-DD')}}</span></p>
          <p>{{item.totalScore}}分</p>
        </cell>
        <p style="text-align:center;padding: 10px;background-color: #fff;font-size: 14px;color: rgb(46, 132, 212);border-top: 1px solid #d9d9d9" @click="more">查看更多</p>
      </group>
      <group gutter="0">
        <div slot="title" style="display: flex;padding: 10px 15px 5px;font-size: 14px;">
          <p style="flex: 2;color: #999;">德育表现情况</p>
          <label style="flex: 1;text-align: right;color: rgb(46, 132, 212)" @click="showPopUp = true">筛选</label>
        </div>
        <cell v-for="(item, index) in scoreList" :key="index" :title="item.projectName" :value="getValue(item) + '分'" is-link @click.native="skip(item)">
          <p slot="inline-desc">{{tools.formateTime(item.evaluateDate, 'YYYY-MM-DD HH:mm')}}</p>
        </cell>
      </group>
    </scroller>
    <detail-tabbar></detail-tabbar>
    <div>
      <popup v-model="showPopUp" height="50%">
        <div style="backgroundColor: #fff;width: 100%;minHeight: 100%;">
          <scroller ref="scroller">
            <div style="padding: 10px 10px 5px;">
              <p style="marginBottom: 10px;">日期区间</p>
              <div style="display: flex;">
                <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;color: #b2b2b2;" @click="selectTime('start')">{{startDate == null ? '开始日期' : startDate}}</p>
                <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
                <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;color: #b2b2b2;" @click="selectTime('end')">{{endDate == null ? '结束日期' : endDate}}</p>
              </div>
            </div>
            <div style="height: 50px;"></div>
          </scroller>
          <div style="display: flex;height: 50px;position: absolute;bottom: 0;width: 100vw;">
            <p style="flex: 1;textAlign: center;lineHeight: 50px;backgroundColor: rgb(230, 230, 230)" @click="clearFilter">重置</p>
            <p style="flex: 1;textAlign: center;lineHeight: 50px;color: #fff;backgroundColor: #A2D268" @click="confirmFilter">确定</p>
          </div>
        </div>
      </popup>
      <div>
        <popup v-model="showDatetime">
          <group gutter="0">
            <cell>
              <p slot="title" style="color: #828282;fontSize: 14px;" @click="showDatetime=false">取消</p>
              <p style="color: #A2D268;fontSize: 14px;" @click="() => {showDatetime=false, confirmDateTime()}">确定</p>
            </cell>
          </group>
          <datetime-view ref="datetime" :min-year="startTime - 10" :max-year="startTime + 10" v-model="datetime" year-row="{value}年" month-row="{value}月" day-row="{value}日"></datetime-view>
        </popup>
      </div>
    </div>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import {Group, Cell, Popup, DatetimeView, Flexbox, FlexboxItem, XButton} from 'vux'
import api from '../api'
export default {
  components: {
    DetailTabbar, Group, Cell, Popup, DatetimeView, Flexbox, FlexboxItem, XButton
  },
  data() {
    return {
      contentHeight: 0,
      startDate: null,
      endDate: null,
      scoreList: [],
      reportList: [],
      showPopUp: false,
      datetime: this.tools.formateTime(new Date(), 'YYYY-MM-DD'),
      showDatetime: false,
      timeType: null,
      isAuth: false // 是否有评定权限
    }
  },
  computed: {
    schoolId() {
      return this.$route.params.schoolId
    },
    studentId() {
      return this.$route.params.studentId
    },
    startTime() {
      return new Date().getFullYear()
    }
  },
  mounted() {
    this.contentHeight = window.innerHeight - 50
    api.getMoralStudentManagerInfo({schoolId: this.$route.params.schoolId}, (data) => {
      this.isAuth = data.isAuth
    }, () => {})
    this.getReportList()
  },
  methods: {
    reportItem (item) {
      if (this.tools.isNull(this.$route.params.studentId)) {
        this.$router.push({name: 'educationStudentScoreReportDetailForStudent', params: {recordId: item.recordId}})
      } else {
        this.$router.push({name: 'educationStudentScoreReportDetailForParents', params: {recordId: item.recordId, studentId: this.$route.params.studentId}})
      }
    },
    more () {
      if (this.tools.isNull(this.$route.params.studentId)) {
        this.$router.push({name: 'educationMoralStudentReportListForStudent'})
      } else {
        this.$router.push({name: 'educationMoralStudentReportList', params: {studentId: this.$route.params.studentId}})
      }
    },
    skip(val) {
      if (this.tools.isNull(this.$route.params.studentId)) {
        this.$router.push({name: 'educationMoralStudentScoreDetailForStudent', params: {evaluateId: val.evaluateId}})
      } else {
        this.$router.push({name: 'educationMoralStudentScoreDetail', params: {studentId: this.studentId, evaluateId: val.evaluateId}})
      }
    },
    infinite(done) {
      this.getScoreList(this.scoreList.length, data => {
        this.scoreList = this.scoreList.concat(data)
        if (data.length === 20) {
          done(false)
        } else {
          done(true)
        }
      })
    },
    getScoreList(rowStart, cb) {
      api.getStudentMinusScoreList({schoolId: this.schoolId, studentId: this.studentId, startDate: this.startDate, endDate: this.endDate, rowStart: rowStart, rowCount: 20}, (data) => {
        cb(data)
      }, er => {
        this.warnToast(er)
      })
    },
    getReportList() {
      api.getReportList({schoolId: this.schoolId, studentId: this.studentId}, data => {
        if (data.length <= 2) {
          this.reportList = data
        } else {
          this.reportList = data.slice(0, 2)
        }
      }, er => {
        this.warnToast(er)
      })
    },
    warnToast(er) {
      if (er.toUser) {
        this.tools.warnToast(er.message)
        return
      }
      this.tools.warnToast('获取列表失败')
    },
    getValue(val) {
      if (!val.isRemove) {
        if (val.projectType === 1) {
          return '+' + val.evaluateStore
        } else {
          return '-' + val.evaluateStore
        }
      } else {
        return '已消'
      }
    },
    selectTime(val) {
      this.timeType = val
      this.showDatetime = true
    },
    confirmDateTime() {
      if (this.timeType === 'start') {
        this.startDate = this.datetime
      } else {
        this.endDate = this.datetime
      }
      this.datetime = this.tools.formateTime(new Date(), 'YYYY-MM-DD')
    },
    clearFilter() {
      this.startDate = null
      this.endDate = null
    },
    confirmFilter() {
      this.showPopUp = false
      this.scoreList = []
      // this.$refs.scroller.finishInfinite(true)
      this.getScoreList(0, (data) => {
        this.scoreList = data
      })
    },
    studentEvaluate (type) {
      if (type === 'student') {
        this.$router.push({name: 'educationMoralStudentEvaluate'})
      } else if (type === 'history') {
        this.$router.push({name: 'educationMoralConductEvaluationList'})
      }
    }
  }
}
</script>

<style>

</style>

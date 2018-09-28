<template>
  <div>
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller ref="scroller" style="background:#fff">
        <div >
          <div v-show="(!tools.isNull($route.params.studentId) && $route.params.parents == 1) || tools.isNull($route.params.studentId)">
            <p v-show="isSubscribe != null && isSubscribe == false" style="float:right;margin-right:10px;color:#8ebf52" @click="addSubscribe">订阅周报</p>
            <p v-show="isSubscribe != null && isSubscribe == true" style="float:right;margin-right:10px;color:#b2b2b2" @click="deleteSubscribe">取消订阅周报</p>
          </div>
          <div class="statistics_achi_dialog_user_icon" :style="{'background-image':'url('+tools.cdn(studentInfo.userIcon, 'head.png', 128)+')', 'border-radius': '27px'}"></div>
          <p style="textAlign: center;">{{studentInfo.studentName}}</p>
          <p style="textAlign: center;">{{tools.formateTime(new Date(startDateText), 'YYYY.MM.DD') + ' - ' + tools.formateTime(new Date(endDateText), 'YYYY.MM.DD')}}</p>
          <p style="textAlign: center;color:#2E84D4" @click="changeDate">修改查询时间</p>
        </div>
        <divider style="color: #d2d2d2;margin: 0 20px">•</divider>

        <div v-show="checkInfo.attendance != null">
          <p style="margin: 5px 15px 0px;font-size:16px"><strong>考勤</strong></p>
          <div style="padding:3px 10px;">
            <x-table full-bordered class="count-table-font">
              <tbody>
                <tr>
                  <td style="line-height:25px;padding:5px;">
                    <p style="text-align: left;"><strong>出勤率: </strong>{{(checkInfo.attendance * 100).toFixed(2)}}%</p>
                    <div v-for="(item, index) in checkInfo.lesson" :key="index" style="text-align: left;">
                      <p v-show="item.lessonName != null">
                        <strong>{{item.lessonName}}: </strong>
                        <span v-if="item.checkNonarrival==0 && item.checkBeLate==0 && item.checkLeaveEarly==0 && item.checkTruant==0 && item.checkVacation==0" style="color:#A2D268">全勤</span>
                        <span v-else style="font-size: 14px;">{{item.checkNonarrival>0?'未到'+item.checkNonarrival+'次.':''}} {{item.checkBeLate>0?'迟到'+item.checkBeLate+'次.':''}} {{item.checkLeaveEarly>0?'早退'+item.checkLeaveEarly+'次.':''}} {{item.checkTruant>0?'旷课'+item.checkTruant+'次.':''}} {{item.checkVacation>0?'请假'+item.checkVacation+'次.':''}}</span>
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </x-table>
          </div>
        </div>
        <div v-show="workInfo.avgNum != null">
          <p style="margin: 5px 15px 0px;font-size:16px"><strong>作业</strong></p>
          <div style="padding:3px 10px;">
            <x-table full-bordered class="count-table-font">
              <tbody>
                <tr>
                  <td style="line-height:25px;padding:5px;">
                    <p style="text-align: left;"><strong>完成率: </strong>{{(workInfo.progress * 100).toFixed(2)}}%</p>
                    <p style="text-align: left;"><strong>平均成绩: </strong>{{filterGrade(workInfo.avgNum)}}</p>
                    <div v-for="(item, index) in workInfo.lesson" :key="index" style="text-align: left;">
                      <p v-show="(item.avgNum != null && item.avgNum > 0) || item.uncommitNum > 0">
                        <strong>{{item.lessonName == null ? '无课程' : item.lessonName}}: </strong>
                        <span style="font-size: 14px;"><span v-show="item.avgNum != null && item.avgNum > 0">平均成绩：{{filterGrade(item.avgNum)}}</span><span v-show="item.avgNum != null && item.avgNum > 0 && item.uncommitNum > 0">、</span>未交作业：{{item.uncommitNum}}次</span>
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </x-table>
          </div>
        </div>
        <div v-show="achievementList.length > 0">
          <p style="margin: 5px 15px 0px;font-size:16px"><strong>成绩</strong></p>
          <div style="padding:3px 10px;">
            <x-table full-bordered class="count-table-font">
              <tbody>
                <tr>
                  <td style="line-height:25px;padding:5px;">
                    <div v-for="(item, index) in achievementList" :key="index" style="text-align: left;">
                      <p>
                        <strong>{{item.lessonName == null ? '无课程' : item.lessonName}}: </strong>
                        <span style="font-size: 14px;">平均{{item.avgScore}}分 / {{item.lessonCount}}次</span>
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </x-table>
          </div>
        </div>
        <div v-show="commentInfo.commentGood > 0 || commentInfo.commentSatisfactory > 0 || commentInfo.commentMedium > 0 || commentInfo.commentCommonly > 0 || commentInfo.commentBad > 0">
          <p style="margin: 5px 15px 0px;font-size:16px"><strong>评语</strong></p>
          <div style="padding:3px 10px;">
            <x-table full-bordered class="count-table-font">
              <tbody>
                <tr>
                  <td style="line-height:25px;padding:5px;">
                    <p v-show="commentInfo.commentGood !== 0" style="text-align: left;">
                      <strong>优秀: </strong>
                      <span style="font-size: 14px;"> {{commentInfo.commentGood}}次</span>
                    </p>
                    <p v-show="commentInfo.commentSatisfactory !== 0" style="text-align: left;">
                      <strong>良好: </strong>
                      <span style="font-size: 14px;">{{commentInfo.commentSatisfactory}}次</span>
                    </p>
                    <p v-show="commentInfo.commentMedium !== 0" style="text-align: left;">
                      <strong>中等: </strong>
                      <span style="font-size: 14px;">{{commentInfo.commentMedium}}次</span>
                    </p>
                    <p v-show="commentInfo.commentCommonly !== 0" style="text-align: left;">
                      <strong>一般: </strong>
                      <span style="font-size: 14px;">{{commentInfo.commentCommonly}}次</span>
                    </p>
                    <p v-show="commentInfo.commentBad !== 0" style="text-align: left;">
                      <strong>差: </strong>
                      <span style="font-size: 14px;">{{commentInfo.commentBad}}次</span>
                    </p>
                    <!-- <p v-show="commentInfo.commentNull !== 0" style="text-align: left;">
                      <strong>无评级: </strong>
                      <span style="font-size: 14px;">{{commentInfo.commentNull}}次</span>
                    </p> -->
                  </td>
                </tr>
              </tbody>
            </x-table>
          </div>
        </div>
        <p v-show="(commentInfo.commentGood == 0 || commentInfo.commentSatisfactory == 0 || commentInfo.commentMedium == 0 || commentInfo.commentCommonly == 0 || commentInfo.commentBad == 0) && achievementList.length == 0 && workInfo.avgNum == null && checkInfo.attendance == null" style="fontSize: 14px;textAlign:center;"><span style="color: #a2a2a2">暂无汇总信息</span>&nbsp;</p>
        <p style="height: 20px;"></p>
      </scroller>
    </div>
    <div v-transfer-dom>
      <popup v-model="showPopUp" height="30%">
        <div style="backgroundColor: #fff;width: 100%;minHeight: 100%;">
          <div style="padding: 10px 10px 5px;">
            <p style="marginBottom: 10px;">日期区间</p>
            <div style="display: flex;">
              <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;color: #b2b2b2;" @click="selectTime('start')">{{startDate == null ? '开始日期' : startDate}}</p>
              <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
              <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;color: #b2b2b2;" @click="selectTime('end')">{{endDate == null ? '结束日期' : endDate}}</p>
            </div>
          </div>
          <div style="display: flex;height: 50px;position: absolute;bottom: 0;width: 100vw;">
            <p style="flex: 1;textAlign: center;lineHeight: 50px;backgroundColor: rgb(230, 230, 230)" @click="clearFilter">重置</p>
            <p style="flex: 1;textAlign: center;lineHeight: 50px;color: #fff;backgroundColor: #A2D268" @click="confirmFilter()">确定</p>
          </div>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showDatetime">
        <group gutter="0">
          <cell>
            <p slot="title" style="color: #828282;fontSize: 14px;" @click="showDatetime=false">取消</p>
            <p style="color: #A2D268;fontSize: 14px;" @click="confirm">确定</p>
          </cell>
        </group>
        <datetime-view ref="datetime" :min-year="startTime - 10" :max-year="startTime + 10" v-model="datetime" year-row="{value}年" month-row="{value}月" day-row="{value}日"></datetime-view>
      </popup>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import {dateFormat, Divider, XTable, Popup, Group, Cell, DatetimeView, TransferDomDirective as TransferDom} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../statisticsApi.js'
import baseApi from '../../api.js'
export default {
  directives: {
    TransferDom
  },
  components: {
    DetailTabbar, Divider, XTable, Popup, Group, Cell, DatetimeView
  },
  data () {
    return {
      startDate: null,
      endDate: null,
      startDateText: null,
      endDateText: null,
      studentInfo: {},
      scrollerHeight: 0,
      checkInfo: {},
      workInfo: {},
      commentInfo: {},
      achievementList: [],
      showPopUp: false,
      showDatetime: false,
      timeType: null,
      datetime: null,
      monday: '',
      sunday: '',
      startTime: parseInt(this.tools.formateTime(new Date(), 'YYYY')),
      isSubscribe: null
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50

    var now = new Date()
    var nowTime = now.getTime()
    var day = now.getDay()
    var oneDayLong = 24 * 60 * 60 * 1000
    var MondayTime = nowTime - (day - 1 + 7) * oneDayLong
    var SundayTime = nowTime - day * oneDayLong
    this.monday = new Date(MondayTime)
    this.sunday = new Date(SundayTime)
    if (!this.tools.isNull(this.$route.params.startDate) && !this.tools.isNull(this.$route.params.endDate)) {
      this.startDate = this.$route.params.startDate
      this.endDate = this.$route.params.endDate
    } else {
      this.startDate = dateFormat(this.monday, 'YYYY-MM-DD')
      this.endDate = dateFormat(this.sunday, 'YYYY-MM-DD')
    }
    baseApi.simplenessStudentInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId}, (data) => {
      this.studentInfo = data
    }, () => {})
    this.queryStatisticsTeacherInfoForCheck()
    this.getSubscribe()
  },
  methods: {
    getSubscribe () {
      api.isSubscribe({type: 'STUDENT_WEEKLY'}, (data) => {
        this.isSubscribe = data.result
      }, () => {})
    },
    addSubscribe () {
      api.addSubscribe({type: 'STUDENT_WEEKLY'}, (data) => {
        this.isSubscribe = true
      }, () => {})
    },
    deleteSubscribe () {
      api.deleteSubscribe({type: 'STUDENT_WEEKLY'}, (data) => {
        this.isSubscribe = false
      }, () => {})
    },
    queryStatisticsTeacherInfoForAchievement () {
      api.queryStatisticsTeacherInfoForAchievement({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, startDate: this.startDate + ' 00:00:00', endDate: this.endDate + ' 23:59:59', isParents: this.$route.params.parents}, (data) => {
        this.achievementList = data
        // this.achievementList = []
        // data.forEach(element => {
        //   if (element.lessonName !== null) {
        //     this.achievementList.push(element)
        //   }
        // })
        this.queryStatisticsTeacherInfoForComment()
      }, () => {})
    },
    queryStatisticsTeacherInfoForWork () {
      api.queryStatisticsTeacherInfoForWork({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, startDate: this.startDate + ' 00:00:00', endDate: this.endDate + ' 23:59:59', isParents: this.$route.params.parents}, (data) => {
        this.workInfo = data
        this.queryStatisticsTeacherInfoForAchievement()
      }, () => {})
    },
    queryStatisticsTeacherInfoForCheck () {
      api.queryStatisticsTeacherInfoForCheck({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, startDate: this.startDate + ' 00:00:00', endDate: this.endDate + ' 23:59:59', isParents: this.$route.params.parents}, (data) => {
        this.checkInfo = data
        this.queryStatisticsTeacherInfoForWork()
      }, (data) => {
        if (data.toUser) {
          this.tools.warnToast(data.message, '180px')
        }
      })
    },
    queryStatisticsTeacherInfoForComment () {
      api.queryStatisticsTeacherInfoForComment({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, startDate: this.startDate + ' 00:00:00', endDate: this.endDate + ' 23:59:59', isParents: this.$route.params.parents}, (data) => {
        if (data !== null) {
          this.commentInfo = data
        }
        this.startDateText = this.startDate + ''
        this.endDateText = this.endDate + ''
      }, () => {})
    },
    changeDate () {
      this.showPopUp = true
    },
    selectTime(val) {
      this.timeType = val
      switch (this.timeType) {
        case 'start':
          this.datetime = this.startDate
          break
        case 'end':
          this.datetime = this.endDate
          break
      }
      this.$refs.datetime.render()
      this.showDatetime = true
    },
    confirm() {
      switch (this.timeType) {
        case 'start':
          this.startDate = this.datetime
          break
        case 'end':
          this.endDate = this.datetime
          break
      }
      this.datetime = this.tools.formateTime(new Date(), 'YYYY-MM-DD')
      this.showDatetime = false
    },
    clearFilter () {
      this.startDate = dateFormat(this.monday, 'YYYY-MM-DD')
      this.endDate = dateFormat(this.sunday, 'YYYY-MM-DD')
    },
    confirmFilter () {
      this.showPopUp = false
      this.queryStatisticsTeacherInfoForCheck()
    },
    filterGrade: function (val) {
      switch (parseInt(val)) {
        case 15:
          return '优+'
        case 14:
          return '优'
        case 13:
          return '优-'
        case 12:
          return '良+'
        case 11:
          return '良'
        case 10:
          return '良-'
        case 9:
          return '中+'
        case 8:
          return '中'
        case 7:
          return '中-'
        case 6:
          return '一般+'
        case 5:
          return '一般'
        case 4:
          return '一般-'
        case 3:
          return '差+'
        case 2:
          return '差'
        case 1:
          return '差-'
      }
    }
  }
}
</script>

<style>
.statistics_achi_dialog_user_icon{
  width: 54px;
  height: 54px;
  display: block;
  border-radius: 5px;
  margin: 10px auto 5px;
  background-position: center center;
  background-size: cover;
  border-style: none;
  border-width: 0;
}
.statistics_achi_dialog_attend_detail {
  text-align: left;
  margin: 5px 15px 0px;
  font-size: 14px;
}
.count-table-font {
  color: #666;
  font-family: PingFangSC-Regular;
}
</style>

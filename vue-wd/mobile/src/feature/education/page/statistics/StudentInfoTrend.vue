<template>
  <div>
    <div :style="{'position': 'relative', 'height': height + 'px'}">
      <scroller>
        <div class="statistics_achi_dialog_user_icon" :style="{'background-image':'url('+tools.cdn(studentInfo.userIcon, 'head.png', 128)+')', 'border-radius': '27px'}"></div>
          <p style="textAlign: center;">{{studentInfo.studentName}}</p>
          <p style="textAlign: center;">{{tools.formateTime(new Date(startDateText), 'YYYY.MM.DD') + ' - ' + tools.formateTime(new Date(endDateText), 'YYYY.MM.DD')}}</p>
          <p style="textAlign: center;color:#2E84D4">
            <span @click="changeDate" style="margin-right:10px;">修改查询时间</span>
            <span @click="changeAchievement">修改所选成绩单</span>
          </p>
        <div>
          <h3 style="margin: 15px 0 0 15px;" v-if="lessons.length >= 1">成绩走势图</h3>
          <div v-if="lessons.length >= 1" style="padding: 0 10px;">
            <checker default-item-class="defalut-item" selected-item-class="item-selected" v-model="lessonId" radio-required>
              <checker-item v-for="(item, index) in lessons" :key="index" :value="item.lessonId">{{item.lessonName}}</checker-item>
            </checker>
          </div>
          <div ref="chartAchievement" style="height: 45vh; padding: 0 10px;" v-show="showAchievement"></div>
        </div>
        <div>
          <h3 style="margin: 15px 0 0 15px;" v-if="ranks.length >= 1">排名走势图</h3>
          <div v-if="ranks.length >= 1" style="padding: 0 10px;">
            <checker default-item-class="defalut-item" selected-item-class="item-selected" v-model="rankName" radio-required>
              <checker-item v-for="(item, index) in ranks" :key="index" :value="item.rankName">{{item.rankName}}</checker-item>
            </checker>
          </div>
          <div ref="chartRank" style="height: 45vh; padding: 0 10px;" v-show="showRank"></div>
        </div>
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
            <p style="flex: 1;textAlign: center;lineHeight: 50px;backgroundColor: rgb(230, 230, 230)" @click="showPopUp = false">关闭</p>
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
    <!-- 成绩单列表 -->
    <popup v-model="achievementPopup" height="90%">
      <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
        <scroller ref="manage_scroller">
          <group v-if="acievementList.length > 0" gutter="-1px">
            <checklist :options="acievementList" v-model="achievementsId"></checklist>
            <cell v-for="(item, index) in acievementListGrade" :key="index">
              <span slot="title" style="color:#999;">{{item.value}}</span>
            </cell>
          </group>
        </scroller>
        <p v-if="acievementList.length <= 0" style="text-align: center; font-size: 16px; padding: 15px; color: rgb(162, 162, 162);">您好，还没有成绩单！</p>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;background: rgb(230, 230, 230)" @click="achievementPopup = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="chooseAchievement">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import {Group, Cell, Popup, Flexbox, FlexboxItem, DatetimeView, Checker, CheckerItem, TransferDomDirective as TransferDom} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import Checklist from '@/components/checklist/Index.vue'
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import baseApi from '../../api.js'
import api from '../../statisticsApi'
export default {
  directives: {
    TransferDom
  },
  components: {
    Group, Cell, Popup, DetailTabbar, Flexbox, FlexboxItem, DatetimeView, Checker, CheckerItem, Checklist
  },
  data () {
    return {
      height: 0,
      scrollerHeight: 0,
      studentInfo: {},
      monday: '',
      sunday: '',
      startDate: null,
      endDate: null,
      startDateText: null,
      endDateText: null,
      showPopUp: false,
      achievementPopup: false,
      timeType: null,
      showDatetime: null,
      datetime: null,
      startTime: parseInt(this.tools.formateTime(new Date(), 'YYYY')),
      acievementList: [],  // 成绩列表
      acievementListGrade: [],
      achievementsId: [],  // 成绩单数组
      lessons: [],
      lessonId: null,
      ranks: [],
      rankName: null,
      achievementChart: null,
      rankChart: null,
      optionAchievement: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['分数', '平均分', '最高分', '最低分']
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      },
      optionRank: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: { onZero: false }
        },
        yAxis: {
          type: 'value',
          inverse: true
        },
        series: [{
          data: [],
          type: 'line',
          smooth: true
        }]
      },
      showRank: true,
      showAchievement: true,
      rankBase: {},
      achievementBase: {}
    }
  },
  mounted () {
    this.height = window.innerHeight - 50
    this.scrollerHeight = window.innerHeight * 0.9 - 50
    var now = new Date()
    var nowTime = now.getTime()
    var day = now.getDay()
    var oneDayLong = 24 * 60 * 60 * 1000
    var MondayTime = nowTime - (day - 1 + 7) * oneDayLong
    var SundayTime = nowTime - day * oneDayLong
    this.monday = new Date(MondayTime)
    this.sunday = new Date(SundayTime)
    this.startDate = this.tools.formateTime(this.monday, 'YYYY-MM-DD')
    this.endDate = this.tools.formateTime(this.sunday, 'YYYY-MM-DD')
    baseApi.simplenessStudentInfo({schoolId: this.schoolId, studentId: this.studentId}, (data) => {
      this.studentInfo = data
    }, () => {})
    this.getAchievementList() // 获取成绩单
    this.achievementChart = echarts.init(this.$refs.chartAchievement)
    this.rankChart = echarts.init(this.$refs.chartRank)
  },
  computed: {
    schoolId () {
      return this.$route.params.schoolId
    },
    studentId () {
      return this.$route.params.studentId
    },
    classId () {
      return this.$route.params.classId
    },
    type () {
      return this.$route.params.type
    }
  },
  watch: {
    lessonId: {
      handler(curval, oval) {
        this.getAchievementCharts(curval)
      },
      deep: true
    },
    rankName: {
      handler(curval, oval) {
        this.getRankCharts(curval)
      },
      deep: true
    }
  },
  methods: {
    getAchievementList () {
      api.geiAchievementListByIdentity({schoolId: this.schoolId, classId: this.classId, studentId: this.studentId, startDate: this.startDate + ' 00:00:00', endDate: this.endDate + ' 23:59:59', rowStart: 0, rowCount: 99999, type: this.type}, (data) => {
        this.startDateText = this.startDate + ''
        this.endDateText = this.endDate + ''
        this.achievementBase = {}
        this.rankBase = {}
        this.acievementList = []
        this.achievementsId = []
        if (data.length <= 0) {
          this.lessons = []
          this.ranks = []
          this.showRank = false
          this.showAchievement = false
          return
        }
        data.forEach(element => {
          if (parseInt(element.achievementType) === 0) {
            let item = {
              key: element.achievementsId,
              value: element.achievementsName
            }
            this.achievementsId.push(item.key)
            this.acievementList.push(item)
          } else {
            let item2 = {
              key: element.achievementsId,
              value: element.achievementsName
            }
            this.acievementListGrade.push(item2)
          }
        })
        if (this.achievementsId.length > 0) {
          this.getLessonRankName()  // 获取课程、排名名称
        }
      }, () => {})
    },
    getLessonRankName () {
      api.getlessonNameByAchievementIds({schoolId: this.schoolId, achievementsId: this.achievementsId}, (data) => {
        this.lessons = []
        this.ranks = []
        if (data.lesson.length > 0) {
          this.showAchievement = true
          data.lesson.forEach(element => {
            let obj = {}
            if (element.lessonId) {
              obj = {lessonName: element.lessonName, lessonId: element.lessonId}
            } else {
              obj = {lessonName: '总成绩', lessonId: 0}
            }
            this.lessons.push(obj)
          })
          this.lessonId = null
          this.lessonId = this.lessons[0].lessonId
        } else {
          this.showAchievement = false
        }
        if (data.Rank.length > 0) {
          this.showRank = true
          data.Rank.forEach(element => {
            let obj = {}
            if (element.rankId) {
              obj = {rankName: element.rankName, rankId: element.rankId}
            }
            this.ranks.push(obj)
          })
          this.rankName = null
          this.rankName = this.ranks[0].rankName
        } else {
          this.showRank = false
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    changeDate () {
      this.showPopUp = true
    },
    confirmFilter () {
      this.getAchievementList() // 获取成绩单
      this.showPopUp = false
    },
    changeAchievement () {
      this.achievementPopup = true
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
    chooseAchievement () {
      if (this.achievementsId.length <= 0) {
        this.tools.warnToast('请至少选择一个成绩单', '180px')
        return
      }
      this.getLessonRankName()
      this.achievementPopup = false
      this.achievementBase = {}
      this.rankBase = {}
    }, // 选择成绩单
    getAchievementCharts (val) {
      if (this.achievementBase[val]) {
        this.showAchievement = true
        this.optionAchievement.series = [
          {
            name: '分数', type: 'line', data: this.achievementBase[val].a
          },
          {
            name: '平均分', type: 'line', data: this.achievementBase[val].b
          },
          {
            name: '最高分', type: 'line', data: this.achievementBase[val].c
          },
          {
            name: '最低分', type: 'line', data: this.achievementBase[val].d
          }
        ]
        this.optionAchievement.xAxis.data = this.achievementBase[val].x
        this.achievementChart.setOption(this.optionAchievement)
        return
      }
      api.queryAchievementTrend({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, achievementsId: this.achievementsId, lessonId: val === 0 ? null : val, studentId: this.$route.params.studentId, type: this.$route.params.type}, (data) => {
        if (data.length > 0) {
          this.showAchievement = true
          let dateList = []
          let scoreList = []
          let avgScoreList = []
          let maxScoreList = []
          let minScoreList = []
          for (let i = 0; i < data.length; i++) {
            dateList.push((this.tools.formateTime(data[i].publishDate, 'YYYY.MM.DD')).toString())
            scoreList.push(data[i].achievementsScore)
            avgScoreList.push(parseFloat(data[i].avgScore.toString()))
            maxScoreList.push(data[i].maxScore)
            minScoreList.push(data[i].minScore)
          }
          this.optionAchievement.series = [
            {
              name: '分数', type: 'line', data: scoreList
            },
            {
              name: '平均分', type: 'line', data: avgScoreList, lineStyle: { normal: { width: 2, type: 'dashed' } }
            },
            {
              name: '最高分', type: 'line', data: maxScoreList, lineStyle: { normal: { width: 2, type: 'dashed' } }
            },
            {
              name: '最低分', type: 'line', data: minScoreList, lineStyle: { normal: { width: 2, type: 'dashed' } }
            }
          ]
          this.optionAchievement.xAxis.data = dateList
          this.achievementBase[val] = {
            x: dateList,
            a: scoreList,
            b: avgScoreList,
            c: maxScoreList,
            d: minScoreList
          }
          this.achievementChart.setOption(this.optionAchievement)
        } else {
          this.showAchievement = false
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getRankCharts (val) {
      if (this.rankBase[val]) {
        this.showRank = true
        this.optionRank.xAxis = {
          type: 'category',
          data: this.rankBase[val].x
        }
        this.optionRank.yAxis = {
          type: 'value',
          inverse: true,
          splitNumber: this.rankBase[val].y.length
        }
        this.optionRank.series = [{
          data: this.rankBase[val].y,
          type: 'line',
          name: '名次',
          smooth: true
        }]
        this.rankChart.setOption(this.optionRank)
        return
      }
      api.queryRankTrend(
        {
          schoolId: this.$route.params.schoolId,
          classId: this.$route.params.classId,
          achievementsId: this.achievementsId,
          rankName: val,
          studentId: this.$route.params.studentId,
          type: this.$route.params.type
        }, (data) => {
        if (data.length > 0) {
          this.showRank = true
          let dateList = []
          let rankList = []
          for (let i = 0; i < data.length; i++) {
            dateList.push((this.tools.formateTime(data[i].publishDate, 'YYYY.MM.DD')).toString())
            rankList.push(data[i].rank)
          }
          this.optionRank.xAxis = {
            type: 'category',
            data: dateList,
            axisLabel: {
              rotate: 30,
              interval: 0
            },
            axisLine: { onZero: false }
          }
          this.optionRank.yAxis = {
            type: 'value',
            inverse: true,
            splitNumber: rankList.length
          }
          this.optionRank.series = [{
            data: rankList,
            type: 'line',
            name: '名次',
            smooth: true
          }]
          this.rankBase[val] = {
            x: dateList,
            y: rankList
          }
          this.rankChart.setOption(this.optionRank)
        } else {
          this.showRank = false
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
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
.defalut-item {
  border: 1px solid #ececec;
  padding: 5px 10px;
  margin: 5px;
}
.item-selected {
  border: 1px solid green;
}
</style>


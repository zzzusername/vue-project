<template>
<div>
  <div :style="{'position': 'relative', 'height': height + 'px'}">
    <scroller>
      <group v-if="achievementInfo.students" gutter="0">
        <p style="padding: 10px 15px;">{{achievementInfo.students[0].studentName}}同学的成绩单</p>
        <p v-if="examineType" style="padding: 0 15px 10px;">考试类型：{{examineType}}</p>
      </group>
      <group gutter="10px">
        <div style="text-align: left;font-size: 16px;padding: 10px 15px;">
          <p style="font-size: 16px;text-align: center;padding: 5px 0 10px;"><strong>{{achievementInfo.achievementsName}}</strong></p>
          <!-- <p v-if="achievementInfo.achievementsNote" style="text-align:center;color: red;"><strong style="padding: 0 5px;border-bottom: 2px solid red">备注</strong></p> -->
          <!-- <i v-if="achievementInfo.students[0].parentIsRead" style="font-size: 12px;color:red;">已知晓</i> -->
          <p v-if="alertHint" style="margin: 10px 0 5px;font-size: 14px;color:red;">重要提示：{{alertHint}}</p>

          <p v-if="achievementInfo.achievementsNote" style="text-align:center;color: rgb(46, 132, 212);padding: 10px"><strong style="padding: 0 5px;border-bottom: 2px solid rgb(46, 132, 212)">说明</strong></p>
          <p v-if="achievementInfo.achievementsNote" style="margin: 10px 0;font-size: 16px;">{{achievementInfo.achievementsNote}}</p>
          <table v-if="achievementInfo.students" v-for="(item, index) in achievementInfo.students" :key="index" width="100%" cellspacing="0">
            <tr>
              <td colspan="2" style="text-align:center;color: rgb(46, 132, 212);padding: 10px"><strong style="padding: 0 5px;border-bottom: 2px solid rgb(46, 132, 212)">成绩</strong></td>
            </tr>
            <tr v-for="(score, i) in item.score" :key="i">
              <td>{{(score.lessonName == null ? '总成绩' : score.lessonName)+(getFullScore(score.lessonId)>0?' (满分'+getFullScore(score.lessonId)+')':'')}}</td>
              <td v-if="achievementInfo.achievementType == 0" style="text-align:center;">{{score.achievementsScore == null ? '无成绩':score.achievementsScore}}</td>
              <td v-if="achievementInfo.achievementType == 1" style="text-align:center;">{{score.achievementsLevel == null ? '无成绩':score.achievementsLevel}}</td>
            </tr>
            <tr v-if="item.ranks && item.ranks.length > 0">
              <td colspan="2" style="text-align:center;color:rgb(46, 132, 212);padding: 10px"><strong style="padding: 0 5px;border-bottom:2px solid rgb(46, 132, 212)">排名</strong></td>
            </tr>
            <tr v-if="item.ranks" v-for="(rank, z) in item.ranks" :key="z">
              <td>{{rank.rankName}}</td>
              <td style="text-align:center;">{{rank.rank == null ? '无排名' : rank.rank}}</td>
            </tr>
          </table>
          <p v-if="lessons.length > 0 && achievementInfo.achievementType == 0 && achievementInfo.isShowChart" style="text-align:center;color: rgb(46, 132, 212);padding: 10px"><strong style="padding: 0 5px;border-bottom: 2px solid rgb(46, 132, 212)">成绩分布情况</strong></p>
          <div v-if="lessons.length > 1 && achievementInfo.achievementType == 0 && achievementInfo.isShowChart">
            <checker default-item-class="defalut-item" selected-item-class="item-selected" v-model="lessonId" radio-required>
              <checker-item v-for="(item, index) in lessons" :key="index" :value="item.lessonId">{{item.lessonName}}</checker-item>
            </checker>
          </div>
          <div v-if="achievementData && achievementData.avgAchievement && achievementData.maxAchievement" style="display: flex;margin-top: 10px">
            <p style="flex: 1;text-align:center;font-size:15px;">最高分数<br>{{achievementData.maxAchievement}}</p>
            <p style="flex: 1;text-align:center;font-size:15px;">平均分数<br>{{achievementData.avgAchievement}}</p>
            <p style="flex: 1;text-align:center;font-size:15px;">我的分数<br><span style="color:#2E84D4">{{achievementData.stuAchievement}}</span></p>
          </div>
          <div ref="chart" style="height: 45vh"></div>
        </div>
      </group>
    </scroller>
  </div>
  <div>
    <alert :hide-on-blur="false" v-model="showReadBtn" title="提示" button-text="我已知晓" @on-hide="onAlertHide"><span style="color: red">{{alertHint}}</span></alert>
  </div>
  <detail-tabbar></detail-tabbar>
</div>
</template>

<script>
import {Group, Alert, Checker, CheckerItem} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
// import echarts from 'echarts'
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import api from '../../api'
export default {
  components: {
    Group, Alert, Checker, CheckerItem, DetailTabbar
  },
  data() {
    return {
      height: 0,
      achievementInfo: {},
      showReadBtn: false,
      alertHint: '',
      chart: null,
      lessons: [],
      lessonId: null,
      option: {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}人 ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            label: {
              // formatter: '{b} \n{c}人 {d}%\n {@student}'
              formatter: (params) => {
                let base = params.data.name + '\n' + params.data.value + '人 ' + params.percent + '% '
                if (params.data.student) {
                  base += '\n' + params.data.student
                }
                return base
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      optionData: {},
      achievementData: null,
      achievementCache: {},
      examineType: null
    }
  },
  computed: {
    id() {
      return this.$route.params.achievementsId
    },
    studentId() {
      return this.$route.params.studentId
    },
    schoolId() {
      return this.$route.params.schoolId
    }
  },
  mounted() {
    this.height = window.innerHeight - 50
    this.chart = echarts.init(this.$refs.chart)
    this.getInfo()
  },
  watch: {
    lessonId(cval, oval) {
      this.getCharts(cval)
    }
  },
  methods: {
    getInfo() {
      api.queryAchievementInfo({schoolId: this.$route.params.schoolId, achievementsId: this.id, studentId: this.$route.params.studentId}, (data) => {
        this.achievementInfo = data
        this.editTypeCode(this.achievementInfo.typeCode, this.achievementInfo.typeParam, this.achievementInfo.typeYear)
        let info = data.students[0]
        if (info.achievementsBadNote) {
          this.alertHint += info.achievementsBadNote
        }
        if (info.achievementsTeacherNote) {
          if (this.alertHint === '') {
            this.alertHint += info.achievementsTeacherNote
          } else {
            this.alertHint += (',' + info.achievementsTeacherNote)
          }
        }
        if (info.needFeedBack && !info.parentIsRead && this.studentId) {
          this.showReadBtn = true
        }
        if (data.students[0].score.length > 0) {
          data.students[0].score.forEach(element => {
            let obj = {}
            if (element.lessonId) {
              obj = {lessonName: element.lessonName, lessonId: element.lessonId}
            } else {
              obj = {lessonName: '总成绩', lessonId: 0}
            }
            this.lessons.push(obj)
          })
          if (data.achievementType === 0 && data.isShowChart) {
            this.lessonId = data.students[0].score[0].lessonId
          }
        }
        // this.showReadBtn = true
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getFullScore(lessonId) {
      if (lessonId) {
        for (let i = 0; i < this.achievementInfo.fullmarks.length; i++) {
          if (this.achievementInfo.fullmarks[i].lessonId === lessonId) {
            return this.achievementInfo.fullmarks[i].score
          }
        }
      } else {
        // let count = 0
        // this.achievementInfo.fullmarks.forEach(element => {
        //   count = count + element.score
        // })
        // return count
        for (let i = 0; i < this.achievementInfo.fullmarks.length; i++) {
          if (this.achievementInfo.fullmarks[i].lessonId === null) {
            return this.achievementInfo.fullmarks[i].score
          }
        }
      }
    },
    onAlertHide() {
      api.achievementFeedback({schoolId: this.$route.params.schoolId, achievementsId: this.id, studentId: this.$route.params.studentId}, (data) => {
        this.achievementInfo.parentIsRead = true
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    warnToast(er, hint) {
      if (er.toUser) {
        this.tools.warnToast(er.message)
      } else {
        this.tools.warnToast(hint)
      }
    },
    getCharts(cval) {
      if (this.optionData[cval]) {
        this.achievementData = this.achievementCache[cval]
        this.option.series[0]['data'] = this.optionData[cval]
        this.chart.setOption(this.option)
        return
      }
      api.getAchievementChartByStudent({schoolId: this.schoolId, achievementsId: this.id, lessonId: this.lessonId, studentId: this.studentId}, (data) => {
        this.achievementCache[cval] = data
        this.achievementData = data
        if (data.chartValue.length > 0) {
          let array = []
          data.chartValue.forEach(element => {
            let names = element.achLevel.split('-')
            let start = ''
            if (names[0].indexOf('.') > -1) {
              start = names[0].substr(0, names[0].indexOf('.'))
            } else {
              start = names[0]
            }
            let end = ''
            if (names[1].indexOf('.') > -1) {
              end = names[1].substr(0, names[1].indexOf('.'))
            } else {
              end = names[1]
            }
            let obj = {value: element.achCount, name: start + '分-' + end + '分'}
            this.achievementInfo.students[0].score.forEach(item => {
              if (item.lessonId === this.lessonId) {
                if (item.achievementsScore > parseFloat(names[0]) && item.achievementsScore <= parseFloat(names[1])) {
                  obj.student = '你在这儿'
                  obj.selected = true
                }
              }
            })
            array.push(obj)
          })
          this.optionData[cval] = array
          this.option.series[0]['data'] = array
          this.chart.setOption(this.option)
        }
      }, er => {
        this.warnToast(er)
      })
    },
    editTypeCode (typeCode, typeParam, typeYear) {
      if (typeCode) {
        var str = ''
        switch (typeCode) {
          case 'RCCS':
            this.examineType = '日常测试'
            break
          case 'YK':
            this.examineType = typeYear + '年' + typeParam + '月月考'
            break
          case 'QZKS':
            if (parseInt(typeParam) === 1) {
              str = '上学期'
            } else {
              str = '下学期'
            }
            this.examineType = typeYear + '年' + str + '期中考试'
            break
          case 'QMKS':
            if (parseInt(typeParam) === 1) {
              str = '上学期'
            } else {
              str = '下学期'
            }
            this.examineType = typeYear + '年' + str + '期末考试'
            break
          case 'MNKS':
            this.examineType = '第' + this.moniKaoshi(typeParam) + '次模拟考试'
            break
          case 'XYHK':
            this.examineType = '学业会考'
            break
          case 'ZK':
            this.examineType = '中考'
            break
          case 'GK':
            this.examineType = '高考'
            break
        }
      }
    },
    moniKaoshi (code) {
      let str = ''
      switch (parseInt(code)) {
        case 1:
          str = '一'
          break
        case 2:
          str = '二'
          break
        case 3:
          str = '三'
          break
        case 4:
          str = '四'
          break
        case 5:
          str = '五'
          break
        case 6:
          str = '六'
          break
        case 7:
          str = '七'
          break
        case 8:
          str = '八'
          break
        case 9:
          str = '九'
          break
        case 10:
          str = '十'
          break
      }
      return str
    }
  }
}
</script>

<style lang="less" scoped>
table {
  font-size: 16px;
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


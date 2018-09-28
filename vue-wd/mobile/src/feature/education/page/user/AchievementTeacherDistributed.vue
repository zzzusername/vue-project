<template>
  <div style="margin: 10px;">
    <divider v-if="lessons.length > 1">请选择</divider>
    <div class="lesson-content" v-if="lessons.length > 1">
      <checker default-item-class="defalut-item" selected-item-class="item-selected" v-model="lessonId" radio-required>
        <checker-item v-for="(item, index) in lessons" :key="index" :value="item.lessonId?item.lessonId:0">{{item.lessonName}}</checker-item>
      </checker>
    </div>
    <divider>成绩分布情况</divider>
    <div v-if="achievementData && achievementData.avgAchievement && achievementData.maxAchievement" style="display: flex;margin-top: 10px">
      <p style="flex: 1;text-align:center">最高分: {{achievementData.maxAchievement}}</p>
      <p style="flex: 1;text-align:center">平均分: {{achievementData.avgAchievement}}</p>
    </div>
    <div ref="pie_chart" style="height: 45vh"></div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Checker, CheckerItem, Divider } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
export default {
  components: {
    DetailTabbar, Checker, CheckerItem, Divider
  },
  data() {
    return {
      lessons: [],
      lessonId: undefined,
      chart: null,
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
              normal: {
                formatter: '{b} \n{c}人 {d}%'
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
      achievementCache: {}
    }
  },
  computed: {
    schoolId() {
      return this.$route.params.schoolId
    },
    achievementsId() {
      return this.$route.params.achievementsId
    }
  },
  watch: {
    lessonId(cval, oval) {
      if (this.optionData[cval]) {
        this.achievementData = this.achievementCache[cval]
        this.option.series[0]['data'] = this.optionData[cval]
        this.chart.setOption(this.option)
        return
      }
      api.getAchievementChartByTeacher({schoolId: this.schoolId, achievementsId: this.achievementsId, lessonId: cval}, (data) => {
        if (!data.maxAchievement) {
          return
        }
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
            array.push({value: element.achCount, name: start + '分-' + end + '分'})
          })
          this.optionData[cval] = array
          this.option.series[0]['data'] = array
          this.chart.setOption(this.option)
        }
      }, (er) => {
        this.warnToast(er, '获取图表信息失败')
      })
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.pie_chart)
    api.getLessonsByAchievementId({schoolId: this.schoolId, achievementsId: this.achievementsId}, (data) => {
      this.lessons = data
      if (data.length > 0) {
        this.lessonId = data[0].lessonId ? data[0].lessonId : 0
      }
    }, (er) => {
      this.warnToast(er, '获取课程列表失败')
    })
  },
  methods: {
    warnToast(er, hint) {
      if (er.toUser) {
        this.tools.warnToast(er.message)
      } else {
        this.tools.warnToast(hint)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.defalut-item {
  border: 1px solid #ececec;
  padding: 5px 10px;
  margin: 5px;
}
.item-selected {
  border: 1px solid green;
}
.lesson-content {
  padding: 10px 15px 10px
}
</style>


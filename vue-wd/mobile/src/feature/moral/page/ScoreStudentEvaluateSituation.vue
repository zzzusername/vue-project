<template>
  <!-- 学生操行评定报告列表 -->
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多评定情况～" ref="manage_scroller">
        <div v-if="dataList.length==0" style="height: 10px"></div>
        <cell v-for="(item, index) in dataList" :key="index" style="background:#fff;" is-link :link="{name: 'educationScoreStudentEvaluateSituationDetail', params: {reportId: item.reportId}}">
          <span slot="title" style="font-size:15px;">{{item.reportName}}</span>
          <span slot="inline-desc" style="margin-left:5px;">{{getDateTime(item.reportStartDate) + ' 至 ' + getDateTime(item.reportEndDate)}}</span>
        </cell>
      </scroller>
    </div>
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Cell, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/moral/api'
export default {
  components: {
    DetailTabbar, Cell
  },
  data () {
    return {
      actions: [],
      scrollerHeight: 0,
      dataList: []
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50
    api.getMoralTeacherInfo({schoolId: this.$route.params.schoolId}, (data) => {
      if (data.isDeyu || data.isGrade || data.isAdviser) {
        this.actions = [{name: '查询并生成报告'}]
      } else {
        this.actions = []
      }
    }, () => {})
  },
  methods: {
    submit () {
      this.$router.push({name: 'educationScoreStudentEvaluateRanking'})
    },
    getDateTime (time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    queryStudentReportList (rowStart, callback) {
      api.queryStudentReportList({schoolId: this.$route.params.schoolId, rowStart, rowCount: 20}, (data) => {
        callback(data)
      }, () => {})
    },
    infinite (done) {
      this.queryStudentReportList(this.dataList.length, (data) => {
        this.dataList = this.dataList.concat(data)
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
      })
    }
  }
}
</script>

<style>

</style>

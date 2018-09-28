<template>
  <div>
    <group>
      <cell :title="reportInfo.report.reportName">
        <p slot="inline-desc"><span>时间：{{tools.formateTime(reportInfo.report.reportStartDate, 'YYYY-MM-DD')}}</span> - <span>{{tools.formateTime(reportInfo.report.reportEndDate, 'YYYY-MM-DD')}}</span></p>
        <p>{{reportInfo.record.totalScore}}分</p>
        <p slot="inline-desc"><span v-show="reportInfo.record.additionStore>0" style="margin-right:10px;">加分：{{reportInfo.record.additionStore}}分</span><span style="margin-right:10px;" v-show="reportInfo.record.subtractStore>0">扣分：{{reportInfo.record.subtractStore}}分</span><span v-show="reportInfo.record.attachStore>0">无违纪：＋{{reportInfo.record.attachStore}}分</span></p>
      </cell>
    </group>
    <group v-if="scoreList.length>0" title="评定明细">
      <cell v-for="(item, index) in scoreList" :key="index" :title="item.projectName" :value="getValue(item) + '分'" is-link @click.native="skip(item)">
        <p slot="inline-desc">{{tools.formateTime(item.evaluateDate, 'YYYY-MM-DD HH:mm')}}</p>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import {Group, Cell} from 'vux'
import api from '../api'
export default {
  components: {
    DetailTabbar, Group, Cell
  },
  data () {
    return {
      reportInfo: {},
      scoreList: []
    }
  },
  mounted () {
    api.getStudentRecordInfo({schoolId: this.$route.params.schoolId, recordId: this.$route.params.recordId}, (data) => {
      this.reportInfo = data
      api.getStudentMinusScoreList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, startDate: this.tools.formateTime(data.report.reportStartDate, 'YYYY-MM-DD'), endDate: this.tools.formateTime(data.report.reportStartDate, 'YYYY-MM-DD'), rowStart: 0, rowCount: 999}, (itemList) => {
        this.scoreList = itemList
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }, () => {})
  },
  methods: {
    skip(val) {
      this.$router.push({name: 'educationMoralStudentScoreDetail', params: {studentId: this.$route.params.studentId, evaluateId: val.evaluateId}})
    }
  }
}
</script>

<style>

</style>

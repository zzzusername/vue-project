<template>
  <div :style="{'position': 'relative', height: contentHeight + 'px'}">
    <scroller>
      <group v-if="reportList.length > 0" title="操行报告">
        <cell v-for="(item, index) in reportList" :key="index" :title="item.reportName" is-link @click.native="reportItem(item)">
          <p slot="inline-desc"><span>{{tools.formateTime(item.reportStartDate, 'YYYY-MM-DD')}}</span> - <span>{{tools.formateTime(item.reportEndDate, 'YYYY-MM-DD')}}</span></p>
          <p>{{item.totalScore}}分</p>
        </cell>
      </group>
    </scroller>
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
  data() {
    return {
      contentHeight: 0,
      reportList: []
    }
  },
  computed: {
    schoolId() {
      return this.$route.params.schoolId
    },
    studentId() {
      return this.$route.params.studentId
    }
  },
  mounted() {
    this.contentHeight = window.innerHeight - 50
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
    getReportList() {
      api.getReportList({schoolId: this.schoolId, studentId: this.studentId}, data => {
        this.reportList = data
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
    }
  }
}
</script>

<style>

</style>

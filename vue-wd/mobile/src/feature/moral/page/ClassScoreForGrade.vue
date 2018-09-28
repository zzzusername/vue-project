<template>
  <!-- 根据年级组的报告查询班级的排名情况 -->
  <div>
    <group gutter="0">
      <cell :title="info.report.reportName">
        <span slot="inline-desc" style="margin-left:5px;">{{getDateTime(info.report.reportStartDate) + ' 至 ' + getDateTime(info.report.reportEndDate)}}</span>
      </cell>
    </group>
    <group>
      <cell title="综合" :value="info.record.totalScore+'分'">
        <span slot="inline-desc">年级排名：{{info.record.ranking}}</span>
      </cell>
      <cell v-for="(item, index) in info.record.projects" :key="index" :title="item.projectName" :value="item.totalStore+'分'">
        <span slot="inline-desc">年级排名：{{item.ranking}}</span>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import { Group, Cell, dateFormat } from 'vux'
import api from '@/feature/moral/api'
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data () {
    return {
      info: {}
    }
  },
  mounted () {
    api.queryClassRecordIdInfo({schoolId: this.$route.params.schoolId, recordId: this.$route.params.recordId}, (data) => {
      this.info = data
    }, () => {})
  },
  methods: {
    getDateTime (time) {
      return dateFormat(time, 'YYYY-MM-DD')
    }
  }
}
</script>

<style>

</style>

<template>
  <!-- 我的班级的报告排名 -->
  <div>
    <group>
      <cell v-for="(item, index) in reportData" :key="index" :title="item.className" is-link @click.native="onDetail(item)">
        <span slot="inline-desc" style="margin-top:5px;margin-left:-8px;">{{item.reportName}}</span>
        <p slot="inline-desc" style="margin-top:5px;">排名：{{item.ranking}}</p>
        <p style="font-size:14px;">{{item.totalScore+'分'}}</p>
      </cell>
    </group>
    <p style="text-align: center;padding: 10px;font-size: 16px;color: #999;" v-if="reportData.length == 0">没有更多评定报告</p>
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
      reportData: []
    }
  },
  mounted () {
    api.queryClassReportForTeacher({schoolId: this.$route.params.schoolId}, (data) => {
      this.reportData = data
    }, () => {})
  },
  methods: {
    onDetail (item) {
      this.$router.push({name: 'educationMoralClassScoreForGrade', params: {recordId: item.recordId}})
    },
    getDateTime (time) {
      return dateFormat(time, 'YYYY-MM-DD')
    }
  }
}
</script>

<style>

</style>

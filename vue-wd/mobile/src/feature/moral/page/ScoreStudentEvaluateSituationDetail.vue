<template>
  <div>
    <group>
      <cell v-for="(item, index) in reportData" :key="index" :title="item.studentName" :value="item.totalScore+'分'">
        <p slot="inline-desc" style="margin-top:5px;"><span v-show="item.ranking>0" style="margin-right:10px;">排名：{{item.ranking}}</span><span v-show="item.additionStore>0" style="margin-right:10px;">加分：{{item.additionStore}}分</span><span style="margin-right:10px;" v-show="item.subtractStore>0">扣分：{{item.subtractStore}}分</span><span v-show="item.attachStore>0">无违纪：＋{{item.attachStore}}分</span></p>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/moral/api'
export default {
  components: {
    DetailTabbar, Group, Cell
  },
  data () {
    return {
      reportData: []
    }
  },
  mounted () {
    api.queryStudentReportInfo({schoolId: this.$route.params.schoolId, reportId: this.$route.params.reportId}, (data) => {
      this.reportData = data
    }, () => {})
  }
}
</script>

<style>

</style>

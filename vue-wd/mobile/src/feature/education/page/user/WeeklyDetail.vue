<template>
  <div>
    <group gutter="0">
      <cell :title="tools.formateTime(detail.weeklyEndDate, 'YYYY-MM-DD') + ' 周报'">
        <p slot="inline-desc">{{detail.className}}</p>
      </cell>
    </group>
    <group gutter="5px" v-if="detail != null">
      <!-- <cell v-if="detail.checkArrived != null" title="已到" :value="detail.checkArrived + ' 次'"></cell> -->
      <cell v-if="detail.checkNonarrival != null && detail.checkNonarrival != 0" title="未到">
        <p><span style="color:#FF6D56">{{detail.checkNonarrival}}</span> 次</p>
      </cell>
      <cell v-if="detail.checkVacation != null && detail.checkVacation != 0" title="请假">
        <p><span style="color: #FF6D56">{{detail.checkVacation}}</span> 次</p>
      </cell>
      <cell v-if="detail.checkLate != null && detail.checkLate != 0" title="迟到">
        <p><span style="color: #FF6D56">{{detail.checkLate}}</span> 次</p>
      </cell>
      <cell v-if="detail.checkLeaveEarly != null && detail.checkLeaveEarly != 0" title="早退">
        <p><span <span style="color: #FF6D56">{{detail.checkLeaveEarly}}</span> 次</p>
      </cell>
      <cell v-if="detail.checkTruant != null && detail.checkTruant != 0" title="旷课">
        <p><span <span style="color: #FF6D56">{{detail.checkTruant}}</span> 次</p>
      </cell>
      <cell v-if="isFullAttend(detail)" title="状态" value="全勤"></cell>
      <!-- <cell v-if="detail.checkRests != null" title="未点名" :value="detail.checkRests + ' 次'"></cell> -->
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data() {
    return {
      detail: null
    }
  },
  mounted() {
    let schoolId = this.$route.params.schoolId
    let studentId = this.$route.params.studentId
    let weeklyId = this.$route.params.weeklyId
    api.getUserWeeklyDetail({schoolId, studentId, weeklyId}, (data) => {
      this.detail = data
    }, (er) => {
      if (er.toUser !== undefined && er.toUser) {
        this.tools.warnToast(er.message)
      }
    })
  },
  methods: {
    isFullAttend(val) {
      if (val.checkNonarrival === 0 && val.checkVacation === 0 && val.checkLate === 0 && val.checkLeaveEarly === 0 && val.checkTruant === 0) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style>

</style>

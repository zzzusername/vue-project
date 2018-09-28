<template>
  <div>
    <group gutter="0">
      <cell :title="tools.formateTime(detail.weeklyEndDate, 'YYYY-MM-DD') + ' 周报'">
        <p slot="inline-desc">{{detail.className}}</p>
      </cell>
    </group>
    <group gutter="5px">
      <cell v-for="(item, index) in detail.studentList" :key="index" :title="item.studentName">
        <p slot="inline-desc">
          <!-- <span>已到: {{item.checkArrived}} 次</span> -->
          <span v-if="item.checkNonarrival != 0">未到: <span style="color: #FF6D56">{{item.checkNonarrival}}</span> 次</span>
          <span v-if="item.checkVacation != 0">请假: <span style="color: #FF6D56">{{item.checkVacation}}</span> 次</span>
          <span v-if="item.checkLate != 0">迟到: <span style="color: #FF6D56">{{item.checkLate}}</span> 次</span>
          <span v-if="item.checkLeaveEarly != 0">早退: <span style="color: #FF6D56">{{item.checkLeaveEarly}}</span> 次</span>
          <span v-if="item.checkTruant != 0">旷课: <span style="color: #FF6D56">{{item.checkTruant}}</span> 次</span>
          <span v-if="isFullAttend(item)">全勤</span>
        </p>
      </cell>
    </group>
    <!-- <div style="height: 50px;"></div> -->
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
      detail: {}
    }
  },
  mounted() {
    let schoolId = this.$route.params.schoolId
    let weeklyId = this.$route.params.weeklyId
    let classId = this.$route.params.classId
    api.getManageWeeklyDetail({schoolId, weeklyId, classId}, (data) => {
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

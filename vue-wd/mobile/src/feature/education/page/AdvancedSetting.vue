<template>
  <div>
    <group>
      <cell v-if="!isPersonal" title="教师完善信息设置" :link="{name: 'educationBasePerfectInfoSetting', params: {type: 1}}"></cell>
      <cell v-if="!isPersonal" title="学生完善信息设置" :link="{name: 'educationBasePerfectInfoSetting', params: {type: 2}}"></cell>
      <cell v-if="!isPersonal" title="家长完善信息设置" :link="{name: 'educationBasePerfectInfoSetting', params: {type: 3}}"></cell>
      <!-- <cell v-if="!isPersonal" title="接收考勤通知设置" :link="{name: 'educationAttendPushSetting'}"></cell> -->
      <cell title="学校功能开关设置" :link="{name: 'educationFeatureSetting'}"></cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data () {
    return {
      isPersonal: true
    }
  },
  mounted () {
    this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (info) => {
      if (info.schoolModel === 2) {
        this.isPersonal = true
      } else {
        this.isPersonal = false
      }
    })
  }
}
</script>

<style>

</style>

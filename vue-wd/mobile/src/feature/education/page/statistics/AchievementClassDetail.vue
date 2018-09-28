<template>
  <div>
    <achievement-student-list :classId="$route.params.classId"></achievement-student-list>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import AchievementStudentList from './AchievementStudentList.vue'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    AchievementStudentList, DetailTabbar
  }
}
</script>

<style>

</style>

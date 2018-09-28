<template>
  <div>
    <group v-if="students.length > 1" gutter="10px">
      <cell v-for="(item, index) in students" :key="index" :title="item.studentName" is-link :link="{name: 'educationActivityDetailForParents', params: {activityId: $route.params.activityId, studentId: item.studentId}}">
        <p slot="inline-desc" v-if="item.userName != null">微信昵称：{{item.userName}}</p>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import eduApi from '@/feature/education/api.js'
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data() {
    return {
      students: []
    }
  },
  mounted() {
    this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
      if (this.$route.params.activityType !== 'teacher' && data.isParent) {
        eduApi.getParentInfoSelf({schoolId: this.$route.params.schoolId}, (data) => {
          this.students = data.studentlist
          if (this.students.length === 1) {
            this.$router.replace({name: 'educationActivityDetailForParents', params: {activityId: this.$route.params.activityId, studentId: this.students[0].studentId}})
          }
        })
      } else {
        this.$router.replace({name: 'educationActivityDetail', params: {activityId: this.$route.params.activityId}})
      }
    }, (er) => {
    })
  }
}
</script>

<style>

</style>

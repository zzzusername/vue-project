<template>
  <div>
    <div :is="plugin"></div>
  </div>
</template>

<script>
import ClassAndInterestManage from '@/feature/education/page/ClassAndInterestManage.vue'
import ClassGradeManage from '@/feature/education/page/ClassGradeManage.vue'
import api from '../api'
export default {
  components: {
    ClassAndInterestManage, ClassGradeManage
  },
  data () {
    return {
      plugin: ''
    }
  },
  mounted () {
    api.getGradeList({schoolId: this.$route.params.schoolId}, (gradeList) => {
      if (gradeList.length > 0) {
        this.plugin = 'class-grade-manage'
      } else {
        api.getClassList({ schoolId: this.$route.params.schoolId, classType: 1, rowStart: 0, rowCount: 5 }, (classList) => {
          if (classList.length > 0) {
            this.plugin = 'class-and-interest-manage'
          } else {
            this.plugin = 'class-grade-manage'
          }
        }, (er) => {
          this.plugin = 'class-grade-manage'
        })
      }
    }, (er) => {
      this.plugin = 'class-grade-manage'
    })
  }
}
</script>

<style>

</style>

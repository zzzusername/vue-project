<template>
</template>

<script>
import userApi from '@/feature/user/api'
import educationApi from '@/feature/education/api'
export default {
  mounted () {
    userApi.invalidBindKey({key: this.$route.params.userBindKey}, () => {
    }, () => {})
    educationApi.getUserSchoolSetting({schoolId: this.$route.params.schoolId}, (data) => {
      this.onLink(data)
    }, (er) => {})
  },
  methods: {
    onLink (userInfo) {
      if (userInfo.teacherStatus !== 2 && userInfo.parentStatus !== 2) {
        this.$router.replace({name: 'schoolIndex', params: {schoolId: this.$route.params.schoolId}})
      }
    }
  }
}
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  mounted () {
    // 通过schoolId 及用户查询身份
    // 学生
    this.$router.replace({name: 'educationStudentHome'})
    // 老师
    this.$router.replace({name: 'educationTeacherHome'})
    // 家长
    this.$router.replace({name: 'educationParentsHome'})
  }
}
</script>

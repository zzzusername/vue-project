<template>
  <div>
    <actionsheet v-model="show" :menus="menus" @on-click-menu="routerLink" :close-on-clicking-mask="false" :close-on-clicking-menu="false">
    </actionsheet>
  </div>
</template>

<script>
import { Actionsheet } from 'vux'
import api from '../../api'

export default {
  components: {
    Actionsheet
  },
  data () {
    return {
      show: false,
      menus: {},
      info: {}
    }
  },
  mounted () {
    api.getAchievementIntro({schoolId: this.$route.params.schoolId, achievementsId: this.$route.params.achievementsId}, (data) => {
      this.info = data
      if (data.identity.length === 0 && !data.isAuth) {
        // 没有身份也没有权限访问成绩详情
        this.routerLink('NONE')
        return
      }
      if (data.identity.length === 0 && data.isAuth) {
        // 只是任课教师
        this.routerLink('TEACHER')
        return
      }
      this.menus = {
        'title.noop': '<span style="color:#666;font-size:14px;">请您先选择身份后再查看成绩详情</span>'
      }
      data.identity.forEach(element => {
        if (element === 'TEACHER') {
          this.menus.TEACHER = '我是教师／家委会成员'
        } else if (element === 'PARENT') {
          this.menus.PARENT = '我是家长'
        } else if (element === 'STUDENT') {
          this.menus.STUDENT = '我是学生'
        }
      })
      if (data.identity.length > 1) {
        // 多重身份
        this.show = true
      } else {
        this.routerLink(data.identity[0])
      }
    }, () => {})
  },
  methods: {
    routerLink (type) {
      if (type === 'TEACHER') {
        // if (this.info.lessonCount > 1) {
        this.$router.replace({name: 'educationAchievementMulInfo', params: {achievementsId: this.info.achievementsId}})
        // } else {
        //   this.$router.replace({name: 'educationAchievementModify', params: {achievementsId: this.info.achievementsId}})
        // }
      } else if (type === 'STUDENT') {
        this.$router.replace({name: 'educationStudentAchievementList'})
      } else if (type === 'PARENT') {
        this.$router.replace({name: 'educationAchievementList', params: {studentId: this.info.studentId}})
      } else if (type === 'NONE') {
        this.$router.replace({name: 'schoolIndex'})
      }
    }
  }
}
</script>

<style>

</style>

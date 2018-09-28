<template>
  <div>
    <actionsheet v-model="show" :menus="menus" @on-click-menu="routerLink" :close-on-clicking-mask="false" :close-on-clicking-menu="false">
    </actionsheet>
  </div>
</template>

<script>
import { Actionsheet } from 'vux'
import api from '../../api'
import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    api.getWorkIntro({schoolId: this.$route.params.schoolId, workId: this.$route.params.workId}, (data) => {
      this.info = data
      if (data.identity.length === 0) {
        // 没有身份也没有权限访问成绩详情
        this.routerLink('NONE')
        return
      }
      this.menus = {
        'title.noop': '<span style="color:#666;font-size:14px;">请您先选择身份后再查看作业详情</span>'
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
        // 创建者
        this.$router.replace({name: 'educationHomeworkOverview', params: {classId: this.info.classId, workId: this.info.workId}})
      } else if (type === 'STUDENT') {
        this.$router.replace({name: 'educationStudentWorkDetails', params: {student: this.info.workStudentId[0]}})
      } else if (type === 'PARENT') {
        this.$router.replace({name: 'educationStudentWorkDetails', params: {student: this.info.workStudentId[0]}})
      } else if (type === 'NONE') {
        if (this.userInfo.isTeacher || this.userInfo.isMaster) {
          // 其他教师或管理员
          this.$router.replace({name: 'educationHomeworkOverview', params: {classId: this.info.classId, workId: this.info.workId}})
        } else {
          this.$router.replace({name: 'schoolIndex'})
        }
      }
    }
  }
}
</script>

<style>

</style>


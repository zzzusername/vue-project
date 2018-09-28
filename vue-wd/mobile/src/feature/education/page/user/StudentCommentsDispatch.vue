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
    api.getCommentIntro({schoolId: this.$route.params.schoolId, commentPeriodId: this.$route.params.commentPeriodId}, (data) => {
      this.info = data
      if (data.identity.length === 0) {
        // 没有身份也没有权限访问成绩详情
        this.routerLink('NONE')
        return
      }
      this.menus = {
        'title.noop': '<span style="color:#666;font-size:14px;">请您先选择身份后再查看评语</span>'
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
        this.$router.replace({name: 'educationWriteComments', params: {commentPeriodId: this.info.commentPeriodId}})
      } else if (type === 'STUDENT') {
        this.$router.replace({name: 'educationCycleCommentsInfo', params: {studentPeriodId: this.info.studentPeriodId, commentType: 1}})
      } else if (type === 'PARENT') {
        this.$router.replace({name: 'educationCycleCommentsInfo', params: {studentPeriodId: this.info.studentPeriodId, commentType: 1}})
      } else if (type === 'NONE') {
        this.$router.replace({name: 'schoolIndex'})
      }
    }
  }
}
</script>

<style>

</style>


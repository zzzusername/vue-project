<template>
  <div>
    <strong style="text-align:center;display:inline-block;width:100vw;margin-top:15px;font-size:16px;">对不起，绑定失败！</strong>
    <p style="margin-top:15px;color:#222;text-align:left;margin:10px;font-size:16px;">
      请您正确提供【{{userInfo.schoolName}}】三位教师的姓名，系统审核通过后方可正常使用
    </p>
    <group>
      <x-input title="第一位教师姓名" placeholder="必填" v-model="teacherName1"></x-input>
      <x-input title="第二位教师姓名" placeholder="必填" v-model="teacherName2"></x-input>
      <x-input title="第三位教师姓名" placeholder="必填" v-model="teacherName3"></x-input>
    </group>
    <detail-tabbar :actionLink="onAction" :actions="actions" :isHideMe="true"></detail-tabbar>
  </div>
</template>

<script>
import { Group, XInput } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import { mapGetters } from 'vuex'
import api from '../../api'
export default {
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  components: {
    Group, XInput, DetailTabbar
  },
  data () {
    return {
      actions: [{
        name: '完成验证'
      }],
      teacherName1: null,
      teacherName2: null,
      teacherName3: null
    }
  },
  methods: {
    onAction () {
      if (this.tools.isNull(this.teacherName1) || this.tools.isNull(this.teacherName2) || this.tools.isNull(this.teacherName3)) {
        this.tools.warnToast('验证信息不完整')
        return
      }
      let teacherInfo = JSON.parse(sessionStorage.getItem('validateBindTeacherName'))
      if (!this.tools.isNull(teacherInfo.extendParam) && teacherInfo.extendParam.length === 0) {
        teacherInfo.extendParam = null
      }
      if (this.tools.isNull(teacherInfo.teacherName)) {
        this.tools.warnToast('验证信息不完整')
        return
      }
      api.oneselfTeacherBinding({schoolId: this.$route.params.schoolId, teacherInfo, type: 2, verifiedTeacherName: [this.teacherName1, this.teacherName2, this.teacherName3]}, (data) => {
        this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId, isRefresh: true}, (data) => {
          this.tools.successToast('绑定成功')
          // if (!data.isSubscribe && window.__wxjs_environment === 'miniprogram') {
          //   this.$wechat.miniProgram.navigateTo({url: '/pages/focus/focus?name=' + data.teacherName + '&type=teacher&schoolName=' + data.schoolName})
          // }
          sessionStorage.setItem('validateBindTeacherName', null)
          api.getClassList({ schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999 }, (data) => {
            if (data.length > 0) {
              this.$router.replace({name: 'educationClassLessonsSetting', params: {settingStatus: 1}})
            } else {
              this.$router.replace({name: 'schoolIndex'})
              location.reload() // 强制刷新
            }
          }, () => {
            this.$router.replace({name: 'schoolIndex'})
            location.reload() // 强制刷新
          })
        })
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message, '160px')
        } else {
          this.tools.warnToast('绑定失败')
        }
      })
    }
  }
}
</script>

<style>

</style>

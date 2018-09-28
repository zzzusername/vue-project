<template>
  <div>
    <strong style="text-align:center;display:inline-block;width:100vw;margin-top:15px;font-size:16px;">对不起，绑定失败！</strong>
    <p style="margin-top:15px;color:#222;text-align:left;margin:10px;font-size:16px;">
      请您正确提供您子女所在班级【{{userInfo.schoolName}}{{parentInfo.className}}】班主任姓名，以及两位同班同学的姓名。系统审核通过后方可正常使用
    </p>
    <group>
      <x-input title="班主任姓名" placeholder="必填" v-model="teacherName"></x-input>
      <x-input title="第一位同学姓名" placeholder="必填" v-model="studentName1"></x-input>
      <x-input title="第二位同学姓名" placeholder="必填" v-model="studentName2"></x-input>
    </group>
    <detail-tabbar :actionLink="onAction" :actions="actions" :isHideMe="true"></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, XInput } from 'vux'
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
    Group, Cell, XInput, DetailTabbar
  },
  data () {
    return {
      actions: [{
        name: '完成验证'
      }],
      teacherName: null,
      studentName1: null,
      studentName2: null,
      className: null,
      parentInfo: {}
    }
  },
  mounted () {
    this.parentInfo = JSON.parse(sessionStorage.getItem('validateBindStudentName'))
  },
  methods: {
    onAction () {
      if (this.tools.isNull(this.teacherName) || this.tools.isNull(this.studentName1) || this.tools.isNull(this.studentName2)) {
        this.tools.warnToast('验证信息不完整')
        return
      }
      if (this.tools.isNull(this.parentInfo.classId)) {
        this.tools.warnToast('验证信息不完整')
        return
      }
      if (!this.tools.isNull(this.parentInfo.extendParam) && this.parentInfo.extendParam.length === 0) {
        this.parentInfo.extendParam = null
      }
      // let self = this
      api.saveAddParent({schoolId: this.$route.params.schoolId, classId: this.parentInfo.classId, data: this.parentInfo, teacherName: this.teacherName, validateBindStudentName: [this.studentName1, this.studentName2], type: 2}, () => {
        this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId, isRefresh: true}, (data) => {
          this.tools.successToast('绑定成功')
          // if (!data.isSubscribe && window.__wxjs_environment === 'miniprogram') {
          //   let parentName = data.parentName ? data.parentName : data.userName
          //   self.$wechat.miniProgram.navigateTo({ url: '/pages/focus/focus?name=' + parentName + '&type=parent&schoolName=' + data.schoolName })
          // }
          sessionStorage.setItem('validateBindStudentName', null)
          this.$router.replace({name: 'schoolIndex'})
          location.reload() // 强制刷新
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

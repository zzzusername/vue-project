<template>
  <div>
    <div v-if="signUpInfo !== null">
      <group>
        <x-number title="报名人数" v-model="signNum" :max="signUpInfo.userMaxSignNum" :min="0" :fillable="true"></x-number>
      </group>
      <group title="填写报名信息" titleColor="#8ebf52">
        <x-input v-for="(item, index) in signInfoList" :title="item.key" :key="index" placeholder="必填" :show-clear="true" v-model="item.value" :is-type="item.key=='手机号'?'china-mobile':''" :keyboard="item.key=='手机号'?'number':''"></x-input>
      </group>
    </div>
    <detail-tabbar :actionLink="signUpBtn" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, XNumber, XInput, XButton, Toast } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/activity/api'
import eduApi from '@/feature/education/api'
export default {
  components: {
    Group, Cell, XNumber, XInput, XButton, Toast, DetailTabbar
  },
  data () {
    return {
      signUpInfo: null,
      signNum: 1,
      signInfoList: [],
      showToast: false,
      actions: [{
        name: '报 名',
        code: 'baoming'
      }],
      defalutName: '',
      defalutPhone: ''
    }
  },
  mounted () {
    this.getSignUpInfo()
  },
  watch: {
    defalutName (newValue, oldValue) {
      for (var i = 0; i < this.signInfoList.length; i++) {
        if (this.signInfoList[i].key === '姓名') {
          this.signInfoList[i].value = newValue
        }
      }
    },
    defalutPhone (newValue, oldValue) {
      for (var i = 0; i < this.signInfoList.length; i++) {
        if (this.signInfoList[i].key === '手机号') {
          this.signInfoList[i].value = newValue
        }
      }
    }
  },
  methods: {
    getUserInfo () {
      var schoolId = this.$route.params.schoolId
      var studentId = this.$route.params.studentId
      if (!this.tools.isNull(studentId)) {
        // 是家长，需要查询家长及学生信息
        eduApi.getStudentInfo({schoolId, studentId}, (data) => {
          this.defalutName = data.studentName
        }, () => {})
        eduApi.getParentInfoSelf({schoolId}, (data) => {
          this.defalutPhone = data.telephoneNum
        }, () => {})
      } else {
        // 判断是否是教师
        this.localStorage.getUserInfo({schoolId}, (data) => {
          this.userInfo = data
          if (data.isTeacher === true) {
            // 教师
            eduApi.getTeacherinfo({schoolId}, (data) => {
              this.defalutName = data.teacherName
              this.defalutPhone = data.teacherTelephoneNum
            }, () => {})
          } else {
            // 学生
            eduApi.getStudentInfo({schoolId}, (data) => {
              this.defalutName = data.studentName
              this.defalutPhone = data.studentTelephoneNum
            }, () => {})
          }
        }, () => {})
      }
    },
    getSignUpInfo () {
      var schoolId = this.$route.params.schoolId
      var activityId = this.$route.params.activityId
      api.getSignUpInfo({schoolId, activityId}, (signUpInfo) => {
        this.signUpInfo = signUpInfo
        for (var i = 0; i < signUpInfo.userLinkData.length; i++) {
          this.signInfoList.push({key: signUpInfo.userLinkData[i].key, value: ''})
        }
        this.getUserInfo()
      }, (errorData) => {
        if (errorData.toUser) {
          this.tools.warnToast(errorData.message, '180px')
        } else {
          this.tools.warnToast('无法报名，请联系管理员', '190px')
        }
      })
    },
    signUpBtn () {
      this.showToast = false
      if (this.signNum === 0) {
        this.tools.warnToast('报名人数不能为0', '140px')
        return
      }
      for (var i = 0; i < this.signInfoList.length; i++) {
        if (this.tools.isNull(this.signInfoList[i].value)) {
          this.tools.warnToast('请完善资料')
          return
        }
      }
      var schoolId = this.$route.params.schoolId
      var studentId = this.$route.params.studentId
      var activityId = this.$route.params.activityId
      var userNum = this.signNum
      var signName = this.signInfoList[0].value
      var signPhoneNum = this.signInfoList[1].value
      var list = this.signInfoList
      var userLinkData = list.slice(2, this.signInfoList.length)
      api.signUpActivity({schoolId, activityId, studentId, userNum, userLinkData, signName, signPhoneNum}, (val) => {
        if (val.isCheck) {
          this.$router.go(-1)
          this.tools.successToast('请等待审核')
          return
        }
        this.$router.go(-1)
        this.tools.successToast('报名成功')
      }, (val) => {
        if (val.toUser === true) {
          this.tools.warnToast(val.message, '170px')
        }
      })
    }
  }
}
</script>

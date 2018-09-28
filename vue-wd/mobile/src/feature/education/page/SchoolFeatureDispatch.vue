<template>
  <div>
    <p style="text-align:center;font-size: 16px;padding: 20px 15px;fontSize:16px;color:#a2a2a2" v-show="isShowText">您还不是学校成员，不能使用此功能</p>
  </div>
</template>
<script>
// 分发功能入口
import api from '../api'
export default {
  data() {
    return {
      isShowText: false,
      schoolInfo: {},
      dispatchList: [],
      parentsFeatureList: [],
      studentFeatureList: [],
      teacherFeatureList: [],
      studentList: [] // 家长的孩子列表
    }
  },
  mounted() {
    this.getSchoolInfo((data) => {
      this.schoolInfo = data
      this.pushRouter(data)
    })
  },
  methods: {
    getSchoolInfo(callback) {
      // 使用群id或学校id查询学校信息
      api.getUserSchoolSetting({ orgId: this.$route.params.orgId, schoolId: this.$route.params.schoolId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getFeatureUrl (type) {
      var featureUrl = null
      if (type === 'teacher') {
        this.teacherFeatureList.forEach((element) => {
          if (this.$route.params.featureCode === element.featureCode) {
            featureUrl = element.featureUrl
          }
        }, this)
        if (featureUrl === null) {
          // 教师个人主页
          featureUrl = JSON.stringify({ name: 'educationTeacherHome', params: { schoolId: this.schoolInfo.schoolId } })
        } else {
          var temp = JSON.parse(featureUrl)
          temp.params = {schoolId: this.schoolInfo.schoolId}
          featureUrl = JSON.stringify(temp)
        }
        console.log('featureUrl====', featureUrl)
      } else if (type === 'student') {
        this.studentFeatureList.forEach((element) => {
          if (this.$route.params.featureCode === element.featureCode) {
            featureUrl = element.featureUrl
          }
        }, this)
        if (featureUrl === null) {
          // 学生个人主页
          featureUrl = JSON.stringify({ name: 'educationStudentHome', params: { schoolId: this.schoolInfo.schoolId } })
        } else {
          var temp2 = JSON.parse(featureUrl)
          temp2.params = {schoolId: this.schoolInfo.schoolId}
          featureUrl = JSON.stringify(temp2)
        }
      } else if (type === 'parents') {
        this.parentsFeatureList.forEach((element) => {
          if (this.$route.params.featureCode === element.featureCode) {
            featureUrl = element.featureUrl
          }
        }, this)
        if (featureUrl !== null && this.studentList.length > 0) {
          if (this.studentList.length > 1) {
            // 家长个人主页
            featureUrl = JSON.stringify({ name: 'educationParentsHome', params: { schoolId: this.schoolInfo.schoolId } })
          } else {
            var temp3 = JSON.parse(featureUrl)
            temp3.params = {studentId: this.studentList[0].studentId, schoolId: this.schoolInfo.schoolId}
            featureUrl = JSON.stringify(temp3)
          }
        } else {
          // 家长个人主页
          featureUrl = JSON.stringify({ name: 'educationParentsHome', params: { schoolId: this.schoolInfo.schoolId } })
        }
      } else if (type === 'master') {
        featureUrl = JSON.stringify({name: 'educationManageSchool', params: { schoolId: this.schoolInfo.schoolId }})
      }
      return featureUrl
    },
    pushRouter (data) {
      let skip = null
      if (this.$route.params.schoolMemberType === 'TEACHER') {
        api.getTeacherFeatures({ schoolId: this.schoolInfo.schoolId }, (features) => {
          this.teacherFeatureList = features
          skip = JSON.parse(this.getFeatureUrl('teacher'))
          if (skip !== null) {
            this.$router.replace(skip)
          } else {
            this.isShowText = true
          }
        }, (er) => {
        })
      } else if (this.$route.params.schoolMemberType === 'PARENT') {
        api.getSchoolParentFeature({schoolId: this.$route.params.schoolId}, (data) => {
          this.parentsFeatureList = data
          api.getParentInfoSelf({ schoolId: this.schoolInfo.schoolId }, (parentInfo) => {
            this.studentList = parentInfo.studentlist
            skip = JSON.parse(this.getFeatureUrl('parents'))
            if (skip !== null) {
              this.$router.replace(skip)
            } else {
              this.isShowText = true
            }
          }, (er) => {
            skip = JSON.parse(this.getFeatureUrl('parents'))
            if (skip !== null) {
              this.$router.replace(skip)
            } else {
              this.isShowText = true
            }
          })
        }, (er) => {
        })
      } else if (this.$route.params.schoolMemberType === 'STUDENT') {
        api.getSchoolStudentFeature({schoolId: this.$route.params.schoolId}, (data) => {
          this.studentFeatureList = data
          skip = JSON.parse(this.getFeatureUrl('student'))
          if (skip !== null) {
            this.$router.replace(skip)
          } else {
            this.isShowText = true
          }
        }, (er) => {
        })
      } else {
        this.isShowText = true
      }
    }
  }
}
</script>

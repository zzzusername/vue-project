<template>
  <div>
    <div v-if="dispatchList.length > 1">
      <group gutter="10px">
        <cell v-for="(item, index) in dispatchList" :key="index" :title="item.name" is-link @click.native="goFeature(item)"></cell>
      </group>
    </div>
    <p v-if="dispatchList.length === 0" style="fontSize: 16px;padding: 10px 15px;textAlign: center;color:#666">{{textHint}}</p>
    <detail-tabbar></detail-tabbar>
  </div>
</template>
<script>
// 我的学校入口的分发类，去学校收页面
import { Group, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data() {
    return {
      dispatchList: [],
      textHint: ''
    }
  },
  mounted() {
    this.getSchoolInfo((data) => {
      if (data.isParent) {
        this.dispatchList.push({ name: '我是家长', memberType: 'PARENT' })
      }
      if (data.isStudent) {
        this.dispatchList.push({ name: '我是学生', memberType: 'STUDENT' })
      }
      if (data.isTeacher || data.isMaster) {
        this.dispatchList.push({ name: '我是教师', memberType: 'TEACHER' })
      }
      if (this.dispatchList.length === 1) {
        this.$router.replace({name: 'educationSchoolFeatureDispatch', params: {featureCode: this.$route.params.featureCode, schoolId: this.$route.params.schoolId, schoolMemberType: this.dispatchList[0].memberType}})
      }
      if (this.dispatchList.length === 0) {
        if (data.schoolStatus === 3) {
          this.textHint = '您的学校暂时无法使用，请联系管理员'
        } else {
          this.textHint = '您还不是本学校成员，请联系管理员'
        }
      }
    })
  },
  methods: {
    getSchoolInfo(callback) {
      api.getUserSchoolSetting({ orgId: this.$route.params.orgId, schoolId: this.$route.params.schoolId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    goFeature (item) {
      this.$router.push({name: 'educationSchoolFeatureDispatch', params: {featureCode: this.$route.params.featureCode, schoolId: this.$route.params.schoolId, schoolMemberType: item.memberType}})
    }
  }
}
</script>

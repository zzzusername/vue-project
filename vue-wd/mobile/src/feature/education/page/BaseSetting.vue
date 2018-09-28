<template>
  <div> 
    <group>
      <cell title="教师完善信息设置" :link="{name: 'educationBasePerfectInfoSetting', params: {type: 1}}"></cell>
      <cell title="学生完善信息设置" :link="{name: 'educationBasePerfectInfoSetting', params: {type: 2}}"></cell>
      <cell title="家长完善信息设置" :link="{name: 'educationBasePerfectInfoSetting', params: {type: 3}}"></cell>
      <!-- <cell title="学生信息查看权限" inline-desc="可以查看所在班级的学生信息" :value="settingInfo.teacherLookStudentTypeName" @click.native="setLookStudentType" is-link></cell> -->
    </group>
    <popup v-model="showAuthPopupStudents" height="90%">
      <radio :options="studentTypes" style="background:#fff;font-size:18px" v-model="studentTypeKey"></radio>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 44px;margin-bottom:15px">
        <x-button plain type="primary" style="width:60vw;height:44px" @click.native="saveLookStudentType">保存并提交</x-button>
      </div>
    </popup>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import {Group, Cell, Popup, XButton, Radio} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Cell, Group, DetailTabbar, Popup, XButton, Radio
  },
  data () {
    return {
      showAuthPopupStudents: false,
      settingInfo: {},
      studentTypes: [{
        key: '1',
        value: '班主任'
      }, {
        key: '2',
        value: '全部教师'
      }],
      studentTypeKey: '1'
    }
  },
  mounted () {
    api.getSettingInfo({schoolId: this.$route.params.schoolId}, (data) => {
      this.settingInfo = data
      this.studentTypeKey = this.settingInfo.teacherLookStudentType
      this.updataLookStudentTypeName(this.settingInfo.teacherLookStudentType)
    }, () => {})
  },
  methods: {
    setLookStudentType () {
      this.showAuthPopupStudents = true
    },
    saveLookStudentType () {
      api.saveSetting({schoolId: this.$route.params.schoolId, teacherLookStudentType: this.studentTypeKey}, () => {
        this.tools.successToast('设置成功')
        this.updataLookStudentTypeName(this.studentTypeKey)
        this.settingInfo.teacherLookStudentType = this.studentTypeKey
        this.showAuthPopupStudents = false
      }, (data) => {
        if (data.toUser !== null) {
          this.tools.warnToast(data.message, '170px')
        } else {
          this.tools.warnToast('设置失败')
        }
      })
    },
    updataLookStudentTypeName (teacherLookStudentType) {
      if (teacherLookStudentType + '' === '1') {
        this.settingInfo.teacherLookStudentTypeName = '班主任'
      } else if (teacherLookStudentType + '' === '2') {
        this.settingInfo.teacherLookStudentTypeName = '全部教师'
      }
    }
  }
}
</script>

<template>
  <div>
    <group gutter="10px" v-if="showOrgSelect">
      <cell title="选择目标群成员" is-link @click.native="selectOrgUser" :value="orgUser.userOrgName == null ? orgUser.userName : orgUser.userOrgName"></cell>
    </group>
    <group label-width="5em" label-margin-right="1em" label-align="left" gutter="10px">
      <x-input title="教师姓名" placeholder="必填" v-model="paramsData.teacherName"></x-input>
      <selector title="教师性别" :options="sexList" placeholder="选填" v-model="paramsData.teacherSex"></selector>
      <popup-picker v-if="lessonList[0].length > 1" title="课程" :data="lessonList" v-model="paramsData.lessonId" show-name placeholder="请选择" popup-title="请选择" value-text-align="left"></popup-picker>
      <cell v-else title="课程">
        <div style="width: 26px;height: 26px;" @click="showHint">
          <x-icon type="ios-information-outline" size="26" style="fill: orange"></x-icon>
        </div>
      </cell>
    </group>
    <p style="font-size: 14px;padding: 3px 15px;fontSize:16px;color:#2E84D4;margin-bottom:7px;text-align:right;margin-top:10px;" @click="showImportHint=true">如何批量导入教师</p>
    <!-- 导入教师提示 -->
    <div>
      <x-dialog v-model="showImportHint" hide-on-blur :dialog-style="{'width': '75%', 'background-color': 'transparent'}">
        <div style="padding: 10px 0;backgroundColor: #fff;borderRadius: 8px;">
          <p style="margin: 20px 20px;fontSize: 16px;textAlign: left">您好！该功能需要在电脑上完成。请用电脑浏览器打开网页：
          <span style="-webkit-touch-callout:default !important; -webkit-user-select:all !important;user-select:all !important;color: #2E84D4">https://edu.qunxiaozhu.com</span>
          ，然后用您当前的微信账号扫码登录网页，选择导入教师，将您的教师名单（excel表格）整体拷贝粘贴到页面的表格中，保存完成。</p>
        </div>
        <x-icon type="ios-close-outline" style="fill:#fff;marginTop: 10px;width: 30px;height: 30px;" @click="showImportHint=false"></x-icon>
      </x-dialog>
    </div>
    <select-org-user :show-popu="showPopu" :max="1" :filter="orgFilter" @on-hide="showPopu = false" @select-value="selectUser"></select-org-user>
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
    <div>
      <confirm v-model="showConfirm" title="提示" @on-confirm="skipAddLesson" confirm-text="去添加">
        <p style="text-align:center;">您可以在课程管理中添加课程</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Group, Cell, XInput, Selector, PopupPicker, Confirm, XDialog } from 'vux'
import SelectOrgUser from '../../components/SelectOrgUser'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
import pApi from '../../personalApi'
export default {
  components: {
    Group, Cell, XInput, Selector, DetailTabbar, SelectOrgUser, PopupPicker, Confirm, XDialog
  },
  data() {
    return {
      showPopu: true,
      actions: [{name: '保存并提交'}],
      paramsData: {},
      sexList: [{key: 1, value: '男'}, {key: 2, value: '女'}],
      orgUserList: [],
      lessonList: [[]],
      lessonId: [],
      orgUser: {},
      orgFilter: {type: 1},
      showConfirm: false,
      showOrgSelect: true,
      teacherInfo: null,
      showImportHint: false
    }
  },
  mounted() {
    let teacherId = this.$route.params.teacherId
    if (teacherId) {
      this.showOrgSelect = false
      this.showPopu = false
      api.getTeacherinfo({schoolId: this.$route.params.schoolId, teacherId: this.$route.params.teacherId}, (data) => {
        this.teacherInfo = data
        this.paramsData = {
          teacherName: data.teacherName,
          teacherSex: data.teacherSex,
          lessonId: data.teacherTeaching.length > 0 ? [data.teacherTeaching[0].lessonId + ''] : []
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  },
  activated () {
    api.getLessonsList({schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 999}, (data) => {
      let temp = [{name: '无', value: '-1'}]
      data.forEach(element => {
        temp.push({name: element.lessonName, value: String(element.lessonId)})
      })
      let result = []
      result.push(temp)
      this.lessonList = result
    }, (er) => {
      if (er.toUser) {
        this.tools.warnToast(er.message)
      }
    })
  },
  methods: {
    selectOrgUser() {
      this.showPopu = true
    },
    submit() {
      // console.log(this.paramsData)
      if (this.paramsData.teacherName !== undefined && this.paramsData.teacherName !== null && this.paramsData.teacherName !== '') {
        let teacherId = this.$route.params.teacherId
        if (teacherId) {
          let info = {
            teacherId: this.teacherInfo.teacherId,
            teacherName: this.paramsData.teacherName,
            teacherSex: this.paramsData.teacherSex
          }
          if ((this.teacherInfo.teacherTeaching.length === 0 && this.paramsData.lessonId[0]) || (this.teacherInfo.teacherTeaching.length > 0 && this.paramsData.lessonId[0] !== this.teacherInfo.teacherTeaching[0].lessonId)) {
            info.lessonId = this.paramsData.lessonId[0]
          }
          pApi.updateTeacher({schoolId: this.$route.params.schoolId, info}, (data) => {
            this.tools.successToast('修改成功')
            this.$router.go(-1)
          }, (er) => {
            if (er.toUser) {
              this.tools.warnToast(er.message)
            }
          })
          return
        }
        pApi.addTeacher({schoolId: this.$route.params.schoolId, info: this.paramsData}, (data) => {
          this.tools.successToast('创建成功')
          this.$router.go(-1)
        }, er => {
          if (er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      } else {
        this.tools.warnToast('请填写教师姓名')
      }
    },
    selectUser(val) {
      this.orgUser = val
      this.paramsData.userId = val.userId
    },
    showHint() {
      this.showConfirm = true
    },
    skipAddLesson() {
      this.$router.push({name: 'educationPersonalAddLessons'})
    }
  }
}
</script>

<style>

</style>

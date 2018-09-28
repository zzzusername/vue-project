<template>
  <div>
    <tab v-if="classList.length > 1" :line-width=1>
      <tab-item :selected="selectClassId === item.classId" v-for="(item, index) in classList" @on-item-click="onSelect(item)" :key="index">{{item.className}}</tab-item>
    </tab>
    <!-- <p style="text-align:right;color:#2E84D4;padding-right:10px;">使用帮助</p> -->
    <group gutter="0">
      <cell v-for="(item,index) in studentList" :key="index" :title="item.studentName" @click.native="onShowActionsheet(index)">
        <div slot="icon" class="student_list_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}" src=""></div>
      </cell>
    </group>
    <p style="text-align: center;padding: 10px;font-size: 16px;color: #999;" v-if="studentList.length == 0">{{currentClassInfo.className}}没有更多评定员</p>
    <detail-tabbar :actions="actions" :actionLink="onAction"></detail-tabbar>
    <student-list :single="true" :show="isShowStudentList" :callback="studentListCallBack" :load="studentListLoadData" :search="studentListSearch"></student-list>
    <actionsheet v-model="showActionsheet" :menus="menus" @on-click-menu="onItemClick" show-cancel></actionsheet>
    <x-dialog v-model="isShowStudentPassword" hide-on-blur>
      <div style="height:200px;text-align:left;">
        <p style="font-size:16px;margin-top:10px;margin-left:10px;">学生姓名: {{selectStudentInfo.studentName}}</p>
        <p style="font-size:16px;margin-top:10px;margin-left:10px;">登陆帐号: {{studentPasswordInfo.userName}}</p>
        <p style="font-size:16px;margin-top:10px;margin-left:10px;">初始密码: {{studentPasswordInfo.isFirst?studentPasswordInfo.firstPassword:'无'}}</p>
        <p style="text-align:center;bottom:10px;position: absolute;width:100%;"><span style="margin:0 auto;color:#2E84D4;" @click="onResetPassword">重置密码</span></p>
      </div>
    </x-dialog>
    <video-dialog :show="showVideo" @hide-dialog="hideVideoDialog" source="http://img.qunxiaozhu.com/video/help_3.mp4" :cover="'moral_assesor_help.jpg'"></video-dialog>
  </div>
</template>

<script>
import { Group, Cell, Tab, TabItem, ConfirmPlugin, Actionsheet, XDialog } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import StudentList from '@/feature/education/components/StudentList.vue'
import VideoDialog from '@/feature/education/components/VideoDialog.vue'
import api from '../api'
import eduApi from '@/feature/education/api.js'
import Vue from 'vue'
Vue.use(ConfirmPlugin)
export default {
  components: {
    Group, Cell, DetailTabbar, Tab, TabItem, StudentList, Actionsheet, XDialog, VideoDialog
  },
  data () {
    return {
      classList: [],
      studentList: [],
      selectClassId: 0,
      actions: [{name: '使用帮助', color: '#2E84D4', code: 'help'}, {name: '添加评定员', code: 'add'}],
      currentClassInfo: {className: ''},
      isShowStudentList: false,
      showActionsheet: false,
      menus: {
        info: '密码管理',
        // reset: '重置密码',
        delete: '删除评定员'
      },
      selectStudentIndex: 0,
      selectStudentInfo: {},
      isShowStudentPassword: false,
      studentPasswordInfo: {},
      showVideo: false
    }
  },
  mounted () {
    // 请求管理的班级
    eduApi.queryHeadTeacherClassList({schoolId: this.$route.params.schoolId}, (data) => {
      this.classList = data
      if (data.length > 0) {
        this.selectClassId = data[0].classId
        this.onSelect(data[0])
      }
    }, () => {})
  },
  methods: {
    hideVideoDialog () {
      this.showVideo = false
    },
    onSelect (item) {
      this.currentClassInfo = item
      this.selectClassId = item.classId
      api.queryMoralStudentManager({schoolId: this.$route.params.schoolId, classId: this.selectClassId}, (data) => {
        this.studentList = data
      }, () => {})
    },
    onAction (type) {
      if (type === 'add') {
        this.isShowStudentList = true
      } else if (type === 'help') {
        this.showVideo = true
      }
    },
    studentListCallBack({ status, student }, cb) {
      if (status === 'cancel') {
        this.isShowStudentList = false
      } else if (status === 'success') {
        // 添加学生
        api.addMoralStudentManager({schoolId: this.$route.params.schoolId, classId: this.selectClassId, studentId: student.studentId}, () => {
          this.tools.successToast('添加成功')
          this.studentList.push(student)
          cb()
        }, () => {
          this.tools.warnToast('添加失败')
        })
      }
    },
    studentListLoadData(cb) {
      eduApi.queryStudentList({ schoolId: this.$route.params.schoolId, classId: this.selectClassId }, (data) => {
        cb(data)
      }, (er) => { })
    },
    studentListSearch(keyword, cb) {
      eduApi.queryStudentList({ schoolId: this.$route.params.schoolId, classId: this.selectClassId, studentName: keyword }, (data) => {
        cb(data)
      }, (er) => { })
    },
    onShowActionsheet (index) {
      this.selectStudentIndex = index
      this.selectStudentInfo = this.studentList[index]
      this.showActionsheet = true
    },
    onItemClick (code) {
      let student = this.studentList[this.selectStudentIndex]
      if (code === 'delete') {
        let self = this
        this.$vux.confirm.show({
          title: '提示',
          content: '确定要删除［' + student.studentName + '］吗？',
          onConfirm () {
            api.delMoralStudentManager({schoolId: self.$route.params.schoolId, classId: self.selectClassId, studentId: student.studentId}, () => {
              self.tools.successToast('删除成功')
              self.studentList.splice(self.selectStudentIndex, 1)
            }, () => {
              self.tools.warnToast('删除失败')
            })
          }
        })
      } else if (code === 'info') {
        api.getStudentPasswordInfo({schoolId: this.$route.params.schoolId, classId: this.selectClassId, studentId: student.studentId}, (data) => {
          this.studentPasswordInfo = data
          this.isShowStudentPassword = true
        }, () => {})
      }
    },
    onResetPassword () {
      this.isShowStudentPassword = false
      let student = this.studentList[this.selectStudentIndex]
      let self = this
      this.$vux.confirm.show({
        title: '提示',
        content: '确定为［' + student.studentName + '］重置密码吗？',
        onConfirm () {
          api.renewalStudentPassword({schoolId: self.$route.params.schoolId, classId: self.selectClassId, studentId: student.studentId}, () => {
            self.tools.successToast('密码重置成功')
          }, () => {
            self.tools.warnToast('密码重置失败')
          })
        }
      })
    }
  }
}
</script>

<style>
.student_list_img {
  width: 44px;
  height:44px;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
</style>

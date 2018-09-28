<template>
  <div>
    <group v-if="studentList.length > 0" gutter="10px">
      <cell is-link v-for="(item, index) in studentList" :key="index" @click.native="editstudent(item, index)">
        <div slot="icon" class="moral-grade-student-icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
        <span slot="title">{{item.studentName}}</span>
        <span slot="inline-desc" v-html="editLength(item.names)" v-if="item.names.length > 0"></span>
      </cell>
    </group>
    <p v-else class="empty-text">暂无学生～</p>
    <div v-transfer-dom>
      <x-dialog v-model="showSwitch" hide-on-blur @on-hide="getAssessorList()">
        <div style="height:100vw;overflow-y: scroll;">
          <x-switch v-for="(item, index) in gradeList" :key="index" :title="item.value" prevent-default v-model="item.isExist" @on-click="changeGrade(item, index, item.isExist)"></x-switch>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="提示" @on-cancel="showConfirm = false" @on-confirm="onConfirm">
        <p style="text-align:center;">您确定删除评定员<span style="color:red;">【{{info.studentName}}】</span>吗？</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showSetPassWord" title="提示" @on-cancel="showSetPassWord = false" @on-confirm="onConfirmSet">
        <p style="text-align:center;">您确定重置评定员<span style="color:red;">【{{this.info.studentName}}】</span>登录密码吗？</p>
      </confirm>
    </div>
    <x-dialog v-model="isShowStudentPassword" hide-on-blur>
      <div style="height:200px;text-align:left;">
        <p style="font-size:16px;margin-top:10px;margin-left:10px;">学生姓名: {{info.studentName}}</p>
        <p style="font-size:16px;margin-top:10px;margin-left:10px;">登陆帐号: {{studentPasswordInfo.userName}}</p>
        <p style="font-size:16px;margin-top:10px;margin-left:10px;">初始密码: {{studentPasswordInfo.isFirst?studentPasswordInfo.firstPassword:'无'}}</p>
        <p style="text-align:center;bottom:10px;position: absolute;width:100%;">
          <span style="margin:0 auto;color:#2E84D4;" @click="isShowStudentPassword=false,showSetPassWord=true">重置密码</span>
        </p>
      </div>
    </x-dialog>
    <actionsheet v-model="showSheet" :menus="menus" @on-click-menu="clickMenu" show-cancel></actionsheet>
    <detail-tabbar :actions="actions" :actionLink="onAction"></detail-tabbar>
  </div>
</template>

<script>
  import { XDialog, Confirm, XSwitch, Group, Cell, Actionsheet, TransferDomDirective as TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../api.js'
  import baseApi from '../../education/api.js'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XDialog, DetailTabbar, Confirm, XSwitch, Group, Cell, Actionsheet
    },
    data () {
      return {
        actions: [{name: '使用帮助', color: '#2E84D4', code: 'help'}, {name: '添加评定员', code: 'add'}],
        studentList: [],
        showSheet: false,
        menus: {
          password: '密码管理',
          change: '修改管理范围',
          delete: '删除评定员'
        },
        info: {},
        showSwitch: false,
        showConfirm: false,
        gradeList: [],
        isShowStudentPassword: false,
        showSetPassWord: false,
        studentPasswordInfo: {}
      }
    },
    mounted() {
      this.getAssessorList()
      // getStudentPasswordInfo
    },
    methods: {
      getAssessorList () {
        api.studentManage({schoolId: this.$route.params.schoolId}, (data) => {
          this.studentList = data
          for (let i = 0; i < this.studentList.length; i++) {
            this.studentList[i].names = []
            let message = this.studentList[i].classes
            for (let o = 0; o < message.length; o++) {
              this.studentList[i].names.push(message[o].gradeName)
            }
          }
        }, (er) => {})
      },
      changeGrade (item, index, isExist) {
        api.editClassManager({schoolId: this.$route.params.schoolId, gradeId: item.key, studentId: this.info.studentId, isExist: !isExist}, (data) => {
          this.tools.successToast('修改成功')
          this.gradeList[index].isExist = !isExist
        }, (er) => {
          if (er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('修改失败')
          }
        })
      },
      editstudent (item, index) {
        this.showSheet = true
        this.info = item
        this.index = index
      },
      onConfirm () {
        api.delClassManager({schoolId: this.$route.params.schoolId, studentId: this.info.studentId}, (data) => {
          this.tools.successToast('删除成功')
          this.studentList.splice(this.index, 1)
        }, (er) => {
          if (er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('删除失败')
          }
        })
      },
      clickMenu (code) {
        if (code === 'delete') {
          this.showConfirm = true
        } else if (code === 'change') {
          let type = this.$route.params.type
          this.gradeList = []
          if (type === 'admin') {
            baseApi.getGradeList({schoolId: this.$route.params.schoolId}, (data) => {
              data.forEach(element => {
                let item = {
                  key: element.gradeId,
                  value: element.gradeName,
                  isExist: false
                }
                this.gradeList.push(item)
              })
              this.editData()
            }, (er) => {})
          } else if (type === 'manage') {
            api.moralTeacherClass({schoolId: this.$route.params.schoolId, isHaveLessonClass: false}, (data) => {
              data.forEach(element => {
                let item = {
                  key: element.gradeId,
                  value: element.gradeName,
                  isExist: false
                }
                this.gradeList.push(item)
              })
              this.editData()
            }, (er) => {})
          }
        } else if (code === 'password') {
          api.getStudentPasswordInfo({schoolId: this.$route.params.schoolId, classId: null, studentId: this.info.studentId}, (data) => {
            this.studentPasswordInfo = data
            this.isShowStudentPassword = true
          }, (er) => {
            if (er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('获取失败')
            }
          })
        }
      },
      editData () {
        for (let i = 0; i < this.gradeList.length; i++) {
          for (let o = 0; o < this.info.classes.length; o++) {
            if (parseInt(this.info.classes[o].gradeId) === parseInt(this.gradeList[i].key)) {
              this.gradeList[i].isExist = true
            }
          }
        }
        this.showSwitch = true
      },
      onConfirmSet () {
        api.renewalStudentPassword({schoolId: this.$route.params.schoolId, classId: null, studentId: this.info.studentId}, () => {
          this.tools.successToast('密码重置成功')
        }, () => {
          this.tools.warnToast('密码重置失败')
        })
      },
      onAction (code) {
        if (code === 'add') {
          this.$router.push({name: 'educationKeepStudent', params: {type: this.$route.params.type}})
        } else {
        }
      },
      studentListLoadData(cb) {
        baseApi.getStudentList({ schoolId: this.$route.params.schoolId, excludeClassId: null, studentName: null, classId: null, rowStart: 0, rowCount: 9999999 }, (data) => {
          cb(data)
        }, (er) => { })
      },
      studentListSearch(keyword, cb) {
        baseApi.getStudentList({ schoolId: this.$route.params.schoolId, excludeClassId: null, studentName: keyword, classId: null, rowStart: 0, rowCount: 9999999 }, (data) => {
          cb(data)
        }, (er) => { })
      },
      editLength (data) {
        if (data.length > 3) {
          let newArr = [...data]
          newArr.length = 3
          return '管理范围：' + newArr.join('、') + '等' + data.length + '个年级'
        } else {
          return '管理范围：' + data.join('、')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.moral-grade-student-icon{
  width: 40px;
  height: 40px;
  display: block;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
}
.empty-text{
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #999;
}
</style>

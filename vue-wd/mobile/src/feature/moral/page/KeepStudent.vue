<template>
  <div>
    <group gutter="10px" label-width="4em" label-margin-right="0.5em" label-align="left">
      <cell is-link @click.native="addStudent('student')" v-if="!message">
        <span slot="title" style="font-size:16px;">评定员</span>
        <span slot="" v-if="studentInfo.studentName">{{studentInfo.studentName}}</span>
      </cell>
      <cell @click.native="addStudent('grade')" is-link>
        <span slot="title" style="font-size:16px;">管理范围</span>
        <span slot="inline-desc" v-if="gradeNameList.length > 0">{{gradeNameList.join('、')}}</span>
      </cell>
    </group>
    <div v-if="showStudent">
      <popup v-model="showStudent" height="80%">
        <search @on-submit="onSubmit" position="absolute" auto-scroll-to-top top="0" @on-focus="onFocus" @on-cancel="onCancel" v-model="searchContent"></search>
        <div :style="{'height': listHeight + 'px', 'position': 'relative', 'margin-top': isFocus?'44px':'0px', 'background': '#fff'}" class="scroller-wrap">
          <scroller :on-infinite="infinite" ref="student_manage_scroller">
            <cell style="backgroundColor: #fff" v-for="(item, index) in studentList" :key="index" ref="index" is-link @click.native="chooseStudent(item)">
              <p slot="title" style="vertical-align: middle;">
                <span style="margin-right:10px;font-size:16px;">{{item.studentName}}</span>
              </p>
              <span slot="">选择</span>
              <div slot="icon" class="student_manage_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head2.png', 128)+')'}" src=""></div>
            </cell>
          </scroller>
          <p style="text-align:center;font-size: 16px;padding: 20px 15px;fontSize:16px;color:#a2a2a2" v-if="studentList.length <= 0">没有学生，请先去添加！</p>
        </div>
        <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 44px;margin-bottom:10px">
          <x-button plain type="primary" style="width:70vw;height:44px" @click.native="showStudent = false">关闭</x-button>
        </div>
      </popup>
    </div>
    <div>
      <popup v-model="showGrade" height="80%" style="backgroundColor: #fff;">
        <div style="backgroundColor: #fff;width: 100%;">
          <div>
            <checklist label-position="left" :options="gradeList" v-model="checklist"></checklist>
          </div>
          <div style="display:flex;position: fixed;z-index:;100000000;width: 100%;bottom: 0;height: 50px;">
            <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="cancel">
              <p style="line-height: 50px; textAlign: center;">取消</p>
            </div>
            <div style="flex: 1;backgroundColor: #8ebf52">
              <p style="line-height: 50px; textAlign: center;color: #fff;" @click="confirm">确定</p>
            </div>
          </div>
        </div>
      </popup>
    </div>
    <detail-tabbar :actions="actions" :actionLink="onAction"></detail-tabbar>
  </div>
</template>

<script>
import baseApi from '../../education/api.js'
import api from '../api.js'
import DetailTabbar from '@/components/DetailTabbar.vue'
import { Group, XButton, Cell, Search, Popup, Checklist } from 'vux'
export default {
  components: { Group, Cell, XButton, Search, DetailTabbar, Popup, Checklist },
  data () {
    return {
      searchContent: null,
      listHeight: 0,
      studentList: [],
      isFocus: false,
      showStudent: false,
      showGrade: false,
      actions: [{name: '添加并保存'}],
      studentInfo: {},
      gradeList: [],
      checklist: [],
      gradeNameList: [],
      type: null,
      message: null
    }
  },
  mounted() {
    this.type = this.$route.params.type
  },
  methods: {
    addStudent (type) {
      if (type === 'student') {
        this.showStudent = true
        this.listHeight = window.innerHeight * 0.8 - 109
      } else {
        if (this.type === 'admin' && this.gradeList.length <= 0) {
          baseApi.getGradeList({schoolId: this.$route.params.schoolId}, (data) => {
            data.forEach(element => {
              let item = {
                key: element.gradeId,
                value: element.gradeName
              }
              this.gradeList.push(item)
            })
          }, (er) => {})
        } else if (this.type === 'manage' && this.gradeList.length <= 0) {
          api.moralTeacherGrade({schoolId: this.$route.params.schoolId, isHaveLessonClass: false}, (data) => {
            data.forEach(element => {
              let item = {
                key: element.gradeId,
                value: element.gradeName
              }
              this.gradeList.push(item)
            })
          }, (er) => {})
        }
        this.showGrade = true
      }
    },
    onAction () {
      if (!this.studentInfo.studentId) {
        this.tools.warnToast('请选择评定员')
        return
      }
      if (this.checklist.length <= 0) {
        this.tools.warnToast('请选择管理范围')
        return
      }
      api.addStudentmanager({schoolId: this.$route.params.schoolId, gradeId: this.checklist, studentId: this.studentInfo.studentId}, (data) => {
        this.tools.successToast('添加成功')
        this.$router.go(-1)
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('添加失败')
        }
      })
    },
    cancel () {
      this.checklist = []
      this.showGrade = false
    },
    confirm () {
      this.gradeNameList = []
      for (let o = 0; o < this.checklist.length; o++) {
        for (let i = 0; i < this.gradeList.length; i++) {
          if (parseInt(this.checklist[o]) === parseInt(this.gradeList[i].key)) {
            this.gradeNameList.push(this.gradeList[i].value)
          }
        }
      }
      this.showGrade = false
    },
    chooseStudent (item) {
      this.studentInfo = item
      this.showStudent = false
    },
    onFocus () {
      this.isFocus = true
      this.listHeight = window.innerHeight * 0.8 - 109
    },
    onCancel () {
      this.isFocus = false
      this.searchContent = null
      this.studentList = []
      this.listHeight = window.innerHeight * 0.8 - 109
      this.$refs.student_manage_scroller.finishInfinite()
    },
    onSubmit () {
      this.studentList = []
      this.$refs.student_manage_scroller.finishInfinite()
    },
    infinite (done) {
      this.getStudentList(this.searchContent, this.studentList.length, (data) => {
        this.studentList = this.studentList.concat(data)
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
        // this.studentList = data
      })
    },
    getStudentList (studentName, rowStart, callback) {
      baseApi.queryStudentList({ schoolId: this.$route.params.schoolId, classId: null, studentName: studentName, rowStart: rowStart, rowCount: 20 }, (data) => {
        callback(data)
      }, (er) => {})
    }
  }
}
</script>

<style lang="less" scoped>
.student_manage_img {
  width: 12vw;
  height:12vw;
  display: inline-block;
  border-radius: 6px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
</style>


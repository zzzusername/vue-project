<template>
  <div>
    <search v-model="searchValue" position="absolute" auto-scroll-to-top top="0" @on-focus="onFocus" @on-cancel="onCancel" @on-submit="onSubmit" ref="search" placeholder="搜索每位学生的学习汇总"></search>
    <group gutter="0" :style="{'margin-top': isFocus?'43px':'-1px'}">
      <cell title="考勤统计" is-link :link="{name: 'educationMasterAttendCount'}"></cell>
      <cell title="作业统计" is-link :link="{name: 'educationPrincipalLookWork'}"></cell>
      <cell title="成绩统计" is-link :link="{name: 'educationAchievementClassList'}"></cell>
    </group>
    <div v-transfer-dom>
      <x-dialog v-model="showDialog" hide-on-blur>
        <div style="max-height:70vh;overflow-y: scroll;">
          <group gutter="0">
            <cell v-for="(item, index) in studentList" :key="index" is-link @click.native="onItemClick(item)">
              <span slot="title" style="float:left;margin-left:5px;">{{item.studentName}}</span>
              <div slot="icon" class="statistics_achi_student_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
            </cell>
          </group>
        </div>
      </x-dialog>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Search, Cell, Group, TransferDomDirective as TransferDom, XDialog } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Search, DetailTabbar, Cell, Group, XDialog
  },
  data () {
    return {
      isFocus: false,
      searchValue: null,
      showDialog: false,
      studentList: []
    }
  },
  methods: {
    onFocus() {
      this.isFocus = true
    },
    onCancel() {
      this.isFocus = false
    },
    onSubmit (keyword) {
      api.getStudentList({ schoolId: this.$route.params.schoolId, studentName: this.searchValue, classId: null, rowStart: 0, rowCount: 50 }, (data) => {
        this.studentList = data
        this.showDialog = true
        this.$refs.search.setBlur()
      }, (er) => {
        if (er.toUser === undefined || er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    onItemClick (item) {
      this.$router.push({name: 'educationStudentInfoForTeacher', params: {classId: item.classId, studentId: item.studentId, type: 'teacher'}})
      // this.$router.push({name: 'educationStudentStudyInfoForTeacher', params: {classId: item.classId, studentId: item.studentId, parents: 0}})
    }
  }
}
</script>

<style>
.statistics_achi_student_icon {
  width: 44px;
  height: 44px;
  display: block;
  margin-right: 5px;
  background-position: center center;
  background-size: cover;
}
</style>

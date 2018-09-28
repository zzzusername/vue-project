<template>
  <div>
    <group>
      <cell v-if="!isChange" title="选择教师" is-link @click.native="isShowTeacherList = true" :value="selectTeacher.teacherName"></cell>
      <cell v-else title="教师" :value="selectTeacher.teacherName"></cell>
    </group>
    <cell>
      <p slot="title" style="color: #666">选择接收考勤通知的班级</p>
      <p style="color: #A2D268" @click="selectAll">{{selectText}}</p>
    </cell>
    <checklist :options="classList" v-model="checkClass" @on-change="change" label-position="left"></checklist>
    <teacher-list :single="true" :show="isShowTeacherList" :callback="teacherListCallBack" :load="teacherListLoadData" :search="teacherListSearch"></teacher-list>
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, Checklist } from 'vux'
import api from '../api'
import TeacherList from '../components/TeacherList.vue'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    Group, Cell, Checklist, TeacherList, DetailTabbar
  },
  data() {
    return {
      actions: [{name: '保存并提交'}],
      isShowTeacherList: false,
      selectTeacher: {},
      classList: [],
      checkClass: [],
      selectText: '全选',
      status: true,
      isChange: false
    }
  },
  mounted () {
    let teacherId = this.$route.params.teacherId
    if (teacherId !== undefined) {
      this.isChange = true
      api.getTeacherinfo({ schoolId: this.$route.params.schoolId, teacherId: teacherId }, (data) => {
        this.selectTeacher = data
      }, (er) => {
        this.error(er)
      })
      api.getAttendPushClasses({ schoolId: this.$route.params.schoolId, teacherId: teacherId }, (data) => {
        data.forEach((element) => {
          this.checkClass.push(element.classId)
        })
      }, (er) => {
        this.error(er)
      })
    }
    api.getClassList({ schoolId: this.$route.params.schoolId, classType: 1, rowStart: 0, rowCount: 999 }, (data) => {
      data.forEach((element) => {
        this.classList.push({key: element.classId, value: element.className})
      })
    }, (er) => {
      this.error(er)
    })
  },
  methods: {
    submit () {
      if (this.selectTeacher.teacherId === undefined || this.selectTeacher.teacherId === null) {
        this.tools.warnToast('请选择教师')
        return
      } else if (this.checkClass.length === 0) {
        this.tools.warnToast('至少选择一个班级', '150px')
        return
      }
      api.saveAttendPushTarget({schoolId: this.$route.params.schoolId, teacherId: this.selectTeacher.teacherId, classIds: this.checkClass}, (data) => {
        this.$router.go(-1)
        this.tools.successToast('提交成功')
      }, (er) => {
        this.error(er)
      })
    },
    selectAll () {
      this.checkClass.splice(0, this.checkClass.length)
      if (this.status) {
        this.classList.forEach((element) => {
          this.checkClass.push(element.key)
        })
        this.selectText = '取消'
        this.status = false
      } else {
        this.selectText = '全选'
        this.status = true
      }
    },
    change(val, label) {
    },
    teacherListCallBack({ status, teacher }, cb) {
      if (status === 'cancel') {
        this.isShowTeacherList = false
      } else if (status === 'success') {
        console.log(teacher)
        this.selectTeacher = teacher
        cb()
      }
    },
    teacherListLoadData(cb) {
      api.getTeacherList({ schoolId: this.$route.params.schoolId, teacherName: null, rowStart: 0, rowCount: 9999 }, (data) => {
        cb(data)
      }, (er) => { })
    },
    teacherListSearch(keyword, cb) {
      api.getTeacherList({ schoolId: this.$route.params.schoolId, teacherName: keyword, rowStart: 0, rowCount: 9999 }, (data) => {
        cb(data)
      }, (er) => { })
    },
    error(er) {
      if (er.toUser !== undefined && er.toUser) {
        this.tools.warnToast(er.message)
      }
    }
  }
}
</script>

<style>

</style>

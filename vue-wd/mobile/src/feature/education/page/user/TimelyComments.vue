<template>
  <div>
    <group gutter="10px" label-width="4em" label-margin-right="1em">
      <!-- <cell v-if="!isEdit" title="目标班级" is-link @click.native="showClassList = !showClassList" :value="className"></cell> -->
      <popup-picker v-if="!isEdit" show-name title="目标班级" :data="classList" v-model="selectClass" placeholder="请选择目标班级" @on-change="changeClass"></popup-picker>
      <cell v-if="!isEdit" title="评语对象" is-link @click.native="popupStudentList" :value="studentName"></cell>
      <cell v-if="isEdit" title="目标班级" :value="className"></cell>
      <cell v-if="isEdit" title="评语对象" :value="studentName"></cell>
      <cell-box>
        <div>
          <p style="marginBottom: 5px;">评语等级</p>
          <checker style="fontSize: 14px;" v-model="selectValue" default-item-class="default-item" selected-item-class="selected-item">
            <checker-item value="1">优秀</checker-item>
            <checker-item value="2">良</checker-item>
            <checker-item value="3">中等</checker-item>
            <checker-item value="4">一般</checker-item>
            <checker-item value="5">差</checker-item>
          </checker>
        </div>
      </cell-box>
      <x-textarea title="评语" v-model="commentsValue" placeholder="请填写评语" :rows="6"></x-textarea>
    </group>
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
    <student-list :show="isShowStudentList" :single="true" :callback="studentListCallBack" :load="studentListLoadData" :search="studentListSearch"></student-list>
  </div>
</template>

<script>
import { Group, Cell, CellBox, Checker, XTextarea, CheckerItem, PopupPicker } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import StudentList from '../../components/StudentList'
import api from '../../api'
export default {
  components: {
    Group, Cell, CellBox, Checker, XTextarea, CheckerItem, PopupPicker, DetailTabbar, StudentList
  },
  data() {
    return {
      actions: [{ name: '创建' }],
      selectValue: '1',
      commentsValue: '',
      isShowStudentList: false,
      studentInfo: {},
      classList: [],
      selectClass: [],
      className: '',
      studentName: '',
      isEdit: false
    }
  },
  mounted() {
    var classId = this.$route.params.classId
    var commentRealId = this.$route.params.commentRealId
    if (classId !== undefined && commentRealId !== undefined) {
      this.isEdit = true
      this.actions = [{ name: '修改' }]
      this.getCommentsInfo((data) => {
        console.log(data)// 信息回填
        this.className = data.className
        this.studentName = data.stuUserName
        this.selectValue = String(data.commentLevel)
        this.commentsValue = data.commentContent
      })
    } else {
      this.queryTeacherClassList((data) => {
        var list = []
        for (var i = 0; i < data.length; i++) {
          list.push({ name: data[i].className, value: String(data[i].classId) })
        }
        this.classList.push(list)
        if (list.length === 1) {
          this.selectClass = [list[0].value]
        }
      })
    }
  },
  methods: {
    changeClass () {
      this.studentInfo = {}
      this.studentName = ''
    },
    submit() {
      if (this.isEdit) {
        this.editComments((data) => {
          this.$router.go(-1)
          this.tools.successToast('编辑成功')
        })
        return
      }
      if (this.selectClass[0] === undefined) {
        this.tools.toast('请选择班级')
      } else if (this.studentInfo.studentId === undefined) {
        this.tools.toast('请选择评语对象')
      } else if (this.selectValue === undefined || this.selectValue === null) {
        this.tools.toast('请选择评语等级')
      } else {
        this.publishTimelyComments((data) => {
          this.$router.go(-1)
          this.tools.successToast('创建成功')
        })
      }
    },
    popupStudentList() {
      if (this.selectClass[0] === undefined) {
        this.tools.toast('请先选择班级')
        return
      }
      this.isShowStudentList = true
    },
    studentListCallBack({ status, student }, cb) {
      if (status === 'cancel') {
        this.isShowStudentList = false
      } else if (status === 'success') {
        this.studentInfo = student
        this.studentName = student.studentName
        cb()
      }
    },
    studentListLoadData(cb) {
      api.getFeaturesStudents({ schoolId: this.$route.params.schoolId, studentName: null, classId: this.selectClass[0], featureCode: 'PINGYU', rowStart: 0, rowCount: 9999 }, (data) => {
        cb(data)
      }, (er) => { })
    },
    studentListSearch(keyword, cb) {
      api.getFeaturesStudents({ schoolId: this.$route.params.schoolId, studentName: keyword, classId: this.selectClass[0], featureCode: 'PINGYU', rowStart: 0, rowCount: 9999 }, (data) => {
        cb(data)
      }, (er) => { })
    },
    publishTimelyComments(callback) {
      api.publishTimelyComments({ schoolId: this.$route.params.schoolId, classesId: this.selectClass[0], studentId: this.studentInfo.studentId, lessonId: null, commentLevel: this.selectValue, commentContent: this.commentsValue }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getCommentsInfo(callback) {
      api.getTimelyCommentsInfo({ schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, commentRealId: this.$route.params.commentRealId, roleType: 'teacher' }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    editComments(callback) {
      api.editTimelyComments({ schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, commentRealId: this.$route.params.commentRealId, commentLevel: this.selectValue, commentContent: this.commentsValue }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    queryTeacherClassList(callback) {
      api.queryTeacherClassList({ schoolId: this.$route.params.schoolId, featureCode: 'PINGYU' }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  }
}
</script>

<style>
.default-item {
  border: 1px solid #d2d2d2;
  padding: 5px 15px;
}

.selected-item {
  border: 1px solid green;
}
</style>

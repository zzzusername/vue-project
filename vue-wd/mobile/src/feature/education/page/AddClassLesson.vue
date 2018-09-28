<template>
  <div>
    <group gutter="10px">
      <cell title="班级课程" v-if="!lessonId" is-link @click.native="classLesson" :value="chooseLesson.name"></cell>
      <cell v-else title="班级课程" :value="chooseLesson.name" is-link @click.native="classLesson"></cell>
      <cell title="任课老师" is-link @click.native="chooseTeacher" :value="teacher.teacherName">
        <p slot="inline-desc" style="color: #FF6D56;fontSize: 12px;">添加任课教师可以获得更精确的统计数据</p>
      </cell>
      <x-input title="课时" v-model="classHour" text-align="right" placeholder="请输入课时" placeholder-align="right" type="number"></x-input>
    </group>
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
    <teacher-list :single="true" :show="isShowTeacherList" :callback="teacherListCallBack" :load="teacherListLoadData" :search="teacherListSearch"></teacher-list>
    <class-lesson-picker :show="showLesson" @confirm="selectPicker" ></class-lesson-picker>
  </div>
</template>

<script>
import { Group, Picker, Popup, Cell, XInput, TransferDom } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import TeacherList from '../components/TeacherList.vue'
import ClassLessonPicker from '../components/ClassLessonPicker.vue'
import { mapGetters } from 'vuex'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Group, Popup, Cell, Picker, XInput, DetailTabbar, TeacherList, ClassLessonPicker
  },
  data() {
    return {
      lessons: [],
      classHour: null,
      actions: [{name: '添加'}],
      schoolId: this.$route.params.schoolId,
      classId: this.$route.params.classId,
      lessonId: this.$route.params.lessonId,
      isShowTeacherList: false,
      teacher: {},
      showLesson: false,
      chooseLesson: {}
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  watch: {
    userInfo(val, old) {
      if (!this.tools.isNull(this.userInfo.feature) && val.feature.lessonsManage) {
        this.isLessonManage = true
      }
    }
  },
  mounted() {
    if (!this.tools.isNull(this.userInfo.feature) && this.userInfo.feature.teacherManage) {
      this.isTeacherManage = true
    }
    if (this.lessonId) {
      api.getClassLessonInfo({schoolId: this.schoolId, classId: this.classId, lessonId: this.lessonId}, (data) => {
        this.chooseLesson = {
          name: data.lessonName,
          value: data.lessonId
        }
        this.teacher.teacherId = data.teacherId
        this.teacher.teacherName = data.teacherName
        this.classHour = data.classHour
      }, (er) => { this.error(er) })
    }
  },
  methods: {
    classLesson() {
      this.showLesson = !this.showLesson
    },
    selectPicker(val) {
      this.chooseLesson = val
    },
    submit() {
      if (this.chooseLesson.value !== undefined && this.chooseLesson.value !== null) {
      } else {
        this.tools.warnToast('请选择课程')
        return
      }
      if (this.lessonId) {
        api.editClassLesson({schoolId: this.schoolId, lessonId: this.chooseLesson.value, classId: this.classId, teacherId: this.teacher.teacherId, classHour: this.classHour}, (data) => {
          this.$router.go(-1)
          this.tools.successToast('修改成功')
        }, (er) => { this.error(er) })
        return
      }
      api.addClassToLessons({schoolId: this.schoolId, lessonId: this.chooseLesson.value, classId: this.classId, teacherId: this.teacher.teacherId, classHour: this.classHour}, (data) => {
        this.$router.go(-1)
        this.tools.successToast('添加成功')
      }, (er) => { this.error(er) })
    },
    chooseTeacher() {
      this.isShowTeacherList = true
    },
    error(val) {
      if (val.toUser !== undefined && val.toUser) {
        this.tools.warnToast(val.message)
      }
    },
    teacherListCallBack({ status, teacher }, cb) {
      if (status === 'cancel') {
        this.isShowTeacherList = false
      } else if (status === 'success') {
        this.teacher = teacher
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
    }
  }
}
</script>

<style>

</style>

<template>
  <div>
    <popu-custom-picker :show="show" :list="lessons" @confirm="confirm">
      <p v-if="isManage">您好！该班级没有课程，请<span style="color: blue" @click="addLesson">点击此处</span>为班级添加课程</p>
      <p v-else>您好！该班级没有课程，请联系本校管理员为本班添加课程</p>
    </popu-custom-picker>
  </div>
</template>

<script>
import PopuCustomPicker from './PopuCustomPicker'
import { mapGetters } from 'vuex'
import api from '../api'
export default {
  components: {
    PopuCustomPicker
  },
  data() {
    return {
      lessons: [],
      isManage: false
    }
  },
  props: {
    show: Boolean,
    classId: Number,
    featureCode: String,
    noDefault: Boolean // 当只有一门课程时，是否不显示默认课程
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  watch: {
    userInfo(nval, oval) {
      this.isManage = nval.feature.classManage
    },
    classId(nval, oval) {
      if (nval === undefined) {
        return
      }
      this.queryTeacherLessonList((data) => {
        this.lessons.splice(0, this.lessons.length)
        let list = []
        let mylist = []
        data.forEach(element => {
          if (element.userId === this.userInfo.userId) {
            mylist.push({name: element.lessonName, value: element.lessonId, teacherName: element.teacherName, teacherId: element.teacherId})
          } else {
            list.push({name: element.lessonName, value: element.lessonId, teacherName: element.teacherName, teacherId: element.teacherId})
          }
        })
        this.lessons.push(mylist.concat(list))
        if (this.noDefault === true) {
          return
        }
        if (mylist.length === 1) {
          this.$emit('confirm', mylist[0])
        } else {
          this.$emit('confirm', {})
        }
      })
    }
  },
  mounted() {
    if (this.userInfo.feature !== undefined) {
      this.isManage = this.userInfo.feature.classManage
    }
    // this.queryTeacherLessonList((data) => {
    //   let list = []
    //   data.forEach(element => {
    //     list.push({name: element.lessonName, value: element.lessonId, teacherName: element.teacherName})
    //   })
    //   this.lessons.push(list)
    // })
  },
  methods: {
    confirm(val) {
      this.$emit('confirm', val)
    },
    addLesson() {
      this.$router.push({name: 'educationLessonsManage'})
    },
    queryTeacherLessonList(callback) {
      api.queryTeacherLessonList({schoolId: this.$route.params.schoolId, featureCode: this.featureCode}, (data) => {
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

</style>

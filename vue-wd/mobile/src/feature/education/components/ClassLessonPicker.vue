<template>
  <div>
    <popu-custom-picker :show="show" :list="lessons" @confirm="confirm">
      <p v-if="isLessonManage" style="font-size:16px;margin:0 15px;">您好！本校还没有任何课程，请<span style="color: rgb(255, 109, 86)" @click="addLesson">点击此处</span>添加课程</p>
      <p v-else>您好！本校还没有任何课程，请联系本校管理员添加课程</p>
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
      isLessonManage: false
    }
  },
  props: {
    show: Boolean,
    classId: Number,
    featureCode: String
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
    if (!this.tools.isNull(this.userInfo.feature) && this.userInfo.feature.lessonsManage) {
      this.isLessonManage = true
    }
    this.getBaseSubjectList((data) => {
      let list = []
      data.forEach(element => {
        list.push({name: element.lessonName, value: element.lessonId, teacherName: element.teacherName})
      })
      this.lessons.push(list)
    })
  },
  methods: {
    confirm(val) {
      this.$emit('confirm', val)
    },
    addLesson() {
      this.$router.push({name: 'educationLessonsManage'})
    },
    getBaseSubjectList(callback) {
      api.getBaseSubjectList({schoolId: this.$route.params.schoolId}, (data) => {
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

<template>
  <div>
    <group gutter="10px">
      <cell title="目标班级" @click.native="showClassPopu = !showClassPopu" :value="selectClass.name" is-link></cell>
      <cell title="选择课程" @click.native="showLessonPicker" :value="selectLesson.name" is-link></cell>
    </group>
    <class-popu-picker :show="showClassPopu" @confirm="selectClassPicker" feature-code="DIANMING"></class-popu-picker>
    <lesson-popu-picker :show="showLessonPopu" @confirm="selectLessonPicker" :classId="selectClass.value" feature-code="DIANMING"></lesson-popu-picker>
    <detail-tabbar :actionLink="skip" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, PopupPicker, XSwitch, Picker, Popup } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import ClassPopuPicker from '../../components/ClassPopuPicker'
import LessonPopuPicker from '../../components/LessonPopuPicker'
import { mapGetters } from 'vuex'
import api from '../../api'
export default {
  components: {
    Group, Cell, PopupPicker, XSwitch, Picker, Popup, ClassPopuPicker, LessonPopuPicker, DetailTabbar
  },
  data() {
    return {
      actions: [{ name: '创建' }],
      showClassPopu: false,
      showLessonPopu: false,
      selectClass: {},
      selectLesson: {}
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted() {
  },
  methods: {
    showLessonPicker() {
      if (this.selectClass.value === undefined) {
        this.tools.warnToast('请选择班级')
        return
      }
      this.showLessonPopu = !this.showLessonPopu
    },
    selectLessonPicker(val) {
      this.selectLesson = val
    },
    selectClassPicker(val) {
      this.selectClass = val
    },
    skip() {
      if (this.selectClass.value === undefined || this.selectClass.value === null) {
        this.tools.warnToast('请选择班级')
        return
      }
      this.createRollCall((data) => {
        this.$router.replace({ name: 'educationRollCall', params: { checkId: data.result, classId: this.selectClass.value, status: 1 } })
      })
    },
    createRollCall(callback) {
      api.createRollCall({ schoolId: this.$route.params.schoolId, classesId: this.selectClass.value, lessonId: this.selectLesson.value, teacherId: this.selectLesson.teacherId }, (data) => {
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

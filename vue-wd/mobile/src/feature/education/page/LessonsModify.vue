<template>
  <div>
    <group gutter="0">
      <x-input title="课程名称" v-model="lessonsInfo.lessonName" placeholder="请输入课程名称"></x-input>
      <x-textarea title="课程简介" v-model="lessonsInfo.lessonDesc" placeholder="请输入课程简介"></x-textarea>
    </group>
    <actionsheet v-model="isShowDeleteMenus" :menus="deleteMenus" @on-click-menu-delete="onDelete" show-cancel></actionsheet>
    <detail-tabbar :actionLink="submitLessons" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
import { Group, XInput, XTextarea, Actionsheet } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Group, XInput, XTextarea, DetailTabbar, Actionsheet
  },
  data() {
    return {
      actions: [
        { name: '创建' }
      ],
      lessonsInfo: {},
      isShowDeleteMenus: false,
      deleteMenus: null
    }
  },
  mounted () {
    if (!this.tools.isNull(this.$route.params.lessonId)) {
      this.actions = [
        {
          name: '删除课程',
          code: 'delete',
          color: '#FF6D56'
        },
        {
          name: '保存并提交',
          code: 'save'
        }
      ]
      //  查询课程信息
      api.getLessonsInfo({schoolId: this.$route.params.schoolId, lessonId: this.$route.params.lessonId}, (data) => {
        this.lessonsInfo = data
      }, () => {})
    } else {
      this.actions = [
        {
          name: '创建',
          code: 'add'
        }
      ]
    }
  },
  methods: {
    submitLessons(code) {
      console.log('code', code)
      if (code === 'add') {
        this.addLessons((data) => {
          this.$router.go(-1)
        })
      } else if (code === 'save') {
        this.editLessons((data) => {
          this.$router.go(-1)
        })
      } else if (code === 'delete') {
        this.deleteMenus = {
          'title.noop': '您确定删除此课程吗?<br/>',
          delete: '<span style="color:red">删除</span>'
        }
        this.isShowDeleteMenus = true
      }
    },
    onDelete () {
      api.delLessons({schoolId: this.$route.params.schoolId, lessonId: this.$route.params.lessonId}, () => {
        this.tools.successToast('删除成功')
        this.$router.back()
      }, () => {})
    },
    addLessons(callback) {
      api.addLessons({schoolId: this.$route.params.schoolId, lessonName: this.lessonsInfo.lessonName, lessonDesc: this.lessonsInfo.lessonDesc ? this.lessonsInfo.lessonDesc : ''}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    editLessons (callback) {
      api.editLessons({schoolId: this.$route.params.schoolId, lessonId: this.$route.params.lessonId, lessonName: this.lessonsInfo.lessonName, lessonDesc: this.lessonsInfo.lessonDesc ? this.lessonsInfo.lessonDesc : ''}, (data) => {
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

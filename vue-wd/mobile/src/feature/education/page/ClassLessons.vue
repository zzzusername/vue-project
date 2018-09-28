<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多课程～">
        <div v-if="lessons.length == 0" style="height: 10px"></div>
        <cell style="backgroundColor: #fff" v-for="(item, index) in lessons" :key="index" is-link @click.native="itemClick(item)">
          <p slot="title" style="fontSize: 17px;">{{item.lessonName}}</p>
          <p slot="inline-desc" v-if="item.teacherName != null">{{item.teacherName}}</p>
          <p style="fontSize: 14px;" v-if="item.classHour != 0 && item.classHour != null">{{item.classHour}}课时</p>
        </cell>
      </scroller>
    </div>
    <detail-tabbar :actionLink="addClassLesson" :actions="actions"></detail-tabbar>
    <actionsheet v-model="showActionSheet" :menus="menus" show-cancel @on-click-menu="menuClick"></actionsheet>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="操作提示" @on-cancel="showConfirm = false" @on-confirm="onConfirm">
        <p style="text-align:center;color:red;">{{confirmHint}}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Cell, Actionsheet, Confirm, TransferDom } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, DetailTabbar, Actionsheet, Confirm
  },
  data() {
    return {
      lessons: [],
      classId: this.$route.params.classId,
      scrollerHeight: 0,
      actions: [{name: '添加课程'}],
      showActionSheet: false,
      menus: {
        edit: '编辑',
        del: '删除'
      },
      tempLesson: {},
      showConfirm: false,
      confirmHint: '您确定删除'
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 50
  },
  methods: {
    menuClick(key) {
      switch (key) {
        case 'edit':
          this.$router.push({name: 'educationEditClassLesson', params: {classId: this.classId, lessonId: this.tempLesson.lessonId}})
          break
        case 'del':
          this.confirmHint = '您确定删除【' + this.tempLesson.lessonName + '】课程吗？'
          this.showConfirm = true
          break
      }
    },
    onConfirm() {
      api.deleteLessonsClass({schoolId: this.$route.params.schoolId, lessonId: this.tempLesson.lessonId, classId: this.classId}, (data) => {
        for (let index = 0; index < this.lessons.length; index++) {
          const element = this.lessons[index]
          if (element.lessonId === this.tempLesson.lessonId) {
            this.lessons.splice(index, 1)
          }
        }
      }, (er) => { this.error(er) })
    },
    itemClick(val) {
      this.tempLesson = val
      this.showActionSheet = true
    },
    addClassLesson() {
      this.$router.push({name: 'educationAddClassLesson', params: {classId: this.classId}})
    },
    infinite(done) {
      api.getClassInfo({schoolId: this.$route.params.schoolId, classId: this.classId}, (data) => {
        this.lessons = data.lessons
        done(true)
      }, (er) => { this.error(er) })
    },
    error(val) {
      if (val.toUser !== undefined && val.toUser) {
        this.tools.warnToast(val.message)
      }
    }
  }
}
</script>

<style>

</style>

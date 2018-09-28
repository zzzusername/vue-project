<template>
  <div>
    <group gutter="0">
      <cell>
        <p slot="title">
          <span>{{detail.lessonName == null ? '全天点名' : detail.lessonName}}</span>&nbsp;
          <span style="fontSize:13px;color:#999;margin-left:5px">{{detail.className}}</span>
        </p>
        <p slot="inline-desc"><span v-show="!tools.isNull(detail.teachingTeacherName)">任课教师：{{detail.teachingTeacherName}} &nbsp;&nbsp; </span>学生人数： {{detail.countStudent}}人</p>
      </cell>
    </group>
    <group gutter="10px">
      <cell v-for="(item, index) in detail.checkStudent" :key="index" :title="item.studentName">
        <div slot="icon" class="student_rollcall_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}" src=""></div>
        <p :style="{'color': item.checkStatus != 1 && item.checkStatus != null ? '#FF6D56' : '#666'}">{{getStatus(item.checkStatus)}}</p>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data() {
    return {
      detail: {}
    }
  },
  mounted() {
    api.getTeacherRollcallInfo({ schoolId: this.$route.params.schoolId, classesId: this.$route.params.classId, checkId: this.$route.params.checkId }, (data) => {
      this.detail = data
    }, (er) => {
      if (er.toUser !== undefined && er.toUser) {
        this.tools.warnToast(er.message)
      }
    })
  },
  methods: {
    getStatus (val) {
      var str = ''
      switch (val) {
        case 1:
        case null:
          str = '已到'
          break
        case 2:
          str = '未到'
          break
        case 3:
          str = '请假'
          break
        case 4:
          str = '迟到'
          break
        case 5:
          str = '早退'
          break
        case 6:
          str = '旷课'
          break
      }
      return str
    }
  }
}
</script>

<style>
.student_rollcall_img {
  width: 40px;
  height:40px;
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

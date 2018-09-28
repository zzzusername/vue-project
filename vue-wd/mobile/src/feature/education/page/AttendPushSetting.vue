<template>
  <div>
    <group title="请添加可以接收班级考勤通知的教师">
      <cell v-for="(item, index) in teachers" :key="index" is-link @click.native="itemClick(item, index)">
        <div slot="icon" class="teacher_list_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}" src=""></div>
        <p slot="title">{{item.teacherName}}</p>
      </cell>
    </group>
    <detail-tabbar :actionLink="add" :actions="actions"></detail-tabbar>
    <actionsheet v-model="showActionsheet" :menus="actionMenus" @on-click-menu="clickMenu" show-cancel></actionsheet>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="提示" theme="ios" @on-confirm="onConfirm">
        <p style="text-align:center;">{{ confirmHint }}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Group, Cell, Actionsheet, Confirm, TransferDomDirective as TransferDom } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Group, Cell, Actionsheet, DetailTabbar, Confirm
  },
  data() {
    return {
      actions: [{name: '添加教师'}],
      teachers: [],
      showActionsheet: false,
      actionMenus: {
        change: '修改',
        del: '删除'
      },
      tempItemData: null,
      clickIndex: -1,
      showConfirm: false,
      confirmHint: ''
    }
  },
  mounted() {
    api.getAttendPushTeachers({schoolId: this.$route.params.schoolId}, (data) => {
      this.teachers = this.teachers.concat(data)
    }, (er) => {
      this.error(er)
    })
  },
  methods: {
    add() {
      this.$router.push({name: 'educationAttendPushTarget'})
    },
    clickMenu(key) {
      switch (key) {
        case 'change':
          this.$router.push({name: 'educationChangeAttendPushClass', params: {teacherId: this.tempItemData.teacherId}})
          break
        case 'del':
          this.confirmHint = '确定删除【' + this.tempItemData.teacherName + '】的接收考勤设置吗？'
          this.showConfirm = true
          break
      }
    },
    onConfirm() {
      api.deleteAttendPushTeacher({schoolId: this.$route.params.schoolId, teacherId: this.tempItemData.teacherId}, (data) => {
        this.teachers.splice(this.clickIndex, 1)
        this.tools.successToast('删除成功')
      }, (er) => {
        this.error(er)
      })
    },
    itemClick(val, index) {
      this.clickIndex = index
      this.tempItemData = val
      this.showActionsheet = true
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
.teacher_list_img {
  width: 44px;
  height:44px;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
</style>

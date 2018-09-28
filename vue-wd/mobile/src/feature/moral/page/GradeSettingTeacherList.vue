<template>
<!-- 年级组德育管理设置 － 年级组教师列表-->
  <div>
    <group>
      <cell v-for="(item, index) in gradeInfo.teachers" :key="index" :title="item.teacherName" is-link @click.native="onDelete(item, index)">
        <div slot="icon" class="moral-grade-teacher-icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
      </cell>
    </group>
    <p style="text-align: center;padding: 10px;font-size: 16px;color: #999;" v-if="gradeInfo.teachers.length == 0">{{gradeInfo.gradeName}}管理组还未添加教师</p>
    <detail-tabbar :actions="actions" :actionLink="onAction"></detail-tabbar>
    <teacher-list :single="true" :show="isShowTeacherList" :callback="teacherListCallBack" :load="teacherListLoadData" :search="teacherListSearch"></teacher-list>
  </div>
</template>

<script>
import { Group, Cell, ConfirmPlugin } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import TeacherList from '@/feature/education/components/TeacherList.vue'
import eduApi from '@/feature/education/api'
import api from '@/feature/moral/api'
import Vue from 'vue'
Vue.use(ConfirmPlugin)
export default {
  components: {
    Group, Cell, DetailTabbar, TeacherList
  },
  data () {
    return {
      actions: [{name: '添加教师'}],
      gradeInfo: {teachers: []},
      isShowTeacherList: false
    }
  },
  mounted () {
    api.getMoralGradeManagerInfo({schoolId: this.$route.params.schoolId, gradeId: this.$route.params.gradeId}, (data) => {
      if (data.length > 0) {
        this.gradeInfo = data[0]
      }
    }, () => {})
  },
  methods: {
    onDelete (item, index) {
      let self = this
      this.$vux.confirm.show({
        title: '提示',
        content: '您确定要删除' + item.teacherName + '吗？',
        onConfirm () {
          api.delMoralGradeManager({schoolId: self.$route.params.schoolId, gradeId: self.$route.params.gradeId, teacherId: item.teacherId}, () => {
            self.gradeInfo.teachers.splice(index, 1)
            self.tools.successToast('删除成功')
          }, (er) => {
            if (er.toUser) {
              self.tools.warnToast(er.message)
            }
          })
        }
      })
    },
    onAction () {
      this.isShowTeacherList = true
    },
    teacherListSearch(keyword, cb) {
      eduApi.getTeacherList({ schoolId: this.$route.params.schoolId, teacherName: keyword, rowStart: 0, rowCount: 9999 }, (data) => {
        cb(data)
      }, (er) => { })
    },
    teacherListCallBack({ status, teacher }, cb) {
      if (status === 'cancel') {
        this.isShowTeacherList = false
      } else if (status === 'success') {
        api.addMoralGradeManager({schoolId: this.$route.params.schoolId, gradeId: this.$route.params.gradeId, teacherId: teacher.teacherId}, () => {
          let isRepeat = false
          this.gradeInfo.teachers.forEach(element => {
            if (parseInt(element.teacherId) === parseInt(teacher.teacherId)) {
              isRepeat = true
            }
          })
          if (!isRepeat) {
            this.gradeInfo.teachers.push({...teacher})
            this.tools.successToast('添加成功')
          }
        }, (er) => {
          if (er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
        cb()
      }
    },
    teacherListLoadData(cb) {
      eduApi.getTeacherList({ schoolId: this.$route.params.schoolId, teacherName: null, rowStart: 0, rowCount: 9999 }, (data) => {
        cb(data)
      }, (er) => { })
    }
  }
}
</script>

<style>
.moral-grade-teacher-icon{
  width: 40px;
  height: 40px;
  display: block;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
}
</style>

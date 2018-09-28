<template>
  <div>
    <group gutter="0" style="margin-bottom: 10px;">
      <cell v-if="gradeInfo" value="管理" :title="gradeInfo.gradeName" is-link @click.native="gradeManage"></cell>
    </group>
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="class_manage_scroller" :no-data-text="loadHint">
        <div v-if="classList.length == 0" style="height: 10px"></div>
        <cell style="backgroundColor: #fff;fontSize:16px;" v-for="(item, index) in classList" :key="index" is-link @click.native="itemClick(item)">
          <p slot="title"><span>{{item.className}}</span>&nbsp;&nbsp;<span style="fontSize: 14px;color: #666">{{item.classTeacherName}}</span></p>
          <div v-if="item.orgId != null || item.parentOrgId != null" slot="inline-desc">{{item.orgName != null ? '学生群：'+item.orgName: '家长群：'+item.parentOrgName}}</div>
          <div v-else slot="inline-desc" style="color:#FF6D56">未绑定微信群</div>
        </cell>
      </scroller>
      <detail-tabbar :actionLink="skipAddClass" :actions="actions"></detail-tabbar>
      <actionsheet v-model="showActionSheet" :menus="menus" show-cancel @on-click-menu="menuClick"></actionsheet>
    </div>
    <actionsheet v-model="showMenu" :menus="menus" @on-click-menu="click" show-cancel></actionsheet>
  </div>
</template>

<script>
import { Group, Cell, Tab, TabItem, Actionsheet } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Group, Cell, DetailTabbar, Tab, TabItem, Actionsheet
  },
  data () {
    return {
      actions: [{ name: '添加班级' }],
      scrollerHeight: 0,
      classList: [],
      loadHint: '',
      menus: {
        student: '学生管理',
        edit: '修改信息'
      },
      showActionSheet: false,
      tempClass: {},
      gradeInfo: null,
      showMenu: false
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 104
    api.getGradeInfo({schoolId: this.$route.params.schoolId, gradeId: this.$route.params.gradeId}, (data) => {
      this.gradeInfo = data
    }, (er) => { this.error(er, '获取年级信息失败') })
  },
  methods: {
    gradeManage () {
      this.menus = {
        'manage': '年级组长管理',
        'edit': '编辑'
      }
      this.showMenu = true
    },
    click (code) {
      if (code === 'manage') {
        this.$router.push({name: 'educationGradeLeaderManage', params: {gradeId: this.$route.params.gradeId}})
      } else if (code === 'edit') {
        this.$router.push({name: 'educationEditGrade', params: {gradeId: this.gradeInfo.gradeId}})
      }
    },
    skipAddClass () {
      this.$router.push({ name: 'educationAddClass', params: {gradeId: this.$route.params.gradeId} })
    },
    infinite(done) {
      this.getClassList(this.tabIndex, this.classList.length, (data) => {
        this.classList = this.classList.concat(data)
        if (this.classList.length > 0) {
          this.loadHint = '没有更多班级了～'
        } else {
          this.loadHint = '暂无班级，快去添加吧'
        }
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
      })
    },
    getClassList(classType, rowStart, callback) {
      api.getClassList({ schoolId: this.$route.params.schoolId, gradeId: this.$route.params.gradeId, classType: classType, rowStart: rowStart, rowCount: 50 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    itemClick(val) {
      this.menus = {
        student: '学生管理',
        edit: '修改信息'
      }
      this.tempClass = val
      this.showActionSheet = true
    },
    menuClick(val) {
      switch (val) {
        case 'student':
          this.$router.push({name: 'educationClassStudentList', params: {classId: this.tempClass.classId, classType: 1}})
          break
        case 'edit':
          this.$router.push({ name: 'educationEditClass', params: { classId: this.tempClass.classId, gradeId: this.$route.params.gradeId } })
          break
      }
    },
    error(er, hint) {
      if (er.toUser) {
        this.tools.warnToast(er.message)
        return
      }
      this.tools.warnToast(hint)
    }
  }
}
</script>

<style>

</style>

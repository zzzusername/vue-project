<template>
  <div>
    <tab custom-bar-width="4em">
      <tab-item selected @on-item-click="tabClick(1)">行政班</tab-item>
      <tab-item @on-item-click="tabClick(2)">课外班</tab-item>
    </tab>
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
    <feature-help-dialog :type="helpType" :schoolId="String($route.params.schoolId)"></feature-help-dialog>
  </div>
</template>

<script>
import { Group, Cell, Tab, TabItem, Actionsheet } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
import FeatureHelpDialog from '@/feature/education/components/FeatureHelpDialog.vue'
export default {
  components: {
    Group, Cell, DetailTabbar, Tab, TabItem, Actionsheet, FeatureHelpDialog
  },
  data() {
    return {
      actions: [{ name: '添加班级' }],
      scrollerHeight: 0,
      classList: [],
      tabIndex: 1,
      loadHint: '暂无班级，快去添加吧',
      showActionSheet: false,
      menus: {
        student: '学生管理',
        lessons: '课程管理',
        edit: '修改信息'
      },
      tempClass: {},
      helpType: 0,
      isFirstLoad: true
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 94
    // 判断是否显示帮助提示
    // let type = this.localStorage.getHelpProgressForSchoolMaster(this.$route.params.schoolId)
    // if ((type === null || parseInt(type) === 0) && this.localStorage.getClassHelpForSchoolManager(this.$route.params.schoolId) !== 'true') {
    //   this.helpType = 4
    // }
  },
  activated() {
    if (!this.isFirstLoad) {
      this.classList.splice(0, this.classList.length)
      this.$refs.class_manage_scroller.finishInfinite()
    }
  },
  deactivated() {
    this.isFirstLoad = false
  },
  methods: {
    menuClick(val) {
      switch (val) {
        case 'student':
          this.$router.push({name: 'educationClassStudentList', params: {classId: this.tempClass.classId, classType: this.tabIndex}})
          break
        case 'lessons':
          this.$router.push({name: 'educationClassLessons', params: {classId: this.tempClass.classId}})
          break
        case 'edit':
          this.$router.push({ name: 'educationEditClassForType', params: { classId: this.tempClass.classId, classType: this.tabIndex } })
          break
      }
    },
    itemClick(val) {
      // {name: 'educationClassStudentList', params: {classId: item.classId, classType: tabIndex}}
      this.tempClass = val
      this.showActionSheet = true
    },
    tabClick(index) {
      this.tabIndex = index
      this.classList = []
      this.$refs.class_manage_scroller.finishInfinite()
    },
    skipAddClass() {
      this.$router.push({ name: 'educationAddClassForType', params: {classType: this.tabIndex} })
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
      api.getClassList({ schoolId: this.$route.params.schoolId, classType: classType, rowStart: rowStart, rowCount: 50 }, (data) => {
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

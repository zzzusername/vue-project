<template>
  <div>
    <tab custom-bar-width="4em">
      <tab-item selected @on-item-click="tabClick(1)">年级</tab-item>
      <tab-item @on-item-click="tabClick(2)">课外班</tab-item>
    </tab>
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller v-if="tabIndex == 2" :on-infinite="infinite" ref="class_manage_scroller" :no-data-text="loadHint">
        <div v-if="classList.length == 0" style="height: 10px"></div>
        <cell style="backgroundColor: #fff;fontSize:16px;" v-for="(item, index) in classList" :key="index" is-link @click.native="itemClick(item)">
          <p slot="title"><span>{{item.className}}</span>&nbsp;&nbsp;<span style="fontSize: 14px;color: #666">{{item.classTeacherName}}</span></p>
          <div v-if="item.orgId != null || item.parentOrgId != null" slot="inline-desc">{{item.orgName != null ? '学生群：'+item.orgName: '家长群：'+item.parentOrgName}}</div>
          <div v-else slot="inline-desc" style="color:#FF6D56">未绑定微信群</div>
        </cell>
      </scroller>
      <scroller v-else :on-infinite="infinite" ref="class_manage_scroller" :no-data-text="loadHint">
        <div v-if="gradeList.length == 0" style="height: 10px"></div>
        <cell style="backgroundColor: #fff;fontSize:16px;" v-for="(item, index) in gradeList" :key="index" is-link @click.native="itemGradeClick(item)">
          <p slot="title"><span>{{item.gradeName}}</span></p>
          <div slot="inline-desc" v-if="item.classNum">共有: {{item.classNum}}个班</div>
        </cell>
      </scroller>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="提示" :close-on-confirm='false' @on-cancel="onCancel" @on-confirm="onConfirm">
        <p style="text-align:center;">您确认毕业吗？确认请在下方输入验证信息：<i style="color:red;font-style:normal;">确认毕业</i></p>
        <input type="text" v-model="textProving" style="width: 100%;border: 2px solid rgb(143, 190, 88);border-radius: 5px;background: transparent;height: 25px;outline: none;margin-top: 5px;text-indent: 1em;}">
      </confirm>
    </div>
    <detail-tabbar :actionLink="skipAddClass" :actions="actions"></detail-tabbar>
    <actionsheet v-model="showActionSheet" :menus="menus" show-cancel @on-click-menu="menuClick"></actionsheet>
    <feature-help-dialog :type="helpType" :schoolId="String($route.params.schoolId)"></feature-help-dialog>
  </div>
</template>

<script>
import { Group, Cell, Tab, TabItem, Actionsheet, Confirm, TransferDomDirective as TransferDom } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
import FeatureHelpDialog from '@/feature/education/components/FeatureHelpDialog.vue'
export default {
  directives: {
    TransferDom
  },
  components: {
    Group, Cell, DetailTabbar, Tab, TabItem, Confirm, Actionsheet, FeatureHelpDialog
  },
  data() {
    return {
      showConfirm: false,
      actions: [{ name: '添加年级', code: 'grade' }],
      scrollerHeight: 0,
      classList: [],
      tabIndex: 1,
      loadHint: '暂无班级，快去添加吧',
      showActionSheet: false,
      menus: {
        student: '学生管理',
        edit: '修改信息',
        graduation: '设置毕业'
      },
      tempClass: {},
      helpType: 0,
      isFirstLoad: true,
      gradeList: [],
      textProving: null
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
          this.$router.push({name: 'educationClassStudentList', params: {classId: this.tempClass.classId, classType: 2}})
          break
        case 'edit':
          this.$router.push({ name: 'educationEditSavorClass', params: { classId: this.tempClass.classId } })
          break
        case 'graduation':
          this.showConfirm = true
          break
      }
    },
    itemClick(val) {
      // {name: 'educationClassStudentList', params: {classId: item.classId, classType: tabIndex}}
      this.tempClass = val
      this.showActionSheet = true
    },
    itemGradeClick(val) {
      this.$router.push({name: 'educationClassManageForGrade', params: {gradeId: val.gradeId}})
    },
    onConfirm () {
      if (!this.textProving) {
        this.tools.warnToast('请输入验证信息')
        return
      } else {
        if (this.textProving === '确认毕业') {
          api.interest({schoolId: this.$route.params.schoolId, classId: this.tempClass.classId}, (data) => {
            this.$refs.class_manage_scroller.finishInfinite()
            this.tools.successToast('设置成功')
            this.showConfirm = false
            this.classList = []
            this.$refs.class_manage_scroller.finishInfinite()
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            }
          })
        } else {
          this.tools.warnToast('验证信息错误')
        }
      }
    },
    onCancel () {
      this.textProving = false
    },
    tabClick(index) {
      if (index === 1) {
        this.actions = [{ name: '添加年级', code: 'grade' }]
      } else if (index === 2) {
        this.actions = [{ name: '添加班级', code: 'class' }]
      }
      this.tabIndex = index
      this.classList = []
      this.$refs.class_manage_scroller.finishInfinite()
    },
    skipAddClass(type) {
      if (type === 'grade') {
        this.$router.push({ name: 'educationAddGrade' })
      } else if (type === 'class') {
        this.$router.push({ name: 'educationAddClassForType', params: {classType: 2} })
      }
    },
    infinite(done) {
      if (this.tabIndex === 1) {
        api.getGradeList({schoolId: this.$route.params.schoolId}, (data) => {
          this.gradeList = data
          if (this.gradeList.length > 0) {
            this.loadHint = '没有更多年级了～'
          } else {
            this.loadHint = '暂无年级，快去添加吧'
          }
          done(true)
        }, (err) => {
          if (err.toUser !== undefined && err.toUser) {
            this.tools.warnToast(err.message)
          }
        })
      } else if (this.tabIndex === 2) {
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
      }
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

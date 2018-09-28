<template>
  <div>
    <search v-model="searchValue" position="absolute" auto-scroll-to-top top="0" @on-focus="onFocus" @on-cancel="onCancel" @on-submit="onSubmit" ref="search"></search>
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative', 'margin-top': isFocus?'43px':'-1px'}">
      <scroller :on-infinite="infinite" ref="student_manage_scroller">
        <group gutter="0">
          <cell v-for="(item, index) in studentList" :key="index" is-link @click.native="onItemClick(index)">
            <p slot="title" style="margin-top:2px"><span>{{item.studentName}}</span><span v-show="item.bindingParent > 0" class="iconfont icon-bangdingjiazhang" style="margin-left:5px; color:CornflowerBlue"></span></p>
            <div slot="icon" class="education_student_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
            <div style="marginTop:3px;" slot="inline-desc">
              <span>{{item.className}}</span>
              <!-- <span>{{item.bindingParent === undefined || item.bindingParent <= 0 ? '未' : ''}}绑定家长</span>&nbsp;
              <span>{{item.userId === undefined || item.userId === null ? '未' : ''}}绑定微信</span> -->
            </div>
          </cell>
        </group>
      </scroller>
      <p v-show="studentList.length==0" style="text-align:center;font-size: 16px;padding: 5px 15px;fontSize:16px;color:#a2a2a2">您还没有添加学生</p>
    </div>
    <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <actionsheet v-model="isShowDeleteMenus" :menus="deleteMenus" @on-click-menu-delete="onDelete" show-cancel></actionsheet>
    <popup v-model="showUpdateClass" height="70%">
      <group label-width="5em" label-margin-right="0.5em" label-align="left">
        <cell title="学生姓名" :value="updateClassInfo.studentName"></cell>
        <cell v-show="updateClassInfo.oldClassId != null && updateClassInfo.oldClassId != undefined" title="当前班级" :value="updateClassInfo.oldClassName"></cell>
        <cell v-if="updateClassInfo.oldClassId != null && updateClassInfo.oldClassId != undefined" title="变更班级" :value="updateClassInfo.newClassName" is-link @click.native="showClassList = !showClassList"></cell>
        <cell v-else title="班级" :value="updateClassInfo.newClassName" is-link @click.native="showClassList = !showClassList"></cell>
      </group>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showUpdateClass=false">
          <p style="line-height: 50px; textAlign: center;color: #000;">关闭</p>
        </div>
        <div style="flex: 2;backgroundColor: #8ebf52" @click="confirmClass()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">保存并提交</p>
        </div>
      </div>
    </popup>
    <class-list :show="showClassList" :selected="selectedClass" @get-select-value="getSelect"></class-list>
    <detail-tabbar :actionLink="skipAddStudent" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Search, Group, Cell, Actionsheet, Popup } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import ClassList from '../components/ClassList.vue'
import api from '../api'
export default {
  components: {
    Search, Group, Cell, DetailTabbar, Actionsheet, Popup, ClassList
  },
  data() {
    return {
      actions: [
        { name: '添加学生' }
      ],
      scrollerHeight: 0,
      searchValue: null,
      studentList: [],
      showMenu: false,
      managemenus: {
        info: '查看信息',
        modify: '修改资料',
        shift: '转班',
        delete: '删除'
      },
      currentIndex: 0,
      deleteMenus: null,
      isShowDeleteMenus: false,
      showUpdateClass: false,
      showClassList: false,
      updateClassInfo: {},
      isFocus: false,
      selectedClass: []
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 50 - 44
  },
  methods: {
    getSelect(val) {
      this.updateClassInfo.newClassName = JSON.parse(val).className
      this.updateClassInfo.newClassId = JSON.parse(val).classId
      this.updateClassInfo = JSON.parse(JSON.stringify(this.updateClassInfo))
    },
    onFocus() {
      this.isFocus = true
    },
    onCancel() {
      this.isFocus = false
      this.studentList = []
      this.$refs.student_manage_scroller.finishInfinite()
    },
    onSubmit() {
      // 搜索
      this.studentList = []
      this.$refs.student_manage_scroller.finishInfinite()
    },
    skipAddStudent() {
      this.$router.push({ name: 'educationAddStudent' })
    },
    infinite(done) {
      this.getStudentList(this.searchValue, null, this.studentList.length, (data) => {
        this.studentList = this.studentList.concat(data)
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
      })
    },
    getStudentList(studentName, classId, rowStart, callback) {
      api.getStudentList({ schoolId: this.$route.params.schoolId, studentName, classId, rowStart, rowCount: 50 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser === undefined || er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    onItemClick (index) {
      this.currentIndex = index
      var item = this.studentList[this.currentIndex]
      if (this.tools.isNull(item.classId)) {
        this.managemenus = {
          info: '查看信息',
          modify: '修改资料',
          shift: '设置班级',
          delete: '删除'
        }
      } else {
        this.managemenus = {
          info: '查看信息',
          modify: '修改资料',
          shift: '转班',
          delete: '删除'
        }
      }
      this.showMenu = true
    },
    menuClick (type) {
      var item = this.studentList[this.currentIndex]
      if (type === 'info') {
        this.$router.push({name: 'educationLookStudentInfo', params: {studentId: item.studentId}})
      } else if (type === 'modify') {
        this.$router.push({ name: 'educationEditStudent', params: { studentId: item.studentId } })
      } else if (type === 'delete') {
        this.deleteMenus = {
          'title.noop': '您确定删除 [' + item.studentName + '] 吗?<br/>',
          delete: '<span style="color:red">删除</span>'
        }
        this.isShowDeleteMenus = true
      } else if (type === 'shift') {
        this.updateClassInfo = {}
        this.updateClassInfo.studentId = item.studentId
        this.updateClassInfo.studentName = item.studentName
        this.updateClassInfo.oldClassName = item.className
        this.updateClassInfo.oldClassId = item.classId
        this.showUpdateClass = true
        this.selectedClass = [{classId: parseInt(item.classId)}]
      }
    },
    onDelete() {
      this.delStudent((data) => {
        this.tools.successToast('删除成功')
        this.studentList.splice(this.currentIndex, 1)
      })
    },
    delStudent(callback) {
      var item = this.studentList[this.currentIndex]
      api.adminDeleteStudent({ schoolId: this.$route.params.schoolId, studentId: item.studentId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    confirmClass () {
      if (this.tools.isNull(this.updateClassInfo.newClassId)) {
        this.tools.warnToast('请选择变更班级', '150px')
        return
      }
      api.updateStudentClass({schoolId: this.$route.params.schoolId, studentId: this.updateClassInfo.studentId, oldClassId: this.updateClassInfo.oldClassId, newClassId: this.updateClassInfo.newClassId}, () => {
        this.tools.successToast('修改成功')
        this.showUpdateClass = false
        var item = this.studentList[this.currentIndex]
        item.className = this.updateClassInfo.newClassName
        item.classId = this.updateClassInfo.newClassId
      }, (er) => {
        if (er.toUser === undefined || er.toUser) {
          this.tools.warnToast(er.message, '150px')
        } else {
          this.tools.warnToast('修改失败')
        }
      })
    }
  }
}
</script>

<style>
.education_student_icon {
  width: 44px;
  height: 44px;
  display: block;
  margin-right: 5px;
  background-position: center center;
  background-size: cover;
}
</style>

<template>
  <div>
    <search v-model="searchValue" position="absolute" auto-scroll-to-top top="0" @on-focus="onFocus" @on-cancel="onCancel" @on-submit="onSubmit" ref="search"></search>
    <p style="padding: 5px 10px;" v-show="showCount && studentList.length>0">该班共{{studentList.length}}名学生</p>
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative', 'margin-top': showMarginTop ? '44px' : '0px'}">
      <scroller :on-infinite="infinite" ref="class_student_list_scroller" no-data-text="没有更多学生了～">
        <!-- <p v-if="showHint !== null" style="textAlign:center;padding: 10px;color:#a2a2a2;">{{showHint}}</p> -->
        <!-- <div class="jhy-1px-t"></div> -->
        <div style="height:10px" v-if="studentList.length==0"></div>
        <cell style="backgroundColor:#fff;font-size:16px;" v-for="(item, index) in studentList" :key="index" is-link @click.native="itemClick(index)">
          <div slot="icon" class="education_student_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
          <p style="fontSize: 16px;" slot="title">
            <span>{{item.studentName}}</span>
            <span v-if="item.userName!=null && item.userName!=undefined" style="backgroundColor: #A2D268;color: #fff;margin-left: 2px;border-radius: 2px;font-size: 12px;" class="iconfont icon-xueshengweixin"></span>
            <span v-if="item.bindingParent > 0" style="backgroundColor: CornflowerBlue;color: #fff;margin-left: 2px;border-radius: 2px;font-size: 12px;" class="iconfont icon-jiachangweixin"></span>
            <!-- <span v-show="item.bindingParent > 0" class="iconfont icon-bangdingjiazhang" style="margin-left:5px; color:CornflowerBlue"></span> -->
            <!-- <span style="fontSize: 14px;color:#666">{{item.className}}</span> -->
          </p>
          <div style="marginTop:3px;" slot="inline-desc">
            <span v-if="item.bindingParent > item.bindingParentStatus && item.userId == null">已绑定家长微信</span>
            <span v-else-if="item.bindingParent != 0 && item.bindingParent == item.bindingParentStatus" style="color: #FF6D56">待家长完善信息</span>
            <span v-else-if="item.userName != null">学生微信: {{item.userName}}</span>
            <span v-else style="color: #FF6D56">未绑定微信</span>
            <!-- <span>{{item.bindingParent === undefined || item.bindingParent
              <=0 ? '未' : ''}}绑定家长</span>&nbsp; -->
                <!-- <span>{{item.userId === undefined || item.userId === null ? '未' : ''}}绑定微信</span> -->
          </div>
        </cell>
      </scroller>
    </div>
    <detail-tabbar :actionLink="skipAddStudent" :actions="actions" isHideMe=true></detail-tabbar>
    <actionsheet v-model="showActionSheet" :menus="menus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <actionsheet v-model="showSettingMenu" :menus="settingMenus" @on-click-menu="classSetting" show-cancel></actionsheet>
    <student-list :show="isShowStudentList" :callback="studentListCallBack" :load="studentListLoadData" :search="studentListSearch"></student-list>
    <!-- <actionsheet v-model="showDeleteClass" :menus="managemenusClass" @on-click-menu="menuClickDelete" show-cancel @on-click-menu-cancel="showDeleteClass=false"></actionsheet> -->
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="提示" theme="ios" @on-confirm="onConfirm">
        <p style="text-align:center;">您确定删除该班级吗？</p>
      </confirm>
    </div>
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

    <select-org-user :show-popu="showGroupStudent" :filter="orgFilter" :max="1" @on-hide="showGroupStudent = false" @select-value="selectStuUser">
      <p slot="title">请为「{{tempInfo.studentName}}」绑定学生微信</p>
      <p slot="no-data-hint">没有发现群成员，请<span style="color:blue" @click="addOrg">添加</span>学生群</p>
    </select-org-user>
    <class-list :show="showClassList" :selected="selectedClass" @get-select-value="getSelect"></class-list>
    <actionsheet v-model="isShowDeleteMenus" :menus="deleteMenus" @on-click-menu-delete="onDelete" show-cancel></actionsheet>
    <select-org-user :show-popu="showGroupParent" :filter="orgFilter" :max="999" @on-hide="showGroupParent = false" @select-value="selectUser">
      <p slot="title">请为「{{tempInfo.studentName}}」绑定家长微信</p>
      <p slot="no-data-hint">没有发现群成员，请<span style="color:blue" @click="addOrg">添加</span>家长群</p>
    </select-org-user>
    <div v-transfer-dom>
      <x-dialog v-model="showPushConfirm">
        <p style="text-align:center;color:#222;margin:15px 15px;text-align:left;font-size:16px;">老师您好！请拷贝粘贴下列文字，发送到【{{className}}】的班级微信群中，提醒群成员激活并完善资料：</p>
        <div class="agent-copy-div" style="border:1px solid #b2b2b2;margin-top:10px;text-align:left;margin: 0px 15px;padding:10px;color:#888888;font-size:15px;">
          <p>{{copyDesc}}</p>
        </div>
        <div style="text-align:center;font-size:16px;height:38px;margin-top:13px;">
          <div style="width:50%;display:inline-block;" @click="showPushConfirm=false">取消</div><div style="width:50%;display:inline-block;color:#8ebf52" v-clipboard:copy="copyDesc" v-clipboard:success="onCopy" v-clipboard:error="onError">拷贝粘贴</div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import { Radio, Popup, Search, Group, Cell, Actionsheet, Confirm, XDialog, TransferDomDirective as TransferDom, ConfirmPlugin } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import StudentList from '../components/StudentList.vue'
import ClassList from '../components/ClassList.vue'
import SelectOrgUser from '../components/SelectOrgUser'
import api from '../api'
import {mapGetters} from 'vuex'
Vue.use(ConfirmPlugin)
export default {
  directives: {
    TransferDom
  },
  components: {
    Radio, ClassList, Popup, Search, Group, Cell, DetailTabbar, Actionsheet, StudentList, Confirm, XDialog, SelectOrgUser
  },
  data() {
    return {
      actions: [{ name: '提醒学生/家长', code: 'push', color: '#FF6D56' }, { name: '添加学生', code: 'add' }],
      menus: {},
      settingMenus: { edit: '修改资料', del: '删除' },
      scrollerHeight: 0,
      showMarginTop: false,
      searchValue: null,
      studentList: [],
      showActionSheet: false,
      showSettingMenu: false,
      clickIndex: -1,
      showHint: null,
      isShowStudentList: false,
      managemenusClass: {},
      showConfirm: false,
      showUpdateClass: false,
      showClassList: false,
      isShowDeleteMenus: false,
      deleteMenus: null,
      updateClassInfo: {},
      selectedClass: [],
      showGroupStudent: false,
      showGroupParent: false,
      studentHeight: 0,
      teachersHeight: 0,
      objectListValue: null,
      bundingList: [],
      parents: [],
      bindParents: [],
      searchValueParent: null,
      selectParent: null,
      showBlock: false,
      parentOrgId: null,
      orgId: null,
      tempInfo: [],
      showPushConfirm: false,
      isSearchParent: false,
      copyDesc: '',
      orgFilter: {classId: this.$route.params.classId},
      className: '',
      showCount: true
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted() {
    this.studentHeight = window.innerHeight * 0.8 - 50 - 45
    this.teachersHeight = window.innerHeight * 0.8 - 94 - 45
    api.getClassInfo({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId}, (data) => {
      this.className = data.className
      if (data.orgId !== null) {
        this.orgId = data.orgId
      }
      if (data.parentOrgId !== null) {
        this.parentOrgId = data.parentOrgId
      }
      if (parseInt(this.$route.params.classType) === 1) {
        this.menus = {
          studentBunding: '选择群成员绑定学生',
          // parentBunding: '选择群成员绑定家长',
          look: '查看信息',
          edit: '修改资料',
          shift: '转班',
          delete: '删除'
        }
      } else {
        this.menus = {
          look: '查看信息',
          edit: '修改资料',
          deleteclass: '删除'
        }
      }
    }, (er) => {})
    this.scrollerHeight = window.innerHeight - 94 - 32
  },
  methods: {
    selectUser(val) {
      let users = []
      for (let index = 0; index < val.length; index++) {
        const element = JSON.parse(val[index])
        users.push(element.userId)
      }
      api.addParentBinding({schoolId: this.$route.params.schoolId, userIds: users, studentId: this.studentList[this.clickIndex].studentId, orgId: val.orgId, classId: this.$route.params.classId}, (data) => {
        this.studentList[this.clickIndex].bindingParent = 1
        this.studentList[this.clickIndex].bindingParentStatus = 1
        this.showGroupParent = false
        this.tools.successToast('绑定成功！')
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    selectStuUser(val) {
      api.bindingStudentByuserId({schoolId: this.$route.params.schoolId, studentId: this.studentList[this.clickIndex].studentId, userId: val.userId, classId: this.$route.params.classId, orgId: val.orgId}, (data) => {
        this.tools.successToast('绑定成功！')
        this.studentList[this.clickIndex].userIcon = val.userIcon
        this.studentList[this.clickIndex].userName = val.userName
        this.studentList[this.clickIndex].userId = val.userId
        this.showGroupStudent = false
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('绑定失败')
        }
      })
    },
    onCopy () {
      this.tools.successToast('拷贝成功')
      this.showPushConfirm = false
    },
    onError () {
      this.tools.warnToast('拷贝失败，请手动拷贝粘贴')
    },
    addOrg () {
      this.$router.push({name: 'educationSchoolOpenOrg'})
    },
    confirmClass () {
      if (this.tools.isNull(this.updateClassInfo.newClassId)) {
        this.tools.warnToast('请选择变更班级', '150px')
        return
      }
      api.updateStudentClass({schoolId: this.$route.params.schoolId, studentId: this.updateClassInfo.studentId, oldClassId: this.updateClassInfo.oldClassId, newClassId: this.updateClassInfo.newClassId}, () => {
        this.tools.successToast('修改成功')
        this.showUpdateClass = false
        this.studentList.splice(this.clickIndex, 1)
      }, (er) => {
        if (er.toUser === undefined || er.toUser) {
          this.tools.warnToast(er.message, '150px')
        } else {
          this.tools.warnToast('修改失败')
        }
      })
    },
    onCancel() {
      this.showCount = true
      this.scrollerHeight = window.innerHeight - 94 - 32
      this.showMarginTop = false
      this.showHint = null
      this.searchValue = null
      this.studentList = []
      this.$refs.class_student_list_scroller.finishInfinite()
    },
    onFocus() {
      this.showMarginTop = true
      this.showCount = false
      this.scrollerHeight = window.innerHeight - 94
    },
    onSubmit() {
      this.studentList = []
      this.$refs.class_student_list_scroller.finishInfinite()
    },
    hideBindPopu() {
      this.selectParent = null
      this.showBlock = false
      this.searchValueParent = null
    },
    studentListCallBack({ status, student }, cb) {
      if (status === 'cancel') {
        this.isShowStudentList = false
      } else if (status === 'success') {
        api.classAddStudent({ schoolId: this.$route.params.schoolId, studentId: student.studentId, classId: this.$route.params.classId }, (data) => {
          cb(data)
          this.showHint = null
          this.studentList.push(student)
          this.tools.successToast('添加成功')
        }, (er) => { })
      }
    },
    studentListLoadData(cb) {
      api.getStudentList({ schoolId: this.$route.params.schoolId, excludeClassId: this.$route.params.classId, studentName: null, classId: null, rowStart: 0, rowCount: 9999 }, (data) => {
        cb(data)
      }, (er) => { })
    },
    studentListSearch(keyword, cb) {
      api.getStudentList({ schoolId: this.$route.params.schoolId, excludeClassId: this.$route.params.classId, studentName: keyword, classId: null, rowStart: 0, rowCount: 9999 }, (data) => {
        cb(data)
      }, (er) => { })
    },
    skipAddStudent(val) {
      switch (val) {
        case 'push':
          if (this.tools.isNull(this.parentOrgId) && this.tools.isNull(this.orgId)) {
            this.$vux.confirm.show({
              title: '提示',
              content: '请先为班级关联学生群或家长群',
              confirmText: '关联班级群',
              onConfirm: () => {
                this.$router.push({name: 'educationSchoolOpenOrg'})
              }
            })
            return
          }
          let schoolUrl = '#/edu/index/' + this.$route.params.schoolId
          api.getShorturl({url: schoolUrl}, (data) => {
            this.copyDesc = '重要通知：为了进一步提高本校班级微信群的沟通效率，我们特此开通了校园微信群管理平台。请大家点击下方链接完善各自的资料。如有遇到提示您不是本校成员，请联系班主任。链接地址：' + data.shortUrl
            this.showPushConfirm = true
          }, () => {})
          break
        case 'add':
          if (Number(this.$route.params.classType) === 1) {
            if (this.userInfo.schoolModel === 1) {
              this.$router.push({ name: 'educationClassAddStudent', params: this.$route.params.classId })
            } else {
              this.$router.push({name: 'educationPersonalAddStudent'})
            }
          } else {
            this.isShowStudentList = true
          }
          break
      }
    },
    itemClick(index) {
      this.showActionSheet = true
      this.clickIndex = index
      this.tempInfo = this.studentList[index]
      this.parentOrgId = this.studentList[index].parentOrgId
      let studentUserId = this.studentList[index].userId
      let parentNum = this.studentList[index].bindingParent
      if (parseInt(this.$route.params.classType) === 1) {
        let temp = {
          studentBunding: '选择群成员绑定学生',
          // parentBunding: '选择群成员绑定家长',
          look: '查看信息',
          edit: '修改资料',
          shift: '转班',
          delete: '删除'
        }
        if (this.userInfo.schoolModel === 2) {
          delete temp.shift
        }
        this.menus = temp
      } else {
        this.menus = {
          look: '查看信息',
          edit: '修改资料',
          deleteclass: '删除'
        }
      }
      if (studentUserId !== null || this.orgId === null) {
        delete this.menus.studentBunding
      }
      if (parentNum > 0) {
        delete this.menus.parentBunding
      }
    },
    getSelect(val) {
      this.updateClassInfo.newClassName = JSON.parse(val).className
      this.updateClassInfo.newClassId = JSON.parse(val).classId
      this.updateClassInfo = JSON.parse(JSON.stringify(this.updateClassInfo))
    },
    menuClick(val) {
      var studentMessage = this.studentList[this.clickIndex]
      let self = this
      switch (val) {
        case 'look':
          this.$router.push({name: 'educationLookStudentInfo', params: {studentId: this.studentList[this.clickIndex].studentId}})
          break
        case 'edit':
          this.$router.push({ name: 'educationEditStudent', params: { studentId: this.studentList[this.clickIndex].studentId } })
          break
        case 'shift':
          this.updateClassInfo = {}
          this.updateClassInfo.studentId = studentMessage.studentId
          this.updateClassInfo.studentName = studentMessage.studentName
          this.updateClassInfo.oldClassName = studentMessage.className
          this.updateClassInfo.oldClassId = studentMessage.classId
          this.showUpdateClass = true
          this.selectedClass = [{classId: parseInt(studentMessage.classId)}]
          break
        case 'delete':
          this.$vux.confirm.show({
            title: '提示',
            content: '<span style="color: red">您确定删除[' + studentMessage.studentName + ']吗？删除后此学生将无法使用</span>',
            onConfirm () {
              self.onDelete()
            }
          })
          break
        case 'studentBunding':
          this.orgFilter = Object.assign({}, this.orgFilter, { type: 2, wantName: studentMessage.studentName })
          this.showGroupStudent = true
          break
        case 'parentBunding':
          this.orgFilter = Object.assign({}, this.orgFilter, { type: 3, wantName: studentMessage.studentName })
          this.showGroupParent = true
          break
        case 'deleteclass':
          this.$vux.confirm.show({
            title: '提示',
            content: '<span style="color: red">您确定删除[' + studentMessage.studentName + ']吗？删除后此学生将无法使用</span>',
            onConfirm () {
              self.onDelete()
            }
          })
          break
      }
    },
    onDelete() {
      if (parseInt(this.$route.params.classType) === 1) {
        this.delStudent((data) => { // 行政班删除
          this.tools.successToast('删除成功')
          this.studentList.splice(this.clickIndex, 1)
        })
      } else if (parseInt(this.$route.params.classType) === 2) {
        this.delStudentClass((data) => { // 课外班删除
          this.tools.successToast('删除成功')
          this.studentList.splice(this.clickIndex, 1)
        })
      }
    },
    delStudent(callback) {
      var item = this.studentList[this.clickIndex]
      api.adminDeleteStudent({ schoolId: this.$route.params.schoolId, studentId: item.studentId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.wranToast('删除失败！')
        }
      })
    },
    delStudentClass(callback) {
      var item = this.studentList[this.clickIndex]
      console.log(item)
      api.delStudentClass({ schoolId: this.$route.params.schoolId, studentId: item.studentId, classId: this.$route.params.classId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.wranToast('删除失败！')
        }
      })
    },
    classSetting(val) {
      switch (val) {
        case 'edit':
          this.$router.push({ name: 'educationEditClass', params: { classId: this.$route.params.classId } })
          break
        case 'del':
          this.managemenusClass = {
            'title.noop': '您确定删除' + document.title + '吗?<br/>',
            delete: '<span style="color:red">删除</span>'
          }
          this.showConfirm = true
          break
      }
    },
    onConfirm () {
      api.deleteClass({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId}, (data) => {
        this.tools.successToast('删除成功')
        this.$router.back()
      }, (err) => {
        console.log(err)
        if (err.toUser) {
          this.tools.warnToast(err.message, '150px')
        } else {
          this.tools.warnToast('删除失败')
        }
      })
    },
    infinite(done) {
      this.getStudentList(this.searchValue, this.studentList.length, (data) => {
        if (this.searchValue == null && data.length > 0 && !this.tools.isNull(data[0].className)) {
          document.title = data[0].className
        }
        this.studentList = this.studentList.concat(data)
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
        if (this.studentList.length === 0) {
          if (this.searchValue !== null) {
            this.showHint = '没有搜索到学生，换个名字试一下吧～'
          } else {
            this.showHint = '没有任何学生，快去添加学生吧～'
          }
        }
      })
    },
    getStudentList(studentName, rowStart, callback) {
      api.getStudentList({ schoolId: this.$route.params.schoolId, excludeClassId: null, studentName: studentName, classId: this.$route.params.classId, rowStart, rowCount: 99999 }, (data) => {
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
.education_student_icon {
  width: 50px;
  height: 50px;
  display: block;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
}
.student_unbing_manage_img {
  width: 20vw;
  height: 20vw;
  display: inline-block;
  border-radius: 6px;
  background-position: center center;
  background-size: cover;
  border-style: none;
  border-width: 0;
  vertical-align: middle;
}
.parent_homework_img {
  width: 13vw;
  height:13vw;
  display: inline-block;
  border-radius: 4px;
  margin-right: 15px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
.user_img {
  width: 8vw;
  height:8vw;
  display: inline-block;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
.bind_parents div p img {
  height: 40px;
  width: 40px;
  border-radius: 5px;
}
.parents_icon {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  display: block;
  margin-right: 5px;
  background-position: center center;
  background-size: cover;
}
.agent-copy-div p{
  -webkit-touch-callout:default !important;  /*系统默认菜单被禁用*/
  -webkit-user-select:all !important; /*webkit浏览器*/ 
  user-select:all !important;   
}
</style>

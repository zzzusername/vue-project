<template>
  <div>
    <group v-if="classList[0].length == 1" gutter="0px">
      <cell :title="classList[0][0].name" style="background:#fff"></cell>
    </group>
    <group v-if="classList[0].length>=2" gutter="0px" label-width="5em" label-margin-right="0.5em" label-align="left">
      <popup-picker title="目标班级" show-name value-text-align="left" :data="classList" v-model="classId" @on-change="onChange" placeholder="请先选择目标班级"></popup-picker>
    </group>
    <p style="overflow: hidden;padding:0 15px;">
      <span style="margin: 8px 0 5px;font-size: 14px;float:left;" v-if="list.length>0">该班共{{list.length}}名学生</span>
      <span @click="remindInfo" v-if="(!tools.isNull(currentClassInfo.orgId) || !tools.isNull(currentClassInfo.parentOrgId)) && (currentClassInfo.classTeacherId === userInfo.teacherId || isManage)" style="color:#FF6D56;float:right;margin: 8px 0 5px;font-size: 14px;">提醒学生/家长完善资料&nbsp;></span>
    </p>
    <group v-show="list.length>0" gutter="0" style="margin-top:-1px;">
      <cell v-for="(item, index) in list" :key="index" is-link @click.native="onShowStudentInfo(item, index)">
        <p slot="title" style="margin-top:2px">
          <span>{{item.studentName}}</span>
          <span v-if="item.userName!=null && item.userName!=undefined" style="backgroundColor: #A2D268;color: #fff;margin-left: 2px;border-radius: 2px;font-size: 12px;" class="iconfont icon-xueshengweixin"></span>
          <span v-if="item.bindingParent > 0" style="backgroundColor: CornflowerBlue;color: #fff;margin-left: 2px;border-radius: 2px;font-size: 12px;" class="iconfont icon-jiachangweixin"></span>
        </p>
        <div slot="icon" class="student_viewstudent_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}" src=""></div>
        <p slot="inline-desc" style="margin-top:2px">
          <span v-if="item.bindingParent > item.bindingParentStatus && item.userId == null">已绑定家长微信</span>
          <span v-else-if="item.bindingParent != 0 && item.bindingParent == item.bindingParentStatus" style="color: #FF6D56">待家长完善信息</span>
          <span v-else-if="item.userName != null">学生微信: {{item.userName}}</span>
          <span v-else style="color: #FF6D56">未绑定微信</span>
        </p>
      </cell>
    </group>
    <div v-if="isManage">
      <p v-if="classId.length>0&&isHaveStudents==false" style="text-align:center;font-size: 16px;padding: 15px 15px;fontSize:16px;color:#a2a2a2">您好！本班还没有学生，请添加学生</p>
      <p v-if="classList[0].length==0" style="text-align:center;font-size: 16px;padding: 15px 15px;fontSize:16px;color:#a2a2a2">您好！本校还没有任何班级，请<span style="color:blue" @click="onClassManage">点击此处</span>添加班级信息。</p>
    </div>
    <div v-else-if="currentClassInfo.classTeacherId === userInfo.teacherId">
      <p v-if="classId.length>0&&isHaveStudents==false" style="text-align:center;font-size: 16px;padding: 15px 15px;fontSize:16px;color:#a2a2a2">您好！本班还没有学生，请添加学生</p>
    </div>
    <div v-else>
      <p v-if="classId.length>0&&isHaveStudents==false" style="text-align:center;font-size: 16px;padding: 15px 15px;fontSize:16px;color:#a2a2a2">您好！该班还没有学生，请联系本校管理员为本班添加学生。</p>
      <!-- <p v-if="classList[0].length==0" style="text-align:center;font-size: 16px;padding: 15px 15px;fontSize:16px;color:#a2a2a2">您好！本校还没有任何班级，请联系本校管理员添加班级信息。</p> -->
    </div>
    <detail-tabbar :actions="actions" :actionLink="onActions" :isHideMe="isHideMe"></detail-tabbar>
    <actionsheet v-model="showMenu" :menus="menus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <!-- 绑定学生 -->
    <select-org-user :max="1" :show-popu="showGroupStudent" :filter="orgFilter" @on-hide="showGroupStudent = false" @select-value="confirmBindStudent">
      <p slot="title">请为「{{tempItemData.studentName}}」绑定学生微信</p>
      <p slot="no-data-hint">没有发现群成员，请<span style="color:blue" @click="addOrg">添加</span>学生群</p>
    </select-org-user>
    <select-org-user :max="999" :show-popu="showGroupParent" :filter="orgFilter" @on-hide="showGroupParent = false" @select-value="confirmBindParent">
      <p slot="title">请为「{{tempItemData.studentName}}」绑定家长微信</p>
      <p slot="no-data-hint">没有发现群成员，请<span style="color:blue" @click="addOrg">添加</span>家长群</p>
    </select-org-user>
    <div>
      <x-dialog v-model="showPushConfirm">
        <p style="text-align:center;color:#222;margin:15px 15px;text-align:left;font-size:16px;">老师您好！请拷贝粘贴下列文字，发送到【{{currentClassInfo.className}}】的班级微信群中，提醒群成员激活并完善资料：</p>
        <div class="agent-copy-div" style="border:1px solid #b2b2b2;margin-top:10px;text-align:left;margin: 0px 15px;padding:10px;color:#888888;font-size:15px;">
          <p>{{copyDesc}}</p>
        </div>
        <div style="text-align:center;font-size:16px;height:38px;margin-top:13px;">
          <div style="width:50%;display:inline-block;" @click="showPushConfirm=false">取消</div><div style="width:50%;display:inline-block;color:#8ebf52" v-clipboard:copy="copyDesc" v-clipboard:success="onCopy" v-clipboard:error="onError">拷贝粘贴</div>
        </div>
      </x-dialog>
    </div>
    <student-list :show="isShowStudentList" :callback="studentListCallBack" :load="studentListLoadData" :search="studentListSearch"></student-list>
  </div>
</template>

<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import {Group, GroupTitle, PopupPicker, Cell, Actionsheet, Popup, Search, Radio, Confirm, XDialog, ConfirmPlugin} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import StudentList from '../../components/StudentList.vue'
import SelectOrgUser from '../../components/SelectOrgUser'
import api from '../../api'
Vue.use(ConfirmPlugin)
export default {
  components: {
    Group, GroupTitle, PopupPicker, Cell, Actionsheet, Popup, Search, Radio, DetailTabbar, Confirm, XDialog, SelectOrgUser, StudentList
  },
  data () {
    return {
      classId: [], // 已选择班级
      list: [],
      classList: [[]],
      actions: [],
      isHaveStudents: true, // 所选班级是否有学生
      menus: {
        // parent: '选择群成员绑定家长',
        student: '选择群成员绑定学生',
        info: '查看学生详情',
        modify: '修改',
        del: '删除'
      },
      changeStatus: false, // 手动修改classId的状态，处理修改后自动处罚change的冲突
      showMenu: false,
      tempItemData: {},
      showGroupParent: false,
      searchValue: null,
      showBlock: false,
      scrollerHeight: 0,
      parents: [],
      selectParent: null,
      parentsHint: '没有发现任何群成员，请添加家长群',
      studentValue: null,
      showGroupStudent: false,
      students: [],
      bindStudents: [],
      isManage: false, // 是否是学校管理员
      isHideMe: false, // 隐藏’我的‘按钮
      showPushConfirm: false,
      isSearchParent: false,
      copyDesc: '',
      userInfo: {},
      orgFilter: {},
      currentClassInfo: {},
      tempIndex: -1,
      isShowStudentList: false,
      isStudentsBinded: false
    }
  },
  mounted () {
    this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (info) => {
      this.userInfo = info
      if (!this.tools.isNull(this.userInfo) && !this.tools.isNull(this.userInfo.feature) && this.userInfo.feature.classManage) {
        this.isManage = true // 学校管理者
      }
      this.onDrawActions()
    })
    if (!this.tools.isNull(this.$route.params.classId)) {
      this.onChange(this.$route.params.classId)
      this.classId = [this.$route.params.classId]
    }
    this.scrollerHeight = window.innerHeight * 0.8 - 94 - 45
    api.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'XUESHENGXINXI'}, (data) => {
      data.forEach((element) => {
        var item = {
          name: element.className,
          value: element.classId + ''
        }
        this.classList[0].push(item)
      }, this)
      if (this.classList[0].length === 1) {
        this.onChange(data[0].classId)
        this.classId = [data[0].classId]
      } else {
        if (sessionStorage.getItem('view-student-list_classId') !== null) {
          this.onChange(sessionStorage.getItem('view-student-list_classId'))
          this.classId = [sessionStorage.getItem('view-student-list_classId') + '']
        }
      }
    }, () => {})
  },
  methods: {
    // 提醒完善资料
    remindInfo () {
      if (this.classId.length === 0) {
        this.tools.warnToast('请先选择目标班级', '140px')
        return
      }
      this.showDialog()
    },
    showDialog () {
      let schoolUrl = '#/edu/index/' + this.$route.params.schoolId
      api.getShorturl({url: schoolUrl}, (data) => {
        this.copyDesc = '重要通知：为了进一步提高本校班级微信群的沟通效率，我们特此开通了校园微信群管理平台。请大家点击下方链接完善各自的资料。如有遇到提示您不是本校成员，请联系班主任。链接地址：' + data.shortUrl
        this.showPushConfirm = true
      }, () => {})
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
    // 绑定学生
    confirmBindStudent(val) {
      // let studentInfo = JSON.parse(this.studentValue)
      api.bindingStudentByuserId({schoolId: this.$route.params.schoolId, studentId: this.tempItemData.studentId, userId: val.userId, classId: this.classId[0], orgId: val.orgId}, (data) => {
        this.list.forEach(element => {
          if (element.studentId === this.tempItemData.studentId) {
            element.userId = val.userId
            element.userIcon = val.userIcon
            element.userName = val.userName
          }
        })
        this.tools.successToast('绑定成功！')
        this.showGroupStudent = false
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('绑定失败')
        }
      })
    },
    // 绑定家长
    confirmBindParent(parentInfo) {
      let userIds = []
      for (let index = 0; index < parentInfo.length; index++) {
        const element = JSON.parse(parentInfo[index])
        userIds.push(element.userId)
      }
      api.addParentBinding({schoolId: this.$route.params.schoolId, userIds: userIds, studentId: this.tempItemData.studentId, orgId: parentInfo.orgId, classId: this.classId}, (data) => {
        this.list.forEach(element => {
          if (element.studentId === this.tempItemData.studentId) {
            element.bindingParent = userIds.length
            element.bindingParentStatus = userIds.length
          }
        })
        this.showGroupParent = false
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    menuClick(key) {
      switch (key) {
        case 'parent':
          this.orgFilter.classId = this.classId[0]
          this.orgFilter.type = 3
          this.orgFilter.wantName = this.tempItemData.studentName
          this.orgFilter = JSON.parse(JSON.stringify(this.orgFilter))
          this.showGroupParent = true
          break
        case 'student':
          this.orgFilter = Object.assign({}, this.orgFilter, {classId: this.classId[0], type: 2, wantName: this.tempItemData.studentName})
          this.showGroupStudent = true
          break
        case 'info':
          this.$router.push({name: 'educationLookStudentInfoClassId', params: {studentId: this.tempItemData.studentId, classId: this.classId[0]}})
          break
        case 'modify':
          this.$router.push({name: 'educationEditStudent', params: {studentId: this.tempItemData.studentId}})
          break
        case 'del':
          let self = this
          this.$vux.confirm.show({
            title: '提示',
            content: '<span style="color: red">您确定删除[' + this.tempItemData.studentName + ']吗？删除后此学生将无法使用</span>',
            onConfirm () {
              api.adminDeleteStudent({ schoolId: self.$route.params.schoolId, studentId: self.tempItemData.studentId, classId: self.currentClassInfo.classId }, (data) => {
                self.tools.successToast('删除成功')
                self.list.splice(self.tempIndex, 1)
              }, (er) => {
                if (er.toUser !== undefined && er.toUser) {
                  this.tools.warnToast(er.message)
                } else {
                  this.tools.wranToast('删除失败！')
                }
              })
            }
          })
          break
      }
    },
    onActions (type) {
      if (type === 'add') {
        if (this.currentClassInfo.classType === 1) {
          this.$router.push({name: 'educationClassAddStudent', params: {classId: this.classId[0]}})
        } else if (this.currentClassInfo.classType === 2) {
          this.isShowStudentList = true
        }
      } else if (type === 'change') {
        if (this.classId.length === 0) {
          this.tools.warnToast('请先选择目标班级', '140px')
          return
        }
        api.queryByClassId({schoolId: this.$route.params.schoolId, classId: this.classId[0]}, (data) => {
          sessionStorage.setItem('roleName', data.roleName)
          this.$router.push({name: 'educationRoleDetails', params: {roleId: data.roleId}})
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('获取数据失败')
          }
        })
      }
    },
    // 选择班级回调
    onChange (val) {
      if (this.changeStatus === false) {
        sessionStorage.setItem('view-student-list_classId', val)
        this.queryClassInfo(val, (isShow) => {
          // isShow 是否展示复制发群功能
          this.list = []
          api.queryStudentList({schoolId: this.$route.params.schoolId, classId: val}, (data) => {
            this.list = data
            if (this.list.length > 0) {
              this.isHaveStudents = true
            } else {
              this.isHaveStudents = false
              this.changeStatus = true
              // this.classId = []
              this.$nextTick(() => {
                this.changeStatus = false
              })
            }
            this.isStudentsBinded = false
            if (this.list.length > 0 && isShow) {
              this.list.forEach(element => {
                if (element.bindingParent > element.bindingParentStatus || !this.tools.isNull(element.userId)) {
                  // 存在已绑定的学生
                  this.isStudentsBinded = true
                }
              })
              if (this.isStudentsBinded === false && (this.isManage || this.currentClassInfo.classTeacherId === this.userInfo.teacherId)) {
                this.showDialog()
              }
            }
          }, () => {
            this.changeStatus = true
            // this.classId = []
            this.$nextTick(() => {
              this.changeStatus = false
            })
          })
        })
      }
    },
    // 查询班级信息
    queryClassInfo(val, cb) {
      api.getClassInfo({schoolId: this.$route.params.schoolId, classId: val}, (data) => {
        this.currentClassInfo = data
        if (this.currentClassInfo.isTeacherCreateOrg === true && (this.tools.isNull(this.currentClassInfo.orgId) && this.tools.isNull(this.currentClassInfo.parentOrgId)) && (this.isManage || this.currentClassInfo.classTeacherId === this.userInfo.teacherId)) {
          // 当前班级没有绑定微信群，当前班级允许班主任关联群，是班主任或是管理员
          this.$vux.confirm.show({
            title: '提示',
            content: '请先为班级关联学生群或家长群',
            confirmText: '关联班级群',
            onConfirm: () => {
              this.addOrg()
            }
          })
          cb(false)
        } else {
          cb(true)
        }
        this.onDrawActions()
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    hideBindPopu() {
      this.selectParent = null
      this.showBlock = false
      this.searchValue = null
    },
    onShowStudentInfo (item, index) {
      this.tempIndex = index
      console.log('this.isManage', this.isManage)
      // 判断是管理员／班主任 或是任课教师，任课教师只显示'查看学生信息'
      if (this.classId.length > 0 && (this.isManage || this.currentClassInfo.classTeacherId === this.userInfo.teacherId)) {
        // 是管理者或是当前班的班主任
        this.tempItemData = item
        this.menus = {
          // parent: '选择群成员绑定家长',
          student: '选择群成员绑定学生',
          info: '查看学生详情',
          modify: '修改',
          del: '删除'
        }
        if (item.bindingParent > 0) {
          delete this.menus.parent
        }
        if (item.userId) {
          delete this.menus.student
        }
        if (item.bindingParent > 0 && item.userId) {
          this.$router.push({name: 'educationLookStudentInfoClassId', params: {studentId: item.studentId, classId: this.classId[0]}})
          return
        }
        this.showMenu = true
      } else {
        // 任课教师
        this.$router.push({name: 'educationLookStudentInfoClassId', params: {studentId: item.studentId, classId: this.classId[0]}})
      }
    },
    selectParentBind() {
      api.selectParentBind({schoolId: this.$route.params.schoolId, orgId: this.tempItemData.parentOrgId, classId: this.classId[0], name: this.searchValue, wantName: this.tempItemData.studentName}, (data) => {
        this.parents.splice(0, this.parents.length)
        data.forEach(element => {
          this.parents.push({key: JSON.stringify(element), value: element.userOrgName ? element.userName + '(' + element.userOrgName + ')' : element.userName, icon: this.tools.cdn(element.userIcon)})
        })
        if (this.parents.length > 0) {
          this.parentsHint = '没有更多家长了～'
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    selectStudentBind() {
      api.getStudentsByclassId({schoolId: this.$route.params.schoolId, classId: this.classId, wantName: this.tempItemData.studentName}, (data) => {
        this.students.splice(0, this.students.length)
        this.bindStudents.splice(0, this.bindStudents.length)
        data.forEach(element => {
          if (element.isBind) {
            this.bindStudents.push(element)
          } else {
            this.students.push({key: JSON.stringify(element), value: element.userOrgName ? element.userName + '(' + element.userOrgName + ')' : element.userName, icon: this.tools.cdn(element.userIcon)})
          }
        })
        if (!this.showBlock) {
          this.isSearchParent = false
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取学生失败！')
        }
      })
    },
    // 管理员在无班级的情况下，可以引导去添加班级
    onClassManage () {
      this.$router.push({name: 'educationClassManage'})
    },
    // 绘制底部菜单功能
    onDrawActions () {
      if (this.classId.length > 0 && (this.isManage || this.currentClassInfo.classTeacherId === this.userInfo.teacherId)) {
        // 是管理者或是当前班的班主任
        this.isHideMe = true
        if (this.currentClassInfo.classType === 1) {
          this.actions = [
            {name: '班级教师管理', code: 'change', color: 'rgb(46, 132, 212)'},
            {name: '添加学生', code: 'add'}
          ]
        } else if (this.currentClassInfo.classType === 2) {
          this.actions = [
            {name: '班级教师管理', code: 'change', color: 'rgb(46, 132, 212)'}
          ]
        }
      } else {
        this.actions = []
        this.isHideMe = false
      }
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
    }
  }
}
</script>

<style>
.student_viewstudent_img {
  width: 50px;
  height:50px;
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

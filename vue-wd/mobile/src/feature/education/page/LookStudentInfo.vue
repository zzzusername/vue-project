<template>
  <div>
    <group title="学生信息" label-width="5em" label-margin-right="0.5em" label-align="left">
      <!-- <x-input type="text" v-for="(item, index) in studentInfo" :key="index" :title="item.name" disabled v-model="item.value"></x-input> -->
      <cell v-for="(item, index) in studentInfo" :key="index" value-align="left" :title="item.name" :value="item.value"></cell>
      <cell v-if="extendParam !== null && extendParam.length > 0" value-align="left" v-for="(item, index) in extendParam" :key="index" :title="item.key" :value="item.value"></cell>
    </group>
    <group>
      <cell is-link @click.native="onShowCount">
        <span slot="title" style="margin-right:20px;">成绩分析</span>
        <span slot class="iconfont icon-quntongji"></span>
      </cell>
    </group>
    <group title="家长信息" v-if="studentBindingStatus.parentlist.length > 0">
      <cell v-for="(item, index) in studentBindingStatus.parentlist" :key="index" is-link @click.native="showParent(item.userIcon, item.userName, item.parentId, index)">
        <p v-if="item.parentId != undefined" slot="title" style="margin-right:20px;">
          <span>{{item.relationship}}</span>
          <span v-if="item.parentName">{{' (' + item.parentName + ')'}}</span>
          <span style="color: red" v-else>(待{{' [' + item.userName + '] '}}完善家长信息)</span>
        </p>
        <p v-else slot="title" style="margin-right:20px;"><span>{{item.relationship}}</span>&nbsp;<span style="color: red">(待{{' [' + item.userName + '] '}}完善家长信息)</span></p>
      </cell>
    </group>
    <group title="二维码绑定">
      <cell :title="studentBindingStatus.userId!=null?studentBindingStatus.userName:'绑定学生微信'" is-link @click.native="showQrcode('1')">
        <p class="iconfont icon-erweimazhuanhuan"></p>
      </cell>
      <cell title="绑定家长微信" is-link @click.native="showQrcode('2')">
        <p class="iconfont icon-erweimazhuanhuan"></p>
      </cell>
    </group>
    <div v-transfer-dom>
      <x-dialog v-model="stutendtQrcode" class="dialog-demo" hide-on-blur @on-hide="showMenu=false">
        <div class="img-style">
          <div style="width: 180px; height: 180px;margin: auto;" v-if="studentBindingStatus.userId == null">
            <qrcode style="text-align:center;" :value="url" type="img"></qrcode>
          </div>
          <p style="text-align: center;margin-top: 2vw;" v-if="studentBindingStatus.userId == null">
            <span style="font-size:18px;">请扫码绑定微信！</span>
          </p>
          <div style="width: 180px; margin: auto;" v-if="studentBindingStatus.userId != null">
            <p class="student_unbing_manage_img" :style="{'background-image':'url('+tools.cdn(studentBindingStatus.userIcon, 'head.png', 128)+')'}" src=""></p>
            <p style="font-size:18px;margin-top:5vw;">{{studentBindingStatus.userName}}</p>
          </div>
          <p style="text-align: center;margin-top: 5vw;" v-if="studentBindingStatus.userId != null">
            <span @click="unBunding" style="display: inline-block;height: 10vw;width: 40vw;line-height: 10vw;background-color: rgb(142, 191, 82);border-radius: 5vw;color: #fff;">解绑</span>
          </p>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="parentQrcode" class="dialog-demo" hide-on-blur @on-hide="showMenu=false">
        <div class="img-style">
          <div style="width: 180px; height: 180px;margin: auto;" v-if="isShowParentCode">
            <qrcode style="text-align:center;" :value="url" type="img"></qrcode>
          </div>
          <p slot="default" style="text-align:center;margin-top:2vw;" v-if="isShowParentCode"><span style="font-size:18px;">请扫码绑定微信！</span></p>
        </div>
      </x-dialog>
    </div>
    <detail-tabbar></detail-tabbar>
    <select-org-user :show-popu="showGroupStudent" :filter="orgFilter" :max="1" @on-hide="showGroupStudent = false" @select-value="selectStuUser">
      <!-- <p slot="title">请为「{{info.studentName}}」绑定家长微信</p> -->
      <p slot="no-data-hint">没有发现群成员，请<span style="color:blue" @click="addOrg">添加</span>学生群</p>
    </select-org-user>
    <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel @on-click-menu-cancel="stutendtQrcode=false"></actionsheet>
    <actionsheet v-model="showChooseBinding" :menus="choosemenus" @on-click-menu="chooseClick" show-cancel></actionsheet>
    <actionsheet v-model="showParentBindMenu" :menus="bindParentMenus" @on-click-menu="showBindParentStyle" show-cancel></actionsheet>
    <select-org-user :show-popu="showGroupParent" :filter="orgFilter" :max="999" @on-hide="showGroupParent = false" @select-value="selectUser">
      <!-- <p slot="title">请为「{{info.studentName}}」绑定家长微信</p> -->
      <p slot="no-data-hint">没有发现群成员，请<span style="color:blue" @click="addOrg">添加</span>家长群</p>
    </select-org-user>
  </div>
</template>

<script>
import { Qrcode, Radio, Popup, Group, Cell, XInput, Actionsheet, XDialog, Search, TransferDomDirective as TransferDom } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import SelectOrgUser from '../components/SelectOrgUser'
import Vue from 'vue'
import VueQriously from 'vue-qriously'
Vue.use(VueQriously)
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Qrcode, Radio, Popup, Group, Cell, DetailTabbar, Actionsheet, XDialog, XInput, Search, SelectOrgUser
  },
  data() {
    return {
      isShowParentCode: false, // 控制家长绑定
      tag: null,
      num: null,
      info: {},
      parentIcon: null,
      parentName: null,
      parentUserId: null,
      parentQrcode: false,
      stutendtQrcode: false,
      showDeleteTeacher: false,
      showMenu: false,
      showChooseBinding: false,
      showGroupStudent: false,
      showParentBindMenu: false,
      studentInfo: [],
      managemenus: {
        'title.noop': '您确定要解绑此学生吗?<br/>',
        delete: '<span style="color:red">解绑</span>'
      },
      choosemenus: {
        sacnBinding: '扫码绑定学生',
        groupBinding: '选择群成员绑定'
      },
      bindParentMenus: {
        qrcode: '扫码绑定家长',
        parent: '选择群成员绑定'
      },
      url: '',
      studentBindingStatus: {parentlist: []},
      extendParam: [],
      objectListValue: null,
      objectList: [],
      classId: null,
      isBindList: [],
      teachersHeight: 0,
      studentHeight: 0,
      showGroupParent: false,
      showBlock: false,
      searchValue: null,
      selectParent: null,
      parents: [],
      bindParents: [],
      parentOrgId: null,
      studentId: null,
      currentClassOrgId: null,
      orgFilter: {}
    }
  },
  mounted() {
    this.teachersHeight = window.innerHeight * 0.8 - 94
    this.studentHeight = window.innerHeight * 0.8 - 50
    this.getInfo()
  },
  methods: {
    addOrg () {
      this.$router.push({name: 'educationSchoolOpenOrg'})
    },
    confirmBindParent() {
      let parentInfo = JSON.parse(this.selectParent)
      api.addParentBinding({schoolId: this.$route.params.schoolId, userIds: [parentInfo.userId], studentId: this.studentId, orgId: parentInfo.orgId, classId: this.classId}, (data) => {
        this.studentBindingStatus.parentlist.push({userIcon: parentInfo.userIcon, userId: parentInfo.userId, userName: parentInfo.userName, relationship: parentInfo.userName})
        this.showGroupParent = false
        // console.log(this.studentBindingStatus.parentlist)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    searchParent() {
      this.selectParentBind()
    },
    searchFocus(val) {
      this.showBlock = val
    },
    showBindParentStyle(val) {
      switch (val) {
        case 'qrcode':
          this.getParentCode()  // 获取家长二维码
          break
        case 'parent':
          // this.selectParentBind()
          // this.showGroupParent = true
          this.orgFilter.classId = this.classId
          this.orgFilter.type = 3
          this.orgFilter.wantName = this.info.studentName
          this.orgFilter = JSON.parse(JSON.stringify(this.orgFilter))
          this.showGroupParent = true
          break
      }
    },
    getInfo () {
      this.getStudentInfo((data) => {
        this.info = data
        this.studentId = data.studentId
        this.studentBindingStatus = {
          bindingParent: data.bindingParent,
          userName: data.userName,
          userIcon: data.userIcon,
          userId: data.userId,
          parentlist: data.parentlist
        }
        data.classList.forEach(element => {
          if (element.classType === 1) {
            this.parentOrgId = element.parentOrgId
            this.currentClassOrgId = element.orgId
          }
        })
        if (data.extendParam !== null) {
          this.extendParam = JSON.parse(data.extendParam)
        }
        this.queryStudentClass((studentClass) => {
          this.studentInfo.push({ name: '姓名', value: data.studentName })
          if (data.studentSex !== null && data.studentSex !== undefined) {
            data.studentSex = data.studentSex === 1 ? '男' : '女'
          } else {
            data.studentSex = ''
          }
          this.studentInfo.push({ name: '性别', value: data.studentSex })
          this.studentInfo.push({ name: '学号', value: data.studentNumber })
          this.studentInfo.push({ name: '寄宿', value: data.isLodging ? '是' : '否' })
          this.studentInfo.push({ name: '手机号', value: data.studentTelephoneNum })
          var str = ''
          for (var i = 0; i < studentClass.length; i++) {
            if (studentClass[i].classType === 1) {
              this.studentInfo.push({ name: '行政班', value: studentClass[i].className })
              this.classId = studentClass[i].classId
            } else {
              if (i === studentClass.length - 1) {
                str = str + studentClass[i].className
              } else {
                str = str + studentClass[i].className + ','
              }
            }
          }
          if (str !== '') {
            this.studentInfo.push({ name: '课外班', value: str })
          }
        })
      })
    },
    getStudentInfo(callback) {
      api.getStudentInfo({ schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    queryStudentClass(callback) {
      api.queryStudentClass({ schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getStudentCode () {
      api.getStudentBindingCode({ schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId }, (data) => {
        this.url = data
        this.stutendtQrcode = true
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取二维码失败！')
        }
      })
    },
    getParentCode () {
      api.getStudentBindingByTeacherCode({ schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId }, (data) => {
        this.url = data
        this.parentQrcode = true
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取二维码失败！')
        }
      })
    },
    showQrcode(code) {
      if (code === '1') {
        this.tag = 'STUDENT'
        if (this.studentBindingStatus.userId === null) {
          this.showChooseBinding = true
        } else {
          this.stutendtQrcode = true
        }
      } else {
        // this.isShowParentUnbing = false
        this.isShowParentCode = true
        this.getParentCode()
        // this.showParentBindMenu = true
        // this.tag = 'PARENT'
      }
    },
    showParent (userIcon, userName, parentId, index) {
      if (parentId === undefined) {
        this.tools.warnToast('等待对方确认中')
        return
      }
      this.parentUserId = parentId
      if (this.$route.params.classId) {
        this.$router.push({name: 'educationQueryParentInfo', params: {studentId: this.$route.params.studentId, parentId: this.parentUserId, classId: this.$route.params.classId}})
      } else {
        this.$router.push({name: 'educationManageParentInfo', params: {studentId: this.$route.params.studentId, parentId: this.parentUserId}})
      }
    },
    unBunding() {
      this.managemenus = {
        'title.noop': '您确定要解绑此学生吗?<br/>',
        delete: '<span style="color:red">解绑</span>'
      }
      this.showMenu = true
      this.isShowParentCode = true
    },
    menuClick(key) {
      if (key === 'delete') {
        api.delStudentBinding({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId}, (data) => {
          this.tools.successToast('解绑成功！')
          this.stutendtQrcode = false
          this.showMenu = false
          this.studentBindingStatus.userId = null
          this.objectListValue = null
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('解绑失败！')
          }
        })
      }
    },
    chooseClick (code) {
      if (code === 'sacnBinding') {
        this.getStudentCode() // 获取学生二维码
      } else if (code === 'groupBinding') {
        if (this.classId === null || this.classId === undefined) {
          this.tools.warnToast('该学生没有班级！', '150px')
          return
        }
        this.orgFilter.classId = this.classId
        this.orgFilter.type = 2
        this.orgFilter.wantName = this.info.studentName
        this.orgFilter = JSON.parse(JSON.stringify(this.orgFilter))
        this.showGroupStudent = true
      //   api.getStudentsByclassId({schoolId: this.$route.params.schoolId, classId: this.classId, wantName: this.info.studentName}, (data) => {
      //     var isBindArr = []
      //     data.forEach((element) => {
      //       if (element.isBind) {
      //         let item = {
      //           'key': element.userId,
      //           'value': element.userName,
      //           'icon': element.userIcon,
      //           'studentName': element.studentName,
      //           'userOrgName': element.userOrgName
      //         }
      //         isBindArr.push(item)
      //       }
      //     })
      //     var listArr = []
      //     data.forEach((element) => {
      //       if (!element.isBind) {
      //         var nameStr
      //         if (element.userOrgName !== null && element.userOrgName !== undefined) {
      //           nameStr = '(' + element.userOrgName + ')'
      //         } else {
      //           nameStr = ''
      //         }
      //         var item = {
      //           'key': element.userId,
      //           'value': element.userName + nameStr,
      //           'icon': this.tools.cdn(element.userIcon)
      //         }
      //         listArr.push(item)
      //       }
      //     })
      //     this.objectList = listArr
      //     this.isBindList = isBindArr
      //     this.showGroupStudent = true
      //   }, (er) => {
      //     if (er.toUser !== undefined && er.toUser) {
      //       this.tools.warnToast(er.message)
      //     } else {
      //       this.tools.warnToast('获取学生失败！')
      //     }
      //   })
      // } else {
      //   this.showGroupStudent = false
      //   this.showChooseBinding = false
      }
    },
    confirmChoose () {
      if (!this.objectListValue) {
        return
      }
      api.bindingStudentByuserId({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, userId: this.objectListValue, classId: this.$route.params.classId, orgId: this.currentClassOrgId}, (data) => {
        this.tools.successToast('绑定成功！')
        this.studentInfo = []
        this.getInfo()
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('绑定失败')
        }
      })
      this.showGroupStudent = false
    },
    onShowCount () {
      // this.$router.push({name: 'educationStudentStudyInfoForTeacher', params: {classId: this.classId, studentId: this.$route.params.studentId, parents: 0}})
      this.$router.push({name: 'educationStudentInfoForTeacher', params: {classId: this.classId, studentId: this.$route.params.studentId, type: 'teacher'}})
    },
    selectParentBind() {
      api.selectParentBind({schoolId: this.$route.params.schoolId, orgId: this.parentOrgId, classId: this.classId, wantName: this.info.studentName, name: this.searchValue}, (data) => {
        this.parents.splice(0, this.parents.length)
        // this.bindParents.splice(0, this.bindParents.length)
        data.forEach(element => {
          // if (element.isBind) {
          //   this.bindParents.push(element)
          // } else {
          this.parents.push({key: JSON.stringify(element), value: element.userOrgName == null ? element.userName : element.userName + '(' + element.userOrgName + ')', icon: this.tools.cdn(element.userIcon)})
          // }
        })
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    selectUser(val) {
      let userIds = []
      for (let index = 0; index < val.length; index++) {
        const element = JSON.parse(val[index])
        userIds.push(element.userId)
      }
      api.addParentBinding({schoolId: this.$route.params.schoolId, userIds: userIds, studentId: this.studentId, orgId: val.orgId, classId: this.classId}, (data) => {
        // this.studentBindingStatus.parentlist.push({userIcon: val.userIcon, userId: val.userId, userName: val.userName, relationship: '家长'})
        this.tools.successToast('绑定成功！')
        this.studentInfo = []
        this.getInfo()
        this.showGroupParent = false
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    selectStuUser(val) {
      api.bindingStudentByuserId({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, userId: val.userId, classId: this.$route.params.classId, orgId: val.userId}, (data) => {
        this.tools.successToast('绑定成功！')
        this.studentInfo = []
        this.getInfo()
        this.showGroupStudent = false
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('绑定失败')
        }
        this.showGroupStudent = false
      })
    }
  }
}
</script>

<style>
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
.img-style{
  padding:20px 20px 20px 20px;
}
.img-style img{
  display: inline-block !important;
  width:100% !important;
}
.user_img {
  width: 8vw;
  height:8vw;
  display: inline-block;
  /* border-radius: 6vw; */
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
</style>

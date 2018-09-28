<template>
  <div>
    <div :style="{'font-size': '16px', 'padding': '10px 20px', 'fontSize':'16px', 'color':'#222222', 'background':'#fff'}"><!--, 'height':hintHeight+'px'-->
      <img class="fail_user_icon" :src="tools.cdn(userInfo.userIcon)">
      <p style="textAlign:center;fontSize: 16px">{{userInfo.userName}}</p>
      <div v-if="userInfo !== null && userInfo.isSubscribe">
        <p style="margin-top:1.2em;">您好！欢迎使用【校和家】</p>
        <p v-if="parseInt($route.params.status) == 0" style="margin-top:0.7em;font-size:14px;">您当前还不是［{{userInfo.schoolName}}］的成员，请根据您的身份信息完成绑定操作：</p>
      </div>
    </div>
    <div v-if="userInfo !== null && userInfo.isSubscribe">
      <div v-if="parseInt($route.params.status) == 0" style="background:#fff;padding-bottom:10px;">
        <span style="font-size:18px;color:#555;margin-left:15px;margin-right:10px;">身份</span>
        <x-button mini :plain="selectStudent==true?false:true" :class="{personal_position_selected: selectStudent, personal_position_normal: !selectStudent}" @click.native="onSelectPosition(1)">学生</x-button>
        <x-button mini :plain="selectParents==true?false:true" :class="{personal_position_selected: selectParents, personal_position_normal: !selectParents}" @click.native="onSelectPosition(2)">家长</x-button>
        <x-button mini :plain="selectTeacher==true?false:true" :class="{personal_position_selected: selectTeacher, personal_position_normal: !selectTeacher}" @click.native="onSelectPosition(3)">教师</x-button>
      </div>
      <group gutter="0">
        <x-input v-if="selectTeacher == true" placeholder="请输入教师姓名" v-model="teacherName"></x-input>
        <x-input v-if="selectStudent == true || selectParents == true" placeholder="请输入学生姓名" v-model="studentName"></x-input>
        <x-input v-if="selectParents == true" placeholder="请输入家长姓名" v-model="parentName"></x-input>
        <selector v-if="selectParents == true" :class="{personal_selector_normal: !selectRelation, personal_selector_select: selectRelation}" placeholder="与学生的关系" v-model="relation" :options="plainList" @on-change="onSelect"></selector>
      </group>
      <x-button type="primary" style="width:80vw;margin-top:30px;" @click.native="onBind(false)">绑定</x-button>
    </div>
    <div v-else-if="userInfo !== null && userInfo.isSubscribe==false" style="background:#fff;padding:20px;">
      <p style="font-size:16px;">您正在申请成为［{{userInfo.schoolName}}］的成员。请长按识别下图二维码，关注并进入本班的［校和家］公众号，根据公众号的提示，绑定自己的成员身份。</p>
      <div style="margin: 20px 0px 5px">
        <qrcode class="personal_register_qrcode" style="text-align: center;" :value="qrInfo.url" type="img"></qrcode>
      </div>
      <p style="font-size:14px;color:red;margin-top:15px;">提醒：为了您平时使用方便，建议您关注后，将公众号进行置顶。同时为保证您能及时收到老师给您的留言，请不要随意取消关注。</p>
    </div>
    <div v-transfer-dom style="max-height:80vh">
      <x-dialog v-model="showDialog" class="help-dialog" hide-on-blur>
        <div style="max-height:80vh;overflow-y: scroll;padding: 15px 15px 15px;font-size:16px;">
          <p style="text-align:left;margin-bottom:10px;">
            <span style="color:#1E5CCA">{{dialogTitle}}</span>
          </p>
          <cell v-if="!tools.isNull(bindedStudent.studentUserName)">
            <p slot="title" style="text-align:left;">{{bindedStudent.studentUserName}}</p>
            <div slot="icon" class="personal_parents_item_img" :style="{'background-image':'url('+tools.cdn(bindedStudent.studentUserIcon, 'head.png', 128)+')'}"></div>
            <p slot="inline-desc" style="color:#666;fontSize:14px;text-align:left;">{{studentName + '的微信'}}</p>
            <p style="font-size:14px;color:#8FBE58">学生</p>
          </cell>
          <cell v-for="(item, index) in parentList" :key="index">
            <p slot="title" style="text-align:left;">{{item.userName}}</p>
            <div slot="icon" class="personal_parents_item_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
            <p slot="inline-desc" style="color:#666;fontSize:14px;text-align:left;">{{studentName + '的' + item.relationship}}</p>
            <p style="font-size:14px;color:#8FBE58">家长</p>
          </cell>
        </div>
        <div style="font-size:12px;font-size:red;padding: 0 15px;color:#FF555E;margin-top:7px; text-align:left;">
          {{errHint}}
        </div>
        <div v-if="bottomBarType==0" style="background:#f2f2f2;text-align:center;padding:10px 0px;font-size:16px;margin-top:25px;display:flex;">
          <span style="color:#444;flex:1;" @click="showDialog=false">修改后绑定</span><span style="color:#2E84D4;flex:1;" @click="onBind(true)">继续绑定</span>
        </div>
        <div v-else-if="bottomBarType==1" style="background:#f2f2f2;text-align:center;padding:10px 0px;font-size:16px;margin-top:25px;display:flex;">
          <span style="color:#444;flex:1;" @click="showDialog=false">修改后绑定</span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { Group, Cell, XInput, Selector, XButton, Flexbox, FlexboxItem, XDialog, TransferDom, AlertPlugin, Qrcode } from 'vux'
import api from '@/feature/education/personalApi'
import indexApi from '../api'
import Vue from 'vue'
Vue.use(AlertPlugin)
export default {
  directives: {
    TransferDom
  },
  components: {
    Group, Cell, XInput, Selector, XButton, Flexbox, FlexboxItem, XDialog, Qrcode
  },
  data () {
    return {
      height: 0,
      plainList: [
        '爸爸', '妈妈', '爷爷', '奶奶', '姥爷', '姥姥', '亲戚'
      ],
      studentName: null,
      parentName: null,
      relation: null,
      selectStudent: false,
      selectParents: false,
      selectTeacher: false,
      selectRelation: false, // 关系是否已经选择，改变展示样式
      showDialog: false,
      studentList: [],
      parentList: [],
      dialogTitle: '',
      bindedStudent: {},
      bottomBarType: 0, // 1 需要联系家长完成绑定
      errHint: '',
      teacherName: null,
      qrInfo: {},
      userInfo: {},
      personalClassInfo: {}
    }
  },
  mounted () {
    this.height = window.innerHeight - 20
    if (parseInt(this.$route.params.status) === 2) {
      this.selectParents = true
    } else if (parseInt(this.$route.params.status) === 1) {
      this.selectStudent = true
    } else if (parseInt(this.$route.params.status) === 3) {
      this.selectTeacher = true
    } else if (parseInt(this.$route.params.status) === 0) {
      this.selectStudent = true
    }
    this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
      this.userInfo = data
      if (this.userInfo.isSubscribe === false) {
        indexApi.createQrUrl({QRcode: 'PERSONAL_SCHOOL_BIND_ROLE', attach: JSON.stringify({schoolId: this.$route.params.schoolId})}, (data) => {
          this.qrInfo = data
        }, () => {})
      }
    }, () => {})
    this.localStorage.getPersonalSchoolClassInfo({schoolId: this.$route.params.schoolId}, (data) => {
      this.personalClassInfo = data
    }, () => {})
  },
  methods: {
    onSelectPosition (type) {
      this.selectStudent = false
      this.selectParents = false
      this.selectTeacher = false
      if (type === 1) {
        this.selectStudent = true
      } else if (type === 2) {
        this.selectParents = true
      } else if (type === 3) {
        this.selectTeacher = true
      }
    },
    onSelect () {
      this.selectRelation = true
    },
    onBind (isContinue) {
      this.bindedStudent = {}
      this.parentList = []
      this.showDialog = false
      if (this.selectStudent === true) {
        if (this.tools.isNull(this.studentName)) {
          this.tools.warnToast('请输入学生姓名')
          return
        }
        api.addStudentToOneself({schoolId: this.$route.params.schoolId, studentName: this.studentName, isContinue}, (data) => {
          this.bottomBarType = 0
          if (data.type === 3) {
            this.showDialog = false
            this.localStorage.clearUserInfo()
            this.tools.successToast('绑定成功')
            this.$router.replace({name: 'educationStudentHome', params: {schoolId: this.$route.params.schoolId}})
          } else if (data.type === 1) {
            this.$vux.alert.show({
              title: '提示',
              content: this.studentName + '已经存在'
            })
          } else if (data.type === 2) {
            this.errHint = '提示：请根据以上信息作出选择：如果学生［' + this.studentName + '］不是您，但和Ta同名，请您选择［修改后绑定］；如果确认Ta就是您，请选择［继续绑定］'
            this.dialogTitle = this.studentName + '已经绑定了' + data.parentList.length + '名家长'
            this.parentList = data.parentList
            this.showDialog = true
          }
        }, (err) => {
          if (err.toUser) {
            this.$vux.alert.show({
              title: '提示',
              content: err.message
            })
          } else {
            this.tools.warnToast('绑定失败')
          }
        })
      } else if (this.selectParents === true) {
        if (this.tools.isNull(this.studentName)) {
          this.tools.warnToast('请输入学生姓名')
          return
        }
        if (this.tools.isNull(this.parentName)) {
          this.tools.warnToast('请输入家长姓名')
          return
        }
        if (this.tools.isNull(this.relation)) {
          this.tools.warnToast('请选择与学生的关系')
          return
        }
        api.addParentToOneself({schoolId: this.$route.params.schoolId, studentName: this.studentName, parentName: this.parentName, relationship: this.relation, isContinue}, (data) => {
          this.bottomBarType = 0
          if (data.type === 4) {
            this.localStorage.clearUserInfo()
            this.tools.successToast('绑定成功')
            this.$router.replace({name: 'educationParentsHome', params: {schoolId: this.$route.params.schoolId}})
          } else if (data.type === 1) {
            this.bottomBarType = 1
            this.errHint = '提示：请根据以上信息作出选择：如果学生［' + this.studentName + '］不是您的子女，但和Ta同名，请您选择［修改后绑定］；如果确认Ta就是您的子女，请联系［' + data.parentList[0].userName + '］绑定完成绑定'
            this.dialogTitle = this.studentName + '已经绑定了' + data.parentList.length + '名家长'
            this.parentList = data.parentList
            this.showDialog = true
            // 继续绑定需要给已有家长发消息
          } else if (data.type === 2) {
            this.errHint = '提示：请根据以上信息作出选择：如果学生［' + this.studentName + '］不是您的子女，但和Ta同名，请您选择［修改后绑定］；如果确认Ta就是您的子女，请选择［继续绑定］'
            this.dialogTitle = this.studentName + '已经存在'
            this.bindedStudent = data
            this.showDialog = true
          } else if (data.type === 3) {
            this.bottomBarType = 1
            this.errHint = '提示：请根据以上信息作出选择：如果学生［' + this.studentName + '］不是您的子女，但和Ta同名，请您选择［修改后绑定］；如果确认Ta就是您的子女，请联系［' + data.parentList[0].userName + '］绑定完成绑定'
            this.dialogTitle = this.studentName + '已经存在，并且已经绑定' + data.parentList.length + '名家长'
            this.bindedStudent = data
            this.parentList = data.parentList
            this.showDialog = true
          }
        }, (err) => {
          if (err.errCode === '21130105') {
            let info = {}
            info.classId = this.personalClassInfo.classId
            info.className = this.personalClassInfo.className
            info.studentName = this.studentName
            info.relationship = this.relation
            info.parentName = this.userInfo.parentName
            sessionStorage.setItem('validateBindStudentName', JSON.stringify(info))
            this.$router.replace({name: 'educationValidateBindParents'})
          } else if (err.toUser) {
            this.$vux.alert.show({
              title: '提示',
              content: err.message
            })
          } else {
            this.tools.warnToast('绑定失败')
          }
        })
      } else if (this.selectTeacher === true) {
        if (this.tools.isNull(this.teacherName)) {
          this.tools.warnToast('请输入教师姓名')
          return
        }
        api.addTeacherToOneself({schoolId: this.$route.params.schoolId, teacherName: this.teacherName}, (data) => {
          this.$vux.alert.show({
            title: '提示',
            content: data.message
          })
        }, (err) => {
          if (err.toUser) {
            this.$vux.alert.show({
              title: '提示',
              content: err.message
            })
          } else {
            this.tools.warnToast('绑定失败')
          }
        })
      }
    }
  }
}
</script>

<style>
.personal_selector_normal select {
  color: #75757B !important;
}
.personal_selector_select select {
  color: #000 !important;
}
.personal_position_normal {
  margin-left:5px !important;
  border-color:#A3D16D !important;
  color:#A3D16D !important;
}
.personal_position_selected {
  margin-left:5px !important;
  color:#fff !important;
  border-color:#A3D16D !important;
  background:#A3D16D !important;
}
.help-dialog .weui-dialog {
  width:85vw !important;
  max-width:85vw !important;
}
.personal_parents_item_img {
  width: 44px;
  height: 44px;
  display: block;
  margin-right: 5px;
  background-position: center center;
  background-size: cover;
}
.personal_register_qrcode img {
  width: 200px !important;
  height: 200px !important;
}
</style>

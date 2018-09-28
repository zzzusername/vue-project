<template>
  <div v-transfer-dom style="max-height:80vh">
    <x-dialog v-model="showDialog" class="help-dialog">
      <div style="max-height:80vh;overflow-y: scroll;padding: 20px 20px 15px;font-size:16px;">
        <strong style="text-align:center">恭喜您！您的班级已创建成功！</strong>
        <p style="margin-top:15px;color:#666666;text-align:left">
接下来，您仅需两步，花费2分钟即可完成班级群管理的初始设置：
        </p>
        <p style="margin-top:15px;color:#666666;text-align:left">
          <strong style="color:#222">第一步：</strong>
          将新创建的班级和您已有班级微信群进行关联
          <span v-if="!isHaveOrg" style="color:#2E84D4;margin-left:10px;text-decoration: underline" @click="onCreateOrg">立即操作</span>
          <span v-else style="color:#8ebf52;margin-left:10px;">已完成</span>
        </p>
        <p style="margin-top:15px;color:#666666;text-align:left">
          <strong style="color:#222">第二步：</strong> 
          通知群成员绑定学生/家长/教师，并开启使用
          <span v-if="!isHaveStudent" style="color:#2E84D4;margin-left:10px;text-decoration: underline" @click="onPush">立即操作</span>
          <span v-else style="color:#8ebf52;margin-left:10px;">已完成</span>
        </p>
        <!-- <div>
          <img style="max-width:100%;margin-top:15px;" src="http://img.qunxiaozhu.com/help/2-1_2.png"></img>
        </div> -->
        <!-- <p style="margin-top:15px;color:#666666;text-align:left">
          <strong style="color:#222">第三步：</strong> 
          将部分群成员设置为教师
          <span style="color:#2E84D4;margin-left:10px;text-decoration: underline" @click="onCreateTeacher">立即操作</span>
        </p> -->
      </div>
      <div v-if="isShowDoneButton" style="background:#f2f2f2;text-align:center;padding:10px 0px;font-size:16px;margin-top:15px;" @click="done">
        <span style="color:#8ebf52;">我已完成</span>
      </div>
    </x-dialog>
    <x-dialog v-model="showPushConfirm">
      <p style="text-align:center;color:#222;margin:15px 15px;text-align:left;font-size:16px;">老师，您好！请将下列文字拷贝，然后发送到您的班级微信群中：</p>
      <div class="agent-copy-div" style="border:1px solid #b2b2b2;margin-top:10px;text-align:left;margin: 0px 15px;padding:10px;color:#888888;font-size:15px;">
        <p>{{copyDesc}}</p>
      </div>
      <div style="text-align:center;font-size:16px;height:38px;margin-top:13px;">
        <div style="width:50%;display:inline-block;" @click="onCancel">取消</div><div style="width:50%;display:inline-block;color:#8ebf52" v-clipboard:copy="copyDesc" v-clipboard:success="onCopy" v-clipboard:error="onError">拷贝粘贴</div>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  // props: ['show'],
  components: {
    TransferDom, XDialog
  },
  data () {
    return {
      showDialog: true,
      isHaveOrg: false,
      isHaveStudent: false,
      showPushConfirm: false,
      copyDesc: ''
    }
  },
  // watch: {
  //   show(newValue, oldValue) {
  //     if (newValue === true) {
  //       this.showDialog = true
  //     }
  //   }
  // },
  computed: {
    isShowDoneButton () {
      return this.isHaveOrg && this.isHaveStudent
      // return true
    }
  },
  mounted () {
    if (this.localStorage.getHelpForPersonalSchoolMaster(this.$route.params.schoolId) !== '1') {
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (info) => {
        if (info.schoolModel === 2) {
          this.init()
        }
      }, () => {})
    }
  },
  methods: {
    init () {
      // 判断是否已经创建群
      api.queryRelationOrg({schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 20}, (data) => {
        if (data.length > 0) {
          this.isHaveOrg = true
        } else {
          this.isHaveOrg = false
        }
      }, (er) => {})
      // 判断是否已经创建学生
      this.localStorage.getPersonalSchoolClassInfo({schoolId: this.$route.params.schoolId}, (data) => {
        api.getStudentList({ schoolId: this.$route.params.schoolId, classId: data.classId, rowStart: 0, rowCount: 20 }, (studentList) => {
          if (studentList.length > 0) {
            this.isHaveStudent = true
          }
        }, () => {})
      }, () => {})
      // api.getClassList({schoolId: this.$route.params.schoolId, classType: 1, rowStart: 0, rowCount: 20}, (data) => {
      //   if (data.length > 0) {
      //   }
      // }, () => {})
    },
    onCreateOrg () {
      this.$router.push({name: 'educationGroupManage'})
    },
    onCreateStudent () {
      if (!this.isHaveOrg) {
        this.tools.warnToast('请先完善第一步')
        return
      }
      this.localStorage.getPersonalSchoolClassInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.$router.push({name: 'educationClassStudentList', params: {classId: data.classId, classType: 1}})
      }, () => {})
    },
    onCreateTeacher () {
      if (!this.isHaveOrg) {
        this.tools.warnToast('请先完善第一步')
        return
      }
      this.$router.push({name: 'educationTeacherManage'})
    },
    done () {
      this.showDialog = false
      this.localStorage.setHelpForPersonalSchoolMaster(this.$route.params.schoolId, 1)
    },
    onPush () {
      if (!this.isHaveOrg) {
        this.tools.warnToast('请先完善第一步')
        return
      }
      let schoolUrl = '#/edu/index/' + this.$route.params.schoolId
      api.getShorturl({url: schoolUrl}, (data) => {
        this.copyDesc = '重要通知：为了进一步提高本班微信群的沟通效率，我们特此开通了班级微信群管理平台。请大家点击下方链接完善各自的资料。如有遇到问题，请联系班主任。链接地址：' + data.shortUrl
        this.showPushConfirm = true
        this.showDialog = false
      }, () => {})
    },
    onCopy () {
      this.tools.successToast('拷贝成功')
      this.showPushConfirm = false
      this.showDialog = true
      this.isHaveStudent = true
    },
    onError () {
      this.tools.warnToast('拷贝失败，请手动拷贝粘贴')
    },
    onCancel () {
      this.showDialog = true
      this.showPushConfirm = false
    }
  }

}
</script>

<style>
.help-dialog .weui-dialog {
  width:85vw !important;
  max-width:85vw !important;
}
.agent-copy-div p{
  -webkit-touch-callout:default !important;  /*系统默认菜单被禁用*/
  -webkit-user-select:all !important; /*webkit浏览器*/ 
  user-select:all !important;   
}
</style>

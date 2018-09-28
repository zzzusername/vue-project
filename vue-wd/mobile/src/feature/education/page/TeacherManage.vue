<template>
  <div>
    <search @on-submit="onSubmit" :auto-fixed="true" @on-focus="onFocus" @on-cancel="onCancel" v-model="searchContent"></search>
    <p style="padding: 5px 10px;" v-if="showTeacherCount">全校共{{teacherCount}}名教师</p>
    <div :style="{'height': listHeight + 'px', 'position': 'relative', 'margin-top': isFocus?'44px':'0px'}" class="scroller-wrap">
      <scroller :on-infinite="infinite" ref="teacher_manage_scroller">
        <cell style="backgroundColor: #fff" v-for="(item, index) in teacherList" :key="index" ref="index" is-link @click.native="showMenu(item)">
          <p slot="title" style="vertical-align: middle;">
            <span style="margin-right:10px;font-size:16px;">{{item.teacherName}}</span>
            <span :style="{'vertical-align': 'middle', color: item.userId != null ? item.teacherAvailableStatus == 1 ? '#2067FB' : '#FF6D56' : '#FF6D56'}">{{ item.userId != null ? item.teacherAvailableStatus == 1 ? item.userName : '待 [' + item.userName + '] 完善教师信息' : '未绑定微信'}}</span>
          </p>
          <!-- <p slot="inline-desc" :style="{'vertical-align': 'middle', color: item.userId != null ? item.teacherAvailableStatus == 1 ? '#666' : '#FF6D56' : '#FF6D56'}">{{ item.userId != null ? item.teacherAvailableStatus == 1 ? '微信: ' + item.userName : '待 [' + item.userName + '] 完善教师信息' : '未绑定微信'}}</p> -->
          <p slot="inline-desc" v-if="item.classNames">{{item.classNames}}的班主任</p>
          <!-- <p slot="inline-desc" v-else-if="item.userId != null && item.userName != null && item.teachClassNames">{{item.teachClassNames}}的任课老师</p> -->
          <div slot="icon" class="teacher_manage_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head2.png', 128)+')'}" src=""></div>
        </cell>
      </scroller>
      <p style="text-align:center;font-size: 16px;padding: 20px 15px;fontSize:16px;color:#a2a2a2" v-if="teacherList.length <= 0">没有可管理的教师，请先去添加！</p>
    </div>
    <detail-tabbar :actionLink="addTeacher" :actions="actions" isHideMe=true></detail-tabbar>
    <actionsheet v-model="showActionSheet" :menus="menus" show-cancel @on-click-menu="menuClick"></actionsheet>
    <!-- 教师绑定二维码 -->
    <div v-transfer-dom>
      <x-dialog v-model="showQrcode" class="teacher-qrcode-dialog">
        <div style="padding: 10px 0;">
          <p style="textAlgin: center;padding: 10px;fontSize: 16px;"><span style="color: #2E84D4">{{tempInfo.teacherName}}</span>的二维码</p>
          <qrcode :value="qrcodeUrl" type="img" :size="180"></qrcode>
          <p style="margin: 5px 20px 0px">请长按二维码，选择“发送给朋友”，将该二维码发送给<span style="color: #2E84D4">{{tempInfo.teacherName}}</span>老师让其绑定；或者与其面对面扫码绑定。</p>
        </div>
        <div style="padding: 10px;" @click="showQrcode=false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>
    <!-- 绑定教师列表 -->
    <!-- <div v-transfer-dom>
      <popup v-model="showGroupTeacher" height="80%" @on-hide="hideBindPopu">
        <div v-if="showGroupTeacher">
          <p style="margin:10px 10px;font-size:16px;color:#222">请为「{{tempInfo.teacherName}}」绑定微信</p>
          <div style="position:relative">
            <search placeholder="搜索教师" top="0" position="absolute" @on-submit="searchTeacher" v-model="searchValue" @on-focus="searchFocus(true)" @on-cancel="searchFocus(false)"></search>
            <div v-if="showBlock" style="height: 44px"></div>
            <div :style="{'position': 'relative', 'height': teachersHeight + 'px'}">
              <scroller>
                <div style="textAlign:center; padding: 10px; color: #a2a2a2;font-size:16px;" v-if="teachers.length == 0 && bindTeachers.length == 0 && !isSearch">没有发现群成员, 请<span style="color:blue" @click="addOrg">添加</span>教师群</div>
                <p v-else-if="teachers.length == 0 && bindTeachers.length == 0 && isSearch" style="text-align:center;padding: 10px; color: #a2a2a2;font-size: 16px;">没有搜到任何结果，换个名字试试吧</p>
                <radio class="bind_teachers" style="backgroundColor: #fff" :options="teachers" v-model="selectTeacher"></radio>
                <cell style="backgroundColor: #fff" v-for="(item, index) in bindTeachers" :key="index">
                  <div slot="icon" class="teachers_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
                  <p slot="title" style="">{{item.userName}}<span v-if="item.userOrgName != null">({{item.userOrgName}})</span></p>
                  <p style="color: #FF6D56"><span style="color: #666">{{item.teacherName}}</span>&nbsp;<span>已绑定</span></p>
                </cell>
              </scroller>
            </div>
          </div>
        </div>
        <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
          <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showGroupTeacher = false">
            <p style="line-height: 50px; textAlign: center;">关闭</p>
          </div>
          <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmChoose">
            <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
          </div>
        </div>
      </popup>
    </div> -->
    <select-org-user :max="1" :show-popu="showPopuOrgUser" :filter="orgFilter" @on-hide="showPopuOrgUser = false" @select-value="selectUser"></select-org-user>
    <feature-help-dialog :type="helpType" :schoolId="String($route.params.schoolId)"></feature-help-dialog>
    <div>
      <x-dialog v-model="showConfirm">
        <p style="text-align:center;color:#222;margin:15px 15px;text-align:left;font-size:16px;">管理员老师，您好！请将下列文字拷贝，然后发送到教师微信群中：</p>
        <div class="agent-copy-div" style="border:1px solid #b2b2b2;margin-top:10px;text-align:left;margin: 0px 15px;padding:10px;color:#888888;font-size:15px;">
          <p>{{copyDesc}}</p>
        </div>
        <div style="text-align:center;font-size:16px;height:38px;margin-top:13px;">
          <div style="width:50%;display:inline-block;" @click="showConfirm=false">取消</div><div style="width:50%;display:inline-block;color:#8ebf52" v-clipboard:copy="copyDesc" v-clipboard:success="onCopy" v-clipboard:error="onError">拷贝粘贴</div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
  Vue.use(VueClipboard)

  import { Group, Cell, Search, Actionsheet, XDialog, Qrcode, Popup, Radio, TransferDomDirective as TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../api'
  import {mapGetters} from 'vuex'
  import FeatureHelpDialog from '@/feature/education/components/FeatureHelpDialog.vue'
  import SelectOrgUser from '@/feature/education/components/SelectOrgUser'

  export default{
    directives: { TransferDom },
    components: { Group, Cell, DetailTabbar, Search, Actionsheet, XDialog, Qrcode, Popup, Radio, FeatureHelpDialog, SelectOrgUser },
    data () {
      return {
        listHeight: 0,
        showActionSheet: false,
        searchContent: null,
        teacherList: [],
        actions: [
          {
            name: '提醒教师完善信息',
            code: 'push',
            color: '#FF6D56'
          },
          {
            name: '添加教师',
            code: 'addTeacher'
          }
        ],
        menus: {
          // select: '选择群成员绑定',
          qrcode: '扫码绑定',
          look: '查看'
        },
        tempInfo: {},
        qrcodeUrl: '',
        showQrcode: false,
        showGroupTeacher: false,
        searchValue: null,
        selectTeacher: null,
        teachers: [],
        bindTeachers: [],
        teachersHeight: 0,
        showBlock: false,
        helpType: 0,
        isFocus: false,
        showConfirm: false,
        copyDesc: '',
        isSearch: false,
        orgFilter: {type: 1},
        showPopuOrgUser: false, // 兼容教师版本的绑定操作
        teacherCount: null,
        showTeacherCount: true
      }
    },
    mounted () {
      this.teachersHeight = window.innerHeight * 0.8 - 94 - 45
      // 判断是否需要显示帮助提示
      let type = this.localStorage.getHelpProgressForSchoolMaster(this.$route.params.schoolId)
      if ((type === null || parseInt(type) === 0) && this.localStorage.getTeacherHelpForSchoolManager(this.$route.params.schoolId) !== 'true') {
        this.helpType = 2
      }
      api.teacherListCount({schoolId: this.$route.params.schoolId}, (data) => {
        this.teacherCount = data
      }, (er) => {})
      this.listHeight = window.innerHeight - 94 - 32
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    methods: {
      onCopy () {
        this.tools.successToast('拷贝成功')
        this.showConfirm = false
      },
      onError () {
        this.tools.warnToast('拷贝失败，请手动拷贝粘贴')
      },
      addOrg () {
        this.$router.push({name: 'educationSchoolOpenOrg'})
      },
      searchFocus(val) {
        this.showBlock = val
        if (!val) {
          this.searchValue = null
          this.searchTeacher()
        } else {
          this.isSearch = true
        }
      },
      searchTeacher() {
        this.getNoBindTeacherList(this.searchValue, 0, (data) => {
          this.showGroupTeacher = true
          this.teachers.splice(0, this.teachers.length)
          this.bindTeachers.splice(0, this.bindTeachers.length)
          data.forEach(element => {
            if (element.isBind) {
              this.bindTeachers.push(element)
            } else {
              this.teachers.push({key: JSON.stringify(element), value: element.userOrgName ? element.userName + '(' + element.userOrgName + ')' : element.userName, icon: this.tools.cdn(element.userIcon)})
            }
          })
          if (!this.showBlock) {
            this.isSearch = false
          }
        })
      },
      confirmChoose() {
        let obj = JSON.parse(this.selectTeacher)
        this.selectTeacherBind(obj)
      },
      selectTeacherBind (obj) {
        api.selectTeacherBind({schoolId: this.$route.params.schoolId, userId: obj.userId, teacherId: this.tempInfo.teacherId, orgId: obj.orgId}, (data) => {
          this.teacherList.forEach((val) => {
            if (val.teacherId === this.tempInfo.teacherId) {
              val.userIcon = obj.userIcon
              val.userName = obj.userName
              val.userId = obj.userId
              val.teacherAvailableStatus = 2
            }
          })
          this.showGroupTeacher = false
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      },
      menuClick(val) {
        switch (val) {
          case 'qrcode':
            this.localStorage.setHelpProgressForSchoolMaster(this.$route.params.schoolId, 0)
            this.getBindQrcode()
            break
          case 'select':
            this.orgFilter.type = 1
            this.orgFilter.wantName = this.tempInfo.teacherName
            this.orgFilter = JSON.parse(JSON.stringify(this.orgFilter))
            this.showPopuOrgUser = true
            // this.getNoBindTeacherList(this.searchValue, 0, (data) => {
            //   if (this.userInfo.schoolModel === 2) {
            //     this.showPopuOrgUser = true
            //   } else if (this.userInfo.schoolModel === 1) {
            //     this.showGroupTeacher = true
            //   }
            //   this.teachers.splice(0, this.teachers.length)
            //   this.bindTeachers.splice(0, this.bindTeachers.length)
            //   data.forEach(element => {
            //     if (element.isBind) {
            //       this.bindTeachers.push(element)
            //     } else {
            //       this.teachers.push({key: JSON.stringify(element), value: element.userOrgName ? element.userName + '(' + element.userOrgName + ')' : element.userName, icon: this.tools.cdn(element.userIcon)})
            //     }
            //   })
            // })
            break
          case 'look':
            this.$router.push({name: 'educationTeacherMessages', params: {teacherId: this.tempInfo.teacherId}})
            break
        }
      },
      addTeacher (code) {
        if (code === 'addTeacher') {
          if (this.userInfo.schoolModel === 1) {
            this.$router.push({name: 'educationAddTeacher'})
          } else {
            this.$router.push({name: 'educationPersonalAddTeacher'})
          }
        } else if (code === 'push') {
          let schoolUrl = '#/edu/index/' + this.$route.params.schoolId
          api.getShorturl({url: schoolUrl}, (data) => {
            this.copyDesc = '各位老师：为了帮助大家更加高效管理各班级微信群，我们特此开通了校园微信群管理平台。任课老师不用加入班级微信群，即可同时向多个班级群发布公告、成绩、作业等信息；还可要求家长对重要的信息作出阅读反馈；学生自助在线请假，班主任随时随地批准假条；家长只能查阅自己孩子的成绩等信息，保护了学生的隐私。请各位老师点击下方链接激活账号并完善各自的资料。如遇到问题，请联系客服人员（微信号：jiaxiaoshequn）。链接地址：' + data.shortUrl
            this.showConfirm = true
          }, () => {})
        }
      },
      showMenu (val) {
        // console.log(val)
        this.tempInfo = val
        if (val.userId === null) {
          this.showActionSheet = true
        } else {
          this.$router.push({name: 'educationTeacherMessages', params: {teacherId: val.teacherId}})
        }
        // this.$router.push({name: 'educationTeacherMessages', params: {teacherId: teacherId}})
      },
      onSubmit () {
        this.teacherList = []
        this.$refs.teacher_manage_scroller.finishInfinite()
      },
      onFocus () {
        this.showTeacherCount = false
        this.isFocus = true
        this.listHeight = window.innerHeight - 94
      },
      onCancel () {
        this.showTeacherCount = true
        this.listHeight = window.innerHeight - 94 - 32
        this.isFocus = false
        this.searchContent = null
        this.teacherList = []
        this.$refs.teacher_manage_scroller.finishInfinite()
      },
      hideBindPopu() {
        this.searchValue = null
        this.showBlock = false
        this.selectTeacher = null
      },
      infinite (done) {
        this.getTeacherList(this.searchContent, this.teacherList.length, (data) => {
          this.teacherList = this.teacherList.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      },
      getTeacherList (teacherName, rowStart, callback) {
        api.getTeacherList({schoolId: this.$route.params.schoolId, teacherName: teacherName, rowStart: rowStart, rowCount: 20}, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('获取失败')
          }
        })
      },
      getBindQrcode() {
        api.getTeacherBindingCode({schoolId: this.$route.params.schoolId, teacherId: this.tempInfo.teacherId}, (data) => {
          this.qrcodeUrl = data
          this.showQrcode = true
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('获取失败！')
          }
        })
      },
      getNoBindTeacherList(searchName, start, callback) {
        api.getNoBindTeacherUser({schoolId: this.$route.params.schoolId, name: searchName, wantName: this.tempInfo.teacherName, rowStart: start, rowCount: 50}, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      },
      selectUser (val) {
        this.selectTeacherBind(val)
      }
    },
    filters: {
      difTeachertype (code) {
        if (code === 1) {
          return '任课教师'
        }
        if (code === 2) {
          return '后勤教师'
        }
        if (code === 3) {
          return '教务教师'
        }
      }
    }
  }
</script>
<style>
.teacher_manage_img {
  width: 12vw;
  height:12vw;
  display: inline-block;
  border-radius: 6px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
.normal-style{
  font-size:14px;
  display: inline-block;
  height: 15px;
  line-height: 15px;
  background-color: rgb(252, 80, 31);
  border-radius: 5px;
  color: #fff;
  padding: 2px;
  vertical-align: middle;
}
.prop_style{
  background-color: rgb(142, 191, 82)!important;
}
.scroller-wrap{
  position: relative;
}
.bind_teachers div p img {
  height: 40px;
  width: 40px;
  border-radius: 5px;
}
.teachers_icon {
  width: 40px;
  height: 40px;
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
<style lang="less" scoped>
@import '~vux/src/styles/close';
.dialog-demo {
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>

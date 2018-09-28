<template>
  <div>
    <div :style="{position: 'relative', height: scrollerHeight + 'px'}">
      <scroller :on-refresh="refresh">
        <school-head></school-head>
        <group gutter="0" class="teacher_group">
          <cell :is-link="isShowTecherInfo?true:false" @click.native="gotoTeacherMessage">
            <div slot="title">{{isShowTecherInfo?teacherInfo.teacherName:userInfo.userName}} 
              <p v-show="statusCount>1" style="margin-left:10px;display:inline;font-size:14px;color:#2E84D4" @click="switchStatus">切换身份</p>
              <p style="margin-left:10px;display:inline;font-size:14px;color:#2E84D4" @click="teacherHelp">使用帮助</p>
            </div>
            <div slot="icon" :style="{'background-image':'url('+tools.cdn(isShowTecherInfo?teacherInfo.userIcon:userInfo.userIcon, 'head.png', 128)+')'}" class="student_icon"></div>
            <!-- <p  v-if="isShowTecherInfo" slot="inline-desc" style="margin-top:5px">{{teacherInfo.teacherType === 1 ? '任课教师' : teacherInfo.teacherType === 2 ? '后勤教师' : teacherInfo.teacherType === 3 ? '教务教师' : ''}}</p> -->
            <p  v-if="isShowTecherInfo" slot="inline-desc" style="margin-top:5px"><span style="display:inline;font-size:14px;color:#2E84D4" @click="setLessons">任课设置</span></p>
          </cell>
        </group>
        <group v-show="teacherFeatureList.length>0" title="功能">
          <flexbox :gutter="0" wrap="wrap" style="margin-bottom:10px">
            <flexbox-item v-for="(item, index) in teacherFeatureList" :key="index" :span="1/4" @click.native="onFeatureItemClick(item)">
              <div class="flex-demo jhy-flex-demo">
                <span class="new-icon-circle iconfont " v-bind:class="item.featureIcon" v-bind:style="{ color:item.featureColor}"></span>
                <span style="font-size:14px">{{item.featureName}}</span>
              </div>
            </flexbox-item>
          </flexbox>
        </group>
        <group v-show="manageFeatureList.length>0" title="管理">
          <flexbox :gutter="0" wrap="wrap" style="margin-bottom:10px">
            <flexbox-item v-for="(item, index) in manageFeatureList" :key="index" :span="1/4" @click.native="onFeatureItemClick(item)">
              <div class="flex-demo jhy-flex-demo">
                <span class="new-icon-circle iconfont " v-bind:class="item.featureIcon" v-bind:style="{ color:item.featureColor}"></span>
                <span style="font-size:14px">{{item.featureName}}</span>
              </div>
            </flexbox-item>
          </flexbox>
        </group>
        <group v-show="noHaveFeature" title="功能">
          <p style="font-size: 16px;padding: 10px 15px;fontSize:16px;color:#222222">您已是本校的教师，但没有授予教学管理的权限，您可以尝试以下操作：</p>
          <p style="font-size: 16px;padding: 3px 15px;fontSize:16px;color:#828282"><strong style="color:#626262">1、如果您是某个班级的任课教师</strong>，请联系班主任，加入该班级的微信群，您会自动获得在该班级里的教学管理权限；</p>
          <p style="font-size: 16px;padding: 3px 15px;fontSize:16px;color:#828282;margin-bottom:7px;"><strong style="color:#626262">2、如果您是其它教师</strong>，请联系学校系统管理员，给您增加相应的功能；</p>
        </group>
        <group v-if="false" v-show="isHaveActivity==true && activityList.length>0">
          <group-title slot="title">活动
            <span style="float:right;color:#8ebf52;" @click="skipActivity">更多</span>
          </group-title>
          <div style="margin-top:0!important;margin-bottom:10px;padding: 10px 0;">
            <scroller lock-y :scrollbar-x='false' ref="scroller">
              <div class="box1" :style="scrollerStyle">
                <div v-for="(item,index) in activityList" :key="index" style="width: 70vw;display:inline-block;margin-left: 2vw;" v-on:click="onActivityItemClick(item)">
                  <div style="position: relative;">
                    <div class="jhy-img-bg" :style="{'background-image': 'url('+tools.cdn(item.activityImg?(item.activityImg+'?imageView2/1/w/512/h/512'):null, 'logo.png')+')', width:'70vw', height:'35vw'}"></div>
                    <div style="position: absolute;bottom:15px; width: 100%">
                      <span class="jhy-margin-left-xs jhy-active-button jhy-text-xs" style="float:left;">{{item.userSignCount}}人参加</span>
                    </div>
                  </div>
                  <span style="position: relative;top:3px;" class="jhy-index-text">{{item.activityName}}</span>
                  <div class="vux-label-desc" style="position: relative;top:3px">{{item.activityStatus===2?('截止时间：'+getTime(item.endDate)):('开始时间：'+getTime(item.startDate))}}
                    <badge v-if="item.activityStatus==1" text="未开始" style="float:right;background-color: #c2c2c2;"></badge>
                    <badge v-else-if="item.activityStatus==2 && item.signStatus" text="立即报名" class="jhy-background-success" style="float:right"></badge>
                    <badge v-else-if="item.activityStatus==2 && item.signStatus==false" text="报名结束" style="float:right;background-color: #c2c2c2;"></badge>
                    <badge v-else text="已结束" style="float:right;background-color: #c2c2c2;"></badge>
                  </div>
                </div>
              </div>
            </scroller>
          </div>
        </group>
        <group v-if="isHaveNotice == true && noticeList.length>0">
          <group-title slot="title">公告
            <span style="float:right;color:#8ebf52;" @click="skipNotice">更多</span>
          </group-title>
          <cell v-for="(item, index) in noticeList" :key="index" :title="item.noticeTitle.length>19?item.noticeTitle.substring(0,19)+'...':item.noticeTitle" @click.native="onNoticeItemClick(item)" is-link>
            <div slot="icon" class="notic-list-img" :style="{'background-image':'url('+tools.cdn(item.noticeImg === null ? '' :item.noticeImg.split(',')[0], 'notice.png', 128)+')'}" src="">
              <p v-if="item.noticeReadFeedback==2" style="font-size: 10px;color:#fff;background-color:red;width: 2em;height:12px;padding: 2px;text-align:center;line-height: 12px;">重要</p>
            </div>
            <p slot="inline-desc" style="color:#666;fontSize:14px;">{{tools.getDateDiff(item.createDate)}} &nbsp;<span v-if="item.readerNum">{{item.readerNum}}阅读</span><span v-else-if="item.viewNum">{{item.viewNum}}浏览</span></p>
          </cell>
        </group>
      </scroller>
    </div>
    <!-- <group title="任课班级" v-if="teachingList.length > 0">
      <cell v-for="(item, index) in teachingList" :key="index">
        <p slot="title">{{item.className}}</p>
        <p>{{item.lessonName}}</p>
      </cell>
    </group> -->
    <actionsheet v-model="showSwitchMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <index-tabbar :showHome="true"></index-tabbar>
    <!-- <master-help-dialog :progress="helpProgress"></master-help-dialog> -->
    <feature-help-dialog :type="helpType" :schoolId="String($route.params.schoolId)" :title="classTitle" :extend="helpDialogExtend"></feature-help-dialog>
    <div :is="plugin"></div>
    <!-- <personal-master-help-dialog :show="showPersonalMasterHelpDialog"></personal-master-help-dialog> -->
    <red-envelopes :show="showRedEnvelopes" :is-teacher="true" @show-help-dialog="controlStatus"></red-envelopes>
    <div v-transfer-dom>
      <confirm v-model="showConfirm"
      title="您还不能使用教师功能！"
      @on-confirm="onConfirm" confirm-text="去添加">
        <p style="text-align:center;color:#FF6D56">请先将自己添加成为教师并绑定微信</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Group, Cell, Flexbox, FlexboxItem, Actionsheet, Confirm, TransferDomDirective as TransferDom, GroupTitle, dateFormat, Badge } from 'vux'
import IndexTabbar from '@/components/IndexTabbar.vue'
import SchoolHead from '../../components/SchoolHead.vue'
import MasterHelpDialog from '@/feature/education/components/MasterHelpDialog.vue'
import FeatureHelpDialog from '@/feature/education/components/FeatureHelpDialog.vue'
import PersonalMasterHelpDialog from '@/feature/education/components/PersonalMasterHelpDialog.vue'
import RedEnvelopes from '@/feature/education/components/RedEnvelopes.vue'
import api from '../../api'
import noticeApi from '@/feature/notice/api'
import activityApi from '@/feature/activity/api'
import { mapGetters } from 'vuex'
export default {
  components: {
    RedEnvelopes, Group, Cell, IndexTabbar, Flexbox, FlexboxItem, SchoolHead, Actionsheet, MasterHelpDialog, FeatureHelpDialog, Confirm, GroupTitle, Badge, PersonalMasterHelpDialog
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  data() {
    return {
      featureList: [],
      teacherFeatureList: [],
      manageFeatureList: [],
      teacherInfo: {},
      teachingList: [],
      isShowTecherInfo: false,
      isClickTeacherMessage: true,
      managemenus: {},
      statusCount: 0,
      showSwitchMenu: false,
      helpType: 0,
      classTitle: '',
      masterFeatureList: ['QUANXIANGUANLI', 'LAOSHIGUANLI', 'BANJIGUANLI', 'KECHENGGUANLI', 'QUN', 'GAOJISHEZHI', 'TONGJI', 'personal_xueshengguanli'],
      showConfirm: false,
      noHaveFeature: false,
      showContentFeatureList: [],
      noticeList: [],
      activityList: [],
      scrollerStyle: {width: '200vw'},
      isHaveNotice: false,
      isHaveActivity: false,
      personalClassInfo: {},
      // userInfo: {},
      showPersonalMasterHelpDialog: false,
      showRedEnvelopes: false,
      plugin: '',
      scrollerHeight: 0,
      helpDialogExtend: {}
    }
  },
  watch: {
    userInfo(newValue, old) {
      this.localStorage.clearTeacherFeature()
      this.initWechat(newValue)
      this.initTeacherHome(newValue)
      this.queryNoticeAndActivity()
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 50
    if (!this.tools.isNull(this.userInfo.schoolId)) {
      this.localStorage.clearTeacherFeature()
      this.initWechat(this.userInfo)
      this.initTeacherHome(this.userInfo)
      this.queryNoticeAndActivity()
    }
    if (window.__wxjs_environment === 'miniprogram') {
      this.$wechat.miniProgram.postMessage({ data: {schoolName: this.userInfo.schoolName, schoolId: this.userInfo.schoolId} })
    }
    // this.localStorage.clearTeacherFeature() // 每次进入教师首页需先清空教师功能的缓存
    // this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (info) => {
    //   this.userInfo = info
    //   this.initWechat(this.userInfo)
    //   this.initTeacherHome(this.userInfo)
    //   this.queryNoticeAndActivity()
    // })
  },
  methods: {
    controlStatus () {
      if (this.userInfo.isTeacher) {
        this.localStorage.setRedEnvelopesPersonalSchoolMaster(this.$route.params.schoolId, 9)
        if (this.localStorage.getHelpForPersonalSchoolMaster(this.$route.params.schoolId) !== '1' && this.userInfo.isMaster) {
          // this.showPersonalMasterHelpDialog = true
          this.plugin = 'personal-master-help-dialog'
        }
      }
    },
    initWechat (data) {
      let schoolLogo = !this.tools.isNull(data.schoolLogo) ? (process.env.CDN_DOMAIN + '/' + data.schoolLogo) : (process.env.CDN_DOMAIN + '/school/school-icon.png')
      let schoolName = this.tools.isNull(data.schoolName) ? '' : data.schoolName + '的'
      let index = location.href.indexOf('#')
      let schoolLink = location.href.substring(0, index + 1) + '/edu/index/' + this.$route.params.schoolId
      this.tools.shareWechat({title: schoolName + '家校空间', desc: '点击查看本校的家校空间，随时随地获取学校的教学、公告、活动等信息。轻松搞定学校和家长的互联互通。', imgUrl: schoolLogo, link: schoolLink})
    },
    initTeacherHome (userInfo) {
      if (userInfo.isTeacher === true && this.tools.isNull(this.teacherInfo.teacherId)) {
        this.getTeacherSelfInfo((data) => {
          this.localStorage.setSchoolUserIdentity(this.$route.params.schoolId, this.userInfo.userId, 'teacher')
          this.isShowTecherInfo = true
          this.teacherInfo = data
          // this.tempList = this.tempList.concat(data.teacherTeaching)
          // var classId = null
          // for (var i = 0; i < this.tempList.length; i++) {
          //   if (classId === this.tempList[i].classId) {
          //     for (var j = 0; j < this.teachingList.length; j++) {
          //       if (classId === this.teachingList[j].classId) {
          //         this.teachingList[j].lessonName = this.teachingList[j].lessonName + ',' + this.tempList[i].lessonName
          //         continue
          //       }
          //     }
          //   } else {
          //     classId = data.teacherTeaching[i].classId
          //     this.teachingList.push(data.teacherTeaching[i])
          //   }
          // }
        })
      }
      this.localStorage.getTeacherFeature({schoolId: this.$route.params.schoolId}, (data) => {
        if (data.length === 0) {
          this.noHaveFeature = true
        }
        this.initManagemenus()
        if (userInfo.schoolModel === 2) {
          this.localStorage.getPersonalSchoolClassInfo({schoolId: this.$route.params.schoolId}, (data) => {
            this.personalClassInfo = data
          }, () => {})
          this.showPersonalFeatureAndStatus(userInfo, data)
        } else {
          this.showSchoolFeatureAndStatus(userInfo, data)
        }
      }, () => {})
    },
    // 学校版本功能及当前帮助状态
    showSchoolFeatureAndStatus (userInfo, featureList) {
      // this.localStorage.setHelpProgressForSchoolMaster(this.$route.params.schoolId, 1)
      let tempProgress = this.localStorage.getHelpProgressForSchoolMaster(this.$route.params.schoolId)
      if (!this.tools.isNull(tempProgress) && parseInt(tempProgress) === 1) {
        // 创建者只展示管理员的帮助引导
        this.helpType = 1
      }
      if (!this.tools.isNull(featureList)) {
        // let isHaveTeacherManage = false
        // let isHaveClassManage = false
        // let isHavelessonsManage = false
        this.manageFeatureList = []
        this.teacherFeatureList = []
        this.showContentFeatureList = []
        let noticeSchool = false
        featureList.forEach(element => {
          if (element.featureCode === 'GONGGAO_XUEXIAO') {
            noticeSchool = true
          }
        })
        featureList.forEach(element => {
          if (element.featureCode === 'GONGGAO') {
            this.isHaveNotice = true
          } else if (element.featureCode === 'HUODONG') {
            this.isHaveActivity = true
          }
          if (element.featureType === 'MENU') {
            if (element.featureCode === 'GONGGAOGUANLI' && noticeSchool === false) {
              return
            }
            if (element.featureGroupCode === 'GUANLI') {
              this.manageFeatureList.push(element)
              // if (element.featureCode === 'LAOSHIGUANLI') {
              //   isHaveTeacherManage = true
              // } else if (element.featureCode === 'KECHENGGUANLI') {
              //   isHavelessonsManage = true
              // } else if (element.featureCode === 'BANJIGUANLI') {
              //   isHaveClassManage = true
              // }
            } else if (element.featureGroupCode === 'GONGNENG') {
              this.teacherFeatureList.push(element)
            }
          } else {
            this.showContentFeatureList.push(element)
          }
        })
        // 管理员身份，首次使用时，显示使用流程帮助页面
        // this.localStorage.setHelpForSchoolManager(this.$route.params.schoolId, false)
        // this.localStorage.setTeacherHelpForSchoolManager(this.$route.params.schoolId, false)
        // this.localStorage.setLessonsHelpForSchoolManager(this.$route.params.schoolId, false)
        // this.localStorage.setClassHelpForSchoolManager(this.$route.params.schoolId, false)
        // this.localStorage.setOrgManageHelpForSchoolManager(this.$route.params.schoolId, false)

        // 管理员不再提示帮助
        // if (this.helpProgress === 0 && isHaveTeacherManage === true && isHaveClassManage === true && isHavelessonsManage === true && this.localStorage.getHelpForSchoolManager(this.$route.params.schoolId) !== 'true') {
        //   // 查询有哪些权限，并且getHelpForSchoolManager 是否已经展示过
        //   this.helpType = 1
        //   return
        // }
        // this.localStorage.setCreateOrgHelpForSchoolManager(this.$route.params.schoolId, false)
        if (this.localStorage.getCreateOrgHelpForSchoolManager(this.$route.params.schoolId) !== 'true') {
          // 判断老师是否有创建群的权限
          if (userInfo.isTeacher) {
            api.queryTeacherDefaultClassStudent({schoolId: this.$route.params.schoolId}, (data) => {
              let orgClass = ''
              if (data.orgClassList.length > 0) {
                data.orgClassList.forEach(element => {
                  if (this.tools.isNull(element.orgId) && this.tools.isNull(element.parentOrgId)) {
                    orgClass = orgClass + '【' + element.className + '】'
                  }
                })
              }
              let noStudentClass = ''
              if (data.studentClassList.length > 0) {
                data.studentClassList.forEach(element => {
                  if (this.tools.isNull(element.orgId) && this.tools.isNull(element.parentOrgId)) {
                    noStudentClass = noStudentClass + '【' + element.className + '】'
                  }
                })
              }
              this.helpDialogExtend = {
                orgClass, noStudentClass
              }
              if (this.tools.isNull(orgClass) && this.tools.isNull(noStudentClass)) {
                // 没有需要绑定群的班级
                this.localStorage.setCreateOrgHelpForSchoolManager(this.schoolId, true)
              } else {
                // 有需要绑定群的班级，需要给班主任引导
                this.localStorage.setCreateOrgHelpForSchoolManager(this.schoolId, false)
                this.helpType = 5
              }
            }, () => {})
          }
        }
      }
    },
    // 个人版本功能及当前帮助状态
    showPersonalFeatureAndStatus (userInfo, featureList) {
      // 首次使用显示帮助
      // window.localStorage.setItem('personalSchoolMaster_' + this.$route.params.schoolId, 0)
      if (this.localStorage.getRedEnvelopesPersonalSchoolMaster(this.$route.params.schoolId) !== '9' && this.userInfo.isTeacher) {
        this.showRedEnvelopes = true
      } else {
        if (this.localStorage.getHelpForPersonalSchoolMaster(this.$route.params.schoolId) !== '1' && this.userInfo.isMaster) {
          // this.showPersonalMasterHelpDialog = true
          this.plugin = 'personal-master-help-dialog'
        }
      }
      if (!this.tools.isNull(featureList)) {
        this.manageFeatureList = []
        this.teacherFeatureList = []
        this.showContentFeatureList = []
        let noticeSchool = false // 公告学校 GONGGAO_XUEXIAO
        featureList.forEach(element => {
          if (element.featureCode === 'GONGGAO_XUEXIAO') {
            noticeSchool = true
          }
        })
        featureList.forEach(element => {
          if (element.featureCode === 'GONGGAO') {
            this.isHaveNotice = true
          } else if (element.featureCode === 'HUODONG') {
            this.isHaveActivity = true
          }
          if (element.featureType === 'MENU') {
            if (element.featureGroupCode === 'GUANLI') {
              if (element.featureCode === 'QUANXIANGUANLI' ||
                  element.featureCode === 'BANJIGUANLI' ||
                  element.featureCode === 'DEYUGUANLI' ||
                  element.featureCode === 'TONGJI') {
                return
              }
              if (element.featureCode === 'GONGGAOGUANLI' && noticeSchool === false) {
                return
              }
              let temp = JSON.parse(JSON.stringify(element))
              if (temp.featureCode === 'QUN') {
                temp.featureUrl = JSON.stringify({name: 'educationGroupManage'})
              }
              this.manageFeatureList.push(temp)
            } else if (element.featureGroupCode === 'GONGNENG') {
              if (element.featureCode === 'XUESHENGXINXI') {
                return
              }
              this.teacherFeatureList.push(element)
            }
          } else {
            this.showContentFeatureList.push(element)
          }
        })
        let studentManage = {
          featureCode: 'personal_xueshengguanli',
          featureColor: 'CornflowerBlue',
          featureIcon: 'icon-xueshengxinxi',
          featureName: '学生管理',
          featureUrl: JSON.stringify({name: 'educationClassStudentList'})
        }
        if (userInfo.isMaster) {
          this.manageFeatureList.unshift(studentManage)
        }
        // 如果是创建者，提示引导
      }
    },
    // 初始化身份类型
    initManagemenus () {
      this.statusCount = 0
      if (this.userInfo.isMaster === true) {
        this.managemenus.teacher = '我是创建者（当前身份）'
        this.statusCount ++
      } else if (this.userInfo.isTeacher === true) {
        this.managemenus.teacher = '我是教师（当前身份）'
        this.statusCount ++
      }
      if (this.userInfo.isParent === true) {
        this.managemenus.parent = '我是家长'
        this.statusCount ++
      }
      if (this.userInfo.isStudent === true) {
        this.managemenus.student = '我是学生'
        this.statusCount ++
      }
    },
    menuClick (val) {
      if (val === 'teacher') {
        this.$router.replace({ name: 'educationTeacherHome', params: { schoolId: this.$route.params.schoolId } })
      } else if (val === 'parent') {
        this.$router.replace({ name: 'educationParentsHome', params: { schoolId: this.$route.params.schoolId } })
      } else if (val === 'student') {
        this.$router.replace({ name: 'educationStudentHome', params: { schoolId: this.$route.params.schoolId } })
      }
    },
    onFeatureItemClick(item) {
      let isMasterFeature = false
      this.masterFeatureList.forEach(element => {
        if (item.featureCode === element) {
          isMasterFeature = true
        }
      })
      if (isMasterFeature === false && this.userInfo.isMaster === true && this.userInfo.isTeacher === false) {
        this.showConfirm = true
      } else {
        if (item.featureCode === 'personal_xueshengguanli') {
          let feature = JSON.parse(item.featureUrl)
          feature.params = {schoolId: this.$route.params.schoolId, classId: this.personalClassInfo.classId, classType: 1}
          this.$router.push(feature)
        } else if (!this.userInfo.feature.classChain && !this.userInfo.feature.schoolChain && item.featureCode === 'JIELONG') {
          this.$router.push({name: 'educationChainHistory'})
        } else {
          this.$router.push(JSON.parse(item.featureUrl))
        }
      }
    },
    getTeacherSelfInfo(callback) {
      api.getTeacherinfo({ schoolId: this.$route.params.schoolId }, (data) => {
        callback(data)
      }, (er) => {
        api.getUserSchoolSetting({schoolId: this.$route.params.schoolId}, (data) => {
          if (data.isMaster === false) {
            this.$router.replace({name: 'index', params: {schoolId: this.$route.params.schoolId}})
          }
        }, () => {})
        // 管理员不应该提示“您不是学校的老师”
        // if (er.toUser !== undefined && er.toUser && this.userInfo.isMaster === false) {
        //   this.tools.warnToast(er.message)
        // }
      })
    },
    switchStatus () {
      this.isClickTeacherMessage = false
      this.showSwitchMenu = true
    },
    teacherHelp () {
      this.isClickTeacherMessage = false
      // location.href = '//doc.qunxiaozhu.com/index.php?s=/page/88'
      this.$router.push({name: 'educationHelpPage', params: {type: 'teacher'}})
    },
    gotoTeacherMessage () {
      if (this.isClickTeacherMessage === false) {
        this.isClickTeacherMessage = true
        return
      }
      if (!this.isShowTecherInfo) {
        return
      }
      this.$router.push({name: 'educationEditTeacherMessage', params: {teacherId: this.teacherInfo.teacherId}})
    },
    onConfirm () {
      this.$router.push({name: 'educationTeacherManage'})
    },
    getTime (date) {
      if (screen.width <= 320) {
        return dateFormat(date, 'YYYY-MM-DD')
      } else {
        return dateFormat(date, 'YYYY-MM-DD HH:mm')
      }
    },
    queryNoticeAndActivity () {
      const count = 3
      noticeApi.getNoticeList({schoolId: this.$route.params.schoolId, isTeacher: true, type: 1, rowStart: 0, rowCount: 2}, (data) => {
        this.noticeList.push(...data)
        if ((count - this.noticeList.length) <= 0) {
          return
        }
        noticeApi.getNoticeList({schoolId: this.$route.params.schoolId, isTeacher: true, type: 2, rowStart: 0, rowCount: (count - this.noticeList.length)}, (data) => {
          this.noticeList.push(...data)
        }, () => {})
      }, () => {})
      activityApi.getActivityList({schoolId: this.$route.params.schoolId, isTeacher: true, listType: 1, rowStart: 0, rowCount: 2}, (data) => {
        this.activityList.push(...data)
        if ((count - this.activityList.length) <= 0) {
          return
        }
        activityApi.getActivityList({schoolId: this.$route.params.schoolId, isTeacher: true, listType: 2, rowStart: 0, rowCount: (count - this.activityList.length)}, (data) => {
          this.activityList.push(...data)
          this.scrollerStyle = {width: (70 * this.activityList.length + 3 * 2 + 2 * (this.activityList.length - 1)) + 'vw'}
        }, () => {})
      }, () => {})
    },
    skipNotice () {
      this.$router.push({name: 'educationNoticeList'})
    },
    onNoticeItemClick (item) {
      this.$router.push({name: 'educationNoticeDetail', params: {noticeId: item.noticeId}})
    },
    skipActivity () {
      this.$router.push({name: 'educationActivityList'})
    },
    onActivityItemClick (item) {
      this.$router.push({name: 'educationActivityDetail', params: {activityId: item.activityId}})
    },
    setLessons () {
      this.isClickTeacherMessage = false
      this.$router.push({name: 'educationClassLessonsSetting', params: {settingStatus: 2}})
    },
    refresh() {
      location.reload()
    }
  },
  directives: {
    TransferDom
  }
}
</script>

<style>
.student_icon {
  width: 50px;
  height: 50px;
  display: block;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-radius: 5px;
}
.teacher_group div::before {
  border-top: 0px !important;
}
.jhy-flex-demo{
  text-align:center;
}
.new-icon-circle {
    display: block;
    margin: auto;
    width: 2.5rem;
    height: 2.5rem;
    text-align: center;
    line-height: 3.0rem;
    font-size: 1.7rem;
    color: #fff;
}
.jhy-card-title-more{
  color: black;
  position:absolute;
  right:10px; 
  top:12px
}
.jhy-active-button {
  background: #fff;
  color: #f37b1d;
  border-radius: 3px;
  padding: 1px 5px;
}
.jhy-index-text {
  width:100%;
  display:block;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.notic-list-img {
  width: 18vw;
  height:13vw;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
</style>


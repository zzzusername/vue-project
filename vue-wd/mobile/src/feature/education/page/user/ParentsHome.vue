<template>
  <div>
    <div :style="{position: 'relative', height: scrollerHeight + 'px'}">
      <scroller :on-refresh="refresh">
        <school-head></school-head>
        <group gutter="0" class="parents_group">
          <cell is-link :inline-desc="parentInfo.userName" @click.native="gotoParentsMessage">
            <div slot="title">{{parentInfo.parentName}} 
              <p v-show="statusCount>1" style="margin-left:10px;display:inline;font-size:14px;color:#2E84D4" @click="switchStatus">切换身份</p>
              <p style="margin-left:10px;display:inline;font-size:14px;color:#2E84D4" @click="parentHelp">使用帮助</p>
            </div>
            <div slot="icon" :style="{'background-image':'url('+tools.cdn(parentInfo.userIcon, 'head.png', 128)+')'}" class="parent_icon"></div>
          </cell>
        </group>
        <group>
          <group-title slot="title">我的子女
            <span style="float:right;color:#8ebf52;" @click="addParent">添加家长</span>
          </group-title>
          <div v-if="parentInfo.studentlist != undefined && parentInfo.studentlist.length > 0" style="padding: 10px 15px;">
            <checker v-model="selectIndex" default-item-class="default-item" selected-item-class="selected-item" @on-change="checkChange">
              <checker-item :style="{'color': selectIndex == index ? '#fff !important': '#8ebf52', 'margin-left': '-1px', 'background': selectIndex == index ? '#8ebf52 !important' : '#fff'}" :value="index" v-for="(item, index) in parentInfo.studentlist" :key="index" @on-item-click="(value, disabled) => { selectChild(value, disabled, index) }">
                <div :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')', 'margin': '0 auto'}" class="student_icon"></div>
                <p style="fontSize: 14px;textAlign: center;">{{item.studentName}}</p>
              </checker-item>
              <span class="iconfont icon-tianjia" style="color:#888;display:inline;font-size:30px;float:right; margin-top: 15px;" @click="addStudent"></span>
            </checker>
          </div>
          <p v-else style="color:#666;padding: 10px 15px;">您未绑定子女，请绑定子女</p>
        </group>
        <span v-show="tools.isNull(selectStudentInfo.userId)" style="color:#8ebf52;right: 15px;position: absolute;margin-top: 10px;" @click="bindStudent">关联孩子微信</span>
        <group :title="selectStudentInfo.studentName == undefined ? '' : selectStudentInfo.studentName+'的相关功能'" v-if="parentInfo.studentlist != undefined && parentInfo.studentlist.length > 0">
          <div style="margin: 10px 0;">
            <flexbox :gutter="0" wrap="wrap" style="margin-bottom:10px">
              <flexbox-item v-for="(item, index) in featureList" :key="index" :span="1/4" @click.native="onFeatureItemClick(item)">
                <div class="flex-demo jhy-flex-demo">
                  <span class="new-icon-circle iconfont " v-bind:class="item.featureIcon" v-bind:style="{ color:item.featureColor}"></span>
                  <span style="font-size:14px">{{item.featureName}}</span>
                </div>
              </flexbox-item>
            </flexbox>
          </div>
        </group>
        <group v-if="false">
          <group-title slot="title">活动
            <span style="float:right;color:#8ebf52;" @click="skipActivity">更多</span>
          </group-title>
          <div style="margin-top:0!important;margin-bottom:10px;padding: 10px 0;">
              <!-- <scroller lock-y :scrollbar-x='false' ref="scroller">
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
              </scroller> -->
              <swiper :options="swiperOption">
                <swiper-slide v-for="(item, index) in activityList" :key="index">
                  <div class="box1">
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
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
              </swiper>
          </div>
        </group>
        <group v-if="isHaveNotice==true && noticeList.length>0">
          <group-title slot="title">{{selectStudentInfo.studentName == undefined ? '' : selectStudentInfo.studentName+'的学校公告'}}
            <span style="float:right;color:#8ebf52;" @click="skipNotice">更多</span>
          </group-title>
          <cell v-for="(item, index) in noticeList" :key="index" :title="item.noticeTitle.length>19?item.noticeTitle.substring(0,19)+'...':item.noticeTitle" @click.native="onNoticeItemClick(item)" is-link>
            <!-- <img slot="icon" :src="tools.cdn(item.noticeImg==null?null:item.noticeImg.split(',')[0], 'notice.png', 128)" class="jhy-cell-img" style="width:16vw; height:13vw"> -->
            <div slot="icon" class="notic-list-img" :style="{'background-image':'url('+tools.cdn(item.noticeImg === null ? '' :item.noticeImg.split(',')[0], 'notice.png', 128)+')'}" src="">
              <p v-if="item.noticeReadFeedback==2" style="font-size: 10px;color:#fff;background-color:red;width: 2em;height:12px;padding: 2px;text-align:center;line-height: 12px;">重要</p>
            </div>
            <p slot="inline-desc" style="color:#666;fontSize:14px;">{{tools.getDateDiff(item.createDate)}} &nbsp;<span v-if="item.readerNum">{{item.readerNum}}阅读</span><span v-else-if="item.viewNum">{{item.viewNum}}浏览</span></p>
          </cell>
        </group>
        <group :title="selectStudentInfo.studentName == undefined ? '' : selectStudentInfo.studentName+'的班级信息'" v-if="parentInfo.studentlist != undefined && parentInfo.studentlist.length > 0">
          <div style="padding: 10px 15px">
            <div v-for="(item, index) in lessonsList" :key="index">
              <divider style="fontSize: 12px;color: #d2d2d2">•</divider>
              <flexbox style="fontSize: 14px;" :gutter="0" wrap="wrap">
                <flexbox-item v-for="(head, index) in item.headList" :key="index" :span="1/2">
                  <div style="margin-bottom:5px">
                    <span v-html="head.name"></span>:&nbsp;
                    <span>{{head.value == null ? '无' : head.value}}</span>
                  </div>
                </flexbox-item>
              </flexbox>
            </div>
          </div>
        </group>
      </scroller>
    </div>
    <!-- <red-enve-parents :showparent="showRedEnveParents"></red-enve-parents> -->
    <red-envelopes :show="showRedEnvelopes" :is-teacher="false" @show-help-dialog="controlStatus"></red-envelopes>
    <video-dialog :show="showVideo" @hide-dialog="hideVideoDialog" source="http://img.qunxiaozhu.com/video/help_1.mp4" :cover="'parent_help_video_cover.jpg'"></video-dialog>
    <actionsheet v-model="showSwitchMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <index-tabbar :showHome="true"></index-tabbar>
    <div v-transfer-dom v-if="parentInfo.studentlist">
      <x-dialog v-model="parentQrcode" hide-on-blur @on-hide="onHideParentQrcode">
        <!-- <div style="width: 180px; height: 180px;margin: auto;">
              <qriously ref="qriously" level="M" :value="url" :size="180" :backgroundAlpha="1.0" background="white" foreground="black" />
            </div> -->
        <div style="display: inline-block !important;width: 100% !important;">
          <!-- <p style="margin-top:20px;font-size:16px;">{{parentInfo.studentlist[this.selectIndex].studentName}}的二维码</p> -->
          <div style="width: 180px; height: 180px;margin: auto;margin-top:35px;">
            <qrcode style="text-align:center;margin-top:10px;" :value="url" type="img"></qrcode>
          </div>
          <p slot="default" style="text-align:center;margin-bottom:20px;">
            <span style="font-size:16px;">请其他家长扫码绑定微信！</span>
          </p>
        </div>
        <!--<p style="text-align: center;margin-top: 2vw;">
              <span style="font-size:18px;">请扫码绑定微信！</span>
            </p> -->
      </x-dialog>
    </div>
    <x-dialog v-model="studentQrcode" hide-on-blur @on-hide="onHideStudentQrcode">
      <div style="display: inline-block !important;width: 100% !important;">
        <p style="margin-top:20px;font-size:16px;">{{studentQrcodeName}}的二维码</p>
        <div style="width: 180px; height: 180px;margin: auto;">
          <qrcode style="text-align:center;margin-top:10px;" :value="studentQrcodeUrl" type="img"></qrcode>
        </div>
        <p slot="default" style="text-align:center;margin-bottom:20px;margin-left:10px;margin-right:10px;">
          请长按二维码，选择“发送给朋友”，将该二维码发送给<span style="color: #2E84D4">{{studentQrcodeName}}</span>让其绑定；或者与其面对面扫码绑定。
        </p>
      </div>
    </x-dialog>
    <x-dialog v-model="showHelp">
      <div style="max-height:80vh;overflow-y: scroll;padding: 20px 15px 15px;font-size:16px;" ref="viewBox5">
        <strong style="text-align:center">【{{selectStudentInfo.studentName}}】的家长，您好！</strong>
        <p style="margin-top:15px;color:#222;text-align:left">
欢迎使用校和家！您可以进行如下操作：
        </p>
        <p v-if="!tools.isNull(selectStudentInfo.userId)" style="margin-top:15px;color:#666666;text-align:left">
          <strong>为孩子添加更多家长</strong>：点击首页面右侧上部位置的“添加家长”链接，让其他家长扫码绑定；
          <span style="color:#2E84D4" @click="onHelpClick(1)">立即操作</span>
        </p>
        <p v-else style="margin-top:15px;color:#666666;text-align:left">
          <strong> 1）为孩子添加更多家长</strong>：点击首页面右侧上部位置的“添加家长”链接，让其他家长扫码绑定；
          <span style="color:#2E84D4" @click="onHelpClick(1)">立即操作</span>
        </p>
        <p v-if="tools.isNull(selectStudentInfo.userId)" style="margin-top:15px;color:#666666;text-align:left">
          <strong>2）绑定学生微信</strong>：如您希望孩子本人也能收到作业、成绩等信息，请点击首页面右侧中下部位置的“关联孩子微信”链接，让学生用微信扫码绑定即可；
          <span style="color:#2E84D4" @click="onHelpClick(2)">立即操作</span>
        </p>
      </div>
      <div style="background:#f2f2f2;text-align:center;padding:8px 0px;font-size:16px;" @click="closeHelp">
        <span style="color:#a2a2a2">关闭</span>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Group, Cell, Checker, CheckerItem, Flexbox, FlexboxItem, Divider, XTable, Actionsheet, GroupTitle, Badge, dateFormat, TransferDomDirective as TransferDom, XDialog, Qrcode } from 'vux'
import IndexTabbar from '@/components/IndexTabbar.vue'
import SchoolHead from '../../components/SchoolHead.vue'
import RedEnvelopes from '@/feature/education/components/RedEnvelopes.vue'
import VideoDialog from '@/feature/education/components/VideoDialog.vue'
import api from '../../api'
import noticeApi from '@/feature/notice/api'
import activityApi from '@/feature/activity/api'
import { mapGetters } from 'vuex'
export default {
  directives: {
    TransferDom
  },
  components: {
    RedEnvelopes, Group, Cell, Checker, CheckerItem, Flexbox, FlexboxItem, Divider, IndexTabbar, XTable, SchoolHead, Actionsheet, GroupTitle, Badge, XDialog, Qrcode, VideoDialog, swiper, swiperSlide
  },
  data() {
    return {
      featureList: [],
      parentInfo: {},
      selectIndex: 0,
      selectStudentInfo: {},
      lessonsList: [],
      studentName: null,
      currentChildIndex: 0,
      tempIndex: -1,
      isClickParentMessage: true,
      managemenus: {},
      statusCount: 0,
      showSwitchMenu: false,
      showContentFeatureList: [],
      noticeList: [],
      activityList: [],
      scrollerStyle: {width: '200vw'},
      isHaveNotice: false,
      isHaveActivity: false,
      url: '',
      parentQrcode: false,
      showRedEnvelopes: false,
      showVideo: false,
      studentQrcode: false,
      studentQrcodeUrl: '',
      studentQrcodeName: '',
      showHelp: false,
      scrollerHeight: 0,
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          dynamicBullets: true
        }
      },
      swiperSlides: [1, 2, 3, 4, 5]
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  watch: {
    userInfo(newValue, old) {
      this.init(newValue)
    }
  },
  mounted() {
    if (window.__wxjs_environment === 'miniprogram') {
      this.$wechat.miniProgram.postMessage({ data: {schoolName: this.userInfo.schoolName, schoolId: this.userInfo.schoolId} })
    }
    this.scrollerHeight = window.innerHeight - 50
    if (!this.tools.isNull(this.userInfo.schoolId)) {
      this.init(this.userInfo)
    }
  },
  methods: {
    init (info) {
      this.initWechat(info)
      if (info.schoolModel === 2) {
        if (this.localStorage.getRedEnvelopesPersonalSchoolParent(this.$route.params.schoolId) !== '8' && info.isParent) {
          this.showRedEnvelopes = true
        }
      }
      if (this.localStorage.getStudyVideoSchoolParent(this.$route.params.schoolId) !== '1' && info.isParent && !this.showRedEnvelopes) {
        this.showVideo = true
      }
      // this.localStorage.setHelpStatusForParent(this.$route.params.schoolId, '0')
      if (this.localStorage.getHelpStatusForParent(this.$route.params.schoolId) !== '-1' && !this.showRedEnvelopes && !this.showVideo) {
        this.showHelp = true
      }
      api.getSchoolParentFeature({schoolId: this.$route.params.schoolId}, (data) => {
        this.featureList = []
        this.showContentFeatureList = []
        data.forEach(element => {
          if (element.featureCode === 'GONGGAO') {
            this.isHaveNotice = true
          } else if (element.featureCode === 'HUODONG') {
            this.isHaveActivity = true
          }
          if (element.featureType === 'MENU') {
            // 个人版不展示德育表现
            if (info.schoolModel === 2 && element.featureCode === 'DEYUBIAOXIAN') {
              return
            }
            if (element.featureCode === 'PINGJIA') {
              return
            }
            this.featureList.push(element)
          } else {
            this.showContentFeatureList.push(element)
          }
        })
      }, () => {})
      this.getInfo((data) => {
        this.localStorage.setSchoolUserIdentity(this.$route.params.schoolId, info.userId, 'parent')
        this.parentInfo = data
        if (data.studentlist !== null && data.studentlist.length > 0) {
          this.queryNoticeAndActivity()
          this.getStudentInfo(data.studentlist[0].studentId, (studentInfo) => {
            this.selectStudentInfo = studentInfo
            this.tempIndex = 0
            this.assemblyData(studentInfo)
          })
        }
        this.initManagemenus()
      })
    },
    onHideStudentQrcode () {
      this.studentQrcode = false
      if (this.localStorage.getHelpStatusForParent(this.$route.params.schoolId) !== '-1') {
        this.showHelp = true
      }
    },
    onHideParentQrcode () {
      this.parentQrcode = false
      if (this.localStorage.getHelpStatusForParent(this.$route.params.schoolId) !== '-1') {
        this.showHelp = true
      }
    },
    onHelpClick (type) {
      this.showHelp = false
      if (type === 1) {
        this.addParent()
      } else if (type === 2) {
        this.bindStudent()
      }
    },
    closeHelp () {
      this.showHelp = false
      this.localStorage.setHelpStatusForParent(this.$route.params.schoolId, '-1')
    },
    hideVideoDialog() {
      this.localStorage.setStudyVideoSchoolParent(this.$route.params.schoolId, 1)
      if (this.localStorage.getHelpStatusForParent(this.$route.params.schoolId) !== '-1') {
        this.showHelp = true
      }
    },
    controlStatus () {
      this.localStorage.setRedEnvelopesPersonalSchoolParent(this.$route.params.schoolId, 8)
      if (this.localStorage.getStudyVideoSchoolParent(this.$route.params.schoolId) !== '1' && this.userInfo.isParent) {
        this.showVideo = true
      }
    },
    initWechat (data) {
      let schoolLogo = !this.tools.isNull(data.schoolLogo) ? (process.env.CDN_DOMAIN + '/' + data.schoolLogo) : (process.env.CDN_DOMAIN + '/school/school-icon.png')
      let schoolName = this.tools.isNull(data.schoolName) ? '' : data.schoolName + '的'
      let index = location.href.indexOf('#')
      let schoolLink = location.href.substring(0, index + 1) + '/edu/index/' + this.$route.params.schoolId
      this.tools.shareWechat({title: schoolName + '家校空间', desc: '点击查看本校的家校空间，随时随地获取学校的教学、公告、活动等信息。轻松搞定学校和家长的互联互通。', imgUrl: schoolLogo, link: schoolLink})
    },
    switchStatus () {
      this.isClickParentMessage = false
      this.showSwitchMenu = true
    },
    initManagemenus () {
      this.statusCount = 0
      if (this.userInfo.isMaster === true) {
        this.managemenus.teacher = '我是创建者'
        this.statusCount ++
      } else if (this.userInfo.isTeacher === true) {
        this.managemenus.teacher = '我是教师'
        this.statusCount ++
      }
      if (this.userInfo.isParent === true) {
        this.managemenus.parent = '我是家长（当前身份）'
        this.statusCount ++
      }
      if (this.userInfo.isStudent === true) {
        this.managemenus.student = '我是学生'
        this.statusCount ++
      }
    },
    gotoParentsMessage () {
      if (this.isClickParentMessage === false) {
        this.isClickParentMessage = true
        return
      }
      this.$router.push({name: 'educationParentsEditInfo'})
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
    onFeatureItemClick(val) {
      var obj = JSON.parse(val.featureUrl)
      switch (val.featureCode) {
        case 'PINGYU':
          obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}
          break
        case 'DIANMING':
          obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}
          break
        case 'CHENGJI':
          obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}
          break
        case 'ZUOYE':
          obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}
          break
        case 'QINGJIA':
          obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}
          break
        case 'GONGGAO':
          obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}
          break
        case 'TONGJI':
          // obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId, parents: 1}
          obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId, type: 'parent'}
          break
        case 'WENJUAN':
          obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}
          break
        case 'HUODONG':
          obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}
          break
        case 'LIUYAN':
          obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}
          break
        case 'DEYUBIAOXIAN':
          obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}
          break
        case 'ZIXUN':
          obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}
          break
        case 'JIELONG':
          obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}
          break
        case 'TOUPIAO':
          obj.params = {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}
          break
      }
      this.$router.push(obj)
    },
    checkChange (val) {
      if (val === '') {
        this.selectIndex = this.tempIndex
      }
    },
    selectChild(value, disabled, index) {
      if (value === this.selectIndex) {
        this.tempIndex = index
        return
      }
      this.selectIndex = index
      var student = this.parentInfo.studentlist[value]
      this.childName = student.studentName
      this.getStudentInfo(student.studentId, (data) => {
        this.selectStudentInfo = data
        this.assemblyData(data)
      })
    },
    assemblyData(data) {
      if (this.tools.isNull(data.classList)) {
        return
      }
      var classId = null
      this.lessonsList = []
      for (var i = 0; i < data.classList.length; i++) {
        if (classId === data.classList[i].classId) {
          for (var j = 0; j < this.lessonsList.length; j++) {
            if (classId === this.lessonsList[j].classId) {
              if (data.classList[i].lessonId !== null) {
                this.lessonsList[j].classList.push(data.classList[i])
              }
              if (!this.tools.isNull(data.classList[i].classHour)) {
                this.lessonsList[j].showClassHour = true
              }
              continue
            }
          }
        } else {
          classId = data.classList[i].classId
          var obj = { classId: classId, showClassHour: false, headList: [{ name: '<span>班</span>&nbsp;&nbsp;&nbsp;<span>级</span>', value: data.classList[i].className }, { name: '<span>学</span>&nbsp;&nbsp;&nbsp;<span>号</span>', value: data.studentNumber }, { name: '班主任', value: data.classList[i].teacherName }, { name: '手机号', value: data.classList[i].teacherTelephoneNum }], classList: [] }
          if (data.classList[i].lessonId !== null) {
            obj.classList.push(data.classList[i])
          }
          if (!this.tools.isNull(data.classList[i].classHour)) {
            obj.showClassHour = true
          }
          this.lessonsList.push(obj)
        }
      }
      this.noticeList = []
      this.queryNoticeAndActivity()
    },
    getInfo(callback) {
      api.getParentInfoSelf({ schoolId: this.$route.params.schoolId }, (data) => {
        callback(data)
      }, (er) => {
        if (er !== null && er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getStudentInfo(studentId, callback) {
      api.getStudentInfo({ schoolId: this.$route.params.schoolId, studentId }, (data) => {
        callback(data)
      }, (er) => {
        if (er !== null && er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    parentHelp () {
      this.isClickParentMessage = false
      // location.href = '//doc.qunxiaozhu.com/index.php?s=/page/90'
      this.$router.push({name: 'educationHelpPage', params: {type: 'parents'}})
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
      noticeApi.getNoticeList({schoolId: this.$route.params.schoolId, isTeacher: false, studentId: this.parentInfo.studentlist[this.selectIndex].studentId, rowStart: 0, rowCount: count}, (data) => {
        this.noticeList = data
      }, () => {})
      activityApi.getActivityList({schoolId: this.$route.params.schoolId, isTeacher: false, studentId: this.parentInfo.studentlist[this.selectIndex].studentId, rowStart: 0, rowCount: count}, (data) => {
        this.activityList = data
        this.scrollerStyle = {width: (70 * this.activityList.length + 3 * 2 + 2 * (this.activityList.length - 1)) + 'vw'}
      }, () => {})
    },
    skipNotice () {
      this.$router.push({name: 'educationNoticeListForParents', params: {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}})
    },
    onNoticeItemClick (item) {
      this.$router.push({name: 'educationNoticeDetail', params: {noticeId: item.noticeId}})
    },
    skipActivity () {
      this.$router.push({name: 'educationActivityListForParents', params: {studentId: this.parentInfo.studentlist[this.selectIndex].studentId}})
    },
    onActivityItemClick (item) {
      this.$router.push({name: 'educationActivityDetailForParents', params: {activityId: item.activityId, studentId: this.parentInfo.studentlist[this.selectIndex].studentId}})
    },
    addParent () {
      api.getStudentBindingStudentCode({ schoolId: this.$route.params.schoolId, studentId: this.parentInfo.studentlist[this.selectIndex].studentId }, (data) => {
        this.url = data
        this.parentQrcode = true
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取二维码失败')
        }
      })
    },
    addStudent () {
      if (this.userInfo.schoolModel === 2) {
        this.$router.push({name: 'eduPersonalRegister', params: {schoolId: this.$route.params.schoolId, status: 2}})
      } else {
        this.$router.push({name: 'educationParentsBindStudent'})
      }
    },
    bindStudent () {
      api.getStudentBindingCodeByParent({schoolId: this.$route.params.schoolId, studentId: this.parentInfo.studentlist[this.selectIndex].studentId}, (data) => {
        this.studentQrcodeUrl = data
        this.studentQrcode = true
        this.studentQrcodeName = this.parentInfo.studentlist[this.selectIndex].studentName
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取二维码失败')
        }
      })
    },
    refresh () {
      location.reload()
    }
  }
}
</script>

<style scoped>
.parent_icon {
  width: 50px;
  height: 50px;
  display: block;
  margin-right: 5px;
  background-position: center center;
  background-size: cover;
  border-radius: 5px;
}

.student_icon {
  width: 40px;
  height: 40px;
  display: block;
  background-position: center center;
  background-size: cover;
  border-radius: 20px;
}

.default-item {
  border: 1px solid #ececec;
  padding: 5px 15px;
}

.selected-item {
  /* border: 1px solid green; */
  color: #8ebf52
}

.parents_group div::before {
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


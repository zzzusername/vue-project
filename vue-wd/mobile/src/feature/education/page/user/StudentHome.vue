<template>
  <div>
    <div :style="{position: 'relative', height: scrollerHeight + 'px'}">
      <scroller :on-refresh="refresh">
        <school-head></school-head>
        <group gutter="0" class="student_group">
          <div style="position: relative;">
            <cell is-link @click.native="gotoStudentMessage" :inline-desc="studentInfo.userName">
              <div slot="title">{{studentInfo.studentName}} 
                <p v-show="statusCount>1" style="margin-left:10px;display:inline;font-size:14px;color:#2E84D4" @click="switchStatus">切换身份</p>
                <p style="margin-left:10px;display:inline;font-size:14px;color:#2E84D4" @click="studentHelp">使用帮助</p>
              </div>
              <div slot="icon" :style="{'background-image':'url('+tools.cdn(studentInfo.userIcon, 'head.png', 128)+')'}" class="student_icon"></div>
            </cell>
          </div>
        </group>
        <group title="功能">
          <flexbox :gutter="0" wrap="wrap" style="margin-bottom:10px">
            <flexbox-item v-for="(item, index) in featureList" :key="index" :span="1/4" @click.native="onFeatureItemClick(item)">
              <div class="flex-demo jhy-flex-demo">
                <span class="new-icon-circle iconfont " v-bind:class="item.featureIcon" v-bind:style="{ color:item.featureColor}"></span>
                <span style="font-size:14px">{{item.featureName}}</span>
              </div>
            </flexbox-item>
          </flexbox>
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
        <group v-if="isHaveNotice==true && noticeList.length>0">
          <group-title slot="title">学校公告
            <span style="float:right;color:#8ebf52;" @click="skipNotice">更多</span>
          </group-title>
          <cell v-for="(item, index) in noticeList" :key="index" :title="item.noticeTitle.length>19?item.noticeTitle.substring(0,19)+'...':item.noticeTitle" @click.native="onNoticeItemClick(item)" is-link>
            <div slot="icon" class="notic-list-img" :style="{'background-image':'url('+tools.cdn(item.noticeImg === null ? '' :item.noticeImg.split(',')[0], 'notice.png', 128)+')'}" src="">
              <p v-if="item.noticeReadFeedback==2" style="font-size: 10px;color:#fff;background-color:red;width: 2em;height:12px;padding: 2px;text-align:center;line-height: 12px;">重要</p>
            </div>
            <p slot="inline-desc" style="color:#666;fontSize:14px;">{{tools.getDateDiff(item.createDate)}} &nbsp;<span v-if="item.readerNum">{{item.readerNum}}阅读</span><span v-else-if="item.viewNum">{{item.viewNum}}浏览</span></p>
          </cell>
        </group>
        <group label-width="8em" label-margin-right="0.5em" label-align="left">
          <group-title slot="title">我的家长
            <span style="float:right;color:#8ebf52;" @click="addParent">添加家长</span>
          </group-title>
          <x-input v-for="(item, index) in studentInfo.parentlist" :key="index" :value="item.relationship + ' (' + (item.parentName==null?item.userName:item.parentName) + ')'" disabled></x-input>
          <p style="text-align: center;padding: 10px;font-size: 16px;color: #999;" v-if="studentInfo.parentlist <= 0">暂无家长，请点击添加家长</p>
        </group>
        <group title="班级信息">
          <div style="padding: 10px 15px;fontSize: 14px;">
            <div v-for="(item, index) in lessonsList" :key="index" style="paddingBottom: 10px;">
              <divider style="fontSize: 12px;color: #d2d2d2">•</divider>
              <flexbox :gutter="0" wrap="wrap">
                <flexbox-item v-for="(head, index) in item.headList" :key="index" :span="1/2">
                  <div style="margin-bottom:5px">
                    <span v-html="head.name"></span>:&nbsp;
                    <span>{{head.value === null ? '无' : head.value}}</span>
                  </div>
                </flexbox-item>
              </flexbox>
              <!-- <div style="margin: 10px 10px 0;color: #444;">
                <x-table v-if="item.classList.length > 0" width="100%" full-bordered>
                  <tr>
                    <th>课程</th>
                    <th v-if="item.showClassHour">课时</th>
                    <th>任课教师</th>
                  </tr>
                  <tr v-for="(content, index) in item.classList" :key="index">
                    <td style="textAlign: center">{{content.lessonName}}</td>
                    <td style="textAlign: center" v-if="item.showClassHour">{{content.classHour}}</td>
                    <td style="textAlign: center">{{content.lessonTeacherName}}</td>
                  </tr>
                </x-table>
              </div> -->
            </div>
          </div>
        </group>
      </scroller>
    </div>
    <actionsheet v-model="showSwitchMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <index-tabbar :showHome="true"></index-tabbar>
    <div v-transfer-dom>
      <x-dialog v-model="parentQrcode" class="dialog-demo" hide-on-blur @on-hide="parentQrcode=false">
        <!-- <div style="width: 180px; height: 180px;margin: auto;">
              <qriously ref="qriously" level="M" :value="url" :size="180" :backgroundAlpha="1.0" background="white" foreground="black" />
            </div> -->
        <div class="img-style">
          <div style="width: 180px; height: 180px;margin: auto;margin-top:30px;">
            <qrcode style="text-align:center;" :value="url" type="img"></qrcode>
          </div>
          <p slot="default" style="text-align:center;margin-top:10px;">
            <span style="font-size:18px;">请扫码绑定微信！</span>
          </p>
        </div>
        <!--<p style="text-align: center;margin-top: 2vw;">
              <span style="font-size:18px;">请扫码绑定微信！</span>
            </p> -->
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { Qrcode, Group, Cell, Popup, Flexbox, FlexboxItem, GroupTitle, XInput, XDialog, Divider, TransferDomDirective as TransferDom, XTable, Actionsheet, dateFormat, Badge } from 'vux'
import IndexTabbar from '@/components/IndexTabbar.vue'
import SchoolHead from '../../components/SchoolHead.vue'
import api from '../../api'
import Vue from 'vue'
import VueQriously from 'vue-qriously'
import { mapGetters } from 'vuex'
import noticeApi from '@/feature/notice/api'
import activityApi from '@/feature/activity/api'

Vue.use(VueQriously)

export default {
  directives: {
    TransferDom
  },
  components: {
    Qrcode, Group, Cell, IndexTabbar, Popup, Flexbox, FlexboxItem, GroupTitle, XInput, XDialog, Divider, XTable, SchoolHead, Actionsheet, Badge
  },
  data() {
    return {
      url: '',
      parentQrcode: false,
      featureList: [],
      showPopup: false,
      studentInfo: {},
      lessonsList: [],
      isClickStudentMessage: true,
      managemenus: {},
      statusCount: 0,
      showSwitchMenu: false,
      showContentFeatureList: [],
      noticeList: [],
      activityList: [],
      scrollerStyle: {width: '200vw'},
      isHaveNotice: false,
      isHaveActivity: false,
      scrollerHeight: 0
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  watch: {
    userInfo(newValue, old) {
      this.initWechat(newValue)
      this.initManagemenus()
    }
  },
  mounted() {
    if (window.__wxjs_environment === 'miniprogram') {
      this.$wechat.miniProgram.postMessage({ data: {schoolName: this.userInfo.schoolName, schoolId: this.userInfo.schoolId} })
    }
    this.scrollerHeight = window.innerHeight - 50
    this.initWechat(this.userInfo)
    api.getSchoolStudentFeature({schoolId: this.$route.params.schoolId}, (data) => {
      data.forEach(element => {
        if (element.featureCode === 'GONGGAO') {
          this.isHaveNotice = true
        } else if (element.featureCode === 'HUODONG') {
          this.isHaveActivity = true
        }
        if (element.featureType === 'MENU') {
          if (element.featureCode === 'PINGJIA') {
            return
          }
          this.featureList.push(element)
        } else {
          this.showContentFeatureList.push(element)
        }
      })
    }, () => {})
    this.getStudentInfo((data) => {
      this.localStorage.setSchoolUserIdentity(this.$route.params.schoolId, this.userInfo.userId, 'student')
      this.studentInfo = data
      this.initManagemenus()
      if (this.tools.isNull(data.classList)) {
        return
      }
      var classId = null
      for (var i = 0; i < data.classList.length; i++) {
        if (classId === data.classList[i].classId) {
          for (var j = 0; j < this.lessonsList.length; j++) {
            if (classId === this.lessonsList[j].classId) {
              if (data.classList[i].lessonId !== null) {
                this.lessonsList[j].classList.push(data.classList[i])
                if (!this.tools.isNull(data.classList[i].classHour)) {
                  this.lessonsList[j].showClassHour = true
                }
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
      this.$store.commit('updateWechatQrcode', {isShowWechatQrcode: !this.userInfo.isSubscribe, wechatQrcode: this.userInfo.wechatQRUrl})
    })
    this.queryNoticeAndActivity()
  },
  methods: {
    initWechat (data) {
      let schoolLogo = !this.tools.isNull(data.schoolLogo) ? (process.env.CDN_DOMAIN + '/' + data.schoolLogo) : (process.env.CDN_DOMAIN + '/school/school-icon.png')
      let schoolName = this.tools.isNull(data.schoolName) ? '' : data.schoolName + '的'
      let index = location.href.indexOf('#')
      let schoolLink = location.href.substring(0, index + 1) + '/edu/index/' + this.$route.params.schoolId
      this.tools.shareWechat({title: schoolName + '家校空间', desc: '点击查看本校的家校空间，随时随地获取学校的教学、公告、活动等信息。轻松搞定学校和家长的互联互通。', imgUrl: schoolLogo, link: schoolLink})
    },
    switchStatus () {
      this.isClickStudentMessage = false
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
        this.managemenus.parent = '我是家长'
        this.statusCount ++
      }
      if (this.userInfo.isStudent === true) {
        this.managemenus.student = '我是学生（当前身份）'
        this.statusCount ++
      }
    },
    gotoStudentMessage () {
      if (this.isClickStudentMessage === false) {
        this.isClickStudentMessage = true
        return
      }
      this.$router.push({name: 'educationEditStudentMessage', params: {studentId: this.studentInfo.studentId}})
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
    addParent() {
      api.getStudentBindingStudentCode({ schoolId: this.$route.params.schoolId }, (data) => {
        // var index = location.href.indexOf('#')
        // this.url = location.href.substring(0, index + 1) + '/app/' + this.$route.params.orgId + '/education/' + this.$route.params.schoolId + '/parents_info/student/' + this.studentInfo.studentId + '/code/' + data.bindingCode
        // window.location = this.url
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
    onFeatureItemClick(val) {
      var routerObj = JSON.parse(val.featureUrl)
      switch (val.featureCode) {
        case 'TONGJI':
          routerObj.params = {type: 'student'}
          break
      }
      this.$router.push(routerObj)
    },
    getStudentInfo(callback) {
      api.getStudentInfo({ schoolId: this.$route.params.schoolId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    studentHelp () {
      this.isClickStudentMessage = false
      // location.href = '//doc.qunxiaozhu.com/index.php?s=/page/89'
      this.$router.push({name: 'educationHelpPage', params: {type: 'student'}})
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
      noticeApi.getNoticeList({schoolId: this.$route.params.schoolId, isTeacher: false, rowStart: 0, rowCount: count}, (data) => {
        this.noticeList = data
      }, () => {})
      activityApi.getActivityList({schoolId: this.$route.params.schoolId, isTeacher: false, rowStart: 0, rowCount: count}, (data) => {
        this.activityList = data
        this.scrollerStyle = {width: (70 * this.activityList.length + 3 * 2 + 2 * (this.activityList.length - 1)) + 'vw'}
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
    refresh() {
      location.reload()
    }
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
  border-radius: 3px;
}

.img-style {
  padding: 20px 20px 20px 20px;
}

.img-style img {
  display: inline-block !important;
  width: 100% !important;
}

.student_group div::before {
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


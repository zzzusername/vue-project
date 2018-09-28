<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多公告～" ref="manage_scroller">
        <div style="height: 10px" v-if="teacherNoticeList.length==0&&classNoticeList.length==0"></div>
        <div>
          <group v-if="teacherNoticeList.length>0" title="教师公告">
            <cell v-for="(item, index) in teacherNoticeList" v-if="index<3" :title="item.noticeTitle.length>25?item.noticeTitle.substring(0,25)+'...':item.noticeTitle" :key="index" @click.native="skipDetail(item.noticeId)" is-link>
              <div slot="icon" class="notic_list_img" :style="{'background-image':'url('+tools.cdn(item.noticeImg === null ? '' :item.noticeImg.split(',')[0], 'notice.png', 128)+')'}" src="">
                <!-- <p v-if="item.noticeReadFeedback==2" style="font-size: 10px;color:#fff;background-color:red;width: 2em;height:12px;padding: 2px;text-align:center;line-height: 12px;">重要</p> -->
              </div>
              <p slot="inline-desc" style="color:#666;fontSize:14px;">{{tools.getDateDiff(item.createDate)}} &nbsp;<span v-if="item.readerNum">{{item.readerNum}}阅读</span><span v-else-if="item.viewNum">{{item.viewNum}}浏览</span></p>
            </cell>
          </group>
          <p v-if="teacherNoticeList.length>3" style="background:#fff;padding:5px 10px;text-align:center;color:#2E84D4;font-size:15px;" @click="more">查看更多</p>
          <group v-if="classNoticeList.length>0" :title="groupTitle">
            <cell v-for="(item, index) in classNoticeList" :title="item.noticeTitle.length>25?item.noticeTitle.substring(0,25)+'...':item.noticeTitle" :key="index" @click.native="skipDetail(item.noticeId)" is-link>
              <div slot="icon" class="notic_list_img" :style="{'background-image':'url('+tools.cdn(item.noticeImg === null ? '' :item.noticeImg.split(',')[0], 'notice.png', 128)+')'}" src="">
                <!-- <p v-if="item.noticeReadFeedback==2" style="font-size: 10px;color:#fff;background-color:red;width: 2em;height:12px;padding: 2px;text-align:center;text-align:center;line-height: 12px;">重要</p> -->
              </div>
              <p slot="inline-desc" style="color:#666;fontSize:14px;">{{tools.getDateDiff(item.createDate)}} &nbsp;<span v-if="item.readerNum">{{item.readerNum}}阅读</span><span v-else-if="item.viewNum">{{item.viewNum}}浏览</span></p>
            </cell>
          </group>
        </div>
      </scroller>
    </div>
    <detail-tabbar :actionLink="actionLink" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/notice/api'
import { Group, Cell, dateFormat } from 'vux'
export default {
  components: {
    DetailTabbar, Group, Cell
  },
  data () {
    return {
      teacherNoticeList: [],
      classNoticeList: [],
      isTeacher: false,
      scrollerHeight: 0,
      groupTitle: '',
      userInfo: {},
      actions: []
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50
    this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
      this.userInfo = data
      if ((data.isMaster === true || data.isTeacher === true) && this.tools.isNull(this.$route.params.studentId)) {
        // 教师
        this.groupTitle = '班级公告'
        api.getNoticeList({schoolId: this.$route.params.schoolId, isTeacher: true, type: 1, rowStart: 0, rowCount: 5}, (noticedata) => {
          this.teacherNoticeList = noticedata
        }, () => {})
      }
    }, () => {})
    this.localStorage.getTeacherFeature({schoolId: this.$route.params.schoolId}, (data) => {
      data.forEach(element => {
        if (element.featureCode === 'GONGGAOGUANLI') {
          this.actions = [{
            name: '公告管理'
          }]
        }
      })
    }, () => {})
  },
  methods: {
    actionLink () {
      this.$router.push({name: 'educationNoticeManage'})
    },
    // refresh(done) {
    //   if (this.classNoticeList.length > 0 && this.classNoticeList.length < 10) {
    //     done(true)
    //     return
    //   }
    //   this.classNoticeList.splice(0, this.classNoticeList.length)
    //   this.teacherNoticeList.splice(0, this.teacherNoticeList.length)
    //   if ((this.userInfo.isMaster === true || this.userInfo.isTeacher === true) && this.tools.isNull(this.$route.params.studentId)) {
    //     api.getNoticeList({schoolId: this.$route.params.schoolId, isTeacher: true, type: 1, rowStart: 0, rowCount: 5}, (noticedata) => {
    //       this.teacherNoticeList = noticedata
    //     }, () => {})
    //     this.getTeacherNoticeList(this.classNoticeList.length, (data) => {
    //       this.classNoticeList = this.classNoticeList.concat(data)
    //       done(true)
    //     })
    //   } else {
    //     this.getStudentNoticeList(this.classNoticeList.length, (data) => {
    //       this.classNoticeList = this.classNoticeList.concat(data)
    //       done(true)
    //     })
    //   }
    // },
    infinite(done) {
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
        if ((data.isMaster === true || data.isTeacher === true) && this.tools.isNull(this.$route.params.studentId)) {
          // 教师
          this.getTeacherNoticeList(this.classNoticeList.length, (data) => {
            this.classNoticeList = this.classNoticeList.concat(data)
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
        } else {
          // 学生 and 家长
          this.getStudentNoticeList(this.classNoticeList.length, (data) => {
            this.classNoticeList = this.classNoticeList.concat(data)
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
        }
      }, () => {})
    },
    getTeacherNoticeList (rowStart, callback) {
      var rowCount = 20
      api.getNoticeList({schoolId: this.$route.params.schoolId, isTeacher: true, type: 2, rowStart, rowCount}, (data) => {
        callback(data)
      }, () => {})
    },
    getStudentNoticeList (rowStart, callback) {
      var rowCount = 20
      api.getNoticeList({schoolId: this.$route.params.schoolId, isTeacher: false, studentId: this.$route.params.studentId, rowStart, rowCount}, (data) => {
        callback(data)
      }, () => {})
    },
    getFormateDate (time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    skipDetail (id) {
      this.$router.push({name: 'educationNoticeDetail', params: {noticeId: id}})
    },
    more () {
      this.$router.push({name: 'educationNoticeTeacherList'})
    }
  }
}
</script>

<style>
.notic_list_img {
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
.triangle-topleft {
  width: 0;
  height: 0;
  border-top: 10px solid white;
  border-bottom: 10px solid white;
  border-left: 5px solid #68C339;
}
</style>

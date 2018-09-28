<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多资讯～" ref="manage_scroller">
        <div style="height: 10px" v-if="teacherNewsList.length==0&&classNewsList.length==0"></div>
        <div>
          <group v-if="teacherNewsList.length>0" title="教师资讯">
            <cell v-for="(item, index) in teacherNewsList" v-if="index<3" :title="item.newsTitle.length>25?item.newsTitle.substring(0,25)+'...':item.newsTitle" :key="index" @click.native="skipDetail(item)">
              <p slot="inline-desc" style="overflow:hidden;font-size:12px;margin: 15px 0px 0 0;">
                <span style="float:left;">来自{{userInfo.teacherId == item.teacherId ? '我' : item.teacherName}}的分享</span>
                <span style="float:right;">{{tools.formateTime(item.publishStartDate, 'YYYY-MM-DD')}}</span>
              </p>
            </cell>
          </group>
          <p v-if="teacherNewsList.length>3" style="background:#fff;padding:5px 10px;text-align:center;color:#2E84D4;font-size:15px;" @click="more">查看更多</p>
          <group v-if="classNewsList.length>0" :title="groupTitle">
            <cell v-for="(item, index) in classNewsList" :title="item.newsTitle.length>25?item.newsTitle.substring(0,25)+'...':item.newsTitle" :key="index" @click.native="skipDetail(item)">
              <p slot="inline-desc" style="overflow:hidden;font-size:12px;margin: 15px 0px 0 0;">
                <span style="float:left;">来自{{userInfo.teacherId == item.teacherId ? '我' : item.teacherName}}的分享</span>
                <span style="float:right;">{{tools.formateTime(item.publishStartDate, 'YYYY-MM-DD')}}</span>
              </p>
            </cell>
          </group>
        </div>
      </scroller>
    </div>
    <alert v-model="showAlert" title="提示">
      <p>
        <span>请复制以下链接在浏览器打开</span><br/>
        <span style="-webkit-touch-callout:default !important;-webkit-user-select:all !important;user-select:all !important;">{{alertHint}}</span>
      </p>
    </alert>
    <detail-tabbar :actionLink="actionLink" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/news/api'
import { Group, Cell, Alert, dateFormat } from 'vux'
export default {
  components: {
    DetailTabbar, Group, Cell, Alert
  },
  data () {
    return {
      teacherNewsList: [],
      classNewsList: [],
      isTeacher: false,
      scrollerHeight: 0,
      windowWidth: 0,
      groupTitle: '',
      userInfo: {},
      actions: [],
      showAlert: false,
      alertHint: ''
    }
  },
  mounted () {
    this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (user) => {
      this.userInfo = user
    }, () => {})
    this.windowWidth = window.innerWidth - 50
    this.scrollerHeight = window.innerHeight - 50
    this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
      this.userInfo = data
      if ((data.isMaster === true || data.isTeacher === true) && this.tools.isNull(this.$route.params.studentId)) {
        // 教师
        this.groupTitle = '班级资讯'
        api.selectNewsListToTeacher({schoolId: this.$route.params.schoolId, isTeacher: true, type: 1, rowStart: 0, rowCount: 5}, (newsData) => {
          this.teacherNewsList = newsData
        }, () => {})
      }
    }, () => {})
    this.localStorage.getTeacherFeature({schoolId: this.$route.params.schoolId}, (data) => {
      data.forEach(element => {
        if (element.featureCode === 'ZIXUNGUANLI') {
          this.actions = [{
            name: '资讯管理'
          }]
        }
      })
    }, () => {})
  },
  methods: {
    actionLink () {
      this.$router.push({name: 'educationNewsManage'})
    },
    infinite(done) {
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
        if ((data.isMaster === true || data.isTeacher === true) && this.tools.isNull(this.$route.params.studentId)) {
          // 教师
          this.getTeacherNewsList(this.classNewsList.length, (data) => {
            this.classNewsList = this.classNewsList.concat(data)
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
        } else {
          // 学生 and 家长
          this.getStudentNoticeList(this.classNewsList.length, (data) => {
            this.classNewsList = this.classNewsList.concat(data)
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
        }
      }, () => {})
    },
    getTeacherNewsList (rowStart, callback) {
      var rowCount = 20
      api.selectNewsListToTeacher({schoolId: this.$route.params.schoolId, isTeacher: true, type: 2, rowStart, rowCount}, (data) => {
        callback(data)
      }, () => {})
    },
    getStudentNoticeList (rowStart, callback) {
      var rowCount = 20
      api.selectNewsListToStudentAndParet({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, rowStart, rowCount}, (data) => {
        callback(data)
      }, () => {})
    },
    getFormateDate (time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    skipDetail (item) {
      if (window.__wxjs_environment === 'miniprogram') {
        api.getNewsInfo({schoolId: this.$route.params.schoolId, newsId: item.newsId}, (data) => {
          this.alertHint = data.newsUrl
          this.showAlert = true
        }, (er) => {
          if (er.toUser) {
            this.tools.warnToast(er.message, '160px')
          } else {
            this.tools.successToast('当前资讯不存在或被删除', '160px')
          }
        })
        return
      }
      this.$router.push({name: 'educationNewsDispatch', params: {newsId: item.newsId}})
    },
    more () {
      this.$router.push({name: 'educationNewsTeacherList'})
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

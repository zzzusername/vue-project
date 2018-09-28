<template>
  <div>
    <group gutter="0" v-if="studentInfo != null">
      <cell :title="studentInfo.studentName">
        <div slot="icon" class="student_head_img" :style="{'background-image':'url('+tools.cdn(studentInfo.userIcon, 'head.png', 128)+')'}" src=""></div>
      </cell>
    </group>
    <tab custom-bar-width="6em">
      <tab-item selected @on-item-click="tabClick(1)">周／月评语</tab-item>
      <tab-item @on-item-click="tabClick(2)">即时评语</tab-item>
    </tab>
    <div v-if="tabIndex === 1" :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="comments_scroller" no-data-text="没有更多评语～">
        <div style="height: 10px" v-if="cycleList.length==0"></div>
        <cell v-for="(item, index) in cycleList" :key="index" style="backgroundColor: #fff" is-link :link="{name: 'educationCycleCommentsInfo', params: {studentPeriodId: item.studentPeriodId, commentType: '1'}}">
          <p style="fontSize: 16px;" slot="title">{{item.commentTitle}}</p>
          <p slot="inline-desc"><span>{{item.className}}</span>&nbsp;&nbsp;<span>{{item.teacherName}}</span>
          </p>
        </cell>
      </scroller>
    </div>
    <div v-if="tabIndex === 2" :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="comments_scroller" no-data-text="没有更多评语～">
        <div style="height: 10px" v-if="timelyList.length==0"></div>
        <cell  v-for="(item, index) in timelyList" :key="index" style="backgroundColor: #fff" is-link :link="{ name: 'educationCommentsInfo', params: { classId: item.classId, commentRealId: item.commentRealId, role: 'parent', commentType: '2' } }">
          <p style="fontSize: 16px;" slot="title"><span>{{item.teacherName}}教师的评语</span><span style="color: #666;fontSize: 14px;marginLeft:1em">{{formateTime(item.commentDate)}}</span></p>
          <p slot="inline-desc"><span>{{item.className}}</span></p>
          <p style="fontSize: 16px;">{{getLevelStr(item.commentLevel)}}</p>
        </cell>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Tab, TabItem, Cell, dateFormat, Group } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Tab, TabItem, Cell, DetailTabbar, Group
  },
  data() {
    return {
      scrollerHeight: 0,
      tabIndex: 1,
      timelyList: [],
      cycleList: [],
      studentInfo: null
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 94
    api.queryStudentInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId}, (data) => {
      this.studentInfo = data
      this.scrollerHeight = window.innerHeight - 94 - 50
    }, () => {})
  },
  methods: {
    tabClick(index) {
      this.tabIndex = index
      this.$refs.comments_scroller.finishInfinite()
    },
    infinite(done) {
      if (this.tabIndex === 1) {
        this.getCycleCommentList(this.cycleList.length, (data) => {
          this.cycleList = this.cycleList.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      } else {
        this.getParentsTimelyCommentsList(this.timelyList.length, (data) => {
          this.timelyList = this.timelyList.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      }
    },
    formateTime (time) {
      return dateFormat(time, 'YYYY-MM-DD HH:mm')
    },
    getCycleCommentList(rowStart, callback) {
      api.getCycleCommentList({ schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, rowStart, rowCount: 20 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getParentsTimelyCommentsList(rowStart, callback) {
      api.getParentsTimelyCommentsList({ schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, rowStart: rowStart, rowCount: 20 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getLevelStr(val) {
      var str = null
      switch (val) {
        case 1:
          str = '优秀'
          break
        case 2:
          str = '良'
          break
        case 3:
          str = '中等'
          break
        case 4:
          str = '一般'
          break
        case 5:
          str = '差'
          break
      }
      return str
    }
  }
}
</script>

<style>
.student_head_img {
  width: 30px;
  height:30px;
  display: inline-block;
  border-radius: 6px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
</style>

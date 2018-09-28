<template>
  <div>
    <tab custom-bar-width="6em">
      <tab-item selected @on-item-click="tabClick(1)">周／月评语</tab-item>
      <tab-item @on-item-click="tabClick(2)">即时评语</tab-item>
    </tab>
    <div v-if="tabIndex === 1" :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="comments_scroller" no-data-text="没有更多评语～">
        <div style="height: 10px" v-if="cycleCommentList.length==0"></div>
        <cell v-for="(item, index) in cycleCommentList" :key="index" style="backgroundColor: #fff" is-link :link="{name: 'educationCycleCommentsInfo', params: {studentPeriodId: item.studentPeriodId, commentType: '1'}}">
          <p style="fontSize: 16px;" slot="title">{{item.commentTitle}}</p>
          <p slot="inline-desc"><span>{{item.className}}</span>&nbsp;&nbsp;<span>{{item.teacherName}}</span></p>
        </cell>
      </scroller>
    </div>
    <div v-if="tabIndex === 2" :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="comments_scroller" no-data-text="没有更多评语～">
        <div style="height: 10px" v-if="timelyCommentsList.length==0"></div>
        <cell v-for="(item, index) in timelyCommentsList" :key="index" style="backgroundColor: #fff" is-link :link="{ name: 'educationCommentsInfo', params: { classId: item.classId, commentRealId: item.commentRealId, role: 'student', commentType: '2' } }">
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
import { Tab, TabItem, Cell, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Tab, TabItem, Cell, DetailTabbar
  },
  data () {
    return {
      scrollerHeight: 0,
      tabIndex: 1,
      cycleCommentList: [],
      timelyCommentsList: []
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 94
  },
  methods: {
    tabClick(index) {
      this.tabIndex = index
      this.$refs.comments_scroller.finishInfinite()
      switch (index) {
        case 1:
          break
        case 2:
          break
      }
    },
    formateTime (time) {
      return dateFormat(time, 'YYYY-MM-DD HH:mm')
    },
    infinite (done) {
      if (this.tabIndex === 1) {
        this.getCycleCommentList(this.cycleCommentList.length, (data) => {
          this.cycleCommentList = this.cycleCommentList.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      } else if (this.tabIndex === 2) {
        this.getStudentTimelyCommentsList(this.timelyCommentsList.length, (data) => {
          this.timelyCommentsList = this.timelyCommentsList.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      }
    },
    getStudentTimelyCommentsList (rowStart, callback) {
      api.getStudentTimelyCommentsList({schoolId: this.$route.params.schoolId, rowStart, rowCount: 20}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getCycleCommentList (rowStart, callback) {
      api.getCycleCommentList({schoolId: this.$route.params.schoolId, rowStart: rowStart, rowCount: 20}, (data) => {
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

</style>

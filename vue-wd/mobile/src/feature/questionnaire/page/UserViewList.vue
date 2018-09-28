<template>
  <div>
    <div :style="{'height': scrollerHeight+'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多问卷～">
        <div style="height: 10px" v-if="teacher.length==0&&classes.length==0"></div>
        <!-- <cell style="color: #999;fontSize: 14px;padding: 8px 15px 5px;" title="教师问卷" v-if="teacher.length > 0"></cell> -->
        <group title="教师问卷" v-if="teacher.length > 0">
          <cell :id="index==0?'topitem':''" style="background-color: #fff;font-size: 16px;" v-for="(item, index) in teacher" :key="index" :title="item.questionTitle" is-link @click.native="skipDetail(item, 1)">
              <div slot="icon" class="question-list-img" :style="{'background-image':'url('+tools.cdn(item.questionImage, 'logo.png')+')'}"></div>
              <p slot="inline-desc">截止时间: <span>{{tools.formateTime(item.endDate, 'MM/DD')}}</span>&nbsp;&nbsp;<span>{{item.number}}人参与</span></p>
              <!-- <p style="font-size: 14px;">{{item.isAnswer?'已参与':item.isFinish?'已结束':'立即参与'}}</p> -->
              <p style="font-size: 14px;">{{item |filterStatus}}</p>
          </cell>
        </group>
        <router-link v-if="teacher.length > 0" :to="{name: 'questionTeacherViewList'}"><p style="color: #1296db;text-align:center;font-size: 16px;background-color:#fff;padding: 10px">查看更多</p></router-link>
        <group title="班级问卷" v-if="classes.length > 0">
          <cell style="background-color: #fff" v-for="(item, index) in classes" :key="index" :title="item.questionTitle" is-link @click.native="skipDetail(item, 2)">
            <div slot="icon" class="question-list-img" :style="{'background-image':'url('+tools.cdn(item.questionImage, 'logo.png')+')'}"></div>
            <p slot="inline-desc">截止时间: <span>{{tools.formateTime(item.endDate, 'MM/DD')}}</span>&nbsp;&nbsp;<span>{{item.number}}人参与</span></p>
            <!-- <p style="font-size: 14px;">{{item.isAnswer?'已参与':item.isFinish?'已结束':'立即参与'}}</p>-->
            <p style="font-size: 14px;" v-if="isTeacher">查看</p>
            <p style="font-size: 14px;" v-else>{{item | filterStatus}}</p>
          </cell>
        </group>
      </scroller>
    </div>
    <detail-tabbar :actions="actions" :actionLink="myQuestion"></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, Tab, TabItem } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Group, Cell, Tab, TabItem, DetailTabbar
  },
  data() {
    return {
      scrollerHeight: 0,
      teacher: [],
      classes: [],
      userInfo: null,
      isTeacher: false,
      actions: [{name: '我参与的', color: '#2E84D4', code: 'my'}]
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 50
    this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
      this.userInfo = data
      if ((data.isMaster === true || data.isTeacher === true) && this.tools.isNull(this.$route.params.studentId)) {
        // 教师
        if (this.userInfo.schoolModel === 2) {
          this.actions = []
        }
        this.isTeacher = true
        this.getList(1, 0, (data) => {
          if (data.length > 3) {
            this.teacher = data.splice(0, 3)
            return
          }
          this.teacher = data
        })
      } else {
      }
    }, () => {})
    this.localStorage.getTeacherFeature({schoolId: this.$route.params.schoolId}, (data) => {
      data.forEach(element => {
        if (element.featureCode === 'WENJUANGUANLI') {
          this.actions = [{name: '我参与的', color: '#2E84D4', code: 'my'}, {name: '问卷管理', color: '#8ebf52', code: 'manage'}]
        }
      })
    }, () => {})
  },
  methods: {
    myQuestion (type) {
      if (type === 'my') {
        if (this.$route.params.studentId) {
          this.$router.push({name: 'questionMyQuestionListStudent', params: {studentId: this.$route.params.studentId}})
        } else {
          this.$router.push({name: 'questionMyQuestionList'})
        }
      } else if (type === 'manage') {
        this.$router.push({name: 'questionManageViewList'})
      }
    },
    skipDetail(val, type) {
      // if (val.isFinish) {
      //   this.tools.toast('问卷已结束')
      //   return
      // }
      let studentId = this.$route.params.studentId
      if (studentId) { // 家长
        if (val.isAnswer) {
          this.$router.push({name: 'questionParentAnswerDetail', params: {questionId: val.questionId, studentId: studentId}})
        } else {
          this.$router.push({name: 'questionParentDetail', params: {questionId: val.questionId, studentId: studentId}})
        }
        return
      }
      if (val.isAnswer) {
        this.$router.push({name: 'questionAnswerDetail', params: {questionId: val.questionId}})
      } else {
        this.$router.push({name: 'questionDetail', params: {questionId: val.questionId}})
      }
    },
    infinite(done) {
      let studentId = this.$route.params.studentId
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
        if ((data.isMaster === true || data.isTeacher === true) && this.tools.isNull(this.$route.params.studentId)) {
          // 教师
          this.getList(2, this.classes.length, (data) => {
            this.classes = this.classes.concat(data)
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
        } else {
          this.studentGetList(studentId, this.classes.length, (data) => {
            this.classes = this.classes.concat(data)
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
        }
      }, () => {})
      // if (this.isTeacher) {
      //   this.getList(2, this.classes.length, (data) => {
      //     this.classes = this.classes.concat(data)
      //     if (data.length >= 20) {
      //       done()
      //     } else {
      //       done(true)
      //     }
      //   })
      // } else {
      //   this.studentGetList(studentId, this.classes.length, (data) => {
      //     this.classes = this.classes.concat(data)
      //     if (data.length >= 20) {
      //       done()
      //     } else {
      //       done(true)
      //     }
      //   })
      // }
    },
    getList(type, rowStart, callback) {
      api.getTeacherQuestionnaireList({schoolId: this.$route.params.schoolId, type, rowStart, rowCount: 20}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    studentGetList(studentId, rowStart, callback) {
      api.getStudentOrParentQuestionnaireList({schoolId: this.$route.params.schoolId, studentId, rowStart, rowCount: 20}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  },
  filters: {
    filterStatus (val) {
      if (val.isFinish) {
        return '已结束'
      } else {
        if (val.isAnswer) {
          return '已参与'
        } else {
          return '立即参与'
        }
      }
    }
  }
}
</script>

<style>
.question-list-img {
  width: 3em;
  height: 3em;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
#topitem::before{
    border-top: 0
  }
</style>

<template>
  <div>
    <div :style="{'height': scrollerHeight+'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite">
        <div style="height: 10px" v-if="teacher.length==0"></div>
        <cell :id="index==0?'topitem':''" style="background-color: #fff;font-size: 16px;" v-for="(item, index) in teacher" :key="index" :title="item.questionTitle" is-link @click.native="skipDetail(item)">
            <div slot="icon" class="question-list-img" :style="{'background-image':'url('+tools.cdn(item.questionImage, 'logo.png')+')'}"></div>
            <p slot="inline-desc">截止时间: <span>{{tools.formateTime(item.endDate, 'MM/DD')}}</span>&nbsp;&nbsp;<span>{{item.number}}人参与</span></p>
            <!-- <p style="font-size: 14px;">{{item.isAnswer?'已参与':item.isFinish?'已结束':'立即参与'}}</p> -->
            <p style="font-size: 14px;" >{{item | filterStatus}}</p>
          </cell>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
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
      teacher: []
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 50
  },
  methods: {
    skipDetail(val) {
      // if (val.isFinish) {
      //   this.tools.toast('问卷已结束')
      //   return
      // }
      if (val.isAnswer) {
        this.$router.push({name: 'questionAnswerDetail', params: {questionId: val.questionId}})
      } else {
        this.$router.push({name: 'questionDetail', params: {type: 1, questionId: val.questionId}})
      }
    },
    infinite(done) {
      this.getList(1, this.teacher.length, (data) => {
        this.teacher = this.teacher.concat(data)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      })
    },
    getList(type, rowStart, callback) {
      api.getTeacherQuestionnaireList({schoolId: this.$route.params.schoolId, type, rowStart, rowCount: 20}, (data) => {
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

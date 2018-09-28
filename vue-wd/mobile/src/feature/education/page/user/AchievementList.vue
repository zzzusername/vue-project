<template>
  <div>
    <group gutter="0" v-if="studentInfo != null">
      <cell :title="studentInfo.studentName">
        <div slot="icon" class="student_head_img" :style="{'background-image':'url('+tools.cdn(studentInfo.userIcon, 'head.png', 128)+')'}" src=""></div>
      </cell>
    </group>
    <group gutter="10px" v-if="list.length > 0">
      <cell v-for="(item, index) in list" :key="index" :title="item.achievementsName+'-'+tools.formateTime(item.publishDate, 'YYYYMMDD')" value="查看" is-link @click.native="showDetail(item)">
        <div slot="inline-desc" style="margin-top:2px">
          <p>科目：{{item.lessonName !== null && item.lessonName !== undefined ? item.lessonName : '未指定'}}</p>
          <p style="margin-right:30px">发布者：{{item.teacherName}}</p>
        </div>
        <!-- <p slot="inline-desc" style="margin-top:2px" v-if="item.classRank || item.schoolRank"><span v-if="item.classRank" style="margin-right:30px">班级排名：{{item.classRank}}</span><span v-show="item.schoolRank">年级排名：{{item.schoolRank}}</span></p> -->
      </cell>
    </group>
    <p v-if="list.length <= 0" style="text-align:center;font-size: 16px;padding: 20px 15px;fontSize:16px;color:#a2a2a2">没有成绩单！</p>
    <detail-tabbar></detail-tabbar>
    <x-dialog v-model="showDialog" hide-on-blur :dialog-style="{'max-width': '80%', 'width': '80%', height: '70vh'}">
      <scroller>
        <div style="text-align: left;font-size: 14px;padding: 10px 15px;">
          <p style="font-size: 16px;text-align: center">{{achievementInfo.achievementsName}}</p>
          <p v-if="achievementInfo.achievementsNote" style="text-align:center;color: rgb(46, 132, 212)"><strong style="padding: 0 5px;border-bottom: 2px solid rgb(46, 132, 212)">说明</strong></p>
          <p v-if="achievementInfo.achievementsNote">{{achievementInfo.achievementsNote}}</p>
          <table v-for="(item, index) in achievementInfo.students" :key="index" width="100%" cellspacing="0">
            <tr>
              <td colspan="2" style="text-align:center;color: rgb(46, 132, 212)"><strong style="padding: 0 5px;border-bottom: 2px solid rgb(46, 132, 212)">成绩</strong></td>
            </tr>
            <tr v-for="(score, i) in item.score" :key="i">
              <td>{{score.lessonName == null ? '总成绩' : score.lessonName}}</td>
              <td>{{score.achievementsScore == null ? '无成绩':score.achievementsScore}}</td>
            </tr>
            <tr v-if="item.ranks.length > 0">
              <td colspan="2" style="text-align:center;color:rgb(46, 132, 212)"><strong style="padding: 0 5px;border-bottom:2px solid rgb(46, 132, 212)">排名</strong></td>
            </tr>
            <tr v-for="(rank, j) in item.ranks" :key="j">
              <td>{{rank.rankName}}</td>
              <td>{{rank.rank == null ? '无排名' : rank.rank}}</td>
            </tr>
          </table>
        </div>
      </scroller>
    </x-dialog>
  </div>
</template>

<script>
import {Group, Cell, dateFormat, XDialog} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Group, Cell, DetailTabbar, XDialog
  },
  data () {
    return {
      list: [],
      studentInfo: null,
      showDialog: false,
      achievementInfo: {}
    }
  },
  mounted () {
    if (this.$route.params.studentId) {
      api.queryStudentInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId}, (data) => {
        this.studentInfo = data
      }, () => {})
    }
    api.getAchievementList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId}, (data) => {
      this.list = data
    }, () => {})
  },
  methods: {
    getDateTime (time) {
      return dateFormat(time, 'YYYYMMDD')
    },
    showDetail(item) {
      if (this.$route.params.studentId) {
        this.$router.push({name: 'educationAchievementDetail', params: {achievementsId: item.achievementsId, studentId: this.$route.params.studentId}})
      } else {
        this.$router.push({name: 'educationStudentAchievementDetail', params: {achievementsId: item.achievementsId}})
      }
      // api.queryAchievementInfo({schoolId: this.$route.params.schoolId, achievementsId: item.achievementsId, studentId: this.$route.params.studentId}, (data) => {
      //   this.achievementInfo = data
      //   this.showDialog = true
      // }, (er) => {
      //   if (er.toUser) {
      //     this.tools.warnToast(er.message)
      //   }
      // })
    }
  }
}
</script>

<style scoped>
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
td {
  /* border-bottom: 1px solid #b2b2b2; */
  padding: 5px 5px;
}
</style>

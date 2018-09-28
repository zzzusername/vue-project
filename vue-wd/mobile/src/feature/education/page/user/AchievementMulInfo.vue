<template>
  <div>
    <group gutter='0' label-width="4em">
      <cell title='名称' :value='info.achievementsName'></cell>
      <cell title='班级' :value='info.className'></cell>
      <cell title="说明" :value="info.achievementsNote"></cell>
      <cell title="考试类型" v-if="examineType">
        <span slot>{{examineType}}</span>
      </cell>
       <p v-if="showHint" style="color: red;padding: 0 15px 5px;font-size: 14px;">如需修改成绩请登录PC版操作</p>
    </group>
    <group>
      <group-title slot="title" v-if="info.achievementType == 0">
        <p style="text-align:right;color: #2E84D4" @click="$router.push({name: 'educationAchievementTeacherDistributed', params: {achievementsId: info.achievementsId}})">查看成绩分布</p>
      </group-title>
      <!-- <cell v-for='(item, index) in info.students' :key='index' :title='item.studentName' :border-intent='false'>
        <div slot='icon' class='avater' :style='{"background-image":"url("+tools.cdn(item.userIcon, "head.png", 128)+")"}'></div>
        <div slot='inline-desc'>
          <p v-if='item.scoreStr'>{{item.scoreStr}}</p>
          <p v-if='item.ranking'>{{item.ranking}}</p>
        </div>
      </cell> -->
      <cell-box v-for="(item, index) in info.students" :key="index" v-if="item.showScore">
        <table width="100%" style="font-size: 14px">
          <tr>
            <td style="width: 4em">姓名：</td>
            <td>{{item.studentName}} &nbsp;<span v-if="item.needFeedBack" :style="{'color': item.parentIsRead ? 'rgb(46, 132, 212)' : 'red'}">{{item.parentIsRead ? '家长已查看' : '家长未查看'}}</span></td>
          </tr>
          <tr v-for="(scores, i) in item.scores" :key="i" v-if="item.showScore">
            <td v-if="i == 0" style="width: 4em">成绩：</td>
            <td v-else></td>
            <td id="data" v-for="(score, j) in scores" :key="j">
              <span>{{score.lessonName == null ? '总成绩' : score.lessonName}}</span>：
              <span v-if="info.achievementType == 0">{{score.achievementsScore == null ? '无成绩': score.achievementsScore}}</span>
              <span v-if="info.achievementType == 1">{{score.achievementsLevel == null ? '无成绩': score.achievementsLevel}}</span>
            </td>
          </tr>
          <tr v-for="(ranks, k) in item.rankings" :key="k" v-if="item.showRank">
            <td v-if="k == 0" style="width: 3em">排名：</td>
            <td v-else></td>
            <td id="data" v-for="(rank, m) in ranks" :key="m">{{rank.rankName + '：'}}<span>{{rank.rank == null ? '无排名' : rank.rank}}</span></td>
          </tr>
        </table>
      </cell-box>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, GroupTitle, CellBox, Cell } from 'vux'
import {mapGetters} from 'vuex'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Group, GroupTitle, CellBox, Cell, DetailTabbar
  },
  data() {
    return {
      info: {},
      students: [],
      showHint: false,
      examineType: null
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted() {
    api.getAchievementInfo({schoolId: this.$route.params.schoolId, achievementsId: this.$route.params.achievementsId}, (data) => {
      this.info = data
      this.editTypeCode(this.info.typeCode, this.info.typeParam, this.info.typeYear)
      if (data.userId === this.userInfo.userId) {
        this.showHint = true
      }
      this.info.students.forEach(element => {
        element.scores = []
        element.rankings = []
        element.showScore = false
        element.showRank = false
        // 组装成绩
        let sArray = []
        for (let index = 0; index < element.score.length; index++) {
          const score = element.score[index]
          if (score.achievementsScore != null || score.achievementsLevel != null) {
            element.showScore = true
          }
          if (index !== 0 && index % 2 === 0) {
            element.scores.push(sArray)
            sArray = []
          }
          sArray.push(score)
          if (index === (element.score.length - 1)) {
            element.scores.push(sArray)
            sArray = []
          }
          // if ((element.score.length - 1) % 2 !== 0 && index === (element.score.length - 1)) {
          //   element.scores.push(sArray)
          //   sArray = []
          // } else if ((element.score.length - 1) % 2 === 0 && index === (element.score.length - 1)) {
          //   element.scores.push(sArray)
          //   sArray = []
          // }
        }
        // 组装排名
        let rArray = []
        for (let index = 0; index < element.ranks.length; index++) {
          const rank = element.ranks[index]
          if (rank.rank != null) {
            element.showRank = true
          }
          if (index !== 0 && index % 2 === 0) {
            element.rankings.push(rArray)
            rArray = []
          }
          rArray.push(rank)
          if (index === (element.ranks.length - 1)) {
            element.rankings.push(rArray)
            rArray = []
          }
        }
      })
      console.log(this.info.students)
      // this.info.students.forEach(element => {
      //   element.scoreStr = ''
      //   element.ranking = ''
      //   for (let index = 0; index < element.score.length; index++) {
      //     const scores = element.score[index]
      //     if (index === element.score.length - 1) {
      //       element.scoreStr += scores.lessonName + ': ' + scores.achievementsScore
      //     } else {
      //       element.scoreStr += scores.lessonName + ': ' + scores.achievementsScore + ', '
      //     }
      //   }
      //   for (let index = 0; index < element.ranks.length; index++) {
      //     const ranks = element.ranks[index]
      //     if (index === element.score.length - 1) {
      //       element.ranking += ranks.rankName + ': ' + ranks.rank
      //     } else {
      //       element.ranking += ranks.rankName + ': ' + ranks.rank + ', '
      //     }
      //   }
      // })
    }, () => {})
  },
  methods: {
    editTypeCode (typeCode, typeParam, typeYear) {
      if (typeCode) {
        var str = ''
        switch (typeCode) {
          case 'RCCS':
            this.examineType = '日常测试'
            break
          case 'YK':
            this.examineType = typeYear + '年' + typeParam + '月月考'
            break
          case 'QZKS':
            if (parseInt(typeParam) === 1) {
              str = '上学期'
            } else {
              str = '下学期'
            }
            this.examineType = typeYear + '年' + str + '期中考试'
            break
          case 'QMKS':
            if (parseInt(typeParam) === 1) {
              str = '上学期'
            } else {
              str = '下学期'
            }
            this.examineType = typeYear + '年' + str + '期末考试'
            break
          case 'MNKS':
            this.examineType = '第' + this.moniKaoshi(typeParam) + '次模拟考试'
            break
          case 'XYHK':
            this.examineType = '学业会考'
            break
          case 'ZK':
            this.examineType = '中考'
            break
          case 'GK':
            this.examineType = '高考'
            break
        }
      }
    },
    moniKaoshi (code) {
      let str = ''
      switch (parseInt(code)) {
        case 1:
          str = '一'
          break
        case 2:
          str = '二'
          break
        case 3:
          str = '三'
          break
        case 4:
          str = '四'
          break
        case 5:
          str = '五'
          break
        case 6:
          str = '六'
          break
        case 7:
          str = '七'
          break
        case 8:
          str = '八'
          break
        case 9:
          str = '九'
          break
        case 10:
          str = '十'
          break
      }
      return str
    }
  }
}
</script>

<style lang='less' scoped>
.avater {
  width: 40px;
  height:40px;
  display: inline-block;
  border-radius: 6px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
#data {
  word-break: break-word;
  width: 10em;
  text-align: left;
}
</style>


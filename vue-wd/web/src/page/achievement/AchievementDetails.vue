<template>
  <div class="achievement_details">
    <div class="header">
      <span class="impot_title">成绩单详情</span>
    </div>
    <div class="achievement_title">
      <el-row type="flex">
        <el-col :span="3">
          <span>名称：</span>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="请输入内容" v-model="achievement.achievementsName" :disabled="isEdit"></el-input>
        </el-col>
        <el-col :span="1">
          <span></span>
        </el-col>
        <el-col :span="2">
          <span>发布老师：</span>
        </el-col>
        <el-col :span="3">
          <span class="details_title">{{achievement.teacherName}}</span>
        </el-col>
        <el-col :span="2">
          <span>日期：</span>
        </el-col>
        <el-col :span="3">
          <span>{{this.tools.formateTime(achievement.publishDate, 'YYYY-MM-DD')}}</span>
        </el-col>
        <el-col :span="2">
          <span>班级：</span>
        </el-col>
        <el-col :span="5">
          <span>{{achievement.className}}</span>
        </el-col>
      </el-row>
      <el-row type="flex" style="margin-top:5px;" v-if="examineType !== '' && examineType !== null">
        <el-col :span="3">
          <span>考试类型：</span>
        </el-col>
        <el-col :span="11">
          <span>{{examineType}}</span>
        </el-col>
      </el-row>
      <el-row type="flex" style="margin-top:5px;">
        <el-col :span="3">
          <span>成绩说明：</span>
        </el-col>
        <el-col :span="11">
          <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 6}" resize="none" placeholder="请输入成绩说明" :disabled="isEdit" v-model="achievement.achievementsNote"></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" style="margin-top:5px;" v-if="!isEdit && achievement.achievementType == 0">
        <el-col :span="3">
          <span>满分设置：</span>
        </el-col>
        <el-col :span="11">
          <el-button type="success" size="mini" @click="modifyScoreFill" :disabled="scoreFill.length <= 0">修改</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="showScoreText != '' && showScoreText != null && showScoreText != undefined">
        <el-col :span="3" style="line-height: 40px;color:#fff;text-align: left;">.</el-col>
        <el-col :span="21" style="line-height: 40px;color:#fff;text-align: left;">
          <p style="color:#878d99;">{{showScoreText}}</p>
        </el-col>
      </el-row>
      <el-row type="flex" style="margin-top:5px;" v-if="!isEdit && achievement.achievementType == 0">
        <el-col :span="3">
          <span>反馈设置：</span>
        </el-col>
        <el-col :span="11">
          <el-button type="success" size="mini" @click="modifyCondition">修改</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="showText != '' && showText != null && showText != undefined">
        <el-col :span="3" style="line-height: 40px;color:#fff;text-align: left;">.</el-col>
        <el-col :span="21" style="line-height: 40px;color:#fff;text-align: left;">
          <p style="color:#878d99;">{{showText}}</p>
        </el-col>
      </el-row>
      <el-row type="flex" style="margin-top:5px;" v-if="!isEdit && achievement.achievementType == 0">
        <el-col :span="3">
          <span>是否展示分布图：</span>
        </el-col>
        <el-col :span="11">
          <el-switch v-model="achievement.isShowChart" active-color="#67c23a" inactive-color="#999"></el-switch>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <el-table :data="tableLostdata" style="width: 100%;" border>
        <el-table-column fixed type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column fixed label="头像" align="center" min-width="50">
          <template slot-scope="scope">
            <img :src="tools.cdn(scope.row.userIcon, 'head.png', 128)" class="head_icon">
          </template>
        </el-table-column>
        <el-table-column fixed label="姓名" align="center" min-width="80">
          <template slot-scope="scope">
            <input type="text" class="input_tr" :disabled="isEdit" v-model="scope.row.studentName">
          </template>
        </el-table-column>
        <el-table-column :label="filterData(item)" min-width="80" align="center" v-for="(item, index) in lessones" :key="`A-${index}`">
          <template slot-scope="scope">
            <input type="number" class="input_tr" v-if="achievement.achievementType == 0" :disabled="isEdit" v-model.number.trim="scope.row['class' + item]" min="0">
            <input type="text" class="input_tr" v-else :disabled="isEdit" v-model.trim="scope.row['class' + item]" min="0">
          </template>
        </el-table-column>
        <el-table-column :label="filterData(item)" v-if="achievement.achievementType == 0" min-width="80" align="center" v-for="(item, index) in rankList" :key="`B-${index}`">
          <template slot-scope="scope">
            <input type="number" class="input_tr" :disabled="isEdit" v-model.number.trim="scope.row['rank' + index]" min="0">
          </template>
        </el-table-column>
        <el-table-column width="100" fixed="right" label="是否已查看" align="left">
          <template slot-scope="scope">
            <p v-if="scope.row.needFeedBack == true">
              <span v-if="scope.row.parentIsRead == true" style="color:#409EFF;">家长已查看</span>
              <span v-else style="color:red;">家长未查看</span>
            </p>
            <span v-if="scope.row.needFeedBack == false">不需要反馈</span>
          </template>
        </el-table-column>
        <el-table-column min-width="120" fixed="right" label="备注" align="left">
          <template slot-scope="scope">
            <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2}" resize="none" placeholder="请输入成绩说明" :disabled="isEdit" v-model="scope.row.achievementsTeacherNote"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom_button">
      <span class="impot_button" @click="goBack">返回</span>
      <span class="impot_button" @click="saveAchievement" v-if="!isEdit">保存</span>
    </div>
    <!-- 修改反馈条件 -->
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-show="showPopup">
        <div class="cover_lost">
          <p style="font-weight:500;">修改反馈条件限制</p>
          <div class="choose_achievement">
            <el-row v-for="item in scoreLimit" :key="item.value" style="line-height: 40px;text-align: left;margin: 5px 0 0 20px;">
              <el-col :span="6">
                <span style="float:left;"><i style="font-style:normal;color:red;">{{item.label}}</i>低于：</span>
              </el-col>
              <el-col :span="18">
                <input type="number" class="set_score" v-model.number.trim="item.scorModel" placeholder="请输入分数">
              </el-col>
            </el-row>
            <el-row v-for="item in rankLimit" :key="item.value" style="line-height: 40px;text-align: left;margin: 5px 0 0 20px;">
              <el-col :span="6">
                <span style="float:left;"><i style="font-style:normal;color:red;">{{item.label}}</i>低于：</span>
              </el-col>
              <el-col :span="18">
                <input type="number" class="set_score" v-model.number.trim="item.scorModel" placeholder="请输入排名">
              </el-col>
            </el-row>
          </div>
          <div class="content_button">
            <el-button type="success" @click="showPopup = false">关闭</el-button>
            <el-button type="success" @click="confirmSet">确定</el-button>
          </div>
        </div>
      </div>
    </transition>
    <!-- 修改满分设置 -->
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-show="showFillScore">
        <div class="cover_lost">
          <p><span style="font-weight:500;">修改满分设置：</span><span style="color:red;font-size:14px;">（满分设置是必填项）</span></p>
          <div class="choose_achievement">
            <el-row v-for="(item, index) in scoreFill" :key="index" style="line-height: 40px;text-align: left;margin: 5px 0 0 20px;">
              <el-col :span="6">
                <span style="float:left;"><i style="font-style:normal;color:red;">{{item.lessonName == null ? '总成绩' : item.lessonName}}</i>满分：</span>
              </el-col>
              <el-col :span="18">
                <input type="number" class="set_score" v-model.number.trim="item.score" placeholder="请输入分数">
              </el-col>
            </el-row>
          </div>
          <div class="content_button border_none">
            <el-button type="success" @click="confirmSetFillScore">确定</el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import api from './api'
import lessApi from '../homework/api'
export default {
  data () {
    return {
      lessones: [],
      rankList: [],
      tableLostdata: [],
      achievement: {},
      isEdit: true,
      lessonOptions: [],
      classId: null,
      scoreLimit: [],
      rankLimit: [],
      showText: '',
      showPopup: false,
      showFillScore: false,
      scoreFill: [],
      showScoreText: '',
      examineType: ''
    }
  },
  mounted () {
    if (this.$route.params.edit === 'edit') {
      this.isEdit = false
    } else {
      this.isEdit = true
    }
    api.getAchievementInfo({schoolId: this.$route.params.schoolId, achievementsId: this.$route.params.achievementsId}, (data) => {
      this.achievement = data
      this.editTypeCode(this.achievement.typeCode, this.achievement.typeParam, this.achievement.typeYear)
      var studentData = this.achievement.students
      if (this.achievement.fullmarks.length > 0) {
        this.scoreFill = this.achievement.fullmarks
        this.fillTextMosaic()
      }
      var list = []
      if (studentData[0].ranks.length > 0) {
        for (let i = 0; i < studentData[0].ranks.length; i++) {
          this.rankList.push(studentData[0].ranks[i].rankName)
        }
      }
      if (studentData[0].score.length > 0) {
        for (let i = 0; i < studentData[0].score.length; i++) {
          this.lessones.push(studentData[0].score[i].lessonId)
        }
      }
      if (this.achievement.attchJsonStr !== null && this.achievement.attchJsonStr !== undefined) {
        this.scoreLimit = JSON.parse(this.achievement.attchJsonStr).score
        this.rankLimit = JSON.parse(this.achievement.attchJsonStr).rank
        this.mosaicSentence()
      }
      for (let j = 0; j < studentData.length; j++) {
        let item = {}
        item.studentName = studentData[j].studentName
        item.userIcon = studentData[j].userIcon
        item.studentId = studentData[j].studentId
        item.achievementsBadNote = studentData[j].achievementsBadNote
        item.achievementsTeacherNote = studentData[j].achievementsTeacherNote
        item.needFeedBack = studentData[j].needFeedBack
        item.parentIsRead = studentData[j].parentIsRead
        for (let k = 0; k < studentData[j].ranks.length; k++) {
          item['rank' + k] = studentData[j].ranks[k].rank
        }
        for (let k = 0; k < studentData[j].score.length; k++) {
          if (parseInt(this.achievement.achievementType) === 0) {
            item['class' + studentData[j].score[k].lessonId] = studentData[j].score[k].achievementsScore
          } else if (parseInt(this.achievement.achievementType) === 1) {
            item['class' + studentData[j].score[k].lessonId] = studentData[j].score[k].achievementsLevel
          }
        }
        list.push(item)
      }
      this.tableLostdata = list
    }, (er) => {})
    this.getLesson()
  },
  methods: {
    // 确认检查满分
    confirmSetFillScore () {
      if (this.checkScoreFill()) {
        this.fillTextMosaic()
        this.showFillScore = false
      }
    },
    // 修改满分
    modifyScoreFill () {
      if (this.scoreFill.length <= 0) {
        this.$message.error('该成绩单没有设置满分，无法修改')
        return
      }
      this.showFillScore = true
    },
    modifyCondition () {
      if (this.scoreLimit.length > 0 || this.rankLimit.length > 0) {

      } else {
        this.$message.error('该成绩单没有设置反馈条件，无法修改。')
        return
      }
      this.showPopup = true
    },
    confirmSet () {
      this.mosaicSentence() // 调用拼接展示语句
      this.showPopup = false
    },
    // 检查满分
    checkScoreFill () {
      let upon = true
      for (let i = 0; i < this.scoreFill.length; i++) {
        if (this.scoreFill[i].score === null || this.scoreFill[i].score === '') {
          this.$message.error('请给' + this.scoreFill[i].lessonName + '设置满分')
          upon = false
          return
        } else {
          upon = true
        }
      }
      return upon
    },
    // 拼接展示语句
    mosaicSentence () {
      let text = ''
      for (let i = 0; i < this.scoreLimit.length; i++) {
        if (this.scoreLimit[i].scorModel !== null && this.scoreLimit[i].scorModel !== undefined && this.scoreLimit[i].scorModel !== '') {
          text += this.scoreLimit[i].label + '低于' + this.scoreLimit[i].scorModel + '分，'
        }
      }
      for (let i = 0; i < this.rankLimit.length; i++) {
        if (this.rankLimit[i].scorModel !== null && this.rankLimit[i].scorModel !== undefined && this.rankLimit[i].scorModel !== '') {
          text += this.rankLimit[i].label + '在第' + this.rankLimit[i].scorModel + '名之后，'
        }
      }
      this.showText = text.substr(0, text.length - 1)
    },
    // 拼接满分展示语
    fillTextMosaic () {
      let text = ''
      if (this.scoreFill.length > 0) {
        for (let i = 0; i < this.scoreFill.length; i++) {
          if (this.scoreFill[i].score !== null && this.scoreFill[i].score !== undefined && this.scoreFill[i].score !== '') {
            let lessName = this.scoreFill[i].lessonName
            if (!lessName) {
              lessName = '总成绩'
            }
            text += lessName + '满分：' + this.scoreFill[i].score + '分，'
          }
        }
      }
      this.showScoreText = text.substr(0, text.length - 1)
    },
    getLesson () {
      lessApi.queryTeacherLessonList({schoolId: this.$route.params.schoolId, featureCode: 'CHENJI'}, (data) => {
        data.forEach((element) => {
          var item = {
            value: element.lessonId,
            label: element.lessonName + '成绩'
          }
          this.lessonOptions.push(item)
        })
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.$message.error(er.message)
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    saveAchievement () {
      if (this.achievement.achievementsName === undefined || this.achievement.achievementsName === null || this.achievement.achievementsName === '') {
        this.$notify.error({
          title: '提示',
          message: '成绩单名称不能为空！'
        })
        return
      }
      if (!this.checkScoreFill()) {
        return
      }
      var schoolReport = {}
      schoolReport.achievementsName = this.achievement.achievementsName
      if (this.achievement.achievementsNote !== null && this.achievement.achievementsNote !== undefined) {
        schoolReport.achievementsNote = this.achievement.achievementsNote
      }
      if (parseInt(this.achievement.achievementType) === 0) {
        schoolReport.attchJsonStr = JSON.stringify({
          score: this.scoreLimit,
          rank: this.rankLimit
        })
        let scoreFill = []
        for (let n = 0; n < this.scoreFill.length; n++) {
          let itemFill = {
            lessonId: this.scoreFill[n].lessonId,
            score: this.scoreFill[n].score
          }
          scoreFill.push(itemFill)
        }
        schoolReport.fullMarks = scoreFill
      }
      schoolReport.classId = this.achievement.classId
      schoolReport.achievementsId = this.$route.params.achievementsId
      schoolReport.students = []
      schoolReport.isShowChart = this.achievement.isShowChart
      for (let i = 0; i < this.tableLostdata.length; i++) {
        if (this.tableLostdata[i].studentId) {
          let item = {}
          item.parentIsRead = this.tableLostdata[i].parentIsRead
          item.studentId = this.tableLostdata[i].studentId
          item.isNeedFeedBack = false
          item.achievementsBadNote = null
          item.achievementsTeacherNote = this.tableLostdata[i].achievementsTeacherNote
          item.lessons = []
          item.ranks = []
          if (parseInt(this.achievement.achievementType) === 0) {
            for (let p in this.tableLostdata[i]) {
              if (p.indexOf('class') !== -1) {
                let score = {}
                if (p.split('class')[1] !== 'achievementsScore') {
                  score.lessonId = p.split('class')[1]
                }
                if (parseInt(p.split('class')[1]) === 0) {
                  score.lessonId = null
                }
                if (this.tableLostdata[i][p] || this.tableLostdata[i][p] === 0) {
                  score.achievementsScore = this.tableLostdata[i][p]
                } else {
                  score.achievementsScore = null
                }
                item.lessons.push(score)
              }
              if (p.indexOf('rank') !== -1) {
                let rankIng = {}
                rankIng.rankName = this.rankList[parseInt(p.split('rank')[1])]
                if (this.tableLostdata[i][p] || this.tableLostdata[i][p] === 0) {
                  rankIng.rank = this.tableLostdata[i][p]
                } else {
                  rankIng.rank = null
                }
                item.ranks.push(rankIng)
              }
            }
          } else {
            for (let p in this.tableLostdata[i]) {
              if (p.indexOf('class') !== -1) {
                let score = {}
                if (p.split('class')[1] !== 'achievementsScore') {
                  score.lessonId = p.split('class')[1]
                } else {
                  score.lessonId = null
                }
                if (this.tableLostdata[i][p]) {
                  if (!this.isString(this.tableLostdata[i][p])) {
                    score.achievementsLevel = null
                  } else {
                    score.achievementsLevel = this.tableLostdata[i][p]
                  }
                } else {
                  score.achievementsLevel = null
                }
                item.lessons.push(score)
              }
            }
          }
          schoolReport.students.push(item)
        }
      }
      // 对数据进行对比添加是否需要反馈、和差评内容
      for (let o = 0; o < schoolReport.students.length; o++) {
        let student = schoolReport.students[o]
        if (student.achievementsTeacherNote !== null && student.achievementsTeacherNote !== undefined && student.achievementsTeacherNote !== '') {
          student.isNeedFeedBack = true
        }
        if (parseInt(this.achievement.achievementType) === 0) {
          var achievements = ''
          if (this.scoreLimit.length > 0) {
            for (let m = 0; m < this.scoreLimit.length; m++) {
              for (let b = 0; b < student.lessons.length; b++) {
                if (this.scoreLimit[m].scorModel !== null && this.scoreLimit[m].scorModel !== undefined) {
                  if (parseInt(this.scoreLimit[m].value) === parseInt(student.lessons[b].lessonId) && (parseInt(student.lessons[b].achievementsScore) < parseInt(this.scoreLimit[m].scorModel))) {
                    student.isNeedFeedBack = true
                    achievements += this.scoreLimit[m].label + '低于' + this.scoreLimit[m].scorModel + '分，'
                  }
                  if (this.scoreLimit[m].value === 'achievementsScore' && parseInt(student.lessons[b].lessonId) === 0 && (parseInt(student.lessons[b].achievementsScore) < parseInt(this.scoreLimit[m].scorModel))) {
                    student.isNeedFeedBack = true
                    achievements += this.scoreLimit[m].label + '低于' + this.scoreLimit[m].scorModel + '分，'
                  }
                }
              }
            }
          }
          if (this.rankLimit.length > 0) {
            for (let k = 0; k < this.rankLimit.length; k++) {
              if (this.rankLimit[k].scorModel !== null && this.rankLimit[k].scorModel !== undefined) {
                if (this.rankLimit[k].label === student.ranks[k].rankName && (parseInt(student.ranks[k].rank) > parseInt(this.rankLimit[k].scorModel))) {
                  student.isNeedFeedBack = true
                  achievements += this.rankLimit[k].label + '在第' + this.rankLimit[k].scorModel + '名之后，'
                }
              }
            }
          }
          achievements = achievements.substr(0, achievements.length - 1)
          student.achievementsBadNote = achievements
        }
      }
      // console.log(schoolReport)
      api.editAchievement({schoolId: this.$route.params.schoolId, students: schoolReport}, (data) => {
        this.$message.success('保存成功！')
        this.$router.push({name: 'AchievementList'})
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.$message.error(er.message)
        } else {
          this.$message.error('保存失败！')
        }
      })
    },
    filterData (code) {
      if (typeof code === 'number') {
        if (code === 0) {
          return '总成绩'
        } else {
          for (var i = 0; i < this.lessonOptions.length; i++) {
            if (code === this.lessonOptions[i].value) {
              return this.lessonOptions[i].label
            }
          }
        }
      } else {
        return code
      }
    },
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
            if (!typeYear && !typeParam) {
              this.examineType = '普通考试'
            } else {
              if (parseInt(typeParam) === 1) {
                str = '上学期'
              } else {
                str = '下学期'
              }
              this.examineType = typeYear + '年' + str + '期末考试'
            }
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
          case 'PASS':
            this.examineType = '合格性考试'
            break
          case 'RANK':
            this.examineType = '等级性考试'
            break
          case 'ACTION':
            this.examineType = '操作测试'
            break
        }
      }
    },
    isString (obj) {  // 判断对象是否是字符串
      return Object.prototype.toString.call(obj) === '[object String]'
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
  },
  filters: {}
}
</script>
<style scoped>
.achievement_details{
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding:20px;
  box-sizing: border-box;
}
.achievement_details .header{
  background: #fff;
  border-top: 4px solid #67c23a;
  padding: 0 20px;
  box-sizing: border-box;
}
.achievement_details .header .impot_title{
  line-height: 60px;
  font-size: 16px;
  font-weight: 600;
}
.achievement_details .achievement_title{
  line-height:30px;
  background: #fff;
  padding: 0 20px 5px;
  box-sizing: border-box;
  line-height: 40px;
}
.achievement_details .achievement_title .details_title{
  margin-right: 20px;
}
.achievement_details .content{
  margin-top: 5px;
}
.achievement_details .bottom_button{
  background: #fff;
  padding: 10px 0;
  margin-top: 5px;
}
.achievement_details .bottom_button .impot_button{
  display: inline-block;
  width: 100px;
  height: 36px;
  text-align: center;
  background: #67c23a;
  line-height: 36px;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 15px;
  box-sizing: border-box;
}
.achievement_details .bottom_button .impot_button:hover{
  background: #85ce61;
  border-color: #85ce61;
  color: #fff;
}
.achievement_details .bottom_button .impot_button:active{
  background: #5daf34;
  border-color: #5daf34;
  color: #fff;
}
.head_icon{
  width: 40px;
  height: 40px;
  vertical-align: middle;
  border-radius: 20px;
}
.input_tr {
 -webkit-appearance: none;
  background-color: #fff;
  border-radius: 4px;
  /* border: 1px solid #d8dce5; */
  border: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #5a5e66;
  display: inline-block;
  font-size: inherit;
  height: 25px;
  line-height: 1;
  outline: 0;
  padding: 0 0 0 5px;
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
}
.achievement_details .cover_wrap{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  background: rgba(0, 0, 0, .5);
}
.achievement_details .cover_wrap .cover_lost{
  width: 700px;
  height: 400px;
  background: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform:translate(-50%,-50%);
  -moz-transform:translate(-50%,-50%);
  -o-transform:translate(-50%,-50%);
  transform:translate(-50%,-50%);
  z-index: 101;
  padding: 10px 10px 0 10px;
  box-sizing: border-box;
}
.achievement_details .cover_lost .content_button{
  text-align: right;
  padding-right: 10px;
  box-sizing: border-box;
  text-align: right;
  padding: 5px;
  box-sizing: border-box;
  border: none;
}
.achievement_details .cover_wrap .cover_lost .choose_achievement{
  height:310px;
  overflow-y: auto;
  border: 1px dashed #999;
  margin-top: 5px;
}
.set_score {
  -webkit-appearance: none;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #d8dce5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #5a5e66;
  display: inline-block;
  font-size: inherit;
  height: 38px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  float:left;
  width:30%;
}
.set_score:hover{
  border-color: #b4bccc;
}
.set_score:focus{
  border-color: #409EFF;
}
.set_score::-webkit-input-placeholder {
  color:#b6bece;
  font-size:14px;
}
.set_score:-moz-placeholder {
  color:#b6bece;
  font-size:14px;
}
.set_score::-moz-placeholder {
  color:#b6bece;
  font-size:14px;
}
.set_score:-ms-input-placeholder {
  color:#b6bece;
  font-size:14px;
}
</style>


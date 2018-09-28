<template>
  <div class="report-wrap warpper">
    <div class="header">
      <el-button type="info" plain size="small" style="margin:10px 20px 0 0;" icon="el-icon-back" @click="goBack"></el-button>
      <span class="impot_title" v-if="identity=='TEACHER'"><i style="font-style: normal;font-size: 20px;vertical-align: middle;">{{message.name}}&nbsp;</i>{{message.title}}</span>
      <el-button type="text" @click="showSwitch=true" v-if="identity=='TEACHER'">切换评价表</el-button>
      <el-button type="success" style="float:right;margin-top:8px;" @click="importPdf">导出</el-button>
      <el-button type="success" style="float:right;margin:8px 10px 0 0;" @click="onReview">预览</el-button>
    </div>
    <div class="compoents-wrap">
      <el-radio-group v-model="typeTab" style="margin-bottom: 15px;width:100%;">
        <el-radio-button label="moral">思想品德</el-radio-button>
        <el-radio-button label="academic">学业水平</el-radio-button>
        <el-radio-button label="physicalHealth">身心健康</el-radio-button>
        <el-radio-button label="artistic">艺术素养</el-radio-button>
        <el-radio-button label="practice">社会实践</el-radio-button>
        <el-radio-button label="semesterReport">学期自我陈述报告</el-radio-button>
      </el-radio-group>
      <el-tabs tab-position="top" v-model="activeName">
        <el-tab-pane :label="item.name" :name="item.tag" v-for="(item, index) in minorItem" :key="index"></el-tab-pane>
        <character-activity v-if="activeName == 'activityProject'"></character-activity>
        <academic-obligatory v-if="activeName == 'curriculumAchievement'"></academic-obligatory>
        <academic-electives v-if="activeName == 'electiveFirst'"></academic-electives>
        <academic-electives2nd v-if="activeName == 'electiveSecond'"></academic-electives2nd>
        <academic-competition v-if="activeName == 'disciplineCompetition'"></academic-competition>
        <character-honorary v-if="activeName == 'honoraryTitle'"></character-honorary>
        <character-violation-discipline v-if="activeName == 'violationDiscipline'"></character-violation-discipline>
        <character-is-crime v-if="activeName == 'isCrime'"></character-is-crime>
        <practice-project v-if="activeName == 'projectPractice'"></practice-project>
        <practice-innovate v-if="activeName == 'technologicalInnovation'"></practice-innovate>
        <practice-inventions v-if="activeName == 'invention'"></practice-inventions>
        <artistic-activity v-if="activeName == 'artProject'"></artistic-activity>
        <artistic-team v-if="activeName == 'artTeamName'"></artistic-team>
        <health-test-score v-if="activeName == 'comprehensiveScore'"></health-test-score>
        <health-events v-if="activeName == 'sportsCompetition'"></health-events>
        <health-grade v-if="activeName == 'technicalLevel'"></health-grade>
      </el-tabs>
        <semester-report-self v-if="activeName==null && minorItem.length<=0"></semester-report-self>
    </div>
    <el-dialog title="切换评价表" :visible.sync="showSwitch" :close-on-click-modal="false">
      <el-select v-model="semester" filterable style="width:50%;" placeholder="请选择学生素质评价表">
        <el-option v-for="(item, index) in semesterOptions" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showSwitch = false">取消</el-button>
          <el-button type="primary" @click="confirmSwitch">确定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import CharacterActivity from './components/CharacterActivity'
  import AcademicObligatory from './components/AcademicObligatory'
  import AcademicElectives from './components/AcademicElectives'
  import AcademicElectives2nd from './components/AcademicElectives2nd'
  import AcademicCompetition from './components/AcademicCompetition'
  import CharacterHonorary from './components/CharacterHonorary'
  import CharacterViolationDiscipline from './components/CharacterViolationDiscipline'
  import CharacterIsCrime from './components/CharacterIsCrime'
  import PracticeProject from './components/PracticeProject'
  import PracticeInnovate from './components/PracticeInnovate'
  import PracticeInventions from './components/PracticeInventions'
  import ArtisticActivity from './components/ArtisticActivity'
  import ArtisticTeam from './components/ArtisticTeam'
  import HealthTestScore from './components/HealthTestScore'
  import HealthEvents from './components/HealthEvents'
  import HealthGrade from './components/HealthGrade'
  import SemesterReportSelf from './components/SemesterReportSelf'
  import api from './api'
  export default {
    components: { SemesterReportSelf, ArtisticTeam, ArtisticActivity, PracticeInventions, CharacterActivity, AcademicObligatory, AcademicElectives, AcademicElectives2nd, AcademicCompetition, CharacterHonorary, CharacterViolationDiscipline, CharacterIsCrime, PracticeProject, PracticeInnovate, HealthTestScore, HealthGrade, HealthEvents },
    data () {
      return {
        typeTab: 'moral',
        activeName: 'activityProject',
        minorItem: [
          {tag: 'activityProject', name: '活动项目'},
          {tag: 'honoraryTitle', name: '先进个人荣誉称号'},
          {tag: 'violationDiscipline', name: '违纪违规项目'},
          {tag: 'isCrime', name: '是否有犯罪记录'}
        ],
        title: null,
        showSwitch: false,
        semesterOptions: [],
        semester: null,
        message: {
          title: null,
          name: null
        },
        identity: null
      }
    },
    watch: {
      typeTab: {
        handler (newName, old) {
          switch (newName) {
            case 'moral':
              this.activeName = 'activityProject'
              this.minorItem = [
                {tag: 'activityProject', name: '活动项目'},
                {tag: 'honoraryTitle', name: '先进个人荣誉称号'},
                {tag: 'violationDiscipline', name: '违纪违规项目'},
                {tag: 'isCrime', name: '是否有犯罪记录'}
              ]
              break
            case 'academic':
              this.activeName = 'curriculumAchievement'
              this.minorItem = [
                {tag: 'curriculumAchievement', name: '必修和选修Ⅰ（A）课程成绩'},
                {tag: 'electiveFirst', name: '选修Ⅰ（B）课程'},
                {tag: 'electiveSecond', name: '选修Ⅱ课程'},
                {tag: 'disciplineCompetition', name: '学科竞赛成绩'}
              ]
              break
            case 'physicalHealth':
              this.activeName = 'comprehensiveScore'
              this.minorItem = [
                {tag: 'comprehensiveScore', name: '《国家学生体质健康标准》测试综合得分'},
                {tag: 'sportsCompetition', name: '参加体育比赛项目'},
                {tag: 'technicalLevel', name: '运动员国家技术等级'}
              ]
              break
            case 'artistic':
              this.activeName = 'artProject'
              this.minorItem = [
                {tag: 'artProject', name: '参加艺术活动项目'},
                {tag: 'artTeamName', name: '参加学生艺术团队名称'}
              ]
              break
            case 'practice':
              this.activeName = 'projectPractice'
              this.minorItem = [
                {tag: 'projectPractice', name: '项目实践'},
                {tag: 'technologicalInnovation', name: '科技创新、研究性学习成果'},
                {tag: 'invention', name: '创造发明成果'}
              ]
              break
            case 'semesterReport':
              this.activeName = null
              this.minorItem = []
              break
          }
        },
        immediate: true
      }
    },
    mounted () {
      this.$store.dispatch('getUserInfo', this.$route.params.schoolId).then(() => {
        this.identity = this.localStorage.getSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId)
      })
      this.message = JSON.parse(sessionStorage.getItem('message'))
      if (this.message) {
        this.semester = this.message.code
      }
      this.onSearch()
    },
    methods: {
      onSearch () {
        if (!this.$route.params.gradeId) {
          return
        }
        api.queryEvaluateGradeReportList({schoolId: this.$route.params.schoolId, gradeId: this.$route.params.gradeId}, (data) => {
          this.semesterOptions = []
          data.forEach(element => {
            let name1 = ''
            let name2 = ''
            if (element.gradeCode === 'G1') {
              name1 = '高一'
            } else if (element.gradeCode === 'G2') {
              name1 = '高二'
            } else if (element.gradeCode === 'G3') {
              name1 = '高三'
            }
            if (element.semesterCode === 'FIRST') {
              name2 = '上学期'
            } else if (element.semesterCode === 'NEXT') {
              name2 = '下学期'
            }
            element.name = name1 + name2 + '学生综合素质评价表'
            let item = {value: element.gradeCode + '-' + element.semesterCode, label: name1 + name2 + '学生素质评价表'}
            this.semesterOptions.push(item)
          })
        }, () => {})
      },
      goBack () {
        this.$router.go(-1)
      },
      confirmSwitch () {
        api.getEvaluateReportInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, gradeCode: this.semester.split('-')[0], semesterCode: this.semester.split('-')[1]}, (data) => {
          if (data.reportId) {
            this.$router.push({name: 'SemesterReport', params: {classId: this.$route.params.classId, studentId: this.$route.params.studentId, reportId: data.reportId}})
            this.semesterOptions.forEach(element => {
              if (element.value === this.semester) {
                this.message.title = element.label
              }
            })
            this.message.code = this.semester
            sessionStorage.setItem('message', JSON.stringify(this.message))
            this.showSwitch = false
            location.reload()
          } else {
            this.warnMessage('请填写活动名称')
          }
        }, (er) => {
          this.responseError(er, '获取失败')
        })
      },
      onReview () {
        let routeData = this.$router.resolve({name: 'ReviewReport', params: {schoolId: this.$route.params.schoolId}, query: {reportId: this.$route.params.reportId}})
        window.open(routeData.href, '_blank')
        // this.$router.push({name: 'ReviewReport'})
        // window.location.href = process.env.API_URL + '/school/evaluate/export/down.json?reportId=' + this.$route.params.reportId
        // window.open(process.env.API_URL + '/school/evaluate/export/down.json?reportId=' + this.$route.params.reportId, '_blank')
      },
      importPdf () {
        window.open(process.env.API_URL + '/school/evaluate/export/down.json?schoolId=' + this.$route.params.schoolId + '&reportId=' + this.$route.params.reportId, '_blank')
      }
    }
  }
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
.report-wrap{
  .header{
    height: 60px;
    .impot_title{
      margin-right:20px;
    }
  }
  .compoents-wrap{
    background:#fff;
    padding:10px 20px 10px 20px;
    margin-top:5px;
  }
}
</style>


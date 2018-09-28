<template>
  <div class="warpper filter-wrap">
    <div class="header">
      <el-button v-if="!tools.isNull(this.$route.params.gradeId)" type="info" plain size="small" style="margin:10px 20px 0 0;" icon="el-icon-back" @click="goBack"></el-button>
      <span class="impot_title">学生素质评价</span>
    </div>
    <div class="content-filter" style="margin-top:5px;">
      <span style="line-height: 60px;font-size: 16px;font-weight: 600;">筛选条件：</span>
      <el-select v-model="gradeId" style="margin-left:15px;" filterable placeholder="请选择年级" @change="changeSelectGrade">
        <el-option v-for="(item, index) in gradeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="classId" style="margin: 0 15px;" filterable placeholder="请选择班级" :disabled="!gradeId">
        <el-option v-for="(item, index) in classOptions" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="semester" filterable placeholder="请选择学生素质评价表" :disabled="!classId">
        <el-option v-for="(item, index) in semesterOptions" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="success" style="margin-left:20px;" @click.native="queryStudent">查询</el-button>
    </div>
    <div v-if="showStudent" class="student-list">
      <el-table :data="studentList" border :max-height="maxHeight" empty-text="暂无素质评价报表">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="头像" width="100" align="center">
          <template slot-scope="scope">
            <img class="userIcon" :src="tools.cdn(scope.row.userIcon, 'head.png', 128)">
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="studentName" align="center" min-width="50"></el-table-column>
        <el-table-column label="创建日期" align="center" min-width="50">
          <template slot-scope="scope">
            <span v-html="eidtTime(scope.row.createDate)"></span>
          </template>
        </el-table-column>
        <el-table-column label="报表状态" align="center" min-width="50">
          <template slot-scope="scope">
            <span v-if="(scope.row.reportId || scope.row.graduateReportId) && scope.row.reportState == 'EDIT'">进行中</span>
            <span v-else-if="(scope.row.reportId || scope.row.graduateReportId) && scope.row.reportState == 'SHOW'">公示中</span>
            <span v-else-if="(scope.row.reportId || scope.row.graduateReportId) && scope.row.reportState == 'END'">已归档</span>
            <span v-else>暂无报表</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click.native="goSemester(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import api from './api.js'
  export default {
    data () {
      return {
        gradeId: null,
        classId: null,
        semester: null,
        gradeOptions: [],
        classOptions: [],
        semesterOptions: [],
        studentList: [],
        maxHeight: document.body.clientHeight - 230,
        showStudent: false,
        reportList: null,
        gradeArr: []
      }
    },
    mounted () {
    },
    activated () {
      api.getNewGradeList({schoolId: this.$route.params.schoolId}, (data) => {
        this.gradeArr = data
        this.gradeOptions = []
        data.forEach((element) => {
          var item = {
            value: element.gradeId,
            label: element.gradeName
          }
          this.gradeOptions.push(item)
        })
        if (!this.tools.isNull(this.$route.params.gradeId)) {
          // 从评价报表管理进入
          this.classId = null
          this.gradeId = parseInt(this.$route.params.gradeId)
          if (this.$route.params.gradeCode && this.$route.params.semesterCode) {
            this.semester = this.$route.params.gradeCode + '-' + this.$route.params.semesterCode
          }
          this.changeSelectGrade()
        }
      }, (er) => {})
    },
    methods: {
      goSemester (code) {
        let messageStorage = {
          title: null,
          name: code.studentName,
          code: this.semester
        }
        this.semesterOptions.forEach(element => {
          if (element.value === this.semester) {
            messageStorage.title = element.label
          }
        })
        if (code.reportId) {
          sessionStorage.setItem('message', JSON.stringify(messageStorage))
          this.$router.push({name: 'SemesterReport', params: {gradeId: this.gradeId, classId: this.classId, studentId: code.studentId, reportId: code.reportId}})
        } else if (code.graduateReportId) {
          sessionStorage.setItem('graduationMessage', JSON.stringify(messageStorage))
          this.$router.push({name: 'GraduationPresentation', params: {gradeId: this.gradeId, classId: this.classId, studentId: code.studentId, graduateReportId: code.graduateReportId}})
        } else {
          this.warnMessage('该学生没有创建素质评价报告')
        }
      },
      queryStudent () {
        if (!this.gradeId) {
          this.warnMessage('请选择年级')
          return
        }
        if (!this.classId) {
          this.warnMessage('请选择班级')
          return
        }
        if (!this.semester) {
          this.warnMessage('请选择学生素质评价表')
          return
        }
        this.showStudent = true
        if (this.semester === 'isGraduation') {
          api.queryStudentGraduateReport({schoolId: this.$route.params.schoolId, gradeId: this.gradeId, classId: this.classId}, (data) => {
            this.studentList = data
          }, (er) => {
            this.responseError(er, '查询失败')
          })
        } else {
          api.queryStudentReport({schoolId: this.$route.params.schoolId, gradeId: this.gradeId, classId: this.classId, gradeCode: this.semester.split('-')[0], semesterCode: this.semester.split('-')[1]}, (data) => {
            this.studentList = data
          }, (er) => {
            this.responseError(er, '查询失败')
          })
        }
      },
      onSearch () {
        api.queryEvaluateGradeReportList({schoolId: this.$route.params.schoolId, gradeId: this.gradeId}, (data) => {
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
          this.getStudentGraduateReportInfo()
        }, () => {})
      },
      getStudentGraduateReportInfo () {
        api.getStudentGraduateReportInfo({schoolId: this.$route.params.schoolId, gradeId: this.gradeId}, (data) => {
          if (data.graduateReportId !== null && data.graduateReportId !== undefined) {
            data.name = ''
            let item = {value: 'isGraduation', label: '高中毕业生综合素质评价报告'}
            this.semesterOptions.push(item)
          }
        }, (er) => {})
      },
      changeSelectGrade () {
        this.classId = null
        this.semester = null
        this.showStudent = false
        this.onSearch()
        let classes = []
        this.classOptions = []
        if (this.gradeId) {
          for (let i = 0; i < this.gradeArr.length; i++) {
            if (this.gradeArr[i].gradeId === parseInt(this.gradeId)) {
              classes = this.gradeArr[i].classes
              break
            }
          }
        }
        classes.forEach((element) => {
          var item = {
            value: element.classId,
            label: element.className
          }
          this.classOptions.push(item)
        })
      },
      eidtTime (val) {
        return this.tools.formateTime(val, 'YYYY-MM-DD')
      },
      goBack () {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
.filter-wrap{
  .content-filter{
    padding:0 20px;
    background: #fff;
  }
  .student-list{
    margin-top: 5px;
    .userIcon {
      width: 40px;
      height: 40px;
      vertical-align: middle;
      border-radius: 20px;
    }
  }
}
</style>

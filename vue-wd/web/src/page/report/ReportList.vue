<template>
  <div class="warpper">
    <div class="header">
      <span class="impot_title">学生素质评价</span>
    </div>
    <div class="content">
      <el-table :data="reportList" border empty-text="暂无素质评价报表" :max-height="maxHeight">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="年级" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{editGrade(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.reportState == 'EDIT'">进行中</span>
            <span v-else-if="scope.row.reportState == 'SHOW'">公示中</span>
            <span v-else-if="scope.row.reportState == 'END'">已归档</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{tools.formateTime(scope.row.createDate, 'YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="queryReport(scope.row)">查看</el-button>
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
      maxHeight: document.body.clientHeight - 268,
      reportList: []
    }
  },
  computed: {
    studentInfo () {
      return this.$store.state.studentInfo
    }
  },
  watch: {
    studentInfo: {
      handler (newStudentInfo, old) {
        this.getReport()
      }
    }
  },
  mounted () {
    this.getReport()
  },
  methods: {
    getReport () {
      api.queryStudentSelfReport({schoolId: this.$route.params.schoolId, studentId: this.studentInfo.studentId}, (data) => {
        this.reportList = data
        this.getGraduateReport()
      }, (er) => {})
    },
    getGraduateReport () {
      api.queryStudentSelfGraduateReport({schoolId: this.$route.params.schoolId, studentId: this.studentInfo.studentId}, (data) => {
        this.reportList = this.reportList.concat(data)
      }, (er) => {})
    },
    queryReport (data) {
      if (data.reportId) {
        this.$router.push({name: 'SemesterReportIdentity', params: {reportId: data.reportId}})
      } else if (data.graduateReportId) {
        this.$router.push({name: 'GraduationPresentation', params: {gradeId: this.gradeId, classId: this.classId, studentId: data.studentId, graduateReportId: data.graduateReportId}})
      }
    },
    editGrade (data) {
      if (data.gradeCode) {
        let name1, name2
        if (data.gradeCode === 'G1') {
          name1 = '高一'
        } else if (data.gradeCode === 'G2') {
          name1 = '高二'
        } else if (data.gradeCode === 'G3') {
          name1 = '高三'
        }
        if (data.semesterCode === 'FIRST') {
          name2 = '上学期'
        } else if (data.semesterCode === 'NEXT') {
          name2 = '下学期'
        }
        return name1 + name2 + '学生综合素质评价表'
      } else {
        return '高中毕业生综合素质评价报告'
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
</style>


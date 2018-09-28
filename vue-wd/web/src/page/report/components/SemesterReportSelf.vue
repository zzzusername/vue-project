<template>
  <div class="self-report">
    <div class="model-style">
      <h4 style="margin-bottom:10px;">自我陈述报告</h4>
      <el-input type="textarea" :autosize="{ minRows: 6}" :disabled="!showStudentBtn" :maxlength="800" clearable resize="none" placeholder="（通过列举典型事例等方式，介绍学生本人的社会责任感、专业志向与才能、个性特点与个人爱好等方面的具体突出表现，字数控制在800字左右。）" v-model="messageInfo.statementContent"></el-input>
      <div class="model-button">
        <el-button type="primary" size="small" plain v-if="!showStudentBtn" @click="showStudentBtn = true">编辑</el-button>
        <el-button type="primary" size="small" plain v-if="showStudentBtn" @click="showStudentBtn = false">取消</el-button>
        <el-button type="primary" size="small" plain v-if="showStudentBtn" @click.native="saveStatement('student')">保存</el-button>
      </div>
    </div>
    <div class="model-style">
      <h4 style="margin-bottom:10px;">教师评语</h4>
      <el-input type="textarea" :autosize="{ minRows: 6}" :disabled="!showTeacherBtn" :maxlength="200" resize="none" placeholder="（审核确认学生自我陈述报告真实性；结合学生高中三年成长经历，对学生作出简要评价；字数不超过200字）" v-model="messageInfo.teacherComment"></el-input>
      <div class="model-button">
        <el-button type="primary" size="small" plain v-if="!showTeacherBtn" @click.native="showTeacherBtn = true">编辑</el-button>
        <el-button type="primary" size="small" plain v-if="showTeacherBtn" @click.native="showTeacherBtn = false">取消</el-button>
        <el-button type="primary" size="small" plain v-if="showTeacherBtn" @click.native="saveStatement('teacher')">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api.js'
export default {
  data () {
    return {
      showTeacherBtn: false,
      showStudentBtn: false,
      approvalStatus: 'SUCCESS',
      messageInfo: {
        statementContent: null,
        teacherComment: null,
        statementId: null
      }
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      api.queryStatementInfo({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, studentId: this.$route.params.studentId, reportId: this.$route.params.reportId}, (data) => {
        if (data !== null) {
          this.messageInfo = data
        }
      }, (er) => {})
    },
    saveStatement (type) {
      if (type === 'student' && (this.messageInfo.statementContent === null || this.messageInfo.statementContent === '')) {
        this.warnMessage('请填写自我陈述报告内容')
        return
      }
      if (type === 'teacher' && (this.messageInfo.teacherComment === null || this.messageInfo.teacherComment === '')) {
        this.warnMessage('请填写教师评语')
        return
      }
      api.saveStatement({statementContent: this.messageInfo.statementContent, teacherComment: this.messageInfo.teacherComment, schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, reportId: this.$route.params.reportId, graduateReportId: null, classId: this.$route.params.classId, statementId: this.messageInfo.statementId, approvalStatus: this.approvalStatus}, (data) => {
        this.successMessage('保存成功')
        this.getInfo()
        this.showTeacherBtn = false
        this.showStudentBtn = false
      }, (er) => {
        this.responseError(er, '保存失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.self-report{
  .model-style{
    overflow:hidden;
    .model-button{
      float:right;
      margin:10px 0 0 0;
    }
  }
}
</style>


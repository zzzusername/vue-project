<template>
  <div class="warpper">
    <div class="header" style="margin-bottom:5px;">
      <el-button type="info" plain size="small" style="margin:10px 20px 0 0;" icon="el-icon-back" @click="goBack"></el-button>
      <span class="impot_title"><i style="font-style: normal;font-size: 20px;vertical-align: middle;">{{graduationMessage.name}}&nbsp;</i>{{graduationMessage.title}}</span>
      <!-- <el-button type="text" @click="showSwitch=true">切换评价表</el-button> -->
      <el-button type="success" style="float:right;margin-top:8px;" @click="importpdf">导出</el-button>
      <el-button type="success" style="float:right;margin:8px 10px 0 0;" @click="onReview">预览</el-button>
    </div>
    <div class="content-wrap">
      <div>
        <div class="model-style" style="margin-top:0;">
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
        <div class="model-style">
          <h4 style="margin-bottom:10px;">典型案例材料</h4>
          <el-row style="line-height:50px;">
            <el-col :span="2">材料类别：</el-col>
            <el-col :span="21">
              <el-radio v-model="caseData.materialsType" :disabled="!showCaseBtn" :label="item.key" v-for="(item, index) in levelList" :key="index">{{item.name}}</el-radio>
            </el-col>
          </el-row>
          <el-row style="line-height:50px;">
            <el-col :span="2">作品标题：</el-col>
            <el-col :span="10">
              <el-input v-model="caseData.materialsTitle" :disabled="!showCaseBtn" placeholder="请输入作品标题"></el-input>
            </el-col>
          </el-row>
          <el-row style="line-height:50px;">
            <el-col :span="2">指导导师：</el-col>
            <el-col :span="4">
              <el-input v-model="caseData.guidanceTeacherName" :disabled="!showCaseBtn" style="width:80%;" placeholder="请输入指导导师"></el-input>
            </el-col>
            <el-col :span="2">合 作 者：</el-col>
            <el-col :span="4">
              <el-input v-model="caseData.partnerName" :disabled="!showCaseBtn" style="width:80%;" placeholder="请输入合作者"></el-input>
            </el-col>
          </el-row>
          <el-row style="line-height:50px;">
            <el-col :span="2">个人角色：</el-col>
            <el-col :span="4">
              <el-radio v-model="caseData.selfRole" :label="item.key" :disabled="!showCaseBtn" v-for="(item, index) in roleList" :key="index">{{item.name}}</el-radio>
            </el-col>
            <el-col :span="2">具体任务：</el-col>
            <el-col :span="16">
              <el-input v-model="caseData.concretenessTask" :disabled="!showCaseBtn" style="width:80%;" placeholder="请输入具体任务"></el-input>
            </el-col>
          </el-row>
          <el-row style="line-height:50px;">
            <el-col :span="4">成果获奖或公开发表情况：</el-col>
            <el-col :span="8">
              <el-radio v-model="caseData.publishRank" :disabled="!showCaseBtn" :label="item.key" v-for="(item, index) in rankList" :key="index">{{item.name}}</el-radio>
            </el-col>
            <el-col :span="2">审核人：</el-col>
            <el-col :span="4">
              <el-input v-model="teacherName" disabled style="width:80%;" placeholder="请输入审核人"></el-input>
            </el-col>
          </el-row>
          <el-input type="textarea" :autosize="{ minRows: 6}" :disabled="!showCaseBtn" :maxlength="1500" clearable resize="none" placeholder="研究性学习报告和社会调查报告，须列出调查研究或实践的内容、方法、历经时间、实施过程、结论及反思；艺术创作作品和其他材料不作格式要求。字数在1500字以内。" v-model="caseData.materialsContent"></el-input>
          <div class="model-button">
            <el-button type="primary" size="small" plain v-if="!showCaseBtn" @click.native="showCaseBtn = true">编辑</el-button>
            <el-button type="primary" size="small" plain v-if="showCaseBtn" @click.native="showCaseBtn = false">取消</el-button>
            <el-button type="primary" size="small" plain v-if="showCaseBtn" @click.native="saveCase">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from './api.js'
export default {
  data () {
    return {
      semesterOptions: [],
      messageInfo: {
        statementContent: null,
        teacherComment: null,
        statementId: null
      },
      graduationMessage: {
        name: null,
        title: null
      },
      caseData: {
        materialsType: null,
        selfRole: null,
        guidanceTeacherName: null,
        partnerName: null,
        materialsTitle: null,
        concretenessTask: null,
        publishRank: null,
        materialsContent: null
      },
      showStudentBtn: false,
      showTeacherBtn: false,
      showCaseBtn: false,
      teacherName: null,
      materialsId: null,
      approvalStatus: 'SUCCESS',
      levelList: [{key: 'YJXX', name: '研究性学习报告'}, {key: 'SHDC', name: '社会调查报告'}, {key: 'YSCZ', name: '艺术创作作品'}, {key: 'QT', name: '其他'}],
      roleList: [{key: 'RESPONSIBLE', name: '负责人'}, {key: 'PARTICIPATE', name: '参与者'}],
      rankList: [{key: 'NATION', name: '国家'}, {key: 'PROVINCE', name: '省'}, {key: 'CITY', name: '市'}, {key: 'COUNTY', name: '区县'}, {key: 'SCHOOL', name: '学校'}]
    }
  },
  mounted () {
    this.graduationMessage = JSON.parse(sessionStorage.getItem('graduationMessage'))
    this.semester = this.graduationMessage.code
    this.queryStatementInfoById()
    this.queryMaterialsList()
  },
  methods: {
    queryMaterialsList () {
      api.queryMaterialsList({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, studentId: this.$route.params.studentId, reportId: null, graduateReportId: this.$route.params.graduateReportId}, (data) => {
        if (data.length > 0) {
          this.queryMaterialsInfo(data[0].materialsId, (data) => {
            this.caseData = {
              materialsType: data.materialsType,
              selfRole: data.selfRole,
              guidanceTeacherName: data.guidanceTeacherName,
              partnerName: data.partnerName,
              materialsTitle: data.materialsTitle,
              concretenessTask: data.concretenessTask,
              publishRank: data.publishRank,
              materialsContent: data.materialsContent
            }
            this.teacherName = data.teacherName
            this.materialsId = data.materialsId
          })
        }
      }, (er) => {})
    },
    queryMaterialsInfo (materialsId, cb) {
      api.queryMaterialsInfo({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, studentId: this.$route.params.studentId, materialsId: materialsId}, (data) => {
        cb(data)
      }, (er) => {})
    },
    queryStatementInfoById () {
      api.queryStatementInfoById({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, studentId: this.$route.params.studentId, graduateReportId: this.$route.params.graduateReportId}, (data) => {
        if (data !== null) {
          this.messageInfo = data
        }
      }, (er) => {})
    },
    getStudentGraduateReportInfo () {
      api.getStudentGraduateReportInfo({schoolId: this.$route.params.schoolId, gradeId: this.gradeId}, (data) => {
        data.name = ''
        let item = {value: 'isGraduation', label: '高中毕业生综合素质评价报告'}
        this.semesterOptions.push(item)
      }, (er) => {})
    },
    saveStatement (type) {
      if (type === 'student' && (this.statementContent === null || this.statementContent === '')) {
        this.warnMessage('请填写自我陈述报告内容')
        return
      }
      if (type === 'teacher' && (this.teacherComment === null || this.teacherComment === '')) {
        this.warnMessage('请填写教师评语')
        return
      }
      api.saveStatement({statementContent: this.messageInfo.statementContent, teacherComment: this.messageInfo.teacherComment, schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, reportId: null, graduateReportId: this.$route.params.graduateReportId, classId: this.$route.params.classId, statementId: this.messageInfo.statementId, approvalStatus: this.approvalStatus}, (data) => {
        this.successMessage('保存成功')
        this.queryStatementInfoById()
        this.showTeacherBtn = false
        this.showStudentBtn = false
      }, (er) => {
        this.responseError(er, '保存失败')
      })
    },
    saveCase () {
      if (!this.caseData.materialsType) {
        this.warnMessage('请选择材料类别')
        return
      }
      if (!this.caseData.materialsTitle) {
        this.warnMessage('请输入作品标题')
        return
      }
      if (!this.caseData.guidanceTeacherName) {
        this.warnMessage('请输入指导老师')
        return
      }
      if (!this.caseData.partnerName) {
        this.warnMessage('请输入合作者')
        return
      }
      if (!this.caseData.selfRole) {
        this.warnMessage('请选择个人角色')
        return
      }
      if (!this.caseData.concretenessTask) {
        this.warnMessage('请输入具体任务')
        return
      }
      if (!this.caseData.publishRank) {
        this.warnMessage('请选择成果获奖或公开发表情况')
        return
      }
      if (!this.caseData.publishRank) {
        this.warnMessage('请填写材料内容')
        return
      }
      api.saveMaterials({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, reportId: null, graduateReportId: this.$route.params.graduateReportId, materialsId: this.materialsId, caseData: this.caseData}, (data) => {
        this.successMessage('保存成功')
        this.queryMaterialsList()
        this.showCaseBtn = false
      }, (er) => {
        this.responseError(er, '保存失败')
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    onReview () {
      let routeData = this.$router.resolve({name: 'ReviewReport', params: {schoolId: this.$route.params.schoolId}, query: {studentId: this.$route.params.studentId}})
      window.open(routeData.href, '_blank')
      // window.open(process.env.API_URL + '/school/evaluate/export/graduate/down.json?studentId=' + this.$route.params.studentId)
    },
    importpdf () {
      window.open(process.env.API_URL + '/school/evaluate/export/graduate/down.json?schoolId=' + this.$route.params.schoolId + '&studentId=' + this.$route.params.studentId)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
.content-wrap{
  padding:10px 10px;
  background: #fff;
  .model-style{
    overflow: hidden;
    background: rgb(241, 243, 246);
    border-radius: 5px;
    padding:10px 10px;
    margin-top: 10px;
    .model-button{
      float:right;
      margin:10px 0 0 0;
    }
  }
}
</style>


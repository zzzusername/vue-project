<template>
  <div>
    <div style="line-height: 28px; margin: 5px 0;">
      <!-- <span style="font-size:14px;font-weight:500;">高一上学期课程成绩</span> -->
      <el-button size="mini" type="primary" style="float:right;margin-right:20px;margin-bottom:5px;" icon="el-icon-upload" @click="onShow">同步成绩单</el-button>
      <!-- <el-button size="mini" type="success" style="float:right;margin-right:20px;" icon="el-icon-plus" @click="onImport">设置成绩单</el-button> -->
    </div>
    <div>
      <el-table :data="tableData" border :max-height="maxHeight">
        <el-table-column v-for="(item,index) in list" :key="index" :label="item.lessonName" align="center" min-width="50">
          <template slot-scope="scope">
            {{item.achievementScore}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title='同步成绩单' :visible.sync="dialogVisible">
      <el-form ref="form" :model="form" label-width="80px">
        <!-- <div style="margin-bottom:20px;margin-left:10px;">
          <template>
            <el-radio v-model="importRadio" label="1">导入课程成绩</el-radio>
            <el-radio v-model="importRadio" label="2">导入学业水平考试成绩</el-radio>
          </template>
        </div> -->
        <!-- <div style="margin-bottom:20px;margin-left:15px;color:red;">
        <span>您还没有选择需要导入成绩的课程</span> <el-button style="margin-left:10px;" type="text">学业水平课程设置</el-button>
        </div> -->
        <el-form-item label="选择年份">
          <el-date-picker v-model="typeYear" type="year" placeholder="选择年" value-format="yyyy"></el-date-picker>
        </el-form-item>
        <el-form-item label="选择学期">
          <div style="margin-left:20px;display:inline-block;">
            <el-radio v-model="typeParam" label="1">上学期</el-radio>
            <el-radio v-model="typeParam" label="2">下学期</el-radio>
          </div>
        </el-form-item>
      </el-form>
      <div style="margin-left:10px;color:red" v-if="achievementList.length > 0">
        注：将以下成绩同步到素质评价表中<br>
        <span v-for="(item,index) in achievementList" :key="index">
          {{item.achievementsName}}：
          <span v-for="(item2,index2) in item.lessons" :key="index2">
            {{item2.lessonName}}
          </span>
          <br>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onImport">立即同步</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../api.js'
export default {
  data () {
    return {
      maxHeight: document.body.clientHeight - 230 - 117,
      form: {},
      dialogVisible: false,
      importRadio: '1',
      typeParam: '1',
      typeYear: '',
      achievementList: [],
      tableData: [{}],
      list: [
      ]
    }
  },
  watch: {
    typeParam (newValue, oldValue) {
      this.onSearchAchievementList()
    },
    typeYear (newValue, oldValue) {
      this.onSearchAchievementList()
    }
  },
  mounted () {
    this.onRefresh()
  },
  methods: {
    onRefresh () {
      api.getAcademicObligatoryReportInfo({schoolId: this.$route.params.schoolId, reportId: this.$route.params.reportId}, (data) => {
        this.list = data
        this.list.forEach(element => {
          if (element.achievementType === 'RANK') {
            element.lessonName = element.lessonName + '/等级性考试'
          } else if (element.achievementType === 'ACTION') {
            element.lessonName = element.lessonName + '/操作测试'
          } else if (element.achievementType === 'PASS') {
            element.lessonName = element.lessonName + '/合格性考试'
          }
        })
      }, () => {})
    },
    onSearchAchievementList () {
      api.getAchievementFinalExamList({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, typeParam: this.typeParam, typeYear: this.typeYear}, (data) => {
        this.achievementList = data
      }, () => {})
    },
    onShow () {
      this.dialogVisible = true
    },
    onImport () {
      if (this.tools.isNull(this.typeYear)) {
        this.warnMessage('请选择年份')
        return
      }
      if (this.achievementList.length === 0) {
        this.warnMessage('此班没有可导入的成绩单')
        return
      }
      this.dialogVisible = false
      let achIds = []
      this.achievementList.forEach(element => {
        achIds.push(element.achievementsId)
      })
      let message = JSON.parse(sessionStorage.getItem('message'))
      let codes = message.code.split('-')
      let gradeCode = ''
      let semesterCode = ''
      if (codes.length > 0) {
        gradeCode = codes[0]
        semesterCode = codes[1]
      }
      api.importAcademicObligatory({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, gradeCode, semesterCode, achIds}, (data) => {
        this.successMessage('同步成功')
        this.onRefresh()
      }, (er) => {
        this.responseError(er, '同步失败')
      })
    }
  }
}
</script>

<style>

</style>

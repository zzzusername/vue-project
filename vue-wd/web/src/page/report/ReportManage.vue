<template>
  <div class="warpper filter-wrap">
    <div class="header">
      <span class="impot_title">评价报表管理</span>
      <el-button type="success" @click="onPublishReport" style="float:right;margin:10px 20px 10px 0;" icon="el-icon-edit-outline" plain>发起毕业生评价报告</el-button>
      <el-button type="success" @click="onSetting" style="float:right;margin:10px 20px 10px 0;" icon="el-icon-setting">学业水平课程设置</el-button>
      <el-button type="success" @click="onPublish" style="float:right;margin:10px 20px 10px 0;" icon="el-icon-edit-outline">发起学期评价表</el-button>
    </div>
    <div class="content-filter">
      <span style="line-height: 60px;font-size: 16px;font-weight: 600;">筛选条件：</span>
      <el-select v-model="gradeId" style="margin-left:15px;" filterable placeholder="请选择年级" @change="onSearch">
        <el-option v-for="(item, index) in gradeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="primary" style="margin-left:20px;" @click="onSearch">查询</el-button>
    </div>
    <div>
      <el-table v-if="gradeId" :data="reportList" border :max-height="maxHeight" empty-text="暂无素质评价报表">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="评价表" prop="name" align="center" min-width="40"></el-table-column>
        <el-table-column label="关联年级" prop="gradeName" align="center" min-width="30"></el-table-column>
        <el-table-column label="状态" align="center" min-width="20">
          <template slot-scope="scope">
            <span v-if="scope.row.reportState == 'EDIT'">进行中</span>
            <span v-if="scope.row.reportState == 'SHOW'">公示中</span>
            <span v-if="scope.row.reportState == 'END'">已归档</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="goSemester(scope.row)" icon="el-icon-search">查看</el-button>
            <el-button size="mini" type="primary" v-if="!scope.row.graduateReportId" @click="importHistoryData(scope.row.gradeReportId)" icon="el-icon-upload">导入评价信息</el-button>
            <el-button size="mini" type="primary" v-if="!scope.row.graduateReportId" @click="importAcademicObligatory(scope.row)" icon="el-icon-upload">同步成绩单</el-button>
            <el-button size="mini" type="primary" @click="editReport(scope.row)" icon="el-icon-setting">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title='发起学期评价表' :visible.sync="publishDialogVisible" :close-on-click-modal="false" @close="publishDialogVisible=false, isGraduation=false, isEdit=false">
      <el-form label-width="100px">
        <el-form-item label="选择年级名称">
          <el-select v-model="publishGradId" :disabled="isEdit"  style="margin-left:15px;width:40%" filterable placeholder="请选择年级" @change="onSearch">
            <el-option v-for="(item, index) in gradeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择年级等级" v-if="!isGraduation">
          <el-select v-model="gradeCode" placeholder="请选择" :disabled="isEdit"  style="width:40%;margin-left:15px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择学期" v-if="!isGraduation">
          <div style="margin-left:20px;display:inline-block;">
            <el-radio v-model="semesterCode" :disabled="isEdit" label="FIRST">上学期</el-radio>
            <el-radio v-model="semesterCode" :disabled="isEdit" label="NEXT">下学期</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="是否归档" v-if="isEdit">
          <div style="margin-left:20px;display:inline-block;">
            <el-switch
              v-model="file"
              active-color="#13ce66"
              inactive-color="#909399">
            </el-switch>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="publishDialogVisible=false, isGraduation=false, isEdit=false">取 消</el-button>
        <el-button type="primary" @click="onPublishSave">{{isEdit ? '确认并保存' : '保存并提交'}}</el-button>
      </span>
    </el-dialog>
    <el-dialog title='学业水平课程设置' :visible.sync="lessonsDialogVisible" :close-on-click-modal="false">
      <el-form label-width="90px">
        <div v-for="(lessons, index) in lessonsList" :key="index" style="margin-bottom:5px;">
          <span>{{index + 1}}.</span>
          <el-select v-model="lessons.lessonId" style="margin-left:15px;" filterable placeholder="请选择课程" @change="onSearch">
            <el-option v-for="(item, index) in optionLessones" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button v-if="index == lessonsList.length-1" type="success" @click="onAddLessons" icon="el-icon-plus" round size="mini">添加</el-button>
          <el-button v-if="index == lessonsList.length-1" type="danger" @click="onDeleteLessons(index)" icon="el-icon-delete" round size="mini">删除</el-button>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lessonsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSettingLessons">保存并提交</el-button>
      </span>
    </el-dialog>

    <el-dialog title="导入历史数据" :visible.sync="dialogVisible">
      <div style="padding: 0 0 20px 0">
        <p>说明: </p>
        <div style="text-indent: 3em;">
          <p>1. 请先<a href="http://img1.sq3q.com/report/%E7%BB%BC%E5%90%88%E7%B4%A0%E8%B4%A8%E8%AF%84%E4%BB%B7%28%E8%AF%84%E4%BB%B7%E4%BF%A1%E6%81%AF%29.xlsx">下载模版</a></p>
          <p>2. 按照模版格式录入素质评价记录</p>
          <p>3. 选择班级上传文件并完成导入</p>
          <p style="color: #f56c6c">注: 请保证上传文件的正确性。如班级内有重名学生，请保证与系统班级成员名称一致，导入成功后可将基本信息手动改回真实姓名</p>
        </div>
      </div>
      <div>
        <span>班级:</span>
        <el-select :disabled="gradeId == null" style="margin-left: 15px" v-model="classId" clearable placeholder="请选择班级">
          <el-option
            v-for="item in classes"
            :key="item.classId"
            :label="item.className"
            :value="item.classId">
          </el-option>
        </el-select>
      </div>
      <div v-if="dialogVisible" style="margin: 20px 0 10px;">
        <el-upload
          class="upload-demo"
          action=""
          :limit="1"
          :on-change="fileChange"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveImport" :loading="importLoading">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog title='同步成绩单' :visible.sync="syncDialogVisible">
      <el-form  label-width="80px">
        <div style="margin-bottom:20px;margin-left:15px;">
          <span>选择已经导入的成绩单，同步到素质评价表中</span><br>
          <span style="color:red;">注：同步成绩单需要先操作</span> <el-button style="margin-left:10px;" type="text" @click="onSetting">学业水平课程设置</el-button>
        </div>
        <el-form-item label="选择班级">
          <el-select v-model="syncClassId" filterable placeholder="请选择班级" :disabled="!gradeId">
            <el-option v-for="(item, index) in classOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
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
        <el-button @click="syncDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onImport">立即同步</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import gradeApi from '../grademanage/api.js'
import api from './api.js'
import schoolApi from '../api.js'
export default {
  data () {
    return {
      maxHeight: document.body.clientHeight - 169,
      gradeId: null,
      publishGradId: null,
      gradeOptions: [],
      reportList: [],
      dialogVisible: false,
      lessonsDialogVisible: false,
      reportDialogVisible: false,
      lessonsList: [
        {
          lessonId: null
        }
      ],
      optionLessones: [],
      options: [{
        value: 'G1',
        label: '高一'
      }, {
        value: 'G2',
        label: '高二'
      }, {
        value: 'G3',
        label: '高三'
      }],
      gradeCode: null,
      semesterCode: null,
      classId: null,
      classes: [],
      excelFile: null,
      importLoading: false,
      gradeReportId: null,
      publishDialogVisible: false,
      isGraduation: false,
      syncDialogVisible: false,
      achievementList: [],
      typeParam: '1',
      typeYear: '',
      syncClassId: null,
      classOptions: [],
      isEdit: false,
      file: false,
      messageInfo: null
    }
  },
  watch: {
    typeParam (newValue, oldValue) {
      this.onSearchAchievementList()
    },
    typeYear (newValue, oldValue) {
      this.onSearchAchievementList()
    },
    syncClassId (newValue, oldValue) {
      this.onSearchAchievementList()
    }
  },
  mounted () {
    gradeApi.getGradeList({schoolId: this.$route.params.schoolId}, (data) => {
      data.forEach((element) => {
        var item = {
          value: element.gradeId,
          label: element.gradeName
        }
        this.gradeOptions.push(item)
      })
    }, (er) => {})
    schoolApi.getLessonsList({schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999}, (data) => {
      data.forEach(element => {
        let item = {
          value: element.lessonId,
          label: element.lessonName
        }
        this.optionLessones.push(item)
      })
    }, () => {})
  },
  computed: {
    schoolId () {
      return this.$route.params.schoolId
    }
  },
  methods: {
    editReport (item) {
      console.log(item)
      this.messageInfo = item
      this.isEdit = true
      this.publishDialogVisible = true
      this.publishGradId = item.gradeId
      switch (item.reportState) {
        case 'EDIT':
          this.file = false
          break
        case 'SHOW':
          this.file = false
          break
        case 'END':
          this.file = true
          break
      }
      if (item.gradeCode && item.semesterCode) {
        this.gradeCode = item.gradeCode
        this.semesterCode = item.semesterCode
      } else {
        this.isGraduation = true
      }
    },
    onSearch () {
      api.queryEvaluateGradeReportList({schoolId: this.$route.params.schoolId, gradeId: this.gradeId}, (data) => {
        this.reportList = data
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
        })
        this.getStudentGraduateReportInfo()
      }, () => {})
    },
    getStudentGraduateReportInfo () {
      api.getStudentGraduateReportInfo({schoolId: this.$route.params.schoolId, gradeId: this.gradeId}, (data) => {
        if (data.graduateReportId !== null && data.graduateReportId !== undefined) {
          data.name = '高中毕业生综合素质评价报告'
          this.reportList.push(data)
        }
      }, (er) => {})
    },
    onPublish () {
      this.publishDialogVisible = true
    },
    onSetting () {
      this.lessonsDialogVisible = true
      api.getAchievementSetList({schoolId: this.$route.params.schoolId}, (data) => {
        if (data.length > 0) {
          this.lessonsList = data
        }
      }, () => {})
    },
    onPublishSave () {
      if (this.tools.isNull(this.publishGradId)) {
        this.warnMessage('请选择年级名称')
        return
      }
      if (this.isGraduation) {
        this.publishDialogVisible = false
        if (this.isEdit) {
          api.editGradeGraduateRepor({schoolId: this.$route.params.schoolId, gradeId: this.messageInfo.gradeId, graduateReportId: this.messageInfo.graduateReportId, reportState: this.file}, (data) => {
            this.successMessage('设置成功')
            this.onSearch()
          }, (er) => {
            this.responseError(er, '设置失败')
          })
        } else {
          api.addGraduateReport({gradeId: this.publishGradId, schoolId: this.$route.params.schoolId}, (data) => {
            this.successMessage('操作成功')
            this.publishGradId = null
            this.gradeCode = null
            this.semesterCode = null
            this.onSearch()
          }, (er) => {
            this.responseError(er, '操作失败')
          })
        }
      } else {
        if (this.tools.isNull(this.gradeCode)) {
          this.warnMessage('请选择年级等级')
          return
        }
        if (this.tools.isNull(this.semesterCode)) {
          this.warnMessage('请选择学期')
          return
        }
        this.publishDialogVisible = false
        if (this.isEdit) {
          api.editReport({schoolId: this.$route.params.schoolId, gradeId: this.publishGradId, gradeCode: this.gradeCode, semesterCode: this.semesterCode, reportState: this.file}, (data) => {
            this.successMessage('设置成功')
            this.onSearch()
          }, (er) => {
            this.responseError(er, '设置失败')
          })
        } else {
          api.addReport({schoolId: this.$route.params.schoolId, gradeId: this.publishGradId, gradeCode: this.gradeCode, semesterCode: this.semesterCode}, () => {
            this.successMessage('操作成功')
            this.publishGradId = null
            this.gradeCode = null
            this.semesterCode = null
            this.onSearch()
          }, (er) => {
            if (er.toUser) {
              this.errorMessage(er.message)
            } else {
              this.errorMessage('操作失败')
            }
          })
        }
      }
    },
    onAddLessons () {
      this.lessonsList.push({
        lessonId: null
      })
    },
    onDeleteLessons (index) {
      this.lessonsList.splice(index, 1)
    },
    onSettingLessons () {
      for (var i = 0; i < this.lessonsList.length; i++) {
        let item = this.lessonsList[i]
        console.log(item)
        if (this.tools.isNull(item.lessonId)) {
          this.warnMessage('请选择课程')
          return
        }
      }
      this.lessonsDialogVisible = false
      api.saveAchievementSetting({schoolId: this.schoolId, lessons: this.lessonsList}, (data) => {
        this.successMessage('保存成功')
      }, (er) => {
        if (er.toUser) {
          this.errorMessage(er.message)
        } else {
          this.errorMessage('保存失败')
        }
      })
    },
    importHistoryData (val) {
      this.classId = null
      this.gradeReportId = val
      schoolApi.getClassList({schoolId: this.schoolId, rowStart: 0, rowCount: 999, gradeId: this.gradeId}, list => {
        this.classes = list
        this.dialogVisible = true
      }, er => {
        this.responseError(er, '获取班级列表失败')
      })
    },
    fileChange (file) {
      this.excelFile = file.raw
    },
    saveImport () {
      this.importLoading = true
      api.uploadEvaluationExcel({schoolId: this.schoolId, classId: this.classId, gradeReportId: this.gradeReportId, file: this.excelFile}, data => {
        this.importLoading = false
        this.dialogVisible = false
        this.excelFile = null
        this.successMessage('导入成功')
      }, er => {
        // this.responseError(er, '导入失败')
        this.importLoading = false
        if (er.toUser) {
          this.warnAlert(er.message.replace(new RegExp('\\n', 'gm'), '<br/>'))
        }
      })
    },
    goSemester (item) {
      if (item.gradeCode && item.semesterCode) {
        this.$router.push({name: 'QualityEvaluationForReport', params: {gradeId: item.gradeId, gradeCode: item.gradeCode, semesterCode: item.semesterCode}})
      } else {
        this.$router.push({name: 'QualityEvaluationForGradeuate', params: {gradeId: item.gradeId}})
      }
    },
    onPublishReport () {
      this.publishDialogVisible = true
      this.isGraduation = true
      this.isEdit = false
    },
    importAcademicObligatory (val) {
      this.currentItem = val
      this.gradeReportId = val.gradeReportId
      this.syncDialogVisible = true
      if (this.gradeReportId) {
        schoolApi.getClassList({schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999, gradeId: this.gradeId, classType: 1}, (data) => {
          this.classOptions = []
          data.forEach((element) => {
            if (parseInt(element.classType) === 1) {
              var item = {
                value: element.classId,
                label: element.className
              }
              this.classOptions.push(item)
            }
          })
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('获取班级失败，请稍后重试')
          }
        })
      }
    },
    onImport () {
      if (this.tools.isNull(this.syncClassId)) {
        this.warnMessage('请选择班级')
        return
      }
      if (this.tools.isNull(this.typeYear)) {
        this.warnMessage('请选择年份')
        return
      }
      if (this.achievementList.length === 0) {
        this.warnMessage('此班没有可导入的成绩单')
        return
      }
      this.syncDialogVisible = false
      let achIds = []
      this.achievementList.forEach(element => {
        achIds.push(element.achievementsId)
      })
      // let message = JSON.parse(sessionStorage.getItem('message'))
      // let codes = message.code.split('-')
      // let gradeCode = ''
      // let semesterCode = ''
      // if (codes.length > 0) {
      //   gradeCode = codes[0]
      //   semesterCode = codes[1]
      // }
      api.importAcademicObligatory({schoolId: this.$route.params.schoolId, classId: this.syncClassId, gradeCode: this.currentItem.gradeCode, semesterCode: this.currentItem.semesterCode, achIds}, (data) => {
        this.successMessage('同步成功')
      }, (er) => {
        this.responseError(er, '同步失败')
      })
    },
    onSearchAchievementList () {
      if (this.tools.isNull(this.syncClassId)) {
        return
      }
      if (this.tools.isNull(this.typeYear)) {
        return
      }
      api.getAchievementFinalExamList({schoolId: this.$route.params.schoolId, classId: this.syncClassId, typeParam: this.typeParam, typeYear: this.typeYear}, (data) => {
        this.achievementList = data
      }, () => {})
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
.filter-wrap{
  .content-filter{
    margin-top: 5px;
    padding:0 20px;
    background: #fff;
  }
}
</style>

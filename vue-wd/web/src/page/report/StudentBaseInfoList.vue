<template>
  <div class="warpper">
    <div class="header">
      <span>学生基本信息列表</span>
      <span style="color: red;font-size: 12px;margin-left: 10px;">仅供普通高中毕业生综合素质评价报告使用</span>
      <div style="display: inline-block;float: right;padding: 10px">
        <!-- <el-button type="text">下载模版</el-button> -->
        <!-- <a href="../../../static/综合素质评价(基本信息).xlsx" class="link">下载模版</a> -->
        <el-button type="text" @click="importInfo">导入学生基本信息</el-button>
      </div>
    </div>
    <div style="margin-top: 10px;">
      <div style="padding: 10px;background-color: #fff;">
        <span style="margin-right: 15px">筛选条件:</span>
        <el-select style="margin-right: 15px" v-model="gradeId" clearable placeholder="请选择年级" @change="gradeChange" @clear="clearGradeId">
          <el-option
            v-for="item in grades"
            :key="item.gradeId"
            :label="item.gradeName"
            :value="item.gradeId">
          </el-option>
        </el-select>
        <el-select :disabled="gradeId == null" v-model="classId" clearable placeholder="请选择班级">
          <el-option
            v-for="item in classes"
            :key="item.classId"
            :label="item.className"
            :value="item.classId">
          </el-option>
        </el-select>
        <el-button style="margin-left: 20px;margin-right: 20px;" size="medium" type="primary" @click="filter()">查询</el-button>
      </div>
      <el-table :data="studentList" border :max-height="maxHeight">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="姓名" prop="name" align="center" min-width="50"></el-table-column>
        <el-table-column label="性别" prop="studentSex" align="center" min-width="50"></el-table-column>
        <el-table-column label="是否完善基本信息" align="center" min-width="50">
          <template slot-scope="scope">
            <span :style="{color: scope.row.studentName ? '' : '#f56c6c'}">{{scope.row.studentName ? '已完善' : '未完善'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="() => {editInfo(scope.row), addStudentInfoDialog = true}">编辑</el-button>
            <el-button size="mini" type="primary" @click="() => {editInfo(scope.row), lookStudentInfoDialog = true}">查看</el-button>
            <!-- <el-button size="mini" type="success" @click="changeInfo('edit', scope.row, scope.$index)">修改</el-button> -->
            <!-- <el-button size="mini" type="danger" @click="confirmDelete(scope.row.studentId, scope.$index, scope.row.studentName)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 导入学生基本信息弹窗 -->
    <el-dialog title="导入学生基本信息" :visible.sync="dialogTableVisible">
      <div style="padding: 0 0 20px 0">
        <p>说明: </p>
        <div style="text-indent: 3em;">
          <p>1. 请先<a href="http://img1.sq3q.com/report/%E7%BB%BC%E5%90%88%E7%B4%A0%E8%B4%A8%E8%AF%84%E4%BB%B7%28%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF%29.xlsx ">下载模版</a></p>
          <p>2. 按照模版格式录入素质评价记录</p>
          <p>3. 选择班级上传文件并完成导入</p>
          <p style="color: #f56c6c">注: 请保证上传文件的正确性。如班级内有重名学生，请保证与系统班级成员名称一致，导入成功后可将基本信息手动改回真实姓名</p>
        </div>
      </div>
      <div style="margin: 10px 0">
        <span>年级:</span>
        <el-select style="margin-left: 15px" v-model="importGradeId" clearable placeholder="请选择年级" @change="importGradeChange" @clear="clearImportGradeId">
          <el-option
            v-for="item in grades"
            :key="item.gradeId"
            :label="item.gradeName"
            :value="item.gradeId">
          </el-option>
        </el-select>
      </div>
      <div>
        <span>班级:</span>
        <el-select :disabled="importGradeId == null" style="margin-left: 15px" v-model="importClassId" clearable placeholder="请选择班级">
          <el-option
            v-for="item in classes"
            :key="item.classId"
            :label="item.className"
            :value="item.classId">
          </el-option>
        </el-select>
      </div>
      <div v-if="dialogTableVisible" style="margin: 20px 0 10px;">
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
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveImport" :loading="importLoading">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 添加学生基本信息弹窗 -->
    <el-dialog title="添加学生基本信息" :visible.sync="addStudentInfoDialog">
      <div style="overflow-y: scroll;height: 60vh;">
        <el-form :model="form" label-position="left">
          <el-form-item label="姓名" label-width="8em">
            <el-input v-model="form.studentName" auto-complete="off" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="性别"  label-width="8em">
            <el-input v-model="form.studentSex" auto-complete="off" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" label-width="8em">
            <el-date-picker
              v-model="form.studentBirthday"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="政治面貌" label-width="8em">
            <el-input v-model="form.political" auto-complete="off" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="民族" label-width="8em">
            <el-input v-model="form.nation" auto-complete="off" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="学籍号" label-width="8em">
            <el-input v-model="form.rollNo" auto-complete="off" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" label-width="8em">
            <el-input v-model="form.idCard" auto-complete="off" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="家庭住址" label-width="8em">
            <el-input v-model="form.homeAddress" auto-complete="off" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" label-width="8em">
            <el-input v-model="form.linkPhone" auto-complete="off" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="感兴趣的职业/专业(1)" label-width="8em">
            <el-input v-model="form.interest0" auto-complete="off" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="感兴趣的职业/专业(2)" label-width="8em">
            <el-input v-model="form.interest1" auto-complete="off" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="感兴趣的职业/专业(3)" label-width="8em">
            <el-input v-model="form.interest2" auto-complete="off" style="width: 50%"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStudentInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveEditInfo" :loading="editLoading">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 查看信息 -->
    <el-dialog title="查看学生基本信息" :visible.sync="lookStudentInfoDialog">
      <div style="overflow-y: scroll;height: 60vh;">
        <table cellspacing="20px">
          <tr>
            <td>姓名</td>
            <td>{{form.studentName}}</td>
          </tr>
          <tr>
            <td>性别</td>
            <td>{{form.studentSex}}</td>
          </tr>
          <tr>
            <td>出生日期</td>
            <td>{{tools.formateTime(form.studentBirthday, 'YYYY-MM-DD')}}</td>
          </tr>
          <tr>
            <td>政治面貌</td>
            <td>{{form.political}}</td>
          </tr>
          <tr>
            <td>民族</td>
            <td>{{form.nation}}</td>
          </tr>
          <tr>
            <td>学籍号</td>
            <td>{{form.rollNo}}</td>
          </tr>
          <tr>
            <td>身份证号</td>
            <td>{{form.idCard}}</td>
          </tr>
          <tr>
            <td>家庭住址</td>
            <td>{{form.homeAddress}}</td>
          </tr>
          <tr>
            <td>联系电话</td>
            <td>{{form.linkPhone}}</td>
          </tr>
          <tr>
            <td>感兴趣的职业/专业(1)</td>
            <td>{{form.interest0}}</td>
          </tr>
          <tr>
            <td>感兴趣的职业/专业(2)</td>
            <td>{{form.interest1}}</td>
          </tr>
          <tr>
            <td>感兴趣的职业/专业(3)</td>
            <td>{{form.interest2}}</td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lookStudentInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="() => {lookStudentInfoDialog = false, addStudentInfoDialog = true}">编 辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import gradeApi from '../grademanage/api.js'
import api from '../api.js'
import reportApi from './api.js'
export default {
  data () {
    return {
      gradeId: null,
      grades: [],
      classes: [],
      classId: null,
      maxHeight: document.body.clientHeight - 169,
      studentList: [],
      dialogTableVisible: false,
      importGradeId: null,
      importClassId: null,
      excelFile: null,
      importLoading: false,
      addStudentInfoDialog: false,
      form: {studentBirthday: null},
      editLoading: false,
      lookStudentInfoDialog: false
    }
  },
  computed: {
    schoolId () {
      return this.$route.params.schoolId
    }
  },
  mounted () {
    gradeApi.getGradeList({schoolId: this.schoolId}, list => {
      this.grades = list
    }, er => {
      this.responseError(er, '获取年级列表失败，请刷新页面')
    })
  },
  methods: {
    gradeChange (val) {
      this.classId = null
      this.getClassList(val)
    },
    importGradeChange (val) {
      this.importClassId = null
      this.getClassList(val)
    },
    clearGradeId () {
      this.gradeId = null
      this.classId = null
    },
    filter () {
      reportApi.queryStudentBaseList({schoolId: this.schoolId, classId: this.classId}, list => {
        this.studentList = list
      }, er => {
        this.responseError(er, '获取学生列表失败')
      })
    },
    importInfo () {
      this.dialogTableVisible = true
    },
    clearImportGradeId () {
      this.importGradeId = null
      this.importClassId = null
    },
    fileChange (file) {
      this.excelFile = file.raw
    },
    getClassList (val) {
      api.getClassList({schoolId: this.schoolId, rowStart: 0, rowCount: 999, gradeId: val}, list => {
        this.classes = list
      }, er => {
        this.responseError(er, '获取班级列表失败')
      })
    },
    saveImport () {
      if (!this.importClassId) {
        this.warnMessage('请选择班级')
        return
      }
      if (this.excelFile && (this.getFileType(this.excelFile.name) === 'xls' || this.getFileType(this.excelFile.name) === 'xlsx')) {
        this.importLoading = true
        reportApi.uploadStudentBaseInfoExcel({schoolId: this.schoolId, classId: this.importClassId, file: this.excelFile}, data => {
          this.importLoading = false
          this.dialogTableVisible = false
          this.successMessage('导入成功')
        }, er => {
          this.importLoading = false
          if (er && er.toUser) {
            this.warnAlert(er.message.replace(new RegExp('\\n', 'gm'), '<br/>'))
            return
          }
          this.warnMessage('请检查表格')
        })
      } else {
        this.warnMessage('请确认是否上传文件，并且验证文件是否为Excel文件')
      }
    },
    editInfo (val) {
      this.form = val
      this.form.studentBirthday = val.studentBirthday ? this.tools.formateTime(new Date(val.studentBirthday), 'YYYY-MM-DD') : null
      if (val.interest) {
        let interests = val.interest.split('|')
        for (let index = 0; index < interests.length; index++) {
          const element = interests[index]
          this.form['interest' + index] = element
        }
      }
      delete this.form.interest
    },
    saveEditInfo () {
      console.log(this.form)
      this.editLoading = true
      reportApi.saveBaseInfo(this.form, data => {
        this.editLoading = false
        this.addStudentInfoDialog = false
        this.successMessage('修改成功')
      }, er => {
        this.editLoading = false
        if (er && er.toUser) {
          this.responseError(er)
          return
        }
        this.warnMessage('修改失败')
      })
    }
  },
  filters: {
    filterSex (sex) {
      if (parseInt(sex) === 1) {
        return '男'
      } else if (parseInt(sex) === 2) {
        return '女'
      } else {
        return '无'
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
.link {
  font-size: 14px;
  color: #409eff;
  margin-right: 20px;
  &:hover {
    color: #66b1ff
  }
}
</style>


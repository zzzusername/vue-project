<template>
  <div>
    <el-button size="mini" type="success" @click="onAdd" style="float:right;margin:10px 20px 10px 0;" icon="el-icon-plus">添加</el-button>
    <div>
      <el-table  :data="list" border :max-height="maxHeight">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="参加体育比赛项目" prop="healthProjectName" align="center" min-width="70"></el-table-column>
        <el-table-column label="级别" align="center" min-width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.healthProjectRank == 'NATION'">国家</span>
            <span v-if="scope.row.healthProjectRank == 'PROVINCE'">省</span>
            <span v-if="scope.row.healthProjectRank == 'CITY'">市</span>
            <span v-if="scope.row.healthProjectRank == 'COUNTY'">区</span>
            <span v-if="scope.row.healthProjectRank == 'SCHOOL'">学校</span>
          </template>
        </el-table-column>
        <el-table-column label="主办单位" prop="holdUnit" align="center" min-width="50"></el-table-column>
        <el-table-column label="时间" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{tools.formateTime(scope.row.healthDate, 'YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="名次或等第" prop="healthProjectPlace" align="center" min-width="50"></el-table-column>
        <el-table-column label="审核人" prop="teacherName" align="center" min-width="50"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="onEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title='添加比赛项目' :visible.sync="dialogVisible">
      <el-form ref="form" :model="form">
        <el-form-item label="体育比赛项目" label-width="100px">
          <el-input style="width:50%" v-model="form.healthProjectName"></el-input>
        </el-form-item>
        <el-form-item label="级别" label-width="100px">
          <el-select v-model="form.healthProjectRank" placeholder="请选择" style="width:50%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主办单位" label-width="100px">
          <el-input style="width:50%" v-model="form.holdUnit"></el-input>
        </el-form-item>
        <el-form-item label="时间" label-width="100px">
          <el-date-picker v-model="form.healthDate" type="date" placeholder="选择日期" style="width:50%;" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="名次或等第" label-width="100px">
          <el-input v-model="form.healthProjectPlace" style="width:50%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSave">立即保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../api.js'
export default {
  data () {
    return {
      maxHeight: document.body.clientHeight - 230 - 69,
      dialogVisible: false,
      form: {},
      list: [],
      options: [{
        value: 'NATION',
        label: '国家'
      }, {
        value: 'PROVINCE',
        label: '省'
      }, {
        value: 'CITY',
        label: '市'
      }, {
        value: 'COUNTY',
        label: '区'
      }, {
        value: 'SCHOOL',
        label: '学校'
      }]
    }
  },
  mounted () {
    this.onRefresh()
  },
  methods: {
    onRefresh () {
      api.getHealthProjectList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId}, (data) => {
        this.list = data
      }, (er) => {})
    },
    onAdd () {
      this.form = {}
      this.dialogVisible = true
    },
    onSave () {
      if (this.tools.isNull(this.form.healthProjectName)) {
        this.warnMessage('请填写体育比赛项目')
        return
      }
      if (this.tools.isNull(this.form.healthProjectRank)) {
        this.warnMessage('请选择比赛级别')
        return
      }
      if (this.tools.isNull(this.form.holdUnit)) {
        this.warnMessage('请填写主办单位')
        return
      }
      if (this.tools.isNull(this.form.healthDate)) {
        this.warnMessage('请选择时间')
        return
      }
      if (this.tools.isNull(this.form.healthProjectPlace)) {
        this.warnMessage('请填写名次或等第')
        return
      }
      this.dialogVisible = false
      this.form.approvalDate = null
      this.form.teacherName = null
      this.form.teacherId = null
      this.form.studentId = null
      this.form.schoolId = null
      this.form.reportId = null
      api.saveHealthProject({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, data: this.form}, () => {
        this.successMessage('保存成功')
        this.onRefresh()
      }, (er) => {
        this.responseError(er, '保存失败')
      })
    },
    onEdit (item) {
      api.getHealthProjectInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, projectId: item.healthProjectId}, (data) => {
        this.form = data
        this.form.healthDate = this.tools.formateTime(this.form.healthDate, 'YYYY-MM-DD')
        this.dialogVisible = true
      }, () => {})
    }
  }
}
</script>

<style>

</style>

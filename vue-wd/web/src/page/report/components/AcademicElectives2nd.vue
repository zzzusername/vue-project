<template>
  <div>
    <el-button size="mini" type="success" @click="onAdd" style="float:right;margin:10px 20px 10px 0;" icon="el-icon-plus">添加</el-button>
    <div>
      <el-table  :data="list" border :max-height="maxHeight">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="模块" prop="moduleName" align="center" min-width="50"></el-table-column>
        <el-table-column label="总学时" prop="period" align="center" min-width="50"></el-table-column>
        <el-table-column label="审核人" prop="teacherName" align="center" min-width="50"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="onEdit(scope.row)">编辑</el-button>
            <!-- <el-button size="mini" type="danger" >删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <el-form ref="form" :model="form">
        <el-form-item label="模块" label-width="100px">
          <el-input v-model="form.moduleName" style="width:40%"></el-input>
        </el-form-item>
        <el-form-item label="总学时" label-width="100px">
          <el-input v-model="form.period" style="width:40%"></el-input> 小时
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
      maxHeight: document.body.clientHeight - 230 - 117,
      dialogVisible: false,
      form: {},
      list: []
    }
  },
  mounted () {
    this.onRefresh()
  },
  methods: {
    onRefresh () {
      api.getElectiveTWOList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId}, (data) => {
        this.list = data
      }, () => {})
    },
    onAdd () {
      this.form = {}
      this.dialogVisible = true
    },
    onSave () {
      if (this.tools.isNull(this.form.moduleName)) {
        this.warnMessage('请填写模块')
        return
      }
      if (this.tools.isNull(this.form.period)) {
        this.warnMessage('请填写总学时')
        return
      }
      this.dialogVisible = false
      let data = {
        moduleName: this.form.moduleName,
        period: this.form.period,
        electiveId: this.form.electiveId
      }
      api.saveElectiveTWO({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, data}, (data) => {
        this.successMessage('保存成功')
        this.onRefresh()
      }, (er) => {
        this.responseError(er, '保存失败')
      })
    },
    onEdit (item) {
      api.getElectiveTWOInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, electiveId: item.electiveId}, (data) => {
        this.form = data
        this.dialogVisible = true
      }, () => {})
    }
  }
}
</script>

<style>

</style>

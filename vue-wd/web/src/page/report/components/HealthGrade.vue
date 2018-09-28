<template>
  <div>
    <!-- <el-button size="mini" type="success" @click="onAdd" style="float:right;margin:10px 20px 10px 0;" icon="el-icon-plus">添加</el-button> -->
    <div>
      <el-table  :data="list" border :max-height="maxHeight">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="运动员国家技术等级" prop="exerciseClass" align="center" min-width="50"></el-table-column>
        <el-table-column label="运动项目" prop="exerciseProject" align="center" min-width="50"></el-table-column>
        <el-table-column label="颁证单位" prop="awardUnit" align="center" min-width="50"></el-table-column>
        <el-table-column label="审核人" prop="teacherName" align="center" min-width="50"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="onEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title='编辑' :visible.sync="dialogVisible">
      <el-form ref="form" :model="form">
        <el-form-item label="运动员国家技术等级" label-width="140px">
          <el-input v-model="form.exerciseClass" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="运动项目" label-width="140px">
          <el-input v-model="form.exerciseProject" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="颁证单位" label-width="140px">
          <el-input v-model="form.awardUnit" style="width:50%"></el-input>
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
      list: [
        {}
      ]
    }
  },
  mounted () {
    this.onRefresh()
  },
  methods: {
    onRefresh () {
      api.getHealthAwardList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId}, (data) => {
        if (data.length > 0) {
          this.list = data
        }
      }, () => {})
    },
    onAdd () {
      this.dialogVisible = true
    },
    onEdit (item) {
      if (!this.tools.isNull(item.healthAwardId)) {
        api.getHealthAwardInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, awardId: item.healthAwardId}, (data) => {
          this.form = data
          this.dialogVisible = true
        }, () => {})
      } else {
        this.dialogVisible = true
      }
    },
    onSave () {
      if (this.tools.isNull(this.form.exerciseClass)) {
        this.warnMessage('请填写运动员国家技术等级')
        return
      }
      if (this.tools.isNull(this.form.exerciseProject)) {
        this.warnMessage('请填写运动项目')
        return
      }
      if (this.tools.isNull(this.form.awardUnit)) {
        this.warnMessage('请填写颁证单位')
        return
      }
      this.dialogVisible = false
      let data = {
        exerciseClass: this.form.exerciseClass,
        exerciseProject: this.form.exerciseProject,
        awardUnit: this.form.awardUnit,
        healthAwardId: this.form.healthAwardId
      }
      api.saveHealthAward({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, data}, (data) => {
        this.successMessage('保存成功')
        this.onRefresh()
      }, (er) => {
        this.responseError(er, '保存失败')
      })
    }
  }
}
</script>

<style>

</style>

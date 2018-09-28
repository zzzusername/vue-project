<template>
  <div>
    <div>
      <el-table  :data="list" border :max-height="maxHeight">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="分数" prop="standardScore" align="center" min-width="50"></el-table-column>
        <el-table-column label="是否坚持体育锻炼" align="center" min-width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.isExercise == null"></span>
            <span v-if="scope.row.isExercise == true">是</span>
            <span v-if="scope.row.isExercise == false">否</span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" prop="exerciseTeacherName" align="center" min-width="50"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="onEdit()">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title='添加' :visible.sync="dialogVisible">
      <el-form>
        <el-form-item label="分数" label-width="80px">
          <el-input style="width:200px;" v-model="standardScore"></el-input>
        </el-form-item>
        <el-form-item label="是否坚持体育锻炼">
          <div style="margin-left:20px;display:inline-block;">
            <el-radio v-model="isExercise" :label="true">是</el-radio>
            <el-radio v-model="isExercise" :label="false">否</el-radio>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onEditSave">立即保存</el-button>
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
      list: [],
      standardScore: null,
      isExercise: null
    }
  },
  mounted () {
    this.onRefresh()
  },
  methods: {
    onRefresh () {
      api.getStandardList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId}, (data) => {
        if (data.length === 0) {
          this.list.push(
            {
              standardScore: null,
              isExercise: null,
              healthStandardId: null
            }
          )
        } else {
          this.list = data
        }
      }, () => {})
    },
    onEdit () {
      this.dialogVisible = true
      if (!this.tools.isNull(this.list[0].healthStandardId)) {
        api.getStandardInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, standardId: this.list[0].healthStandardId}, (data) => {
          this.standardScore = data.standardScore
          this.isExercise = data.isExercise
        }, () => {})
      }
    },
    onEditSave () {
      if (this.standardScore > 0) {
      } else {
        this.warnMessage('分数错误，请重新输入')
        return
      }
      this.dialogVisible = false
      api.saveHealthStandard({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, standardScore: this.standardScore, isExercise: this.isExercise, healthStandardId: this.list[0].healthStandardId}, (data) => {
        this.successMessage('保存成功')
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

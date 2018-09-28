<template>
  <div>
    <el-button size="mini" type="success" @click="onAdd" style="float:right;margin:10px 20px 10px 0;" icon="el-icon-plus">添加</el-button>
    <div>
      <el-table  :data="list" border :max-height="maxHeight">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="项目" prop="competitionName" align="center" min-width="50"></el-table-column>
        <el-table-column label="级别" align="center" min-width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.competitionRank == 'INTERNATIONAL'">国际</span>
            <span v-if="scope.row.competitionRank == 'NATION'">国家</span>
            <span v-if="scope.row.competitionRank == 'PROVINCE'">省</span>
            <span v-if="scope.row.competitionRank == 'CITY'">市</span>
          </template>
        </el-table-column>
        <el-table-column label="主办单位" prop="holdUnit" align="center" min-width="50"></el-table-column>
        <el-table-column label="时间" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{tools.formateTime(scope.row.competitionDate, 'YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="名次或等第" prop="competitionPlace" align="center" min-width="50"></el-table-column>
        <el-table-column label="审核人" prop="teacherName" align="center" min-width="50"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="onEdit(scope.row)">编辑</el-button>
            <!-- <el-button size="mini" type="danger" >删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title='添加' :visible.sync="dialogVisible">
      <el-form ref="form" :model="form">
        <el-form-item label="项目" label-width="100px">
          <el-input v-model="form.competitionName" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="级别" label-width="100px">
          <el-select v-model="form.competitionRank" placeholder="请选择" style="width:50%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主办单位" label-width="100px">
          <el-input v-model="form.holdUnit" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="时间" label-width="100px">
          <el-date-picker v-model="form.competitionDate" type="date" placeholder="选择日期" style="width:50%;" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="名次或等第" label-width="100px">
          <el-input v-model="form.competitionPlace" style="width:50%"></el-input>
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
      options: [{
        value: 'INTERNATIONAL',
        label: '国际'
      }, {
        value: 'NATION',
        label: '国家'
      }, {
        value: 'PROVINCE',
        label: '省'
      }, {
        value: 'CITY',
        label: '市'
      }],
      list: []
    }
  },
  mounted () {
    this.onRefresh()
  },
  methods: {
    onRefresh () {
      api.getCompetitionList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId}, (data) => {
        this.list = data
      }, () => {})
    },
    onAdd () {
      this.form = {}
      this.dialogVisible = true
    },
    onSave () {
      if (this.tools.isNull(this.form.competitionName)) {
        this.warnMessage('请填写项目')
        return
      }
      if (this.tools.isNull(this.form.competitionRank)) {
        this.warnMessage('请选择级别')
        return
      }
      if (this.tools.isNull(this.form.holdUnit)) {
        this.warnMessage('请填写主办单位')
        return
      }
      if (this.tools.isNull(this.form.competitionDate)) {
        this.warnMessage('请选择时间')
        return
      }
      if (this.tools.isNull(this.form.competitionPlace)) {
        this.warnMessage('请填写名次或等第')
        return
      }
      this.dialogVisible = false
      let data = {
        competitionName: this.form.competitionName,
        competitionRank: this.form.competitionRank,
        competitionDate: this.form.competitionDate,
        holdUnit: this.form.holdUnit,
        competitionPlace: this.form.competitionPlace,
        competitionId: this.form.competitionId
      }
      api.saveCompetition({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, data}, (data) => {
        this.successMessage('保存成功')
        this.onRefresh()
      }, (er) => {
        this.responseError(er, '保存失败')
      })
    },
    onEdit (item) {
      this.form = item
      this.form.competitionDate = this.tools.formateTime(new Date(item.competitionDate), 'YYYY-MM-DD')
      this.dialogVisible = true
      // api.getCompetitionInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, competitionId: item.competitionId}, (data) => {
      //   this.form = data
      //   this.form.competitionDateTemp = this.tools.formateTime(this.form.competitionDate, 'YYYY-MM-DD')
      //   this.dialogVisible = true
      // }, () => {})
    }
  }
}
</script>

<style>

</style>

<template>
  <div>
    <p style="line-height:40px;">
      <span>是否有犯罪记录：</span>
      <span>{{list.length > 0 ? '是' : '否'}}</span>
      <el-button size="mini" class="edit-button" type="success" icon="el-icon-plus" @click="addCrime">新增</el-button>
    </p>
    <div>
      <el-table :data="list" border :max-height="maxHeight">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="犯罪内容" prop="crimeContent" align="center" min-width="50"></el-table-column>
        <el-table-column label="犯罪时间" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{ tools.formateTime(new Date(scope.row.crimeDate), 'YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" prop="teacherName" align="center" min-width="50"></el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editCrime(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="delCrime(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="犯罪记录" :visible.sync="showIsCrime">
      <el-form :model="form" label-position="left">
        <el-form-item label="犯罪内容" label-width="8em">
            <el-input v-model="form.crimeContent" auto-complete="off" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="犯罪时间" label-width="8em">
            <el-date-picker
              v-model="form.crimeDate"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showIsCrime = false">取消</el-button>
        <el-button type="primary" @click="saveViolation" :loading="saveLoading">立即保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import reportApi from '../api.js'
export default {
  data () {
    return {
      isCrime: null,
      showIsCrime: false,
      list: [],
      maxHeight: document.body.clientHeight - 338,
      form: {},
      saveLoading: false
    }
  },
  computed: {
    schoolId () {
      return this.$route.params.schoolId
    },
    classId () {
      return this.$route.params.classId
    },
    studentId () {
      return this.$route.params.studentId
    },
    reportId () {
      return this.$route.params.reportId
    }
  },
  mounted () {
    this.getCrimeList()
    this.initForm()
  },
  methods: {
    initForm () {
      this.form = {
        schoolId: this.schoolId,
        classId: this.classId,
        studentId: this.studentId,
        reportId: this.reportId,
        approvalStatus: 'SUCCESS'
      }
    },
    saveViolation () {
      if (!this.form.crimeContent) {
        this.warnMessage('请输入犯罪内容')
        return
      }
      if (!this.form.crimeDate) {
        this.warnMessage('请输入犯罪时间')
        return
      }
      this.saveLoading = true
      reportApi.saveCrime(this.form, data => {
        this.saveLoading = false
        this.showIsCrime = false
        this.initForm()
        this.getCrimeList()
        this.successMessage('保存成功')
      }, er => {
        this.saveLoading = false
        this.responseError(er)
      })
    },
    editCrime (val) {
      this.form = val
      this.form.classId = this.classId
      this.form.crimeDate = this.tools.formateTime(new Date(val.crimeDate), 'YYYY-MM-DD')
      delete this.form.teacherName
      delete this.form.teacherId
      delete this.form.approvalDate
      this.showIsCrime = true
    },
    addCrime () {
      this.initForm()
      this.showIsCrime = true
    },
    delCrime (val) {
      this.warnConfirm('提示', '您确定删除「' + val.crimeContent + '」这条犯罪记录吗?', () => {
        reportApi.delCrime({schoolId: this.schoolId, classId: this.classId, studentId: this.studentId, crimeId: val.crimeId, reportId: this.reportId}, data => {
          this.successMessage('删除成功')
          this.getCrimeList()
        }, er => {
          this.responseError(er)
        })
      })
    },
    getCrimeList () {
      reportApi.getCrimeList({schoolId: this.schoolId, studentId: this.studentId, classId: this.classId, reportId: this.reportId}, data => {
        this.list = data
      }, er => {
        if (er && er.toUser) {
          this.responseError(er, '获取犯罪信息失败')
          return
        }
        this.warnMessage('获取犯罪信息失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.edit-button {
  float:right;
  margin:6px 20px 0 0;
}
</style>


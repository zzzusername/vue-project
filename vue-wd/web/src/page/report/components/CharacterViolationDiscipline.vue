<template>
  <div>
    <div style="line-height: 28px; margin: 5px 0;">
      <span style="font-size:14px;font-weight:500;">共{{violationList.length}}个违纪违规记录</span>
      <el-button size="mini" type="success" style="float:right;margin-right:20px;" icon="el-icon-plus" @click="addNewViolation">新增</el-button>
    </div>
    <el-table :data="violationList" border empty-text="暂无数据" :max-height="maxHeight">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column label="违纪违规项目" prop="violationName" align="center" min-width="50"></el-table-column>
      <el-table-column label="处罚类别" prop="violationCategory" min-width="50" align="center"></el-table-column>
      <el-table-column label="处罚时间" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{tools.formateTime(new Date(scope.row.violationDate), 'YYYY-MM-DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" prop="teacherName" min-width="50" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editViolation(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delViolation(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :model="violation" title="违纪违规项目" :visible.sync="showViolation">
      <el-form label-width="100px">
        <el-form-item label="违纪违规名称">
          <el-input v-model="violation.violationName" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="处罚类别">
            <el-input v-model="violation.violationCategory" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="处罚时间">
          <el-date-picker 
          v-model="violation.violationDate"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showViolation = false">取消</el-button>
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
      maxHeight: document.body.clientHeight - 338,
      showViolation: false,
      violation: {},
      violationList: [],
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
    this.initViolation()
    this.getViolationList()
  },
  methods: {
    initViolation () {
      this.violation = {
        schoolId: this.schoolId,
        classId: this.classId,
        studentId: this.studentId,
        reportId: this.reportId,
        approvalStatus: 'SUCCESS'
      }
    },
    addNewViolation () {
      this.initViolation()
      this.showViolation = true
    },
    editViolation (val) {
      this.violation = val
      this.violation.classId = this.classId
      this.violation.violationDate = this.tools.formateTime(new Date(val.violationDate), 'YYYY-MM-DD')
      delete this.violation.teacherName
      delete this.violation.teacherId
      delete this.violation.approvalDate
      this.showViolation = true
    },
    saveViolation () {
      if (!this.violation.violationName) {
        this.warnMessage('请输入违纪违规名称')
        return
      }
      if (!this.violation.violationCategory) {
        this.warnMessage('请输入处罚类别')
        return
      }
      if (!this.violation.violationDate) {
        this.warnMessage('请输入处罚时间')
        return
      }
      this.saveLoading = true
      reportApi.saveViolation(this.violation, data => {
        this.showViolation = false
        this.saveLoading = false
        this.successMessage('保存成功')
        this.getViolationList()
      }, er => {
        this.saveLoading = false
        this.responseError(er, '保存违纪违规项目失败')
      })
    },
    delViolation (val) {
      this.warnConfirm('提示', '您确定删除「' + val.violationName + '」这条犯罪记录吗?', () => {
        reportApi.delViolation({schoolId: this.schoolId, classId: this.classId, studentId: this.studentId, violationId: val.violationId, reportId: this.reportId}, data => {
          this.successMessage('删除成功')
          this.getViolationList()
        }, er => {
          this.responseError(er)
        })
      })
    },
    getViolationList () {
      reportApi.getViolationList({schoolId: this.schoolId, studentId: this.studentId, classId: this.classId, reportId: this.reportId}, data => {
        console.log(data)
        this.violationList = data
      }, er => {
        this.responseError(er, '获取违纪违规信息失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>


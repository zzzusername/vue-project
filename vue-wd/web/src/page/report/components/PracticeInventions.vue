<template>
  <div>
    <div style="line-height: 28px; margin: 5px 0;height: 28px;">
      <span style="font-size:14px;font-weight:500;" v-if="list.length > 0">共{{list.length}}个创造发明成果</span>
      <el-button size="mini" type="success" style="float:right;margin-right:20px;" icon="el-icon-plus" @click="addNewInventions">新增</el-button>
    </div>
    <el-table :data="list" border empty-text="暂无数据" :max-height="maxHeight">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column label="创造发明成果" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.practiceInventName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="专利类型" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.practiceInventType === 'FM' ? '发明' : scope.row.practiceInventType === 'SYXX' ? '实用新型' : '外观设计'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{tools.formateTime(scope.row.practiceDate, 'YYYY-MM-DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="专利号" prop="patentNumber" min-width="50" align="center"></el-table-column>
      <el-table-column label="审核人" prop="teacherName" min-width="50" align="center"></el-table-column>
      <el-table-column label="审核时间" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{tools.formateTime(scope.row.approvalDate, 'YYYY-MM-DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="50">
        <template slot-scope="scope">
          <span :style="{'color': scope.row.approvalStatus == 'SUCCESS' ? '#67C23A' : scope.row.approvalStatus == 'FAIL' ? '#F56C6C' : '#E6A23C'}">{{editStatus(scope.row.approvalStatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editInventions(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="科技创新、研究性学习成果" :visible.sync="showNewInventions" :close-on-click-modal="false" @close="closeDialog">
      <el-form label-width="100px">
        <el-form-item label="创造发明名称">
          <el-input v-model="practiceInventData.practiceInventName" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="专利类型">
          <el-radio v-model="practiceInventData.practiceInventType" :label="item.key" v-for="(item, index) in typeList" :key="index">{{item.name}}</el-radio>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="dateTime" type="date" placeholder="选择日期" style="width:50%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="专利号">
          <el-input v-model="practiceInventData.patentNumber" style="width:50%;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="saveInventions">{{isEdit ? '确认修改' : '立即保存'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../api.js'
export default {
  data () {
    return {
      typeList: [{key: 'FM', name: '发明'}, {key: 'SYXX', name: '实用新型'}, {key: 'WGSJ', name: '外观设计'}],
      list: [],
      maxHeight: document.body.clientHeight - 268 - 69,
      showNewInventions: false,
      practiceInventData: {
        practiceInventName: null,
        practiceInventType: null,
        practiceDate: null,
        patentNumber: null
      },
      dateTime: null,
      isEdit: false,
      approvalStatus: 'SUCCESS',
      practiceInventId: null,
      identity: null
    }
  },
  mounted () {
    if (this.$store.state.userInfo.userId) {
      this.identity = this.localStorage.getSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId)
      if (this.identity === 'TEACHER') {
        this.getInventList('TEACHER')
      } else if (this.identity === 'PARENT') {
        this.getInventList('PARENT')
      } else if (this.identity === 'STUDENT') {
        this.getInventList('STUDENT')
      }
    } else {
      this.$store.dispatch('getUserInfo', this.$route.params.schoolId).then(() => {
        this.identity = this.localStorage.getSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId)
        if (this.identity === 'TEACHER') {
          this.getInventList('TEACHER')
        } else if (this.identity === 'PARENT') {
          this.getInventList('PARENT')
        } else if (this.identity === 'STUDENT') {
          this.getInventList('STUDENT')
        }
      })
    }
  },
  watch: {
    studentInfo: {
      handler (newStudentInfo, old) {
        this.getInventList(this.identity)
      }
    }
  },
  computed: {
    studentInfo () {
      return this.$store.state.studentInfo
    }
  },
  methods: {
    getInventList (identity) {
      api.getInventList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId ? this.$route.params.studentId : this.studentInfo.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, identity: identity}, (data) => {
        this.list = data
      }, (er) => {
        this.responseError(er, '获取失败')
      })
    },
    addNewInventions () {
      this.showNewInventions = true
      this.isEdit = false
    },
    saveInventions () {
      if (!this.practiceInventData.practiceInventName) {
        this.warnMessage('请输入创造发明名称')
        return
      }
      if (!this.practiceInventData.practiceInventType) {
        this.warnMessage('请选择专利类型')
        return
      }
      if (!this.dateTime) {
        this.warnMessage('请输入选择时间')
        return
      }
      if (!this.practiceInventData.patentNumber) {
        this.warnMessage('请选择专利号')
        return
      }
      this.practiceInventData.practiceDate = this.tools.formateTime(this.dateTime, 'YYYY-MM-DD')
      api.saveInvent({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, studentId: this.$route.params.studentId, reportId: this.$route.params.reportId, approvalStatus: this.approvalStatus, practiceInventId: this.practiceInventId, practiceInventData: this.practiceInventData}, (data) => {
        this.successMessage(this.isEdit ? '修改成功' : '保存成功')
        this.getInventList()
        this.cancel()
      }, (er) => {
        this.responseError(er, this.isEdit ? '修改失败' : '保存失败')
      })
    },
    editInventions (item) {
      this.showNewInventions = true
      this.isEdit = true
      this.practiceInventData = {
        practiceInventName: item.practiceInventName,
        practiceInventType: item.practiceInventType,
        practiceDate: item.practiceDate,
        patentNumber: item.patentNumber
      }
      this.dateTime = item.practiceDate
      this.practiceInventId = item.practiceInventId
    },
    cancel () {
      this.showNewInventions = false
      this.practiceInventData = {
        practiceInventName: null,
        practiceInventType: null,
        practiceDate: null,
        patentNumber: null
      }
      this.dateTime = null
      this.practiceInventId = null
    },
    closeDialog () {
      this.cancel()
    },
    editStatus (val) {
      let content
      if (val) {
        switch (val) {
          case 'SUCCESS':
            content = '已审核'
            break
          case 'FAIL':
            content = '未通过'
            break
          default:
            content = '未审核'
        }
      } else {
        content = '无'
      }
      return content
    }
  }
}
</script>

<style lang="less" scoped>

</style>

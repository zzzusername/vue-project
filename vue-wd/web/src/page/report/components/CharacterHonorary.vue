<template>
  <div>
    <div style="line-height: 28px;height: 28px; margin: 5px 0;">
      <span style="font-size:14px;font-weight:500;" v-if="list.length > 0">共{{list.length}}个荣誉称号</span>
      <el-button size="mini" type="success" style="float:right;margin-right:20px;" icon="el-icon-plus" @click="addNewHonorary">新增</el-button>
    </div>
    <el-table :data="list" border empty-text="暂无数据" :max-height="maxHeight">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column label="先进个人荣誉称号" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.honorName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{tools.formateTime(scope.row.honorDate, 'YYYY-MM-DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="级别" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{identify(scope.row.honorRank)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="评选单位" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.evaluateUnit}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="50">
        <template slot-scope="scope">
          <span :style="{'color': scope.row.approvalStatus == 'SUCCESS' ? '#67C23A' : scope.row.approvalStatus == 'FAIL' ? '#F56C6C' : '#E6A23C'}" v-html="editStatus(scope.row.approvalStatus)"></span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" min-width="50" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.teacherName ? scope.row.teacherName : '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editHonoe(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="先进个人荣誉称号" :visible.sync="showHonorary" :close-on-click-modal="false" @close="closeDialog">
      <el-form label-width="80px">
        <el-form-item label="荣誉名称">
          <el-input v-model="honorData.honorName" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="获得时间">
          <el-date-picker v-model="dateTime" type="date" placeholder="选择日期" style="width:50%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="级别">
          <el-radio v-model="honorData.honorRank" :label="item.key" v-for="(item, index) in levelList" :key="index">{{item.name}}</el-radio>
        </el-form-item>
        <el-form-item label="评选单位">
          <el-input v-model="honorData.evaluateUnit" style="width:50%;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" plain @click="saveHonorary(1)" v-if="identity !== 'TEACHER'">仅保存</el-button>
        <el-button type="primary" @click="saveHonorary(2)" v-if="identity !== 'TEACHER'">{{isEdit ? '修改并提交' : '保存并提交'}}</el-button>
        <el-button type="primary" @click="saveHonorary(3)" v-else>{{isEdit ? '修改并保存' : '保存并提交'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '../api.js'
export default {
  data () {
    return {
      showHonorary: false,
      honorData: {
        honorName: null,
        honorDate: null,
        honorRank: null,
        evaluateUnit: null
      },
      dateTime: null,
      approvalStatus: 'SUCCESS',
      honorId: null,
      isEdit: false,
      levelList: [{key: 'PROVINCE', name: '省'}, {key: 'CITY', name: '市'}, {key: 'COUNTY', name: '区县'}, {key: 'SCHOOL', name: '学校'}],
      list: [],
      maxHeight: document.body.clientHeight - 268 - 69,
      identity: null
    }
  },
  mounted () {
    if (this.$store.state.userInfo.userId) {
      this.identity = this.localStorage.getSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId)
      if (this.identity === 'TEACHER') {
        this.getHonoraryList('TEACHER')
      } else if (this.identity === 'PARENT') {
        this.getHonoraryList('PARENT')
      } else if (this.identity === 'STUDENT') {
        this.getHonoraryList('STUDENT')
      }
    } else {
      this.$store.dispatch('getUserInfo', this.$route.params.schoolId).then(() => {
        this.identity = this.localStorage.getSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId)
        if (this.identity === 'TEACHER') {
          this.getHonoraryList('TEACHER')
        } else if (this.identity === 'PARENT') {
          this.getHonoraryList('PARENT')
        } else if (this.identity === 'STUDENT') {
          this.getHonoraryList('STUDENT')
        }
      })
    }
  },
  watch: {
    studentInfo: {
      handler (newStudentInfo, old) {
        this.getHonoraryList(this.identity)
      }
    }
  },
  computed: {
    studentInfo () {
      return this.$store.state.studentInfo
    }
  },
  methods: {
    getHonoraryList (identity) {
      api.getMoralHonorList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId ? this.$route.params.studentId : this.studentInfo.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, identity: identity}, (data) => {
        this.list = data
      }, (er) => {
        this.responseError(er, '获取失败')
      })
    },
    saveHonorary (key) {
      this.honorData.honorDate = this.tools.formateTime(this.dateTime, 'YYYY-MM-DD')
      if (key === 1) {
        this.approvalStatus = 'EDIT'
      } else if (key === 2) {
        this.approvalStatus = 'CHECK'
      } else if (key === 3) {
        this.approvalStatus = 'SUCCESS'
      }
      api.saveMoralHonor({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, studentId: this.$route.params.studentId ? this.$route.params.studentId : this.studentInfo.studentId, reportId: this.$route.params.reportId, approvalStatus: this.approvalStatus, honorId: this.honorId, honorData: this.honorData, identity: this.identity}, (data) => {
        this.successMessage(this.isEdit ? '修改成功' : '保存成功')
        this.getHonoraryList(this.identity)
        this.cancel()
      }, (er) => {
        this.responseError(er, '保存失败')
      })
    },
    addNewHonorary () {
      this.showHonorary = true
      this.isEdit = false
    },
    editHonoe (item) {
      this.showHonorary = true
      this.honorData = {
        honorName: item.honorName,
        honorDate: item.honorDate,
        honorRank: item.honorRank,
        evaluateUnit: item.evaluateUnit
      }
      this.dateTime = item.honorDate
      this.honorId = item.honorId
      this.isEdit = true
    },
    cancel () {
      this.showHonorary = false
      this.honorData = {
        honorName: null,
        honorDate: null,
        honorRank: null,
        evaluateUnit: null
      }
      this.dateTime = null
      this.honorId = null
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
          case 'CHECK':
            content = '待审核'
            break
          case 'EDIT':
            content = '未提交'
            break
          default:
            content = '未审核'
        }
      } else {
        content = '无'
      }
      return content
    },
    closeDialog () {
      this.cancel()
    },
    identify (code) {
      let honorName
      switch (code) {
        case 'PROVINCE':
          honorName = '省'
          break
        case 'CITY':
          honorName = '市'
          break
        case 'COUNTY':
          honorName = '区县'
          break
        case 'SCHOOL':
          honorName = '学校'
          break
      }
      return honorName
    }
  }
}
</script>

<style lang="less" scoped>

</style>


<template>
  <div>
    <div style="line-height: 28px; height: 28px;margin: 5px 0;">
      <span style="font-size:14px;font-weight:500;" v-if="list.length > 0">共{{list.length}}个参加学生艺术团队</span>
      <el-button size="mini" type="success" style="float:right;margin-right:20px;" icon="el-icon-plus" @click="addNewTeam">新增</el-button>
    </div>
    <el-table :data="list" border empty-text="暂无数据" :max-height="maxHeight">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column label="参加艺术团队名称" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.artActivityName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织单位" prop="organizationUnit" min-width="50" align="center"></el-table-column>
      <el-table-column label="开始时间" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{tools.formateTime(scope.row.startDate, 'YYYY-MM-DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{tools.formateTime(scope.row.endDate, 'YYYY-MM-DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核情况" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.assess === 'EXCELLENT' ? '优秀' : '合格'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.teacherName ? scope.row.teacherName : '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="50">
        <template slot-scope="scope">
          <span :style="{'color': scope.row.approvalStatus == 'SUCCESS' ? '#67C23A' : scope.row.approvalStatus == 'FAIL' ? '#F56C6C' : '#E6A23C'}">{{editStatus(scope.row.approvalStatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.approvalDate ? tools.formateTime(scope.row.approvalDate, 'YYYY-MM-DD') : '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click.native="editGroupActivity(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="参加艺术活动项目" :visible.sync="showNewArtTeam" :close-on-click-modal="false" @close="closeDialog">
      <el-form label-width="130px">
        <el-form-item label="艺术团队名称">
          <el-input v-model="groupActivity.artActivityName" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="主办单位">
          <el-input v-model="groupActivity.organizationUnit" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker style="width:50%;" v-model="startDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker style="width:50%;" v-model="endDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="考核情况">
            <el-radio v-model="groupActivity.assess" label="EXCELLENT">优秀</el-radio>
            <el-radio v-model="groupActivity.assess" label="QUALIFIED">合格</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" plain @click="saveArtTeam(1)" v-if="identity !== 'TEACHER'">仅保存</el-button>
        <el-button type="primary" @click="saveArtTeam(2)" v-if="identity !== 'TEACHER'">{{isEdit ? '修改并提交' : '保存并提交'}}</el-button>
        <el-button type="primary" @click="saveArtTeam(3)" v-else>{{isEdit ? '修改并保存' : '保存并提交'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../api.js'
export default {
  data () {
    return {
      maxHeight: document.body.clientHeight - 268 - 69,
      groupActivity: {
        artActivityName: null,
        organizationUnit: null,
        startDate: null,
        endDate: null,
        assess: null
      },
      levelList: [{key: 'NATION', name: '国家'}, {key: 'PROVINCE', name: '省'}, {key: 'CITY', name: '市'}, {key: 'COUNTY', name: '区县'}, {key: 'SCHOOL', name: '学校'}],
      showNewArtTeam: false,
      isEdit: false,
      startDate: null,
      endDate: null,
      approvalStatus: 'SUCCESS',
      artActivityId: null,
      list: [],
      identity: null
    }
  },
  mounted () {
    if (this.$store.state.userInfo.userId) {
      this.identity = this.localStorage.getSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId)
      if (this.identity === 'TEACHER') {
        this.groupActivityList('TEACHER')
      } else if (this.identity === 'PARENT') {
        this.groupActivityList('PARENT')
      } else if (this.identity === 'STUDENT') {
        this.groupActivityList('STUDENT')
      }
    } else {
      this.$store.dispatch('getUserInfo', this.$route.params.schoolId).then(() => {
        this.identity = this.localStorage.getSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId)
        if (this.identity === 'TEACHER') {
          this.groupActivityList('TEACHER')
        } else if (this.identity === 'PARENT') {
          this.groupActivityList('PARENT')
        } else if (this.identity === 'STUDENT') {
          this.groupActivityList('STUDENT')
        }
      })
    }
  },
  watch: {
    studentInfo: {
      handler (newStudentInfo, old) {
        this.groupActivityList(this.identity)
      }
    }
  },
  computed: {
    studentInfo () {
      return this.$store.state.studentInfo
    }
  },
  methods: {
    groupActivityList (identity) {
      api.queryArtGroupActivityList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId ? this.$route.params.studentId : this.studentInfo.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, identity: identity}, (data) => {
        this.list = data
      }, (er) => {
        this.responseError(er, '获取失败')
      })
    },
    addNewTeam () {
      this.isEdit = false
      this.showNewArtTeam = true
    },
    saveArtTeam (key) {
      if (!this.groupActivity.artActivityName) {
        this.warnMessage('请输入艺术团队名称')
        return
      }
      if (!this.groupActivity.organizationUnit) {
        this.warnMessage('请输入主办单位')
        return
      }
      if (!this.startDate) {
        this.warnMessage('请选择开始时间')
        return
      }
      if (!this.endDate) {
        this.warnMessage('请选择结束时间')
        return
      }
      if (!this.groupActivity.assess) {
        this.warnMessage('请选择考核情况')
        return
      }
      if (key === 1) {
        this.approvalStatus = 'EDIT'
      } else if (key === 2) {
        this.approvalStatus = 'CHECK'
      } else if (key === 3) {
        this.approvalStatus = 'SUCCESS'
      }
      this.groupActivity.startDate = this.tools.formateTime(this.startDate, 'YYYY-MM-DD')
      this.groupActivity.endDate = this.tools.formateTime(this.endDate, 'YYYY-MM-DD')
      if (this.identity === 'TEACHER') {
        this.teacherEdit()
      } else if (this.identity === 'PARENT' || this.identity === 'STUDENT') {
        this.studentParentGroup()
      }
    },
    studentParentGroup () {
      api.studentParentGroup({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId ? this.$route.params.studentId : this.studentInfo.studentId, reportId: this.$route.params.reportId, approvalStatus: this.approvalStatus, artActivityId: this.artActivityId, groupActivity: this.groupActivity, identity: this.identity}, (data) => {
        this.successMessage(this.isEdit ? '修改成功' : '保存成功')
        this.cancel()
        this.groupActivityList(this.identity)
      }, (er) => {
        this.responseError(er, this.isEdit ? '修改成功' : '保存成功')
      })
    },
    teacherEdit () {
      if (this.isEdit) {
        api.editArtGroupActivity({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, studentId: this.$route.params.studentId ? this.$route.params.studentId : this.studentInfo.studentId, reportId: this.$route.params.reportId, approvalStatus: this.approvalStatus, artActivityId: this.artActivityId, groupActivity: this.groupActivity}, (data) => {
          this.successMessage('修改成功')
          this.groupActivityList(this.identity)
          this.cancel()
        }, (er) => {
          this.responseError(er, '修改失败')
        })
      } else {
        api.addArtGroupActivity({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, studentId: this.$route.params.studentId ? this.$route.params.studentId : this.studentInfo.studentId, reportId: this.$route.params.reportId, approvalStatus: this.approvalStatus, groupActivity: this.groupActivity}, (data) => {
          this.successMessage('保存成功')
          this.groupActivityList(this.identity)
          this.cancel()
        }, (er) => {
          this.responseError(er, '保存失败')
        })
      }
    },
    editGroupActivity (index, item) {
      this.isEdit = true
      this.groupActivity = {
        artActivityName: item.artActivityName,
        organizationUnit: item.organizationUnit,
        startDate: item.startDate,
        endDate: item.endDate,
        assess: item.assess
      }
      this.startDate = item.startDate
      this.endDate = item.endDate
      this.artActivityId = item.artActivityId
      this.showNewArtTeam = true
    },
    cancel () {
      this.showNewArtTeam = false
      this.startDate = null
      this.endDate = null
      this.groupActivity = {
        artActivityName: null,
        organizationUnit: null,
        startDate: null,
        endDate: null,
        assess: null
      }
      this.artActivityId = null
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
    }
  }
}
</script>

<style lang="less" scoped>

</style>


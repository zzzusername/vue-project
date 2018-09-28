<template>
  <div>
    <div style="line-height: 28px;height:28px; margin: 5px 0;">
      <span style="font-size:14px;font-weight:500;" v-if="list.length > 0">共{{list.length}}个艺术活动项目</span>
      <el-button size="mini" type="success" style="float:right;margin-right:20px;" icon="el-icon-plus" @click="addNewActivity">新增</el-button>
    </div>
    <el-table :data="list" border empty-text="暂无数据" :max-height="maxHeight">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column label="艺术活动名称" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.artActivityName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="级别" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{artActivityRank(scope.row.artActivityRank)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="主办单位" prop="holdUnit" min-width="50" align="center"></el-table-column>
      <el-table-column label="名次或等第" prop="artPlace" min-width="50" align="center"></el-table-column>
      <el-table-column label="时间" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{tools.formateTime(scope.row.activityDate, 'YYYY-MM-DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.teacherName ? scope.row.teacherName : '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批时间" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.approvalDate ? tools.formateTime(scope.row.approvalDate, 'YYYY-MM-DD') : '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="50">
        <template slot-scope="scope">
          <span :style="{'color': scope.row.approvalStatus == 'SUCCESS' ? '#67C23A' : scope.row.approvalStatus == 'FAIL' ? '#F56C6C' : '#E6A23C'}">{{editStatus(scope.row.approvalStatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click.native="editArtActivity(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="参加艺术活动项目" :visible.sync="showNewArtActivity" :close-on-click-modal="false" @close="closeDialog">
      <el-form label-width="130px">
        <el-form-item label="艺术活动项目名称">
          <el-input v-model="artActivity.artActivityName" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="级别">
          <el-radio v-model="artActivity.artActivityRank" :label="item.key" v-for="(item, index) in levelList" :key="index">{{item.name}}</el-radio>
        </el-form-item>
        <el-form-item label="主办单位">
          <el-input v-model="artActivity.holdUnit" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker style="width:50%;" v-model="dateTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="名次或等第">
          <el-input v-model="artActivity.artPlace" style="width:50%;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" plain @click="saveArtActivity(1)" v-if="identity !== 'TEACHER'">仅保存</el-button>
        <el-button type="primary" @click="saveArtActivity(2)" v-if="identity !== 'TEACHER'">{{isEdit ? '修改并提交' : '保存并提交'}}</el-button>
        <el-button type="primary" @click="saveArtActivity(3)" v-else>{{isEdit ? '修改并保存' : '保存并提交'}}</el-button>
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
      artActivity: {
        artActivityName: null,
        artActivityRank: null,
        holdUnit: null,
        artPlace: null,
        activityDate: null
      },
      dateTime: null,
      approvalStatus: 'SUCCESS',
      levelList: [{key: 'NATION', name: '国家'}, {key: 'PROVINCE', name: '省'}, {key: 'CITY', name: '市'}, {key: 'COUNTY', name: '区县'}, {key: 'SCHOOL', name: '学校'}],
      showNewArtActivity: false,
      list: [],
      isEdit: false,
      artActivityId: null,
      identity: null
    }
  },
  mounted () {
    if (this.$store.state.userInfo.userId) {
      this.identity = this.localStorage.getSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId)
      if (this.identity === 'TEACHER') {
        this.getList('TEACHER')
      } else if (this.identity === 'PARENT') {
        this.getList('PARENT')
      } else if (this.identity === 'STUDENT') {
        this.getList('STUDENT')
      }
    } else {
      this.$store.dispatch('getUserInfo', this.$route.params.schoolId).then(() => {
        this.identity = this.localStorage.getSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId)
        if (this.identity === 'TEACHER') {
          this.getList('TEACHER')
        } else if (this.identity === 'PARENT') {
          this.getList('PARENT')
        } else if (this.identity === 'STUDENT') {
          this.getList('STUDENT')
        }
      })
    }
  },
  watch: {
    studentInfo: {
      handler (newStudentInfo, old) {
        this.getList(this.identity)
      }
    }
  },
  computed: {
    studentInfo () {
      return this.$store.state.studentInfo
    }
  },
  methods: {
    getList (identity) {
      api.queryArtActivityList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId ? this.$route.params.studentId : this.studentInfo.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, identity: identity}, (data) => {
        this.list = data
      }, (er) => {})
    },
    addNewActivity () {
      this.isEdit = false
      this.showNewArtActivity = true
    },
    saveArtActivity (key) {
      if (!this.artActivity.artActivityName) {
        this.warnMessage('请输入艺术活动项目名称')
        return
      }
      if (!this.artActivity.artActivityRank) {
        this.warnMessage('请选择级别')
        return
      }
      if (!this.artActivity.holdUnit) {
        this.warnMessage('请填写主办单位')
        return
      }
      if (!this.dateTime) {
        this.warnMessage('请输入选择时间')
        return
      }
      if (!this.artActivity.artPlace) {
        this.warnMessage('请输入名次或等第')
        return
      }
      this.artActivity.activityDate = this.tools.formateTime(this.dateTime, 'YYYY-MM-DD')
      if (key === 1) {
        this.approvalStatus = 'EDIT'
      } else if (key === 2) {
        this.approvalStatus = 'CHECK'
      } else if (key === 3) {
        this.approvalStatus = 'SUCCESS'
      }
      if (this.identity === 'TEACHER') {
        this.teacherSavedit()
      } else if (this.identity === 'PARENT' || this.identity === 'STUDENT') {
        this.studentParentSaveEdit()
      }
    },
    studentParentSaveEdit () {
      api.studentParentEditArtActivity({schoolId: this.$route.params.schoolId, studentId: this.studentInfo.studentId, reportId: this.$route.params.reportId, artActivityId: this.artActivityId, approvalStatus: this.approvalStatus, activityData: this.artActivity, identity: this.identity}, (data) => {
        this.successMessage(this.isEdit ? '修改成功' : '保存成功')
        this.cancel()
        this.getList(this.identity)
      }, (er) => {
        this.responseError(er, this.isEdit ? '修改成功' : '保存成功')
      })
    },
    teacherSavedit () {
      if (this.isEdit) {
        api.editArtActivity({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, studentId: this.$route.params.studentId, reportId: this.$route.params.reportId, approvalStatus: this.approvalStatus, artActivityId: this.artActivityId, activityData: this.artActivity}, (data) => {
          this.successMessage('修改成功')
          this.cancel()
          this.getList(this.identity)
        }, (er) => {
          this.responseError(er, '修改失败')
        })
      } else {
        api.addArtActivity({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, studentId: this.$route.params.studentId, reportId: this.$route.params.reportId, approvalStatus: this.approvalStatus, activityData: this.artActivity}, (data) => {
          this.successMessage('保存成功')
          this.cancel()
          this.getList(this.identity)
        }, (er) => {
          this.responseError(er, '保存失败')
        })
      }
    },
    editArtActivity (index, item) {
      this.artActivity = {
        artActivityName: item.artActivityName,
        artActivityRank: item.artActivityRank,
        holdUnit: item.holdUnit,
        artPlace: item.artPlace,
        activityDate: null
      }
      this.artActivityId = item.artActivityId
      this.dateTime = item.activityDate
      this.showNewArtActivity = true
      this.isEdit = true
    },
    cancel () {
      this.showNewArtActivity = false
      this.dateTime = null
      this.artActivity = {
        artActivityName: null,
        artActivityRank: null,
        holdUnit: null,
        artPlace: null,
        activityDate: null
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
    },
    artActivityRank (rank) {
      let rankName
      switch (rank) {
        case 'NATION':
          rankName = '国家'
          break
        case 'PROVINCE':
          rankName = '省'
          break
        case 'CITY':
          rankName = '市'
          break
        case 'COUNTY':
          rankName = '区县'
          break
        case 'SCHOOL':
          rankName = '学校'
          break
      }
      return rankName
    }
  }
}
</script>

<style lang="less" scoped>

</style>


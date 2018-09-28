<template>
  <div class="activity-wrap">
    <div :style="{'max-height': maxHeight, 'overflow-y': 'auto'}">
      <div class="activity-project">
        <p class="title-activity">
          <el-row>
            <el-col :span="3"><span class="small-title">党团活动</span></el-col>
            <el-col :span="5"><span class="small-title">累计次数（次）：{{partyActivity.length}}</span></el-col>
            <el-col :span="5"><span class="small-title">累计时间（小时）：{{timeLength(partyActivity)}}</span></el-col>
            <el-col :span="11"><span class="small-title add-button" @click="addActivity('1')"><i class="iconfont icon-xinzeng" style="font-size:14px;margin-right:10px;"></i>新增</span></el-col>
          </el-row>
        </p>
        <div class="item-list">
          <ul v-if="partyActivity.length > 0">
            <li v-for="(item, index) in partyActivity" :key="index">
              <span class="name-width">{{item.moralActivityName}}</span>
              <span class="name-width">{{tools.formateTime(item.activityDate, 'YYYY-MM-DD')}}</span>
              <span style="float:right;color:#409EFF;cursor: pointer;" @click="editData('1', index, item)">编辑</span>
              <span :style="{'float': 'right', 'color': item.approvalStatus == 'SUCCESS' ? '#67C23A' : item.approvalStatus == 'FAIL' ? '#F56C6C' : '#E6A23C'}">{{editStatus(item.approvalStatus)}}</span>
            </li>
          </ul>
          <p v-else style="padding: 0 0 0 10px;font-size: 14px;line-height: 35px;">暂无党团活动～</p>
        </div>
      </div>
      <div class="activity-project">
        <p class="title-activity">
          <el-row>
            <el-col :span="3"><span class="small-title">社团活动</span></el-col>
            <el-col :span="5"><span class="small-title">累计次数（次）：{{association.length}}</span></el-col>
            <el-col :span="5"><span class="small-title">累计时间（小时）：{{timeLength(association)}}</span></el-col>
            <el-col :span="11"><span class="small-title add-button" @click="addActivity('2')"><i class="iconfont icon-xinzeng" style="font-size:14px;margin-right:10px;"></i>新增</span></el-col>
          </el-row>
        </p>
        <div class="item-list">
          <ul v-if="association.length > 0">
            <li v-for="(item, index) in association" :key="index">
              <span class="name-width">{{item.moralActivityName}}</span>
              <span class="name-width">{{tools.formateTime(item.activityDate, 'YYYY-MM-DD')}}</span>
              <span style="float:right;color:#409EFF;cursor: pointer;" @click="editData('2', index, item)">编辑</span>
              <span :style="{'float': 'right', 'color': item.approvalStatus == 'SUCCESS' ? '#67C23A' : item.approvalStatus == 'FAIL' ? '#F56C6C' : '#E6A23C'}">{{editStatus(item.approvalStatus)}}</span>
            </li>
          </ul>
          <p v-else style="padding: 0 0 0 10px;font-size: 14px;line-height: 35px;">暂无社团活动～</p>
        </div>
      </div>
      <div class="activity-project">
        <p class="title-activity">
          <el-row>
            <el-col :span="3"><span class="small-title">志愿服务</span></el-col>
            <el-col :span="5"><span class="small-title">累计次数（次）：{{volunteerService.length}}</span></el-col>
            <el-col :span="5"><span class="small-title">累计时间（小时）：{{timeLength(volunteerService)}}</span></el-col>
            <el-col :span="11"><span class="small-title add-button" @click="addActivity('3')"><i class="iconfont icon-xinzeng" style="font-size:14px;margin-right:10px;"></i>新增</span></el-col>
          </el-row>
        </p>
        <div class="item-list">
          <ul v-if="volunteerService.length > 0">
            <li v-for="(item, index) in volunteerService" :key="index">
              <span class="name-width">{{item.moralActivityName}}</span>
              <span class="name-width">{{tools.formateTime(item.activityDate, 'YYYY-MM-DD')}}</span>
              <span style="float:right;color:#409EFF;cursor: pointer;" @click="editData('3', index, item)">编辑</span>
              <span :style="{'float': 'right', 'color': item.approvalStatus == 'SUCCESS' ? '#67C23A' : item.approvalStatus == 'FAIL' ? '#F56C6C' : '#E6A23C'}" v-html="editStatus(item.approvalStatus)"></span>
            </li>
          </ul>
          <p v-else style="padding: 0 0 0 10px;font-size: 14px;line-height: 35px;">暂无志愿服务～</p>
        </div>
      </div>
      <div class="activity-project">
        <p class="title-activity">
          <el-row>
            <el-col :span="3"><span class="small-title">公益劳动</span></el-col>
            <el-col :span="5"><span class="small-title">累计次数（次）：{{publicLabour.length}}</span></el-col>
            <el-col :span="5"><span class="small-title">累计时间（小时）：{{timeLength(publicLabour)}}</span></el-col>
            <el-col :span="11"><span class="small-title add-button" @click="addActivity('4')"><i class="iconfont icon-xinzeng" style="font-size:14px;margin-right:10px;"></i>新增</span></el-col>
          </el-row>
        </p>
        <div class="item-list">
          <ul v-if="publicLabour.length > 0">
            <li v-for="(item, index) in publicLabour" :key="index">
              <span class="name-width">{{item.moralActivityName}}</span>
              <span class="name-width">{{tools.formateTime(item.activityDate, 'YYYY-MM-DD')}}</span>
              <span style="float:right;color:#409EFF;cursor: pointer;" @click="editData('4', index, item)">编辑</span>
              <span :style="{'float': 'right', 'color': item.approvalStatus == 'SUCCESS' ? '#67C23A' : item.approvalStatus == 'FAIL' ? '#F56C6C' : '#E6A23C'}" v-html="editStatus(item.approvalStatus)"></span>
            </li>
          </ul>
          <p v-else style="padding: 0 0 0 10px;font-size: 14px;line-height: 35px;">暂无公益劳动～</p>
        </div>
      </div>
    </div>
    <el-dialog :title="activetyName" :visible.sync="showNewActivity" :close-on-click-modal="false" @close="closeDialog">
      <el-form label-width="150px">
        <el-form-item label="活动名称">
          <el-input v-model="moralActivityData.moralActivityName" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker v-model="dateTime" style="width:50%;" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动时长（小时）">
          <el-input :maxlength="4" v-model="moralActivityData.activityDateLength" style="width:50%;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" plain @click="saveActivity(1)" v-if="identity !== 'TEACHER'">仅保存</el-button>
        <el-button type="primary" @click="saveActivity(2)" v-if="identity !== 'TEACHER'">{{isEdit ? '修改并提交' : '保存并提交'}}</el-button>
        <el-button type="primary" @click="saveActivity(3)" v-else>{{isEdit ? '修改并保存' : '保存并提交'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../api.js'
export default {
  data () {
    return {
      maxHeight: document.body.clientHeight - 230 - 69 + 'px',
      showNewActivity: false,
      activetyName: null,
      moralActivityData: {
        moralActivityName: null,
        activityDate: null,
        activityDateLength: null
      },
      dateTime: null,
      reportId: null,
      isEdit: false,
      approvalStatus: 'SUCCESS',
      moralActivityId: null,
      moralActivityType: null,
      partyActivity: [],
      association: [],
      volunteerService: [],
      publicLabour: [],
      identity: null
    }
  },
  mounted () {
    if (this.$store.state.userInfo.userId) {
      this.identity = this.localStorage.getSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId)
      if (this.identity === 'TEACHER') {
        this.getData('TEACHER')
      } else if (this.identity === 'PARENT') {
        this.getData('PARENT')
      } else if (this.identity === 'STUDENT') {
        this.getData('STUDENT')
      }
    } else {
      this.$store.dispatch('getUserInfo', this.$route.params.schoolId).then(() => {
        this.identity = this.localStorage.getSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId)
        if (this.identity === 'TEACHER') {
          this.getData('TEACHER')
        } else if (this.identity === 'PARENT') {
          this.getData('PARENT')
        } else if (this.identity === 'STUDENT') {
          this.getData('STUDENT')
        }
      })
    }
  },
  watch: {
    studentInfo: {
      handler (newStudentInfo, old) {
        this.getData(this.identity)
      }
    }
  },
  computed: {
    studentInfo () {
      return this.$store.state.studentInfo
    }
  },
  methods: {
    getData (identity) {
      this.getMoralList('DTHD', identity, (data) => {
        this.partyActivity = data
      })
      this.getMoralList('STHD', identity, (data) => {
        this.association = data
      })
      this.getMoralList('ZYFW', identity, (data) => {
        this.volunteerService = data
      })
      this.getMoralList('GYHD', identity, (data) => {
        this.publicLabour = data
      })
    },
    getMoralList (type, identity, callback) {
      api.moralTeacherActivityList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId ? this.$route.params.studentId : this.studentInfo.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, activityType: type, identity: identity}, (data) => {
        callback(data)
      }, (er) => {})
    },
    addActivity (type) {
      this.identify(type)
      this.isEdit = false
      this.showNewActivity = true
    },
    editData (type, index, item) {
      this.identify(type)
      this.isEdit = true
      this.moralActivityId = item.moralActivityId
      this.showNewActivity = true
      this.moralActivityData = {
        moralActivityName: item.moralActivityName,
        activityDate: item.activityDate,
        activityDateLength: item.activityDateLength
      }
      this.dateTime = item.activityDate
    },
    identify (code) {
      switch (parseInt(code)) {
        case 1:
          this.moralActivityType = 'DTHD'
          this.activetyName = '党团活动'
          break
        case 2:
          this.moralActivityType = 'STHD'
          this.activetyName = '社团活动'
          break
        case 3:
          this.moralActivityType = 'ZYFW'
          this.activetyName = '志愿服务'
          break
        case 4:
          this.moralActivityType = 'GYHD'
          this.activetyName = '公益劳动'
          break
      }
    },
    saveActivity (key) {
      if (!this.moralActivityData.moralActivityName) {
        this.warnMessage('请填写活动名称')
        return
      }
      if (!this.moralActivityData.activityDateLength) {
        this.warnMessage('请填写活动时长')
        return
      }
      if (!this.dateTime) {
        this.warnMessage('请选择活动时间')
        return
      }
      this.moralActivityData.activityDate = this.tools.formateTime(this.dateTime, 'YYYY-MM-DD')
      if (key === 1) {
        this.approvalStatus = 'EDIT'
      } else if (key === 2) {
        this.approvalStatus = 'CHECK'
      } else if (key === 3) {
        this.approvalStatus = 'SUCCESS'
      }
      this.saveApi((data) => {
        this.successMessage(this.isEdit ? '修改成功' : '保存成功')
        if (this.identity === 'TEACHER') {
          this.getData('TEACHER')
        } else if (this.identity === 'PARENT') {
          this.getData('PARENT')
        } else if (this.identity === 'STUDENT') {
          this.getData('STUDENT')
        }
        this.cancel()
      })
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
    saveApi (callback) {
      api.saveMoralActivity({
        schoolId: this.$route.params.schoolId,
        classId: this.$route.params.classId,
        studentId: this.$route.params.studentId ? this.$route.params.studentId : this.studentInfo.studentId,
        reportId: this.$route.params.reportId,
        approvalStatus: this.approvalStatus,
        moralActivityData: this.moralActivityData,
        moralActivityId: this.moralActivityId,
        moralActivityType: this.moralActivityType,
        identity: this.identity}, (data) => {
        callback(data)
      }, (er) => {
        this.responseError(er, '保存失败')
      })
    },
    cancel () {
      this.showNewActivity = false
      this.moralActivityData = {
        moralActivityName: null,
        activityDate: null,
        activityDateLength: null
      }
      this.moralActivityType = null
      this.moralActivityId = null
      this.dateTime = null
    },
    closeDialog () {
      this.cancel()
    },
    timeLength (data) {
      let length = 0
      for (let i = 0; i < data.length; i++) {
        length += data[i].activityDateLength
      }
      return length
    }
  }
}
</script>
<style scoped lang="less">
.activity-wrap{
  .activity-project{
    .title-activity{
      line-height: 40px;
      background: rgb(241, 243, 246);
      padding: 0 10px;
      box-sizing: border-box;
      .small-title{
        font-weight:500;
        font-size: 15px;
        margin-right:20px;
      }
      .add-button{
        float:right;
        color:#409EFF;
        cursor: pointer;
      }
    }
    .item-list{
      ul{
        list-style:none;font-size:14px;
        li{
          line-height: 35px;
          padding:0 10px;
          box-sizing: border-box;
          span{
            margin-right: 20px;
          }
          .name-width{
            display: inline-block;
            min-width: 120px;
          }
        }
      }
    }
  }
}
</style>


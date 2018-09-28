<template>
  <div class="project-wrap">
    <div :style="{'max-height': maxHeight, 'overflow-y': 'auto'}">
      <!-- 军事训练 -->
      <div class="project-practice">
        <p class="title-project">
          <el-row>
            <el-col :span="2"><span class="small-title">军事训练</span></el-col>
            <el-col :span="5"><span class="small-title">累计次数（次）：{{militaryTraining.length}}</span></el-col>
            <el-col :span="5"><span class="small-title">累计时间（小时）：{{timeLength(militaryTraining)}}</span></el-col>
            <el-col :span="8"><span class="small-title">组织单位：{{identifyHoldUnit(militaryTraining)}}</span></el-col>
            <el-col :span="4"><span class="small-title add-button" @click="addActivity('1')"><i class="iconfont icon-xinzeng" style="font-size:14px;margin-right:10px;"></i>新增</span></el-col>
          </el-row>
        </p>
        <div class="item-list">
          <ul v-if="militaryTraining.length > 0">
            <li v-for="(item, index) in militaryTraining" :key="index">
              <span class="name-width">{{item.practiceProjectName}}</span>
              <span class="name-width">{{item.holdUnit}}</span>
              <span class="name-width">{{tools.formateTime(item.projectDate, 'YYYY-MM-DD')}}</span>
              <span style="float:right;color:#409EFF;cursor: pointer;" @click="editData('1', index, item)">编辑</span>
              <span :style="{'float': 'right', 'color': item.approvalStatus == 'SUCCESS' ? '#67C23A' : item.approvalStatus == 'FAIL' ? '#F56C6C' : '#E6A23C'}" v-html="editStatus(item.approvalStatus)"></span>
            </li>
          </ul>
          <p v-else style="padding: 0 0 0 10px;font-size: 14px;line-height: 35px;">暂无军事训练～</p>
        </div>
      </div>
      <!-- 生产劳动 -->
      <div class="project-practice">
        <p class="title-project">
          <el-row>
            <el-col :span="2"><span class="small-title">生产劳动</span></el-col>
            <el-col :span="5"><span class="small-title">累计次数（次）：{{productiveLabor.length}}</span></el-col>
            <el-col :span="5"><span class="small-title">累计时间（小时）：{{timeLength(productiveLabor)}}</span></el-col>
            <el-col :span="8"><span class="small-title">组织单位：{{identifyHoldUnit(productiveLabor)}}</span></el-col>
            <el-col :span="4"><span class="small-title add-button" @click="addActivity('2')"><i class="iconfont icon-xinzeng" style="font-size:14px;margin-right:10px;"></i>新增</span></el-col>
          </el-row>
        </p>
        <div class="item-list">
          <ul v-if="productiveLabor.length > 0">
            <li v-for="(item, index) in productiveLabor" :key="index">
              <span class="name-width">{{item.practiceProjectName}}</span>
              <span class="name-width">{{item.holdUnit}}</span>
              <span class="name-width">{{tools.formateTime(item.projectDate, 'YYYY-MM-DD')}}</span>
              <span style="float:right;color:#409EFF;cursor: pointer;" @click="editData('2', index, item)">编辑</span>
              <span :style="{'float': 'right', 'color': item.approvalStatus == 'SUCCESS' ? '#67C23A' : item.approvalStatus == 'FAIL' ? '#F56C6C' : '#E6A23C'}" v-html="editStatus(item.approvalStatus)"></span>
            </li>
          </ul>
          <p v-else style="padding: 0 0 0 10px;font-size: 14px;line-height: 35px;">暂无生产劳动～</p>
        </div>
      </div>
      <!-- 社会调查 -->
      <div class="project-practice">
        <p class="title-project">
          <el-row>
            <el-col :span="2"><span class="small-title">社会调查</span></el-col>
            <el-col :span="5"><span class="small-title">累计次数（次）：{{socialInvestigation.length}}</span></el-col>
            <el-col :span="5"><span class="small-title">累计时间（小时）：{{timeLength(socialInvestigation)}}</span></el-col>
            <el-col :span="8"><span class="small-title">组织单位：{{identifyHoldUnit(socialInvestigation)}}</span></el-col>
            <el-col :span="4"><span class="small-title add-button" @click="addActivity('3')"><i class="iconfont icon-xinzeng" style="font-size:14px;margin-right:10px;"></i>新增</span></el-col>
          </el-row>
        </p>
        <div class="item-list">
          <ul v-if="socialInvestigation.length > 0">
            <li v-for="(item, index) in socialInvestigation" :key="index">
              <span class="name-width">{{item.practiceProjectName}}</span>
              <span class="name-width">{{item.holdUnit}}</span>
              <span class="name-width">{{tools.formateTime(item.projectDate, 'YYYY-MM-DD')}}</span>
              <span style="float:right;color:#409EFF;cursor: pointer;" @click="editData('3', index, item)">编辑</span>
              <span :style="{'float': 'right', 'color': item.approvalStatus == 'SUCCESS' ? '#67C23A' : item.approvalStatus == 'FAIL' ? '#F56C6C' : '#E6A23C'}" v-html="editStatus(item.approvalStatus)"></span>
            </li>
          </ul>
          <p v-else style="padding: 0 0 0 10px;font-size: 14px;line-height: 35px;">暂无社会调查～</p>
        </div>
      </div>
      <!-- 社会调查 -->
      <div class="project-practice">
        <p class="title-project">
          <el-row>
            <el-col :span="2"><span class="small-title">勤工俭学</span></el-col>
            <el-col :span="5"><span class="small-title">累计次数（次）：{{workStudy.length}}</span></el-col>
            <el-col :span="5"><span class="small-title">累计时间（小时）：{{timeLength(workStudy)}}</span></el-col>
            <el-col :span="8"><span class="small-title">组织单位：{{identifyHoldUnit(workStudy)}}</span></el-col>
            <el-col :span="4"><span class="small-title add-button" @click="addActivity('4')"><i class="iconfont icon-xinzeng" style="font-size:14px;margin-right:10px;"></i>新增</span></el-col>
          </el-row>
        </p>
        <div class="item-list">
          <ul v-if="workStudy.length > 0">
            <li v-for="(item, index) in workStudy" :key="index">
              <span class="name-width">{{item.practiceProjectName}}</span>
              <span class="name-width">{{item.holdUnit}}</span>
              <span class="name-width">{{tools.formateTime(item.projectDate, 'YYYY-MM-DD')}}</span>
              <span style="float:right;color:#409EFF;cursor: pointer;" @click="editData('4', index, item)">编辑</span>
              <span :style="{'float': 'right', 'color': item.approvalStatus == 'SUCCESS' ? '#67C23A' : item.approvalStatus == 'FAIL' ? '#F56C6C' : '#E6A23C'}" v-html="editStatus(item.approvalStatus)"></span>
            </li>
          </ul>
          <p v-else style="padding: 0 0 0 10px;font-size: 14px;line-height: 35px;">暂无勤工俭学～</p>
        </div>
      </div>
      <!-- 其它 -->
      <div class="project-practice">
        <p class="title-project">
          <el-row>
            <el-col :span="2"><span class="small-title">其&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;它</span></el-col>
            <el-col :span="5"><span class="small-title">累计次数（次）：{{otherProject.length}}</span></el-col>
            <el-col :span="5"><span class="small-title">累计时间（小时）：{{timeLength(otherProject)}}</span></el-col>
            <el-col :span="8"><span class="small-title">组织单位：{{identifyHoldUnit(otherProject)}}</span></el-col>
            <el-col :span="4"><span class="small-title add-button" @click="addActivity('5')"><i class="iconfont icon-xinzeng" style="font-size:14px;margin-right:10px;"></i>新增</span></el-col>
          </el-row>
        </p>
        <div class="item-list">
          <ul v-if="otherProject.length > 0">
            <li v-for="(item, index) in otherProject" :key="index">
              <span class="name-width">{{item.practiceProjectName}}</span>
              <span class="name-width">{{item.holdUnit}}</span>
              <span class="name-width">{{tools.formateTime(item.projectDate, 'YYYY-MM-DD')}}</span>
              <span style="float:right;color:#409EFF;cursor: pointer;" @click="editData('5', index, item)">编辑</span>
              <span :style="{'float': 'right', 'color': item.approvalStatus == 'SUCCESS' ? '#67C23A' : item.approvalStatus == 'FAIL' ? '#F56C6C' : '#E6A23C'}" v-html="editStatus(item.approvalStatus)"></span>
            </li>
          </ul>
          <p v-else style="padding: 0 0 0 10px;font-size: 14px;line-height: 35px;">暂无其它项目～</p>
        </div>
      </div>
    </div>
    <el-dialog :title="activetyName" :visible.sync="showNewProject" :close-on-click-modal="false" @close="closeDialog">
      <el-form label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="practiceProjectData.practiceProjectName" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="组织单位">
          <el-input v-model="practiceProjectData.holdUnit" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker v-model="dateTime" type="date" placeholder="选择日期" style="width:50%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动时长">
          <el-input :maxlength="4" v-model="practiceProjectData.projectDateLength" style="width:50%;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showNewProject = false">取消</el-button>
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
      showNewProject: false,
      activetyName: null,
      practiceProjectData: {
        practiceProjectName: null,
        projectDate: null,
        projectDateLength: null,
        holdUnit: null
      },
      dateTime: null,
      militaryTraining: [],
      productiveLabor: [],
      socialInvestigation: [],
      workStudy: [],
      otherProject: [],
      approvalStatus: 'SUCCESS',
      practiceProjectType: null,
      practiceProjectId: null,
      isEdit: false,
      identity: null
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
  methods: {
    getData (identity) {
      this.getPracticeProjectList('JSSC', identity, (data) => {
        this.militaryTraining = data
      })
      this.getPracticeProjectList('SCLD', identity, (data) => {
        this.productiveLabor = data
      })
      this.getPracticeProjectList('SHDC', identity, (data) => {
        this.socialInvestigation = data
      })
      this.getPracticeProjectList('QGJX', identity, (data) => {
        this.workStudy = data
      })
      this.getPracticeProjectList('QT', identity, (data) => {
        this.otherProject = data
      })
    },
    getPracticeProjectList (type, identity, callback) {
      api.getProjectList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId ? this.$route.params.studentId : this.studentInfo.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId, practiceProjectType: type, identity: identity}, (data) => {
        callback(data)
      }, (er) => {
        this.responseError(er, '获取失败')
      })
    },
    saveActivity (key) {
      if (!this.practiceProjectData.practiceProjectName) {
        this.warnMessage('请输入活动名称')
        return
      }
      if (!this.practiceProjectData.holdUnit) {
        this.warnMessage('请选择组织单位')
        return
      }
      if (!this.dateTime) {
        this.warnMessage('请选择活动时间')
        return
      }
      if (!this.practiceProjectData.projectDateLength) {
        this.warnMessage('请输入活动时长')
        return
      }
      if (key === 1) {
        this.approvalStatus = 'EDIT'
      } else if (key === 2) {
        this.approvalStatus = 'CHECK'
      } else if (key === 3) {
        this.approvalStatus = 'SUCCESS'
      }
      this.practiceProjectData.projectDate = this.tools.formateTime(this.dateTime, 'YYYY-MM-DD')
      this.showNewProject = false
      this.saveProject((data) => {
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
    saveProject (callback) {
      api.saveProject({
        schoolId: this.$route.params.schoolId,
        classId: this.$route.params.classId,
        studentId: this.$route.params.studentId ? this.$route.params.studentId : this.studentInfo.studentId,
        reportId: this.$route.params.reportId,
        approvalStatus: this.approvalStatus,
        practiceProjectId: this.practiceProjectId,
        practiceProjectType: this.practiceProjectType,
        practiceProjectData: this.practiceProjectData,
        identity: this.identity}, (data) => {
        callback(data)
      }, (er) => {
        this.responseError(er, this.isEdit ? '修改失败' : '保存失败')
      })
    },
    addActivity (type) {
      this.showNewProject = true
      this.isEdit = false
      this.identify(type)
    },
    editData (type, index, item) {
      this.showNewProject = true
      this.isEdit = true
      this.identify(type)
      this.practiceProjectData = {
        practiceProjectName: item.practiceProjectName,
        projectDate: item.projectDate,
        projectDateLength: item.projectDateLength,
        holdUnit: item.holdUnit
      }
      this.practiceProjectId = item.practiceProjectId
      this.dateTime = item.projectDate
    },
    identify (code) {
      switch (parseInt(code)) {
        case 1:
          this.practiceProjectType = 'JSSC'
          this.activetyName = '军事训练'
          break
        case 2:
          this.practiceProjectType = 'SCLD'
          this.activetyName = '生产劳动'
          break
        case 3:
          this.practiceProjectType = 'SHDC'
          this.activetyName = '社会调查'
          break
        case 4:
          this.practiceProjectType = 'QGJX'
          this.activetyName = '勤工俭学'
          break
        case 5:
          this.practiceProjectType = 'QT'
          this.activetyName = '其他'
          break
      }
    },
    cancel () {
      this.practiceProjectData = {
        practiceProjectName: null,
        projectDate: null,
        projectDateLength: null,
        holdUnit: null
      }
      this.dateTime = null
      this.showNewProject = false
      this.practiceProjectId = null
    },
    closeDialog () {
      this.cancel()
    },
    timeLength (data) {
      let length = 0
      for (let i = 0; i < data.length; i++) {
        length += parseInt(data[i].projectDateLength)
      }
      return length
    },
    identifyHoldUnit (data) {
      let nameList = []
      for (let i = 0; i < data.length; i++) {
        nameList.push(data[i].holdUnit)
      }

      if (nameList.length <= 0) {
        return '无'
      } else {
        nameList = this.uniqueArr(nameList)
      }
      if (nameList.length > 3) {
        let newArr = [...nameList]
        newArr.length = 3
        return newArr.join('、') + '等'
      } else {
        return nameList.join('、')
      }
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
    uniqueArr (arr) {
      let newArr = []
      for (let i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
          newArr.push(arr[i])
        }
      }
      return newArr
    }
  }
}
</script>

<style lang="less" scoped>
.project-wrap{
  .project-practice {
     .title-project{
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
            cursor: pointer;
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

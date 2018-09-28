<template>
  <div style="height:100%;">
    <header>
      <h1>
        <img src="../assets/jy_logo_white.png" class="logo">
        <span @click="goSchoolCard" style="cursor: pointer;">校和家</span>
      </h1>
      <div class="school_name">
        <span style="border-left:2px solid hsla(0,0%,100%,.2);margin:0 15px;"></span>
        <span>{{userInfo.schoolName}}</span>
        <span v-if="statusCount > 1" style="font-weight: normal;font-size:16px;margin-left:20px;">当前身份（{{identity()}}）</span>
      </div>
      <div class="header_right">
        <span class="username change-btn" style="cursor: pointer;color:#409eff;" v-if="statusCount > 1" @click="dialogVisible = true">切换<i class="el-icon-d-arrow-right"></i></span>
        <img class="headicon" :src="tools.cdn(userInfo.userIcon, 'head_icon.png', 128)">
        <span class="username">{{userInfo.userName}}</span>
        <div class="lagout_button" @click='logout'>退出</div>
      </div>
    </header>
    <div class="nav">
      <div v-if="studentList.length > 0" style="padding-top:20px;">
        <img class="student-icon" :src="tools.cdn(studentInfo.userIcon, 'head.png', 128)">
        <p class="name-style"><span class="student-name" :style="{'margin-right': studentList.length > 1 ? '20px' : '0px'}">{{studentInfo.studentName}}</span><el-button type="text" v-if="studentList.length > 1" @click.native="dialogStudentVisible=true">切换</el-button></p>
      </div>
      <div class="nav_wrap">
        <el-menu class="el-menu-vertical-demo" background-color="#19202f" text-color="#fff" active-text-color="#67c23a" unique-opened>
          <el-submenu :index="index.toString()" v-for="(item, index) in navList" :key="index">
            <template slot="title">
              <i class="iconfont change_color" v-bind:class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="index.toString() + '-' + tag.toString()" v-for="(nav, tag) in item.paths" :key="tag" @click="navFun(nav, tag, item)">{{nav.name}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <el-dialog title="切换身份" :visible.sync="dialogVisible" width="30%" top="30vh" :close-on-click-modal="false">
      <el-button type="text" @click.native="switchUser('TEACHER')">{{this.managemenus.teacher}}</el-button>
      <el-button type="text" @click.native="switchUser('PARENT')">{{this.managemenus.parent}}</el-button>
      <el-button type="text" @click.native="switchUser('STUDENT')">{{this.managemenus.student}}</el-button>
    </el-dialog>
    <el-dialog title="切换学生" :visible.sync="dialogStudentVisible" width="40%" :close-on-click-modal="false">
      <div class="choose-student">
        <el-table :data="studentList">
          <el-table-column label="头像" width="100" align="center">
            <template slot-scope="scope">
              <img class="head-student-icon" :src="tools.cdn(scope.row.userIcon, 'head.png', 128)">
            </template>
          </el-table-column>
          <el-table-column label="姓名" prop="studentName" align="center" min-width="50"></el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click.native="studentInfo=scope.row,dialogStudentVisible= false">切换</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <router-view style="width:calc(100% - 200px);height:calc(100% - 60px);background-color: #f1f3f6;float:left;"/>
    <textarea id="textAreaXXDD" style="opacity: 0;position: absolute;top: 0; left: -99999px;"></textarea>
  </div>
</template>

<script>
import api from './api.js'
export default {
  data () {
    return {
      type: false,
      userName: 'widem',
      userImg: '',
      featureList: [],
      navList: [],
      managemenus: {},
      statusCount: 0,
      studentList: [],
      studentInfo: {
        userIcon: null,
        studentName: null,
        studnetId: null
      },
      dialogVisible: false,
      dialogStudentVisible: false
    }
  },
  mounted () {
    this.$store.dispatch('getUserInfo', this.$route.params.schoolId).then(() => {
      if (this.$store.state.userInfo.userId) {
        let identity
        if (this.localStorage.getSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId)) {
          identity = this.localStorage.getSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId)
        } else {
          identity = sessionStorage.getItem('identity')
        }
        if (identity === 'TEACHER') {
          this.localStorage.setSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId, 'TEACHER')
          api.getTeacherFeatures({schoolId: this.$route.params.schoolId}, (data) => {
            this.initNav(data)
          }, (er) => {})
        } else if (identity === 'PARENT') {
          this.localStorage.setSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId, 'PARENT')
          api.getSchoolParentFeature({schoolId: this.$route.params.schoolId}, (data) => {
            // this.initNav(data)
            this.navList.push(
              {
                title: '素质评价',
                featureCode: 'PINGJIAGUANLI',
                featureGroupCode: 'GUANLI',
                paths: [{path: 'ReportList', name: '学生素质评价'}],
                icon: 'icon-pingjia'
              }
            )
          }, (er) => {})
          api.getParentInfoSelf({schoolId: this.$route.params.schoolId}, (data) => {
            this.studentList = data.studentlist
            this.studentInfo = this.studentList[0]
          }, (er) => {})
        } else if (identity === 'STUDENT') {
          this.localStorage.setSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId, 'STUDENT')
          api.getSchoolStudentFeature({schoolId: this.$route.params.schoolId}, (data) => {
            // this.initNav(data)
            this.navList.push(
              {
                title: '素质评价',
                featureCode: 'PINGJIAGUANLI',
                featureGroupCode: 'GUANLI',
                paths: [{path: 'ReportList', name: '学生素质评价'}],
                icon: 'icon-pingjia'
              }
            )
          }, (er) => {})
        }
        sessionStorage.removeItem('identity')
        this.initManagemenus()
      }
    })
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  watch: {
    studentInfo: {
      handler (newStudentInfo, old) {
        this.$store.commit('studentInfo', newStudentInfo)
      }
    }
  },
  methods: {
    identity () {
      let str = this.localStorage.getSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId)
      let identity
      switch (str) {
        case 'TEACHER':
          identity = '教师'
          break
        case 'PARENT':
          identity = '家长'
          break
        case 'STUDNET':
          identity = '学生'
          break
      }
      return identity
    },
    initManagemenus () {
      this.statusCount = 0
      if (this.userInfo.isMaster === true) {
        this.managemenus.teacher = '我是创建者'
        this.statusCount ++
      } else if (this.userInfo.isTeacher === true) {
        this.managemenus.teacher = '我是教师'
        this.statusCount ++
      }
      if (this.userInfo.isParent === true) {
        this.managemenus.parent = '我是家长'
        this.statusCount ++
      }
      if (this.userInfo.isStudent === true) {
        this.managemenus.student = '我是学生'
        this.statusCount ++
      }
    },
    initNav (data) {
      let paths = []
      data.forEach(element => {
        if (element.featureCode === 'LAOSHIGUANLI') {
          this.navList.push(
            {
              title: '老师管理',
              featureCode: 'LAOSHIGUANLI',
              featureGroupCode: 'GUANLI',
              paths: [{path: 'TeacherImport', name: '导入老师'}, {path: 'TeacherList', name: '教师管理'}],
              icon: 'icon-laoshi'
            }
          )
        } else if (element.featureCode === 'XUESHENGXINXI') {
          this.navList.push(
            {
              title: '我的班级',
              featureCode: 'XUESHENGXINXI',
              featureGroupCode: 'GONGNENG',
              paths: [{path: 'StudentManageMy', name: '学生管理'}, {path: 'StudentImport', name: '导入学生'}],
              icon: 'icon-xuesheng'
            }
          )
          this.$store.commit('isClassMaster', true)
        } else if (element.featureCode === 'BANJIGUANLI') {
          if (parseInt(this.$store.state.userInfo.schoolModel) === 2) {
            this.navList.push(
              {
                title: '班级学生',
                featureCode: 'XUESHENGBANJIGUANLIXINXI',
                featureGroupCode: 'GUANLI',
                paths: [{path: 'StudentManage', name: '学生管理'}, {path: 'ImportStudent', name: '导入学生'}],
                icon: 'icon-banji'
              }
            )
          } else {
            this.navList.push(
              {
                title: '班级学生',
                featureCode: 'XUESHENGBANJIGUANLIXINXI',
                featureGroupCode: 'GUANLI',
                paths: [{path: 'GradeManage', name: '年级管理'}, {path: 'ClassManage', name: '班级管理'}, {path: 'StudentManage', name: '学生管理'}, {path: 'ShiftClassDispatch', name: '分班 / 转班'}],
                icon: 'icon-banji'
              }
            )
          }
          this.$store.commit('isManager', true)
        } else if (element.featureCode === 'CHENGJI') {
          this.navList.push(
            {
              title: '成绩管理',
              featureCode: 'CHENGJI',
              featureGroupCode: 'GONGNENG',
              paths: [{path: 'AchievementDispense', name: '导入成绩'}, {path: 'AchievementList', name: '查看成绩'}],
              icon: 'icon-chengji'
            }
          )
        } else if (element.featureCode === 'ZUOYE') {
          this.navList.push(
            {
              title: '作业管理',
              featureCode: 'ZUOYE',
              featureGroupCode: 'GONGNENG',
              paths: [{path: 'PublishHomework', name: '发布作业'}, {path: 'HomeworkList', name: '作业列表'}],
              icon: 'icon-zuoye'
            }
          )
        } else if (element.featureCode === 'GONGGAOGUANLI') {
          this.navList.push(
            {
              title: '公告管理',
              featureCode: 'GONGGAOGUANLI',
              featureGroupCode: 'GUANLI',
              paths: [{path: 'NoticePublish', name: '发布公告'}, {path: 'NoticeList', name: '公告列表'}],
              icon: 'icon-qungonggaoguanli'
            }
          )
        } else if (element.featureCode === 'DEYUGUANLI') {
          this.navList.push(
            {
              title: '德育管理',
              featureCode: 'DEYUGUANLI',
              featureGroupCode: 'GUANLI',
              paths: [{path: 'StudentEvaluationSetting', name: '学生操行评比项设置'}, {path: 'ClassEvaluationSetting', name: '星级班级评比项设置'}],
              icon: 'icon-deyuguanli'
            }
          )
        } else if (element.featureCode === 'PINGJIAGUANLI') {
          let a = {
            title: '素质评价',
            featureCode: 'PINGJIAGUANLI',
            featureGroupCode: 'GUANLI',
            paths: [],
            icon: 'icon-pingjia'
          }
          this.navList.push(a)
        } else if (element.featureCode === 'PINGJIA_XUEXIAO') {
          paths = [{path: 'studentBaseInfoList', name: '学生基本信息'}, {path: 'QualityEvaluation', name: '学生素质评价'}, {path: 'ReportManage', name: '评价报表管理'}]
        } else if (element.featureCode === 'PINGJIA_BANJI') {
          if (paths.length !== 4) {
            paths = [{path: 'QualityEvaluation', name: '学生素质评价'}]
          }
        } else if (element.featureCode === 'TONGJI') {
          setTimeout(() => {
            this.navList.forEach((item) => {
              if (item.featureCode === 'CHENGJI' && parseInt(this.$store.state.userInfo.schoolModel) !== 2) {
                item.paths.push({path: 'AchievementStatistics', name: '成绩统计'})
              }
            })
          }, 100)
        }
      })
      this.navList.forEach((item) => {
        if (item.featureCode === 'PINGJIAGUANLI') {
          item.paths = paths
        }
      })
    },
    navFun (code, index, item) {
      if (this.$store.state.userInfo.isMaster) {
        switch (item.featureGroupCode) {
          case 'GONGNENG':
            if (this.$store.state.userInfo.isTeacher) {
              this.$router.push({'name': code.path})
            } else {
              this.$confirm('您还不能使用教师功能，请先将自己添加为教师并绑定微信！', '操作提示', {
                confirmButtonText: '去添加',
                cancelButtonText: '关闭',
                closeOnClickModal: false,
                type: 'warning'
              }).then(() => {
                this.$router.push({'name': 'TeacherImport'})
              }).catch(() => {})
              return
            }
            break
          case 'GUANLI':
            this.$router.push({'name': code.path})
            break
        }
      } else if (this.$store.state.userInfo.isTeacher || this.$store.state.userInfo.isStudent || this.$store.state.userInfo.isParent) {
        this.$router.push({'name': code.path})
      }
    },
    switchUser (val) {
      if (val === 'TEACHER') {
        this.localStorage.setSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId, 'TEACHER')
      } else if (val === 'STUDENT') {
        this.localStorage.setSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId, 'STUDENT')
      } else if (val === 'PARENT') {
        this.localStorage.setSchoolUserIdentity(this.$route.params.schoolId, this.$store.state.userInfo.userId, 'PARENT')
      }
      this.$router.push({name: 'Welcome', params: { schoolId: this.$route.params.schoolId }})
      setTimeout(() => {
        location.reload()
      }, 200)
    },
    goSchoolCard () {
      this.$router.push({name: 'SchoolCard'})
    },
    logout () {
      this.$confirm('是否退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.homeLogout((data) => {
          window.location.reload()
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('退出失败')
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style>
[v-cloak] { display: none }
header {
  width: 100%;
  height: 60px;
	background: #1e3d80;
}
header .logo {
  display: inline-block;
  width: 50px;
  height: 50px;
  margin: 5px 10px 0 15px;
  float: left;
}
header h1{
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  float: left;
  color: #fff;
  text-align: center;
}
header .school_name{
  float: left;
  height: 60px;
  line-height: 60px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
}
header .header_right{
  float: right;
}
header .headicon{
  width: 40px;
	height: 40px;
	display: inline-block;
  border-radius: 50%;
  border: none;
  float: left;
  margin: 10px 20px 0 0;
}
header .header_right .username{
  float: left;
  line-height: 60px;
  color: #fff;
  margin-right: 20px;
}
header .header_right .change-btn:hover{
  color: #66b1ff !important;
  border-color: transparent;
  background-color: transparent;
}
header .header_right .change-indentity{
  line-height: 60px;
  color: rgb(255, 255, 255);
  font-size: 16px;
  margin: 0 20px 0 -40px;
  cursor: pointer;
}
header .header_right .lagout_button{
  width: 70px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  margin:15px 40px 0 0;
  color:#fff;
  cursor: pointer;
  border-left: 2px solid hsla(0,0%,100%,.2);
  float: left;
}
.nav {
  width: 200px;
  box-sizing: border-box;
	height: calc(100% - 60px);
  background: #19202f;
	float: left;
}
.nav .student-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: block;
  margin: auto;
}
.nav .name-style{
  color:#fff;
  font-size:14px;
  text-align:center;
}
.nav .name-style .student-name{
  margin-right: 20px
}
.choose-student .head-student-icon{
  width: 40px;
  height: 40px;
  border-radius: 5px;
}
.el-menu{
  border-right:none !important;
}
.el-menu-item-group__title{
	display: none;
}
.change_color{
	color: #fff !important;
}
</style>

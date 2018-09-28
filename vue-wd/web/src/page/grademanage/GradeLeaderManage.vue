<template>
  <div class="warpper">
    <div class="header">
      <el-button type="info" plain size="small" style="margin:10px 20px 0 0;" icon="el-icon-back" @click="goBack"></el-button>
      <span class="impot_title" v-if="title!==null&&title!==undefined">{{title}}组角色</span>
      <el-button type="success" class="back-button" style="margin-left:20px;" @click="getNotAppend">添加</el-button>
      <div v-if="this.purPose.length > 0" style="padding:10px 0;">
        <p>共{{this.purPose.length}}项功能：{{this.purPose.join('、')}}</p>
      </div>
    </div>
    <div class="teacher_list">
      <el-table :data="teacherList" border :max-height="maxWrapHeight" empty-text="暂无年级组长">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="头像" width="100" align="center">
          <template slot-scope="scope">
            <img class="userIcon" :src="tools.cdn(scope.row.userIcon, 'head.png', 128)">
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="teacherName" align="center" min-width="50"></el-table-column>
        <el-table-column label="操作" align="center" min-width="60">
          <template slot-scope="scope">
             <el-button size="mini" type="danger" @click="confirm('delete', scope.row, scope.$index)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="showTeacherList" title="添加年级组长">
      <div style="margin-bottom:5px;">
        <el-input style="width:50%;margin-right:10px;" v-model="teacherName" placeholder="请输入老师名字" @input="searchValue"></el-input>
        <el-button type="success" class="button_search" style="margin-right:20px;" icon="el-icon-search" @click="searchTeacher">搜索</el-button>
      </div>
      <el-table :data="notAppendTeacher" border empty-text="暂无教师" :max-height="maxHeight">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="头像" width="100" align="center">
          <template slot-scope="scope">
            <img class="userIcon" :src="tools.cdn(scope.row.userIcon, 'head.png', 128)">
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="teacherName" align="center" min-width="150"></el-table-column>
        <el-table-column label="操作" align="center" min-width="80">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="confirm('add', scope.row, scope.$index)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import api from './api'
  export default {
    data () {
      return {
        purPose: [],
        teacherList: [],
        showTeacherList: false,
        notAppendTeacher: [],
        maxHeight: document.body.clientHeight - 318,
        maxWrapHeight: document.body.clientHeight - 212,
        index: 0,
        title: null,
        teacherName: null
      }
    },
    mounted () {
      api.getGradeInfo({schoolId: this.$route.params.schoolId, gradeId: this.$route.params.gradeId}, (data) => {
        this.title = data.gradeName
      }, (er) => {})
      if (this.$route.params.isAdd === 'isAdd') {
        this.getNotAppend()
      }
      this.getTreacherList(true, (data) => {
        this.teacherList = data
      })
      api.getFeatureList({schoolId: this.$route.params.schoolId, gradeId: this.$route.params.gradeId}, (data) => {
        data.forEach(element => {
          this.purPose.push(element.featureName)
        })
      }, (er) => {})
    },
    methods: {
      searchTeacher () {
        if (this.teacherName !== null && this.teacherName !== undefined) {
          this.getTreacherList(false, (data) => {
            this.notAppendTeacher = data
          })
        } else {
          this.$message.warning('请填写教师姓名')
        }
      },
      confirm (type, item, index) {
        let tag = false
        let title
        if (type === 'delete') {
          tag = false
          title = '您确定取消教师【' + item.teacherName + '】的年级组长权限吗？'
        } else if (type === 'add') {
          tag = true
          title = '您确定为教师【' + item.teacherName + '】添加年级组长权限吗？'
        }
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (tag) {
            this.addTeacher(item, index)
          } else {
            this.confirmDelete(item, index)
          }
        }).catch(() => {})
      },
      addTeacher (item, index) {
        this.editTeacher(item.teacherId, true, (data) => {
          this.$message.success('添加成功')
          this.showTeacherList = false
          this.teacherList.push(item)
          this.notAppendTeacher.splice(index, 1)
          this.teacherName = null
        })
      },
      confirmDelete (item, index) {
        this.editTeacher(item.teacherId, false, (data) => {
          this.$message.success('取消成功')
          this.notAppendTeacher.push(item)
          this.teacherList.splice(index, 1)
        })
      },
      getTreacherList (type, callback) {
        api.gradeTeacherList({schoolId: this.$route.params.schoolId, gradeId: this.$route.params.gradeId, teacherName: this.teacherName, isExist: type}, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('获取失败')
          }
        })
      },
      editTeacher (teacherId, isExist, callback) {
        api.gradeEditTeacher({schoolId: this.$route.params.schoolId, gradeId: this.$route.params.gradeId, teacherId: teacherId, isExist: isExist}, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('操作失败')
          }
        })
      },
      searchValue () {
        if (!this.teacherName && this.teacherName === '') {
          this.getTreacherList(false, (data) => {
            this.notAppendTeacher = data
          })
        }
      },
      goBack () {
        this.$router.go(-1)
      },
      getNotAppend () {
        this.getTreacherList(false, (data) => {
          this.notAppendTeacher = data
          this.showTeacherList = true
        })
      }
    },
    filters: {
      filterSex (sex) {
        if (parseInt(sex) === 1) {
          return '男'
        } else if (parseInt(sex) === 2) {
          return '女'
        } else {
          return '无'
        }
      },
      filterType (type) {
        if (parseInt(type) === 1) {
          return '任课教师'
        } else if (parseInt(type) === 2) {
          return '后勤教师'
        } else if (parseInt(type) === 3) {
          return '教务教师'
        } else {
          return '无'
        }
      }
    }
  }
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
.warpper{
  .header{
    .back-button{
      float: right;
      margin-top: 10px;
    }
  }
  .teacher_list {
    margin-top: 5px;
  }
  .userIcon {
    width: 40px;
    height: 40px;
    vertical-align: middle;
    border-radius: 20px;
  }
}
</style>


<template>
  <div class="warpper">
    <div class="header">
      <span>学生管理</span><span v-if="studentList.length > 0" style="margin-left:10px;">{{studentList.length > 0 ? '该班共' + studentList.length + '名学生' : ''}}</span>
      <div class="search_wrap">
        <span>班级：</span>
        <el-select v-model="classId" filterable placeholder="请选择班级" @change="getList">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="success" class="addStudent" v-if="classId !== null && classId !== undefined && isPower" @click="changeInfo('save')">增加</el-button>
      </div>
    </div>
    <div class="student_list" v-if="studentList.length > 0">
      <el-table :data="studentList" border :max-height="maxHeight">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="头像" width="100" align="center">
          <template slot-scope="scope">
            <img class="userIcon" :src="tools.cdn(scope.row.userIcon, 'head.png', 128)">
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="studentName" align="center" min-width="50"></el-table-column>
        <el-table-column label="性别" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.studentSex | filterSex}}</span>
          </template>
        </el-table-column>
        <el-table-column label="学号" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.studentNumber ? scope.row.studentNumber : '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250" v-if="isPower">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="changeInfo('edit', scope.row, scope.$index)">修改</el-button>
            <el-button size="mini" type="danger" @click="confirmDelete(scope.row.studentId, scope.$index, scope.row.studentName)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class="empty_wrap">
      <div class="prop_center">
        <img src="../../assets/empty.png">
        <p>{{classId ? '该班暂无学生' : '请先选择班级'}}</p>
      </div>
    </div>
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-show="showAlert">
        <div class="cover_inner">
          <el-form label-position="left" label-width="85px" :model="studentInfo">
            <el-form-item label="姓名">
              <el-col :span="12">
                <el-input v-model="studentInfo.studentName"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="性别">
              <el-col :span="12">
                <el-radio v-model="studentInfo.studentSex" label="1">男</el-radio>
                <el-radio v-model="studentInfo.studentSex" label="2">女</el-radio>
              </el-col>
            </el-form-item>
            <el-form-item label="学生学号">
              <el-col :span="12">
                <el-input v-model="studentInfo.studentNumber"></el-input>
              </el-col>
            </el-form-item>
             <el-form-item label="是否寄宿">
              <el-col :span="12">
                <el-switch v-model="studentInfo.lodging" active-color="#67C23A" inactive-color="#909399"></el-switch>
              </el-col>
            </el-form-item>
            <el-form-item label="学生手机号">
              <el-col :span="12">
                <el-input v-model="studentInfo.studentTelephoneNum"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
          <div>
            <el-button class="saveWrap" type="success" @click="clearAlert">关闭</el-button>
            <el-button class="saveWrap" type="success" @click="studentAdd" style="margin-right:10px;">保存</el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import baseApi from '../api'
  import listApi from '../homework/api'
  import api from './api'
  export default {
    data () {
      return {
        classList: [],
        classId: null,
        options: [],
        studentList: [],
        showAlert: false,
        studentInfo: {
          studentName: null,
          studentSex: null,
          studentNumber: null,
          studentTelephoneNum: null,
          lodging: false
        },
        personInfo: {},
        type: null,
        index: 0,
        isPower: false,
        maxHeight: document.body.clientHeight - 169
      }
    },
    mounted () {
      this.getClassList()
    },
    computed: {
      isManager () {
        return this.$store.state.isManager
      },
      userInfo () {
        return this.$store.state.userInfo
      }
    },
    methods: {
      getClassList () {
        baseApi.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'XUESHENGXINXI'}, (data) => {
          this.classList = data
          data.forEach((element) => {
            if (parseInt(element.classType) === 1) {
              var item = {
                value: element.classId,
                label: element.className
              }
              this.options.push(item)
            }
          })
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          }
        })
      },
      getList () {
        this.classList.forEach((element) => {
          if (element.classId === parseInt(this.classId)) {
            // 是管理者或者是班主任
            if (this.userInfo.teacherId === element.classTeacherId || this.$store.state.isManager) {
              this.isPower = true
            } else {
              this.isPower = false
            }
          }
        })
        this.getClassStudent()
      },
      getClassStudent () {
        listApi.queryStudentList({schoolId: this.$route.params.schoolId, classId: this.classId}, (data) => {
          this.studentList = data
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('获取失败，请稍后重试')
          }
        })
      },
      confirmDelete (idCode, index, name) {
        this.$confirm('您确定删除学生【' + name + '】吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.deleteStudent(idCode, index)
        }).catch(() => {})
      },
      changeInfo (type, item, index) {
        this.type = type
        if (this.type === 'edit') {
          this.personInfo = item
          this.index = index
          api.getStudentInfo({schoolId: this.$route.params.schoolId, studentId: this.personInfo.studentId}, (data) => {
            this.studentInfo = {
              studentName: data.studentName,
              studentSex: data.studentSex !== null ? data.studentSex.toString() : null,
              studentNumber: data.studentNumber,
              studentTelephoneNum: data.studentTelephoneNum,
              lodging: data.isLodging
            }
            this.showAlert = true
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.$message.error(er.message)
            } else {
              this.$message.error('获取失败')
            }
          })
        } else if (this.type === 'save') {
          this.showAlert = true
        }
      },
      studentAdd () {
        if (!this.studentInfo.studentName) {
          this.$message.error('请填写学生名字')
          return
        }
        if (this.studentInfo.studentTelephoneNum) {
          if (!(/^1[34578]\d{9}$/.test(this.studentInfo.studentTelephoneNum))) {
            this.$message.error('请填写正确手机号码！')
            return
          }
        }
        if (this.type === 'save') {
          api.addStudent({schoolId: this.$route.params.schoolId, info: this.studentInfo, classId: this.classId}, (data) => {
            this.$message.success('添加成功')
            this.studentList.push({ userIcon: null,
              studentId: data.result,
              studentName: this.studentInfo.studentName,
              studentNumber: this.studentInfo.studentNumber,
              studentSex: this.studentInfo.studentSex
            })
            this.studentInfo = {studentName: null, studentSex: null, studentNumber: null, studentTelephoneNum: null, isLodging: null}
            this.showAlert = false
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.$message.error(er.message)
            } else {
              this.$message.error('添加失败')
            }
          })
        } else if (this.type === 'edit') {
          api.adminEditStudentInfo({schoolId: this.$route.params.schoolId, info: this.studentInfo, studentId: this.personInfo.studentId}, (data) => {
            this.$message.success('修改成功')
            this.studentList[this.index].studentName = this.studentInfo.studentName
            this.studentList[this.index].studentSex = this.studentInfo.studentSex
            this.studentList[this.index].studentNumber = this.studentInfo.studentNumber
            this.studentInfo = {studentName: null, studentSex: null, studentNumber: null, studentTelephoneNum: null, isLodging: null}
            this.showAlert = false
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.$message.error(er.message)
            } else {
              this.$message.error('修改失败')
            }
          })
        }
      },
      deleteStudent (id, index) {
        api.delStudent({schoolId: this.$route.params.schoolId, studentId: id, classId: this.classId}, (data) => {
          this.$message.success('删除成功')
          this.studentList.splice(index, 1)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('删除失败')
          }
        })
      },
      clearAlert () {
        this.showAlert = false
        this.studentInfo = {studentName: null, studentSex: null, studentNumber: null, studentTelephoneNum: null, isLodging: null}
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
      }
    }
  }
</script>
<style lang="less" scoped>
@import url('../../style/public.less');
.warpper {
  .header {
    .search_wrap {
      float: right;
      .addStudent{
        margin-left: 20px;
      }
    }
  }
  .student_list{
    margin-top: 5px;
    .userIcon {
      width: 40px;
      height: 40px;
      vertical-align: middle;
      border-radius: 20px;
    }
  }
  .empty_wrap {
    height:calc(100% - 69px);
    margin-top: 5px;
    background: #fff;
    position: relative;
    .prop_center {
      width: 280px;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform:translate(-50%,-50%);
      -moz-transform:translate(-50%,-50%);
      -o-transform:translate(-50%,-50%);
      transform:translate(-50%,-50%);
      img {
        width:158px;
        height:123px;
      }
      p {
        font-size: 14px;
        margin-top: 20px;
        font-weight: 700;
      }
    }
  }
  .cover_wrap{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    background: rgba(0, 0, 0, .5);
    .cover_inner{
      padding: 20px 20px;
      background: #fff;
      width: 500px;
      border-radius: 5px;
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform:translate(-50%,-50%);
      -moz-transform:translate(-50%,-50%);
      -o-transform:translate(-50%,-50%);
      transform:translate(-50%,-50%);
      z-index: 101;
      .saveWrap {
        float: right;
      }
    }
  }
}
</style>

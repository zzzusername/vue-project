<template>
  <div class="warpper">
    <div class="header">
      <span>班级管理</span>
      <div class="search_wrap" v-if="options.length > 0">
        <span>年级：</span>
        <el-select v-model="gradeId" filterable placeholder="请选择年级" @change="getList">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="success" class="addStudent" @click="showAlert = true" :disabled="gradeId == null">添加班级</el-button>
      </div>
      <el-button type="success" class="addStudent" @click="showAlert = true" v-if="options.length <= 0 && userInfo.schoolModel == 2" style="float: right;margin-top: 10px;">添加班级</el-button>
    </div>
    <div class="class_list">
      <el-table :data="classList" border empty-text="暂无班级" :max-height="maxHeight">
        <el-table-column label="年级名称" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.gradeName ? scope.row.gradeName : '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="班级名称" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.className}}</span>
          </template>
        </el-table-column>
        <el-table-column label="班主任" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.classTeacherName ? scope.row.classTeacherName : '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="editGrade(scope.row, scope.$index)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteGrade(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-show="showAlert">
        <div class="cover_inner">
          <div class="check_box" v-if="!isAgree">
            <el-radio v-model="isBatch" :disabled="isAgree" label="1">批量</el-radio>
            <el-radio v-model="isBatch" label="2">单独</el-radio>
          </div>
          <div v-if="isBatch == '1'">
            <el-row class="line_style">
              <el-col :span="6">
                <span class="title">起始班级编号：</span>
              </el-col>
              <el-col :span="18">
                <input type="number" v-model.number="batchData.startNumber" class="input_number">
              </el-col>
            </el-row>
            <el-row class="line_style">
              <el-col :span="6">
                <span class="title">批量创建数量：</span>
              </el-col>
              <el-col :span="18">
                <input type="number" v-model.number="batchData.createNum" class="input_number">
              </el-col>
            </el-row>
            <p class="created_num">
              <span>您将创建<i>{{batchData.startNumber}}</i>班&nbsp;到<i>{{endNumber}}</i>班</span>
            </p>
          </div>
          <div v-if="isBatch == '2'">
            <p class="change_title">创建班级</p>
            <el-row class="line_style">
              <el-col :span="6">
                <span class="title">创建班级名称:</span>
              </el-col>
              <el-col :span="18">
                <input type="text" v-model="onlyData.className" class="input_number">
              </el-col>
            </el-row>
            <p class="created_num" v-if="onlyData.className">
              <span>您将创建班级：<i>{{gradeName + onlyData.className}}</i></span>
            </p>
          </div>
          <div>
            <el-button class="saveWrap" type="success" @click="closeAdd">关闭</el-button>
            <el-button class="saveWrap" type="success" @click="saveClass" style="margin-right:10px;">添加</el-button>
          </div>
        </div>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-show="showChange">
        <div class="cover_inner">
          <div>
            <p class="change_title">修改班级</p>
            <el-row class="line_style">
              <el-col :span="4">
                <span class="title">班级名称</span>
              </el-col>
              <el-col :span="20">
                <input type="text" v-model="changeClassName" class="input_number">
              </el-col>
            </el-row>
            <el-row class="line_style">
              <el-col :span="4">
                <span class="title">班主任</span>
              </el-col>
              <el-col :span="20">
                <el-select v-model="classTeacher" filterable placeholder="请选择老师(支持搜索)">
                  <el-option v-for="item in optionTeachers" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row class="line_style">
              <el-col :span="8">
                <span class="title">允许班主任关联微信群</span>
              </el-col>
              <el-col :span="16" style="line-height:37px;">
                <el-switch v-model="isTeacherCreateOrg" active-color="#13ce66" inactive-color="#dcdfe6"></el-switch>
              </el-col>
            </el-row>
            <el-row class="line_style">
              <el-col :span="24">
                <span class="title" v-if="changeClassName">您将班级名称修改为：<i class="change_name">{{gradeName + changeClassName}}</i></span>
              </el-col>
              <el-col :span="24">
                <span class="title" v-if="classTeacher">您将班主任修改为：<i class="change_name">{{changeTeacherName}}老师</i></span>
              </el-col>
            </el-row>
          </div>
          <div>
            <el-button class="saveWrap" type="success" @click="showChange = false, changeClassName = null, classTeacher = null, changeTeacherName = null">关闭</el-button>
            <el-button class="saveWrap" type="success" @click="confirmChange" style="margin-right:10px;">确认修改</el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import baseApi from '../api'
  import api from './api'
  export default {
    data () {
      return {
        changeClassName: null,
        showChange: false,
        changeData: {},
        gradeId: null,
        options: [],
        classList: [],
        showAlert: false,
        isBatch: null,
        batchData: {
          startNumber: 1,
          createNum: 1
        },
        onlyData: {
          className: null
        },
        endNumber: 1,
        gradeName: '',
        isAgree: true,
        optionTeachers: [],
        classTeacher: null,
        isTeacherCreateOrg: true,
        changeTeacherName: null,
        maxHeight: document.body.clientHeight - 169
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo
      }
    },
    mounted () {
      api.getGradeList({schoolId: this.$route.params.schoolId}, (data) => {
        if (data.length > 0) {
          data.forEach((element) => {
            var item = {
              value: element.gradeId,
              label: element.gradeName
            }
            this.options.push(item)
          })
        } else {
          this.getList()
        }
      }, (er) => {})
      api.getTeacherList({schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 99999}, (data) => {
        data.forEach((element) => {
          var item = {
            value: element.teacherId,
            label: element.teacherName
          }
          this.optionTeachers.push(item)
        })
      }, (er) => {})
    },
    watch: {
      classTeacher: {
        handler (newVal, oldVal) {
          if (newVal !== null && newVal !== undefined) {
            this.optionTeachers.forEach((element) => {
              if (parseInt(element.value) === parseInt(newVal)) {
                this.changeTeacherName = element.label
              }
            })
          }
        },
        deep: true
      },
      batchData: {
        handler (newVal, oldVal) {
          this.endNumber = newVal.startNumber
          if (newVal.createNum > 100) {
            newVal.createNum = 100
          }
          if (newVal.createNum < 0) {
            newVal.createNum = 1
          }
          if (newVal.startNumber < 0) {
            newVal.createNum = 1
          }
          if (newVal.createNum !== null && newVal.createNum !== '') {
            for (let i = 0; i < newVal.createNum - 1; i++) {
              this.endNumber++
            }
          }
        },
        deep: true
      }
    },
    methods: {
      closeAdd () {
        this.showAlert = false
        this.batchData = {startNumber: 1, createNum: 1}
        this.onlyData = {className: null}
        this.endNumber = 1
      },
      editGrade (item, index) {
        this.showChange = true
        this.changeData = {
          data: item,
          index: index
        }
        this.changeClassName = this.changeData.data.classInfoName
        if (this.changeData.data.classTeacherId !== null && this.changeData.data.classTeacherId !== undefined) {
          this.classTeacher = this.changeData.data.classTeacherId
        } else {
          this.classTeacher = null
        }
        this.isTeacherCreateOrg = this.changeData.data.isTeacherCreateOrg
      },
      confirmChange () {
        this.options.forEach((element) => {
          if (parseInt(element.value) === parseInt(this.gradeId)) {
            this.gradeName = element.label
          }
        })
        if (this.changeClassName || this.classTeacher) {
        } else {
          this.$message.error('请填写班级名称或选择班主任老师')
          return
        }
        let item = {
          classDesc: this.changeData.data.classDesc,
          classType: this.changeData.data.classType,
          orgId: this.changeData.data.orgId,
          isGraduate: this.changeData.data.isGraduate,
          isTeacherCreateOrg: this.isTeacherCreateOrg
        }
        let newTeacherId
        let newClassname
        if (this.changeClassName !== null && this.changeClassName !== undefined) {
          newClassname = this.changeClassName
        } else {
          newClassname = this.changeData.data.classInfoName
        }
        if (this.classTeacher !== null && this.classTeacher !== undefined) {
          newTeacherId = this.classTeacher
        } else {
          newTeacherId = this.changeData.data.classTeacherId
        }
        api.editClass({schoolId: this.$route.params.schoolId, classId: this.changeData.data.classId, className: newClassname, classTeacherId: newTeacherId, info: item}, (data) => {
          this.$message.success('修改成功')
          this.getList()
          this.showChange = false
          this.changeClassName = null
          this.classTeacher = null
          this.changeTeacherName = null
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('修改失败')
          }
        })
      },
      deleteGrade (item, index) {
        this.$confirm('您确定删除此班级吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'error'
        }).then(() => {
          api.deleteClass({schoolId: this.$route.params.schoolId, classId: item.classId}, (data) => {
            this.$message.success('删除成功')
            this.classList.splice(index, 1)
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.$message.error(er.message)
            } else {
              this.$message.error('删除失败')
            }
          })
        }).catch(() => {})
      },
      saveClass () {
        if (parseInt(this.isBatch) === 1) {
          let infoList = []
          if (this.batchData.startNumber !== null && this.batchData.startNumber !== '') {
          } else {
            this.$message.error('请填写起始班级编号')
            return
          }
          if (this.batchData.createNum !== null && this.batchData.createNum !== '') {
          } else {
            this.$message.error('请填写批量创建数量')
            return
          }
          let name = this.batchData.startNumber
          for (let i = 0; i < this.batchData.createNum; i++) {
            var item = {
              className: name++ + '班',
              classType: 1,
              gradeId: this.gradeId,
              isTeacherCreateOrg: true
            }
            infoList.push(item)
          }
          api.batchAddclass({schoolId: this.$route.params.schoolId, infoListJson: JSON.stringify(infoList)}, (data) => {
            this.$message.success('批量添加班级成功')
            this.batchData = {startNumber: 1, createNum: 1}
            this.endNumber = 1
            this.showAlert = false
            this.getList()
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.$message.error(er.message)
            } else {
              this.$message.error('批量添加班级失败')
            }
          })
        } else if (parseInt(this.isBatch) === 2) {
          // 单独
          if (this.onlyData.className !== null && this.onlyData.className !== '') {
            api.onlyAddclass({schoolId: this.$route.params.schoolId, gradeId: this.gradeId, classType: 1, className: this.onlyData.className}, (data) => {
              this.$message.success('添加班级成功')
              this.onlyData = {className: null}
              this.showAlert = false
              this.getList()
            }, (er) => {
              if (er.toUser !== undefined && er.toUser) {
                this.$message.error(er.message)
              } else {
                this.$message.error('添加班级失败')
              }
            })
          } else {
            this.$message.error('请填写创建班级名称')
            return
          }
        }
      },
      getList () {
        baseApi.getClassList({schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999, gradeId: this.gradeId, classType: 1}, (data) => {
          let listArr = []
          data.forEach((element) => {
            if (parseInt(element.classType) === 1) {
              var item = {}
              for (let i in element) {
                item[i] = element[i]
              }
              listArr.push(item)
            }
          })
          this.classList = listArr
          this.options.forEach((element) => {
            if (parseInt(element.value) === parseInt(this.gradeId)) {
              this.gradeName = element.label
            }
          })
          if (data.length > 0) {
            this.isBatch = '2'
            this.isAgree = true
          } else {
            this.isBatch = '1'
            this.isAgree = false
          }
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('获取班级失败，请稍后重试')
          }
        })
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
      .addStudent {
        margin-left: 20px;
      }
    }
  }
  .class_list {
    margin-top: 5px;
  }
  .cover_wrap {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    background: rgba(0, 0, 0, .5);
    .cover_inner {
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
      .change_title {
        font-weight: 500;
        font-size: 16px;
        padding: 10px 0;
      }
      .saveWrap {
        float: right;
      }
      .grade_name {
        margin:20px 20px;
      }
      .check_box {
        margin-bottom:20px;
      }
      .line_style {
        margin:10px 0;
        .change_name {
          font-style: normal;
          color: red;
        }
      }
      .input_number {
        width: 46%;
        height: 40px;
        border: none;
        text-indent: 1em;
        outline: none;
        font-size: 16px;
        border: 1px solid #d8dce5;
        border-radius: 4px;
        background-color: #fff;
        border-radius: 4px;
      }
      .input_number:hover{
        border-color: #b4bccc;
      }
      .input_number:focus{
        border-color: #409EFF;
      }
      .title {
        line-height: 40px;
        font-size: 16px;
      }
      .created_num {
        line-height: 40px;
        i {
          font-style: normal;
          color: red;
          margin: 0 5px;
        }
      }
    }
  }
}
</style>


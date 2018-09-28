<template>
  <div class="warpper">
    <div class="header">
      <span>年级管理</span>
      <div class="add_grade">
        <el-button type="success" @click="showAlert = true, type= 'add'">添加年级</el-button>
      </div>
    </div>
    <div class="table_wrap">
      <el-table :data="gradeList" border :max-height="maxHeight">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="年级名称" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.gradeName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="班级个数" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.classNum == 0 ? '无' : scope.row.classNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-popover
              placement="left-start"
              width="388"
              trigger="hover">
              <div>
                <el-button size="mini" type="success" @click="editGrade('edit', scope.row, scope.$index)">修改</el-button>
                <el-button size="mini" type="primary" @click="editGrade('upgrade', scope.row, scope.$index)">升级</el-button>
                <el-button size="mini" type="warning" @click="editGrade('graduate', scope.row, scope.$index)">毕业</el-button>
                <el-button size="mini" type="danger" @click="deleteGrade(scope.row, scope.$index)">删除</el-button>
                <el-button size="mini" type="info" @click="editGrade('role', scope.row, scope.$index)">年级组长管理</el-button>
              </div>
              <el-button slot="reference">操作</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-if="showAlert">
        <div class="cover_inner">
          <div class="grade_name">
            <span>年级名称：</span>
            <el-input v-model="gradeName" style="width:60%;" placeholder="请输入年级名称"></el-input>
          </div>
          <div>
            <el-button class="saveWrap" type="success" @click="gradeName=null,showAlert=false">取消</el-button>
            <el-button class="saveWrap" type="success" @click="addGradeFun" style="margin-right: 10px;">保存</el-button>
          </div>
        </div>
      </div>
    </transition>
    <transition name="el-zoom-in-center">
      <div class="cover_wrap" v-if="showUpgrade">
        <div class="cover_inner">
          <div style="margin: 0 20px;">
            <span>此年级为<i class="grade_style">{{dataItem.data.gradeName}}</i>，升级后：</span>
            <ol style="margin-left:20px;">
              <li>推送升级消息，通知用户年级变更</li>
              <li>教师／学生／家长 在使用过程中，显示升级后的年级名称</li>
              <li>升级前产生的业务数据不会丢失</li>
            </ol>
          </div>
          <div class="grade_name">
            <span>年级升级名称：</span>
            <el-input v-model="changeGradeName" style="width:60%;" placeholder="请输入年级名称"></el-input>
          </div>
          <div>
            <el-button class="saveWrap" type="success" @click="changeGradeName=null,showUpgrade=false,valiDate=null">取消</el-button>
            <el-button class="saveWrap" type="success" @click="next" style="margin-right: 10px;">确定</el-button>
          </div>
        </div>
      </div>
    </transition>
    <transition name="el-zoom-in-center">
      <div class="cover_wrap" v-if="showUpgradeAgain">
        <div class="cover_inner">
          <div style="margin: 0 20px;">
            <p>您确定将&nbsp;<i class="grade_style">{{dataItem.data.gradeName}}</i>&nbsp;升级为&nbsp;<i class="grade_style">{{changeGradeName}}</i>&nbsp;吗？</p>
            <p>确认请在下方输入验证信息：<i class="grade_style">我确认升级</i></p>
          </div>
          <div style="margin: 5px 20px; 0 20px">
            <el-input v-model="valiDate" style="width:60%;" placeholder="请输入验证信息"></el-input>
          </div>
          <div>
            <el-button class="saveWrap" type="success" @click="showUpgradeAgain=false,showUpgrade=true">返回</el-button>
            <el-button class="saveWrap" type="success" @click="confirmUpgrade" style="margin-right: 10px;">升级</el-button>
          </div>
        </div>
      </div>
    </transition>
    <transition name="el-zoom-in-center">
      <div class="cover_wrap" v-if="showGraduate">
        <div class="cover_inner">
          <div class="grade_name">
            <span>此年级为<i class="grade_style">{{dataItem.data.gradeName}}</i>，设置毕业后：</span>
            <ol style="margin-left:20px;">
              <li>'社群小助手' 会从本年级的所有微信群中退出</li>
              <li>权限管理中不再显示毕业的班级</li>
              <li>不再支持毕业班级的业务功能</li>
              <li>毕业前产生的业务数据不会丢失</li>
            </ol>
          </div>
          <div class="grade_name">
            <p style="margin-bottom:5px;">确认请在下方输入验证信息：<i class="grade_style">我确认毕业</i></p>
            <span>验证信息：</span>
            <el-input v-model="graduation" style="width:60%;" placeholder="请输入验证信息"></el-input>
          </div>
          <div>
            <el-button class="saveWrap" type="success" @click="graduation=null,showGraduate=false">取消</el-button>
            <el-button class="saveWrap" type="success" @click="gradeUate" style="margin-right: 10px;">确认毕业</el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import api from './api'
  export default {
    data () {
      return {
        gradeList: [],
        gradeName: null,
        changeGradeName: null,
        type: null,
        dataItem: {},
        showAlert: false,
        showUpgrade: false,
        showGraduate: false,
        showUpgradeAgain: false,
        valiDate: null,
        graduation: null,
        maxHeight: document.body.clientHeight - 169
      }
    },
    mounted () {
      this.getGrade()
    },
    methods: {
      getGrade () {
        api.getGradeList({schoolId: this.$route.params.schoolId}, (data) => {
          this.gradeList = data
        }, (er) => {})
      },
      editGrade (type, item, index) {
        this.dataItem = {
          data: item,
          index: index
        }
        switch (type) {
          case 'edit':
            this.gradeName = this.gradeList[index].gradeName
            this.showAlert = true
            this.type = 'edit'
            break
          case 'upgrade':
            this.showUpgrade = true
            break
          case 'graduate':
            this.showGraduate = true
            break
          case 'role':
            this.$router.push({'name': 'GradeLeaderManage', params: {gradeId: this.dataItem.data.gradeId}})
            break
        }
      },
      next () {
        if (!this.changeGradeName) {
          this.$message.error('请输入升级名称')
          return
        }
        setTimeout(() => {
          this.showUpgrade = false
          this.showUpgradeAgain = true
        }, 200)
      },
      confirmUpgrade () {
        if (!this.valiDate) {
          this.$message.error('请输入验证信息')
        } else {
          if (this.valiDate === '我确认升级') {
            this.gradeEdit((data) => {
              this.$message.success('升级成功')
              this.getGrade()
              this.valiDate = null
              this.changeGradeName = null
              this.showUpgradeAgain = false
            })
          } else {
            this.$message.error('验证信息错误')
          }
        }
      },
      gradeEdit (cb) {
        api.gradeEdit({schoolId: this.$route.params.schoolId, gradeId: this.dataItem.data.gradeId, gradeName: this.changeGradeName}, (data) => {
          cb(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('删除失败')
          }
        })
      },
      gradeUate () {
        if (!this.graduation) {
          this.$message.error('请输入验证信息')
        } else {
          if (this.graduation === '我确认毕业') {
            this.gradeEdit((data) => {
              this.$message.success('设置成功')
              this.getGrade()
              this.graduation = null
              this.showGraduate = false
            })
          } else {
            this.$message.error('验证信息错误')
          }
        }
      },
      deleteGrade (item, index) {
        this.$confirm('您确定删除此年级吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'error'
        }).then(() => {
          api.delGrade({schoolId: this.$route.params.schoolId, gradeId: item.gradeId}, (data) => {
            this.$message.success('删除成功')
            this.gradeList.splice(index, 1)
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.$message.error(er.message)
            } else {
              this.$message.error('删除失败')
            }
          })
        }).catch(() => {})
      },
      addGradeFun () {
        if (!this.gradeName) {
          this.$message.warning('请填写年级名称')
          return
        }
        if (this.type === 'edit') {
          api.editGrade({schoolId: this.$route.params.schoolId, gradeId: this.dataItem.data.gradeId, gradeName: this.gradeName}, (data) => {
            this.$message.success('修改成功')
            this.gradeList[this.dataItem.index].gradeName = this.gradeName
            this.showAlert = false
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.$message.error(er.message)
            } else {
              this.$message.error('修改失败')
            }
          })
        } else if (this.type === 'add') {
          api.addGrade({schoolId: this.$route.params.schoolId, gradeName: this.gradeName}, (data) => {
            this.$message.success('添加成功')
            this.$router.push({'name': 'GradeLeaderManageAdd', params: {gradeId: data.gradeId, isAdd: 'isAdd'}})
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.$message.error(er.message)
            } else {
              this.$message.error('添加失败')
            }
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
@import url('../../style/public.less');
.warpper{
  .header{
    .add_grade{
      float: right;
      margin-top: 10px;
    }
  }
  .table_wrap {
    margin-top: 5px;
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
      font-size:16px;
      .saveWrap {
        float: right;
      }
      .grade_name {
        margin:20px 20px;
      }
      .grade_style{
        color: red;
        font-style: normal;
        font-weight: 500;
      }
    }
  }
}
</style>

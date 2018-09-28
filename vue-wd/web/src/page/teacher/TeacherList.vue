<template>
  <div class="warpper">
    <div class="header">
      <span class="impot_title">教师管理</span><span v-if="teacherCount" style="margin-left:10px;">{{teacherCount != 0 && teacherCount != null ? '全校共' + teacherCount + '名教师' : ''}}</span>
      <div class="search_wrap">
        <div class="input_search">
          <el-input v-model="teacherName" placeholder="请输入老师名字" @input="searchValue"></el-input>
        </div>
        <el-button type="success" class="button_search" @click="addTeacher('save')">增加</el-button>
        <el-button type="success" class="button_search" style="margin-right:20px;" @click="searchTeacher">搜索</el-button>
      </div>
    </div>
    <div class="teacher_list">
      <el-table :data="teacherList" border :max-height="maxHeight" empty-text="暂无教师">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="头像" width="100" align="center">
          <template slot-scope="scope">
            <img class="userIcon" :src="tools.cdn(scope.row.userIcon, 'head.png', 128)">
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="teacherName" align="center" min-width="50"></el-table-column>
        <el-table-column label="性别" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.teacherSex | filterSex}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类别" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.teacherType | filterType}}</span>
          </template>
        </el-table-column>
        <el-table-column label="班级" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.classNames == null ? '无' : scope.row.classNames + '班主任'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260">
          <template slot-scope="scope">
            <el-button type="primary" v-if="scope.row.userId" size="mini" disabled>已绑定</el-button>
            <el-button size="mini" v-else type="primary" @click="bindTeacher(scope.row)">点击绑定</el-button>
            <el-button size="mini" type="success" @click="changeInfo(scope.row, scope.$index)">修改</el-button>
            <el-button size="mini" type="danger" @click="confirmDelete(scope.row.teacherId, scope.$index, scope.row.teacherName)">删除</el-button>
          </template>
        </el-table-column>
        <p v-if="isShowLoadMore" slot="append" style="padding:10px 0;text-align:center;cursor: pointer;"><span style="font-size:15px;color:#2E84D4" @click="loadMore">加载更多</span></p>
      </el-table>
    </div>
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-show="showAlert">
        <div class="cover_inner">
          <el-form label-position="left" label-width="85px" :model="teacherInfo">
            <el-form-item label="教师姓名">
              <el-col :span="12">
                <el-input v-model="teacherInfo.teacherName"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="教师性别">
              <el-col :span="12">
                <el-radio v-model="teacherInfo.teacherSex" label="1">男</el-radio>
                <el-radio v-model="teacherInfo.teacherSex" label="2">女</el-radio>
              </el-col>
            </el-form-item>
            <el-form-item label="教师类别">
              <el-col :span="18">
                <el-radio v-model="teacherInfo.teacherType" label="1">任课教师</el-radio>
                <el-radio v-model="teacherInfo.teacherType" label="2">后勤教师</el-radio>
                <el-radio v-model="teacherInfo.teacherType" label="3">教务教师</el-radio>
              </el-col>
            </el-form-item>
            <el-form-item label="教师生日">
              <el-col :span="12">
                <el-date-picker
                  v-model="teacherInfo.teacherBirthday"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="教师手机号">
              <el-col :span="12">
                <el-input v-model="teacherInfo.teacherTelephoneNum"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
          <div>
            <el-button class="saveWrap" type="success" @click="clearAlert">关闭</el-button>
            <el-button class="saveWrap" type="success" @click="saveTeacher" style="margin-right:10px;">保存</el-button>
          </div>
        </div>
      </div>
    </transition>
    <qrcode v-show="showQrcode" :value="codeUrl" :size="maxWidth" @close-qrcode="showQrcode = false"></qrcode>
  </div>
</template>

<script>
  import api from './api.js'
  import Qrcode from '@/components/Qrcode'
  export default {
    components: { Qrcode },
    data () {
      return {
        codeUrl: '',
        showQrcode: false,
        showAlert: false,
        teacherList: [],
        teacherName: null,
        isShowLoadMore: true,
        teacherInfo: {},
        teacherMessage: {},
        index: null,
        teacherCount: 0,
        type: null,
        maxHeight: document.body.clientHeight - 169, // 140
        maxWidth: document.body.clientHeight * 0.3
      }
    },
    mounted () {
      this.getTeacherList(this.teacherList.length, (data) => {
        this.teacherList = data
        this.nextPageStatus(data, 20)
      })
      api.teacherListCount({schoolId: this.$route.params.schoolId}, (data) => {
        this.teacherCount = data
      }, (er) => {})
    },
    methods: {
      addTeacher () {
        this.type = 'save'
        this.showAlert = true
      },
      clearAlert () {
        this.showAlert = false
        this.type = null
        this.teacherInfo = {}
      },
      bindTeacher (code) {
        api.getTeacherBindingCode({schoolId: this.$route.params.schoolId, teacherId: code.teacherId}, (data) => {
          console.log(data)
          this.codeUrl = data
          this.showQrcode = true
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('获取二维码失败')
          }
        })
      },
      saveTeacher () {
        if (!this.teacherInfo.teacherName) {
          this.$message.error('请填写教师名字')
          return
        }
        if (this.teacherInfo.teacherTelephoneNum) {
          if (!(/^1[34578]\d{9}$/.test(this.teacherInfo.teacherTelephoneNum))) {
            this.$message.error('请填写正确手机号码！')
            return
          }
        }
        if (!this.teacherInfo.teacherType) {
          this.$message.error('请选择教师类别')
          return
        }
        let info = {
          teacherName: this.teacherInfo.teacherName,
          teacherSex: this.teacherInfo.teacherSex,
          teacherType: this.teacherInfo.teacherType,
          teacherTelephoneNum: this.teacherInfo.teacherTelephoneNum
        }
        if (this.teacherInfo.teacherBirthday !== null && this.teacherInfo.teacherBirthday !== undefined) {
          info.teacherBirthday = this.tools.formateTime(this.teacherInfo.teacherBirthday, 'YYYY-MM-DD')
        } else {
          info.teacherBirthday = null
        }
        if (this.type === 'save') {
          api.saveTeacher({schoolId: this.$route.params.schoolId, data: info}, (data) => {
            this.$message.success('添加成功')
            this.clearAlert()
            this.getTeacherList(0, (data) => {
              this.teacherList = data
              this.nextPageStatus(data, 20)
            })
            api.teacherListCount({schoolId: this.$route.params.schoolId}, (data) => {
              this.teacherCount = data
            }, (er) => {})
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.$message.error(er.message)
            } else {
              this.$message.error('添加失败')
            }
          })
        } else if (this.type === 'edit') {
          api.updateTeacher({schoolId: this.$route.params.schoolId, teacherId: this.teacherMessage.teacherId, data: info}, (data) => {
            this.showAlert = false
            this.type = null
            this.$message.success('修改成功')
            this.teacherList[this.index].teacherName = this.teacherInfo.teacherName
            this.teacherList[this.index].teacherSex = this.teacherInfo.teacherSex
            this.teacherList[this.index].teacherType = this.teacherInfo.teacherType
            this.teacherInfo = {}
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.$message.error(er.message)
            } else {
              this.$message.error('修改失败')
            }
          })
        }
      },
      searchTeacher () {
        if (!this.teacherName) {
          this.$message({
            message: '请填写老师名字',
            type: 'warning'
          })
          return
        }
        this.getTeacherList(0, (data) => {
          this.teacherList = data
          this.nextPageStatus(data, 20)
        })
      },
      searchValue () {
        if (!this.teacherName && this.teacherName === '') {
          this.getTeacherList(0, (data) => {
            this.teacherList = data
            this.nextPageStatus(data, 20)
          })
        }
      },
      loadMore () {
        this.getTeacherList(this.teacherList.length, (data) => {
          this.teacherList = this.teacherList.concat(data)
          this.nextPageStatus(data, 20)
        })
      },
      nextPageStatus (data, count) {
        if (data.length >= 20) {
          this.isShowLoadMore = true
        } else {
          this.isShowLoadMore = false
        }
      },
      confirmDelete (teacherId, index, teacherName) {
        this.$confirm('是否删除[' + teacherName + ']老师?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delTeacher({schoolId: this.$route.params.schoolId, teacherId: teacherId}, (data) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.teacherList.splice(index, 1)
            if (this.teacherList.length <= 0) {
              this.teacherName = null
              this.getTeacherList(0, (data) => {
                this.teacherList = data
                this.nextPageStatus(data, 20)
              })
            }
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.$message.error(er.message)
            } else {
              this.$message.error('删除失败')
            }
          })
        }).catch(() => {})
      },
      changeInfo (item, index) {
        this.teacherMessage = item
        this.index = index
        api.getTeacherinfo({schoolId: this.$route.params.schoolId, teacherId: item.teacherId}, (data) => {
          if (data.teacherSex) {
            data.teacherSex = data.teacherSex.toString()
          }
          if (data.teacherType) {
            data.teacherType = data.teacherType.toString()
          }
          if (data.teacherBirthday) {
            data.teacherBirthday = new Date(data.teacherBirthday)
          }
          this.teacherInfo = data
          this.showAlert = true
          this.type = 'edit'
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('修改失败')
          }
        })
      },
      getTeacherList (rowStart, cb) {
        api.getTeacherList({schoolId: this.$route.params.schoolId, teacherName: this.teacherName, rowStart: rowStart, rowCount: 20}, (data) => {
          cb(data)
        }, (er) => {})
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
  .search_wrap{
    width:400px;
    float:right;
    margin-top: 10px;
    .input_search{
      float: left;
      width:210px;
      margin-right: 10px;
    }
    .button_search{
      float: right;
    }
  }
  .teacher_list{
    margin-top: 5px;
    background:#fff;
    .userIcon {
      width: 40px;
      height: 40px;
      vertical-align: middle;
      border-radius: 20px;
    }
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
      .saveWrap {
        float: right;
      }
    }
  }
}
</style>


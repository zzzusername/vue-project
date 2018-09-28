<template>
  <div class="list_wrap warpper">
    <div class="header">
      <span class="impot_title">作业列表</span>
    </div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%;" border :max-height="maxHeight">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="头像" width="80" align="center">
          <template slot-scope="scope">
            <img class="userIcon" :src="tools.cdn(scope.row.userIcon, 'head.png', 128)">
          </template>
        </el-table-column>
        <el-table-column label="老师" prop="teacherName" align="center" min-width="50"></el-table-column>
        <el-table-column label="作业名称" prop="workName" align="center" min-width="70"></el-table-column>
        <el-table-column label="班级" prop="className" align="center" min-width="70"></el-table-column>
        <el-table-column label="创建时间" align="center" min-width="60">
          <template slot-scope="scope">
            <span v-html="eidtTime(scope.row.createDate)"></span>
          </template>
        </el-table-column>
        <el-table-column label="截止时间" align="center" min-width="60">
          <template slot-scope="scope">
            <span v-html="eidtTime(scope.row.endDate)"></span>
          </template>
        </el-table-column>
        <el-table-column label="完成情况" prop="teacherName" align="center" min-width="40">
          <template slot-scope="scope">
            <span v-if="scope.row.requireCommitNum > 0">{{scope.row.commitNum + '/' + scope.row.totalNum}}</span>
            <span v-else>{{scope.row.totalNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="rowFunction(scope.$index, 'look')">查看</el-button>
            <el-button size="mini" type="primary" v-if="userInfo.userId === scope.row.userId" @click="rowFunction(scope.$index, 'edit')">修改</el-button>
            <el-button size="mini" type="danger" v-if="userInfo.userId === scope.row.userId" @click="rowFunction(scope.$index, 'delete')">删除</el-button>
          </template>
        </el-table-column>
        <p v-if="showNext" slot="append" style="padding:10px 0;text-align:center;cursor: pointer;"><span style="font-size:15px;color:#2E84D4" @click="loadMore">加载更多</span></p>
      </el-table>
    </div>
  </div>
</template>

<script>
  import api from './api'
  export default {
    data () {
      return {
        tableData: [],
        showNext: false,
        maxHeight: document.body.clientHeight - 169 // 140
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo
      }
    },
    mounted () {
      this.getWorkList(0, (data) => {
        this.tableData = data
        this.nextPageStatus(data, 20)
      })
    },
    methods: {
      eidtTime (val) {
        return this.tools.formateTime(val, 'YYYY-MM-DD HH:mm')
      },
      loadMore () {
        this.getWorkList(this.tableData.length, (data) => {
          this.tableData = this.tableData.concat(data)
          this.nextPageStatus(data, 20)
        })
      },
      nextPageStatus (data, count) {
        if (data.length >= 20) {
          this.showNext = true
        } else {
          this.showNext = false
        }
      },
      getWorkList (rowStart, callback) {
        api.teacherQueryWork({schoolId: this.$route.params.schoolId, classId: null, startDate: null, endDate: null, status: null, rowStart: rowStart, rowCount: 20}, (data) => {
          callback(data)
        }, (er) => {})
      },
      rowFunction (index, code) {
        switch (code) {
          case 'look':
            this.$router.push({name: 'HomeworkPercent', params: {workId: this.tableData[index].workId}})
            break
          case 'edit':
            this.$router.push({name: 'ChangeHomework', params: {workId: this.tableData[index].workId}})
            break
          case 'delete':
            if (this.tableData[index].commitNum > 0) {
              this.$message.error('该作业已有人提交，不能删除')
              return
            }
            this.$confirm('您确定删除【' + this.tableData[index].workName + '】吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              api.deleteWork({schoolId: this.$route.params.schoolId, workId: this.tableData[index].workId}, (data) => {
                this.$message.success('删除成功')
                this.tableData.splice(index, 1)
              }, (err) => {
                if (err.toUser) {
                  this.$message.error(err.message)
                } else {
                  this.$message.error('删除失败')
                }
              })
            }).catch(() => {})
            break
        }
      },
      pushHomework () {
        api.pushWork({schoolId: this.$route.params.schoolId, classId: this.currentitem.classId, workId: this.currentitem.workId}, () => {
          this.$alert('推送成功', '提示', {
            confirmButtonText: '确定'
          })
        }, (err) => {
          if (err.toUser) {
            this.$message.error(err.message)
          } else {
            this.$message.error('推送失败')
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
.el-table--enable-row-transition .el-table__body td{
  padding: 12px 0 !important;
}
.list_wrap .content{
  margin-top: 5px;
}
.list_wrap .content .next{
  text-decoration: none;
  color: #333;
  display: block;
  border: 1px solid rgb(194,213,227);
  margin-top: 5px;
  padding: 10px;
  text-align: center;
  background: #fff;
  font-size: 12px;
}
.list_wrap .content .userIcon{
  width: 40px;
  height: 40px;
  vertical-align: middle;
  border-radius: 20px;
}
.list_wrap .look_button{
  color:#67c23a;
  display:inline-block;
  margin-right:10px;
  cursor: pointer;
}
</style>

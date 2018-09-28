<template>
  <div class="warpper">
    <div class="header">
      <span>公告列表</span>
    </div>
    <div v-if="showFilter" class="filter">
      <span>筛选:</span>
      <el-button size="mini" round :type="checkFilter == 1 ? 'primary' : null" @click="filter(1)">全校公告</el-button>
      <el-button size="mini" round :type="checkFilter == 2 ? 'primary' : ''" @click="filter(2)">教师公告</el-button>
      <el-button size="mini" round :type="checkFilter == 3 ? 'primary' : ''" @click="filter(3)">班级公告</el-button>
    </div>
    <div class="content">
      <el-table :data="list" border style="width: 100%" :max-height="maxHeight" empty-text="暂无公告">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="date" label="发布日期"></el-table-column>
        <el-table-column prop="end" label="截止日期"></el-table-column>
        <el-table-column prop="view" label="浏览量"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="medium" type="text" @click="operation(scope.row, 'MODIFY')">修改</el-button>
            <el-button size="medium" type="text" @click="operation(scope.row, 'PUSH')">推送</el-button>
            <el-button size="medium" type="text" @click="operation(scope.row, 'DELETE')">删除</el-button>
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
      list: [],
      checkFilter: 1,
      showNext: false,
      itemNotice: {},
      showFilter: false,
      maxHeight: document.body.clientHeight - 217
    }
  },
  mounted () {
    this.$store.dispatch('getUserInfo', this.$route.params.schoolId).then(() => {
      if (this.$store.state.userInfo.schoolModel === 2) {
        this.showFilter = false
      } else {
        this.showFilter = true
      }
    })
    this.getList(0, (data) => {
      this.list = data
      this.nextPageStatus(data, 20)
    })
  },
  methods: {
    filter (index) {
      this.showNext = false
      this.checkFilter = index
      this.getList(0, (data) => {
        this.list = data
        this.nextPageStatus(data, 20)
      })
    },
    getList (rowStart, callback) {
      api.getNoticeList({schoolId: this.$route.params.schoolId, type: this.checkFilter, rowStart, rowCount: 20}, (data) => {
        let list = []
        data.forEach(item => {
          list.push({
            title: item.noticeTitle,
            date: this.tools.formateTime(item.publishStartDate, 'YYYY-MM-DD HH:mm'),
            end: this.tools.formateTime(item.publishEndDate, 'YYYY-MM-DD HH:mm'),
            view: item.viewNum,
            noticeId: item.noticeId
          })
        })
        callback(list)
      }, (er) => {
        if (er.toUser) {
          this.$message.error(er.message)
        }
      })
    },
    loadMore () {
      this.getList(this.list.length, (data) => {
        this.list = this.list.concat(data)
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
    operation (val, type) {
      switch (type) {
        case 'MODIFY':
          this.$router.push({name: 'NoticeModify', params: {noticeId: val.noticeId}})
          break
        case 'PUSH':
        case 'DELETE':
          this.itemNotice = {noticeId: val.noticeId, name: val.title, type: type}
          this.noticeId = val.noticeId
          this.confirmDialog()
          break
      }
    },
    confirm () {
      if (this.itemNotice.type === 'PUSH') {
        api.pushNotice({schoolId: this.$route.params.schoolId, noticeId: this.noticeId}, (data) => {
          this.$message.success('推送成功')
        }, (er) => {
          if (er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('推送失败')
          }
        })
      } else if (this.itemNotice.type === 'DELETE') {
        api.deleteNotice({schoolId: this.$route.params.schoolId, noticeId: this.noticeId}, (data) => {
          this.$message.success('删除成功')
          for (let index = 0; index < this.list.length; index++) {
            const element = this.list[index]
            if (element.noticeId === this.itemNotice.noticeId) {
              this.list.splice(index, 1)
              break
            }
          }
        }, (er) => {
          if (er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('删除失败')
          }
        })
      }
    },
    confirmDialog () {
      let message = this.itemNotice.type === 'PUSH' ? '您确定推送标题为【' + this.itemNotice.name + '】的公告吗？' : this.itemNotice.type === 'DELETE' ? '您确定删除标题为【' + this.itemNotice.name + '】的公告吗？' : ''
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirm()
      }).catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
.filter {
  background-color: @bg-color;
  padding: 10px 20px;
  span {
    margin-right: 10px;
  }
}
.next {
  text-decoration: none;
  color: #333;
  display: block;
  border: 1px solid rgb(194,213,227);
  margin-top: 5px;
  padding: 10px;
  text-align: center;
  font-size: 12px;
}
</style>

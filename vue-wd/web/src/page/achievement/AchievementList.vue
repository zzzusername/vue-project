<template>
  <div class="achievement_list">
    <div class="header">
      <span class="impot_title">成绩列表</span>
    </div>
    <div class="content" v-if="list.length > 0">
      <el-table :data="list" border empty-text="暂无成绩单" :max-height="maxHeight">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="头像" align="center" min-width="50">
          <template slot-scope="scope">
            <img :src="tools.cdn(scope.row.userIcon, 'head.png', 128)" class="head_icon">
          </template>
        </el-table-column>
        <el-table-column label="老师" prop="teacherName" min-width="50" align="center"></el-table-column>
        <el-table-column label="日期" align="center" min-width="50">
          <template slot-scope="scope">
            <span v-html="eidtTime(scope.row.publishDate)"></span>
          </template>
        </el-table-column>
        <el-table-column label="班级" prop="className" min-width="50" align="center"></el-table-column>
        <el-table-column label="课程" align="center" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.lessonName == null ? '无' : scope.row.lessonName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="achievementsName" min-width="50" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="goDetails('look', scope.row, scope.$index)">查看</el-button>
            <el-button v-if="scope.row.userId == userInfo.userId" size="mini" type="primary" @click="goDetails('edit', scope.row, scope.$index)">修改</el-button>
            <el-button v-if="scope.row.userId == userInfo.userId" size="mini" type="danger" @click="goDetails('delete', scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
        <p v-if="showNext" slot="append" style="padding:10px 0;text-align:center;cursor: pointer;"><span style="font-size:15px;color:#2E84D4" @click="loadMore">加载更多</span></p>
      </el-table>
    </div>
    <!-- 图片 -->
    <div class="empty_wrap" v-else>
      <div class="prop_center">
        <img src="../../assets/empty.png">
      </div>
    </div>
  </div>
</template> 
<script>
import api from './api'
export default {
  data () {
    return {
      list: [],
      index: 0,
      showNext: true,
      maxHeight: document.body.clientHeight - 169 // 140
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  mounted () {
    this.getchieveList(0, (data) => {
      this.list = data
      this.nextPageStatus(data, 20)
    })
  },
  methods: {
    eidtTime (val) {
      return this.tools.formateTime(val, 'YYYY-MM-DD')
    },
    loadMore () {
      this.getchieveList(this.list.length, (data) => {
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
    getchieveList (rowStart, callback) {
      api.getAchievementListForTeacher({schoolId: this.$route.params.schoolId, rowStart: rowStart, rowCount: 20}, (data) => {
        callback(data)
      }, (er) => {})
    },
    goDetails (code, item, index) {
      this.index = index
      if (code === 'look') {
        this.$router.push({name: 'AchievementDetailsLook', params: {achievementsId: item.achievementsId, edit: 'look', classId: item.classId}})
      } else if (code === 'delete') {
        this.$confirm('您确定删除此成绩单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.delete(item)
        }).catch(() => {})
      } else if (code === 'edit') {
        this.$router.push({name: 'AchievementDetailsEdit', params: {achievementsId: item.achievementsId, edit: 'edit', classId: item.classId}})
      }
    },
    delete (info) {
      api.deleteAchievement({schoolId: this.$route.params.schoolId, classId: info.classId, achievementsId: info.achievementsId}, (data) => {
        this.list.splice(this.index, 1)
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.$message.error(er.message)
        } else {
          this.$message.error('删除失败，请稍后再试！')
        }
      })
    }
  },
  filters: {}
}
</script>
<style scoped>
.achievement_list{
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding:20px;
  box-sizing: border-box;
}
.achievement_list .header{
  background: #fff;
  border-top: 4px solid #67c23a;
  padding: 0 20px;
  box-sizing: border-box;
}
.achievement_list .header .impot_title{
  line-height: 60px;
  font-size: 16px;
  font-weight: 600;
}
.achievement_list .content{
  margin-top: 5px;
}
.achievement_list .content .head_icon{
  width: 40px;
  height: 40px;
  vertical-align: middle;
  border-radius: 20px;
}
.achievement_list .content .next{
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
.achievement_list .content .next:hover{
  background: #F9F9F9;
}
.achievement_list .empty_wrap{
  height:calc(100% - 64px);
  margin-top: 5px;
  background: #fff;
  position: relative;
}
.achievement_list .empty_wrap .prop_center{
  width: 280px;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform:translate(-50%,-50%);
  -moz-transform:translate(-50%,-50%);
  -o-transform:translate(-50%,-50%);
  transform:translate(-50%,-50%);
}
.achievement_list .empty_wrap .prop_center img{
  width:158px;
  height:123px;
}
</style>


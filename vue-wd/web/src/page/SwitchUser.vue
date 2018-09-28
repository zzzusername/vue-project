<template>
  <div class="user_wrap">
    <el-table :data="userListData" style="width: 100%;" border :max-height="maxHeight" empty-text="暂无用户">
      <el-table-column label="头像" width="100" align="center">
        <template slot-scope="scope">
          <img class="userIcon" :src="tools.cdn(scope.row.userIcon, 'head.png', 128)">
        </template>
      </el-table-column>
      <el-table-column label="微信昵称" prop="userName" align="center" min-width="50"></el-table-column>
      <el-table-column label="用户ID" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="国籍" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.userCountry ? scope.row.userCountry : '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.userCity ? scope.row.userCity : '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.userSex == 1 ? '男' : '女'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" min-width="50">
        <template slot-scope="scope">
          <span v-html="eidtTime(scope.row.createDate)"></span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" min-width="50">
        <template slot-scope="scope">
          <span v-html="eidtTime(scope.row.updateDate)"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="50">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click.native.prevent="switchUser(scope.row)">切换</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import api from './api'
  export default {
    data () {
      return {
        userListData: [],
        maxHeight: document.body.clientHeight - 20 // 140
      }
    },
    mounted () {
      api.getUserList((userListData) => {
        this.userListData = userListData
      }, () => {
        this.userListData = []
      })
    },
    methods: {
      eidtTime (val) {
        if (val !== null && val !== undefined) {
          return this.tools.formateTime(val, 'YYYY-MM-DD HH:mm')
        } else {
          return '无'
        }
      },
      switchUser (code) {
        let userId = code.userId
        api.switchUser({userId}, () => {
          this.$message.success('切换成功')
          this.$router.push({name: 'SchoolCard'})
        }, () => {
          this.$message.error('切换失败')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.user_wrap {
  width:100%;
  padding:10px 20px;
  box-sizing: border-box;
  background: rgb(241, 243, 246);
  .userIcon{
    width: 40px;
    height: 40px;
    vertical-align: middle;
    border-radius: 20px;
  }
}
</style>

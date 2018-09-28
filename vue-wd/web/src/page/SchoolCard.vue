<template>
  <div style="height: 100%;" v-if="schoolData.length > 0">
      <header>
        <img src="../assets/jy_logo_white.png">
        <h1>校和家</h1>
        <div class="header_right">
          <span class="username" v-if="isShowSwitch" @click="goSwitchUser">切换用户</span>
          <div class="lagout_button" @click="logout">退出</div>
        </div>
      </header>
      <div class="content">
        <el-row :gutter="10">
          <el-col :span="6" v-for="(item, index) in schoolData" :key="index">
            <el-card class="card_info" shadow="hover" :body-style="{ padding: '0px' }">
              <div class="schoolHand" v-bind:style="{'background-image':'url('+tools.cdn(item.schoolLogo, 'school-icon.png')+')'}"></div>
              <div style="padding: 14px;">
                <p style="font-weight:500;">学校名称：{{item.schoolName}}</p>
                <span v-if="item.schoolModel !== null && item.schoolModel !== undefined">{{item.schoolModel == 2 ? '（个人版）' : '（机构版）'}}</span>
                <div style="margin-top:10px;">
                  <el-button type="success" size="mini" @click="getIdentity(item)">点击进入</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
  </div>
</template>
<script>
import api from './api.js'
export default {
  data () {
    return {
      schoolData: [],
      isShowSwitch: false
    }
  },
  beforeCreate () {
    this.$store.dispatch('getSchoolList')
  },
  computed: {
    schoolList () {
      return this.$store.state.schoolList
    }
  },
  mounted () {
    if (process.env.IS_SHOW_SWITCH_USER === true) {
      this.isShowSwitch = true
    }
  },
  watch: {
    schoolList: function (newSchoolList, old) {
      if (newSchoolList.length > 0) {
        this.schoolData = newSchoolList
      } else {
        this.$alert('对不起，请您在手机微信中打开！', '温馨提示', {
          confirmButtonText: '确定',
          callback: action => {
            api.homeLogout((data) => {
              window.location.reload()
            }, (er) => {})
          }
        })
      }
    }
  },
  methods: {
    goSwitchUser () {
      this.$router.push({name: 'SwitchUser'})
    },
    getIdentity (data) {
      if (data.schoolStatus === 1) {
        if (data.memberType.indexOf('MASTER') !== -1 || data.memberType.indexOf('TEACHER') !== -1) {
          sessionStorage.setItem('identity', 'TEACHER')
        } else if (data.memberType.indexOf('PARENT') !== -1) {
          sessionStorage.setItem('identity', 'PARENT')
        } else if (data.memberType.indexOf('STUDENT') !== -1) {
          sessionStorage.setItem('identity', 'STUDENT')
        }
        this.$router.push({ name: 'Welcome', params: { schoolId: data.schoolId } })
        // else {
        //   this.$alert('对不起，请您在手机微信中打开！', '温馨提示', {
        //     confirmButtonText: '确定'
        //   })
        // }
      } else {
        this.$alert('您的学校暂时无法使用，请联系学校管理员！', '温馨提示', {
          confirmButtonText: '确定'
        })
      }
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
<style scoped>
header {
  width: 100%;
  height: 60px;
	background: #1e3d80;
}
header img {
  display: inline-block;
  width: 50px;
  height: 50px;
  margin-top: 5px;
  margin-left: 25px;
  float: left;
}
header h1{
  width: 100px;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  float: left;
  color: #fff;
  text-align: center;
}
header .header_right{
  float: right;
}
header .header_right .username{
  float: left;
  line-height: 60px;
  color: #fff;
  margin-right: 20px;
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
.content{
  padding: 0 20px 10px 20px;
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 60px);
  /* height: 100%; */
  overflow-y: auto;
  background: rgb(241, 243, 246);
}
.content .card_info{
  width: 100%;
  height: 330px;
  background: #fff;
  margin-top:10px;
  text-align: center;
  cursor: pointer;
}
.content .card_info .schoolHand{
  height:210px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.content .card_info img {
	width: 120px;
	height: 120px;
	display: inline-block;
	margin-top: 30px;
	margin-bottom: 10px;
	border: none;
}
</style>


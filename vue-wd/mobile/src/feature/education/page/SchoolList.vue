<template>
  <div>
    <div>
      <div v-for="(item, index) in schoolList" :key="index" class="school_icon" :style="{'background-image':'url('+tools.cdn(tools.isNull(item.schoolLogo)?'school/school-icon.png':item.schoolLogo, 'logo.png')+')', 'marginBottom': '5px'}" @click="onClick(item)">
        <div style="margin:0 auto;position:relative;width:100%;height:100%">
          <div style="width:100%;height:100%;background-color:#000;opacity:0.2;"></div>
          <h2 class="shool-hand-title">{{item.schoolName}}</h2>
          <!--&nbsp;<span style="font-size:14px;">{{parseInt(item.schoolModel) == 1 ? '(机构版)' : '(个人版)'}}</span>-->
        </div>
      </div>
      <div v-if="isShowError" style="text-align:left;font-size: 16px;fontSize:16px;color:#888;">
        <group gutter="0">
          <p style="color:#424242;font-size:16px;padding:15px;">{{userInfo.userName}}，您好！本系统只向学校教师和家长开放使用，请搜索找到学校，并成功加入后，方可使用。</p>
        </group>
        <group>
          <div :style="{'height':(hintHeight -85) + 'px'}">
            <p style="font-size:16px;color:#424242;padding-left:15px;padding-top:15px;">请搜索您的目标学校：</p>
            <div class="search_dd" style="margin-top:10px;">
                <form class="form_dd">
                    <input class="input_dd" type="text" placeholder="请输入学校名称" v-model="searchValue">
                    <button class="button_dd" type="button" @click="onSearch"></button>
                </form>
            </div>
            <div v-if="tempSchoolList.length > 0" style="height:100px;width:100vw;margin:0 auto;position: absolute;z-index:999;">
              <x-table full-bordered style="background-color:#fff;width:70vw;margin:0 auto;font-size:14px;background:#f2f2f2;">
                <tbody>
                  <tr v-for="(item, index) in tempSchoolList" :key="index" v-if="index<3">
                    <td @click="onSelectKeyword(item.schoolName)" style="text-align:left;padding-left:10px;"><span class="iconfont icon-sousuo" style="color:#555;"></span> {{item.schoolName}}</td>
                  </tr>
                </tbody>
              </x-table>
            </div>
            <div :style="{'height':(isNoData?'70px':'45vh'), 'width':'70vw', 'margin':'0 auto', 'overflow-y':'scroll'}">
              <p v-if="isNoData" style="font-size:16px;text-align:center;padding-top:20px;">对不起，没找到您的学校</p>
              <cell v-for="(item, index) in searchSchoolList" :key="index">
                <p slot="title" style="font-size:14px;">{{item.schoolName}}</p>
                <span style="font-size:14px;color:#2E84D4" @click="toSchoolIndex(item)">立即加入</span>
              </cell>
            </div>
            <div v-if="isNoData" style="font-size:14px;text-align:center;">
              <p>如果您希望继续使用，请联系客服人员</p>
              <p>长按识别下图二维码，添加客服人员为好友</p>
              <div style="text-align:center;margin-top:15px;margin-bottom:10px;">
                <img style="width:60vw;height:60vw;margin:0 auto;" src="http://img.qunxiaozhu.com/error/page/WechatIMG9481.jpeg"/>
              </div>
            </div>
            <p v-else style="position: absolute;font-size:14px;text-align:center;bottom: 5vh;width:100vw;">如需帮助，请联系客服人员（微信号：jiaxiaoshequn）</p>
          </div>
        </group>
      </div>
      <!-- <p v-show="desc!=null" style="text-align:center;font-size: 16px;padding: 5px 15px;fontSize:16px;color:#a2a2a2; margin-top:20px;">{{desc}}</p> -->
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, XTable } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
import searchApi from '@/feature/index/api'
import { mapGetters } from 'vuex'
export default {
  components: {
    Group, Cell, DetailTabbar, XTable
  },
  data() {
    return {
      schoolList: [],
      desc: null,
      isShowError: false,
      searchValue: null,
      searchSchoolList: [],
      requestDone: true,
      tempSchoolList: [],
      currentSearchSchoolName: null,
      isNoData: false,
      hintHeight: 0
    }
  },
  watch: {
    searchValue (newVal, oldVal) {
      this.onChange(newVal)
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted() {
    this.hintHeight = window.innerHeight - 60
    api.getMySchoolList((data) => {
      this.schoolList = this.schoolList.concat(data)
      if (this.schoolList.length === 0) {
        this.isShowError = true
        // this.desc = '您还没有加入到任何学校，请联系您所在的学校管理员'
      }
    }, (er) => {
      this.isShowError = true
      // this.desc = '您还没有加入到任何学校，请联系您所在的学校管理员'
      if (er.toUser !== undefined && er.toUser) {
        this.tools.warnToast(er.message)
      }
    })
  },
  methods: {
    toSchoolIndex (item) {
      this.$router.push({name: 'schoolIndex', params: {schoolId: item.schoolId}})
    },
    onSelectKeyword (schoolName) {
      this.currentSearchSchoolName = schoolName
      this.searchValue = schoolName
      this.onSearch(schoolName)
    },
    onSearch () {
      if (this.tools.isNull(this.searchValue)) {
        this.tools.warnToast('请输入学校名称')
        return
      }
      this.tempSchoolList = []
      searchApi.querySchoolByName({schoolName: this.searchValue}, (data) => {
        this.searchSchoolList = data
        if (data.length === 0) {
          this.isNoData = true
        }
        this.currentSearchSchoolName = null
      }, () => {})
    },
    onChange (val) {
      this.isNoData = false
      if (val === this.currentSearchSchoolName) {
        return
      }
      let self = this
      if (this.requestDone) {
        this.requestDone = false
        searchApi.querySchoolByName({schoolName: val}, (data) => {
          self.tempSchoolList = data
          this.requestDone = true
        }, () => {})
      }
    },
    onClick(data) {
      if (data.schoolStatus === 2) {
        // 如果未审核跳转到提交页面
        if (parseInt(data.schoolModel) === 1) {
          this.$router.replace({name: 'educationSchoolOrder', params: {schoolId: data.schoolId, isRenew: 'noRenew'}})
          return
        } else {
          this.$router.replace({name: 'educationClassOrder', params: {schoolId: data.schoolId}})
          return
        }
      }
      this.localStorage.clearTeacherFeature() // 每次进入教师首页需先清空教师功能的缓存
      this.localStorage.getUserInfo({schoolId: data.schoolId, isRefresh: true}, (info) => {
        let userCurrentStatus = this.localStorage.getSchoolUserIdentity(data.schoolId, this.userInfo.userId)
        if (!this.tools.isNull(userCurrentStatus)) {
          if (userCurrentStatus === 'teacher') {
            this.$router.replace({ name: 'educationTeacherHome', params: { schoolId: data.schoolId } })
            return
          } else if (userCurrentStatus === 'parent') {
            this.$router.replace({ name: 'educationParentsHome', params: { schoolId: data.schoolId } })
            return
          } else if (userCurrentStatus === 'student') {
            this.$router.replace({ name: 'educationStudentHome', params: { schoolId: data.schoolId } })
            return
          }
        }
        if (data.memberType.indexOf('MASTER') !== -1 || data.memberType.indexOf('TEACHER') !== -1) {
          this.$router.replace({ name: 'educationTeacherHome', params: { schoolId: data.schoolId } })
        } else if (data.memberType.indexOf('PARENT') !== -1) {
          this.$router.replace({ name: 'educationParentsHome', params: { schoolId: data.schoolId } })
        } else if (data.memberType.indexOf('STUDENT') !== -1) {
          this.$router.replace({ name: 'educationStudentHome', params: { schoolId: data.schoolId } })
        }
      })
    }
  }
}
</script>
<style>
.shool-hand-title{
  position:absolute;
  text-align: center;
  color : #fff;
  width: 100%;
  top: 13vw;
}
.school_icon{
  width:100vw;
  height:35vw;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
div.search_dd {
	padding:10px 0px 0 0;
}
.form_dd {
	position:relative;
	width:70vw;
	margin:0 auto;
}
.input_dd {
  border:none;
	outline:none;
	width:100%;
	height:38px;
	padding-left:13px;
  box-sizing:border-box;
}
.button_dd {
  border:none;
	outline:none;
	height:38px;
	width:38px;
	cursor:pointer;
	position:absolute;
}
.search_dd input {
	border:2px solid #8FBE58;
	border-radius:5px;
	background:transparent;
	top:0;
	right:0;
}
.search_dd button {
	background:#8FBE58;
	border-radius:0 5px 5px 0;
	width:60px;
	top:0;
	right:0;
}
.search_dd button:before {
	content:"搜索";
	font-size:13px;
	color:#F9F0DA;
}
</style>

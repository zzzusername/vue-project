<template>
  <div>
    <group gutter="0">
      <cell v-for="(item, index) in schoolList" :key="index" :title="item.schoolName" is-link @click.native="pushRouter(item)" >
        <div slot="icon" class="dispatch_school_icon" :style="{'background-image':'url('+tools.cdn(tools.isNull(item.schoolLogo)==true?'school/school-icon.png':item.schoolLogo, 'logo.png', 128)+')'}"></div>
        <div v-show="item.schoolStatus==2" slot>已提交审核</div>
      </cell>
    </group>
    <div v-if="isShowError" style="text-align:left;font-size: 16px;fontSize:16px;color:#888;">
      <group gutter="0">
        <p style="color:#424242;font-size:16px;padding:15px;">{{userInfo.userName}}，您好！本系统只向学校教师和家长开放使用，请搜索找到学校，并成功加入后，方可使用。</p>
      </group>
      <group>
        <div :style="{'height':(hintHeight - 85) + 'px'}">
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
    <p v-show="desc!=null" style="text-align:center;font-size: 16px;padding: 5px 15px;fontSize:16px;color:#a2a2a2; margin-top:20px;">{{desc}}</p>
    <!-- <div v-show="isShowIdentityHint" :style="{'font-size': '16px', 'padding': '10px 20px', 'fontSize':'16px', 'color':'#222222', 'background':'#fff', 'height':hintHeight+'px'}">
      <img class="dispatch_user_icon" :src="tools.cdn(userInfo.userIcon)">
      <p style="textAlign:center;fontSize: 16px">{{userInfo.userName}}</p>
      <p style="margin-top:1.2em;">您好！欢迎使用【校和家】</p>
      <p style="margin-top:1.2em">您当前还不是［{{schoolName}}学校］的成员，所以无法访问本校的任何页面！请根据您的身份，选择下列操作：</p>
      <p style="margin-top:1.2em; color:#626262">1、<strong style="color:#000">如果您是老师</strong>，请联系本校系统管理员，为您添加老师身份；</p>
      <p style="margin-top:0.3em; color:#626262">2、<strong style="color:#000">如果您是家长</strong>，请联系本班班主任，为您绑定学生家长；</p>
      <p style="margin-top:0.3em; color:#626262">3、<strong style="color:#000">如果您是学生</strong>，请联系本班班主任，为您绑定学生；</p>
    </div> -->
    <index-tabbar :showHome="true"></index-tabbar>
  </div>
</template>

<script>
import { Group, Cell, XTable } from 'vux'
import api from '../../education/api'
import IndexTabbar from '@/components/IndexTabbar.vue'
import { mapGetters } from 'vuex'
import searchApi from '../api'
export default {
  components: {
    Group, Cell, IndexTabbar, XTable
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  data () {
    return {
      schoolId: null,
      schoolList: [],
      desc: null,
      isShowIdentityHint: false,
      hintHeight: 0,
      schoolName: null,
      isShowError: false,
      searchValue: null,
      searchSchoolList: [],
      requestDone: true,
      tempSchoolList: [],
      currentSearchSchoolName: null,
      isNoData: false
    }
  },
  watch: {
    userInfo(newValue, old) {
      this.init(newValue)
    },
    searchValue (newVal, oldVal) {
      this.onChange(newVal)
    }
  },
  mounted () {
    this.hintHeight = window.innerHeight - 60
    this.init(this.userInfo)
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
    init (data) {
      if (this.tools.isNull(this.userInfo.userId)) {
        return
      }
      this.schoolId = this.$route.params.schoolId
      if (!this.tools.isNull(this.schoolId)) {
        if (data.schoolStatus === 2) {
          // 付款页面
          this.$router.replace({name: 'educationSchoolOrder', params: {schoolId: data.businessId}})
        } else if (data.schoolStatus === 1) {
          var router = this.getHomeRouter(data)
          if (router === null) {
            this.schoolName = data.schoolName
            this.isShowIdentityHint = true
            // this.desc = '您还不是本校成员，请联系学校管理员'
          } else {
            this.$router.replace(router)
          }
        } else {
          this.desc = '您的学校暂时无法使用，请联系学校管理员'
        }
      } else {
        // 缓存学校列表，不重新请求，及缓存身份状态，用户可以修改并缓存
        api.getMySchoolList((data) => {
          if (data.length === 1) {
            if (data[0].schoolStatus === 2) {
              this.schoolList = data
            } else if (data[0].schoolStatus === 1) {
              // 根据身份进入首页
              this.replaceRouter(data[0])
              return
            }
          } else if (data.length > 1) {
            this.schoolList = data
          } else {
            // this.desc = '您还没有加入到任何学校，请联系您所在的学校管理员'
            // 提示购买入口
          }
          if (this.schoolList.length === 0) {
            this.isShowError = true
          }
        })
      }
    },
    getSchoolInfo(callback) {
      api.getUserSchoolSetting({ orgId: this.$route.params.orgId, schoolId: this.$route.params.schoolId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getHomeRouter (data) {
      let userCurrentStatus = this.localStorage.getSchoolUserIdentity(data.schoolId, this.userInfo.userId)
      if (!this.tools.isNull(userCurrentStatus)) {
        if (userCurrentStatus === 'teacher') {
          return { name: 'educationTeacherHome', params: { schoolId: data.schoolId } }
        } else if (userCurrentStatus === 'parent') {
          return { name: 'educationParentsHome', params: { schoolId: data.schoolId } }
        } else if (userCurrentStatus === 'student') {
          return { name: 'educationStudentHome', params: { schoolId: data.schoolId } }
        }
      }
      if (data.isTeacher || data.isMaster) {
        return { name: 'educationTeacherHome', params: { schoolId: data.schoolId } }
      } else if (data.isParent) {
        return { name: 'educationParentsHome', params: { schoolId: data.schoolId } }
      } else if (data.isStudent) {
        return { name: 'educationStudentHome', params: { schoolId: data.schoolId } }
      } else {
        return null
      }
    },
    replaceRouter (data) {
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

      // 身份缓存，优先使用缓存的身份
      this.localStorage.clearTeacherFeature()
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
    },
    pushRouter (data) {
      if (data.schoolStatus === 2) {
        if (parseInt(data.schoolModel) === 1) {
          this.$router.push({name: 'educationSchoolOrder', params: {schoolId: data.schoolId, isRenew: 'noRenew'}})
          return
        } else {
          this.$router.push({name: 'educationClassOrder', params: {schoolId: data.schoolId}})
          return
        }
      }
      // 身份缓存，优先使用缓存的身份
      this.localStorage.clearTeacherFeature()
      this.localStorage.getUserInfo({schoolId: data.schoolId, isRefresh: true}, (info) => {
        let userCurrentStatus = this.localStorage.getSchoolUserIdentity(data.schoolId, this.userInfo.userId)
        if (!this.tools.isNull(userCurrentStatus)) {
          if (userCurrentStatus === 'teacher') {
            this.$router.push({ name: 'educationTeacherHome', params: { schoolId: data.schoolId } })
            return
          } else if (userCurrentStatus === 'parent') {
            this.$router.push({ name: 'educationParentsHome', params: { schoolId: data.schoolId } })
            return
          } else if (userCurrentStatus === 'student') {
            this.$router.push({ name: 'educationStudentHome', params: { schoolId: data.schoolId } })
            return
          }
        }
        if (data.memberType.indexOf('MASTER') !== -1 || data.memberType.indexOf('TEACHER') !== -1) {
          this.$router.push({ name: 'educationTeacherHome', params: { schoolId: data.schoolId } })
        } else if (data.memberType.indexOf('PARENT') !== -1) {
          this.$router.push({ name: 'educationParentsHome', params: { schoolId: data.schoolId } })
        } else if (data.memberType.indexOf('STUDENT') !== -1) {
          this.$router.push({ name: 'educationStudentHome', params: { schoolId: data.schoolId } })
        }
      })
    }
  }
}
</script>

<style>
.dispatch_school_icon {
  width: 50px;
  height: 50px;
  display: block;
  margin-right: 5px;
  background-position: center center;
  background-size: cover;
  border-radius: 3px;
}
.dispatch_user_icon {
  height: 50px;
  width: 50px;
  border-radius: 25px;
  display: block;
  margin: 10px auto 5px;
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


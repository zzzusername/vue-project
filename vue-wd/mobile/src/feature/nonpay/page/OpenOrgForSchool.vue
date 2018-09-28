<template>
  <div style="background:#fff;height:100vh;font-size:16px;margin-bottom: -50px;">
    <div style="text-align:center;">
      <div class="open_org_user_icon" :style="{'background-image':'url('+tools.cdn(userInfo.userIcon, 'head.png', 128)+')', 'border-radius': '27px'}"></div>
      <p style="textAlign: center;">{{userInfo.userName}}</p>
      <p style="textAlign: center;margin-top:1.2em">您好！欢迎使用「校和家」</p>
      <div v-if="isShowError" style="text-align:center;margin:0 auto;margin-top:10em;color:#FF6D56;font-size:16px;border:1px solid #FF6D56;width:200px;padding:10px;">{{errorText}}</div>
      <p v-else style="textAlign: center;margin-bottom:2em">您正在为「{{orgInfo.chatroomName}}」群增加家校互动管理功能</p>
    </div>
    <group v-show="schoolList.length > 0">
       <!-- <cell is-link @click.native="onSelectSchool">
         <p slot="title" :style="{'color': schoolList.length == 0 ? '#b2b2b2' : '#333'}" >选择群所属学校</p>
       </cell> -->
       <popup-picker v-model="school" :data="schoolSelectList" show-name @on-hide="schoolHide" @on-change="onChangeSchool">
         <p slot="title" style="color:#333">选择群所属学校</p>
       </popup-picker>
       <popup-picker v-model="category" :data="categoryList" show-name @on-hide="categoryHide">
         <p slot="title" style="color:#333">选择群类型</p>
       </popup-picker>
       <cell v-show="isShowClassList" is-link @click.native="showPopu = !showPopu" :value="selectClassInfo.className">
         <p slot="title" :style="{'color': schoolList.length==0?'#b2b2b2':'#333'}">选择群对应班级</p>
       </cell>
    </group>
    <x-button v-show="schoolList.length > 0" type="primary" :style="{'margin':'0 auto', 'width':'80vw', 'margin-top':'3em', 'backgroundColor': agreement ? '#8ebf52':'#b2b2b2'}" @click.native="createSchoolOrg">{{buttonText}}</x-button>
    <div v-show="schoolList.length > 0" style="margin: 10px 15px;textAlign:center;fontSize: 14px;color: #b2b2b2!important">
      <check-icon :value.sync="agreement" id="agreement_id" type="plain">我已阅读并同意</check-icon><a href="//doc.qunxiaozhu.com/index.php?s=/page/67">《用户协议》</a>
    </div>
    <popup v-model="showPopu" height="70%">
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller ref="scroller">
          <radio style="backgroundColor: #fff;fontSize: 16px;" :options="classOptions" v-model="selectClass"></radio>
          <cell style="backgroundColor: #fff;fontSize: 16px;" v-for="(item, index) in bindOrgList" :key="index">
            <p slot="title" style="color: #666">{{item.title}}</p>
            <p >已关联微信群</p>
          </cell>
        </scroller>
        <p v-if="classOptions.length==0 && bindOrgList.length == 0" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">请联系管理员先创建班级</p>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showPopu = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirm()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import {Group, Cell, PopupPicker, XButton, Popup, Radio, CheckIcon} from 'vux'
import { mapGetters } from 'vuex'
import schoolApi from '../../education/api'
import nonpayApi from '../../nonpay/api'
export default {
  components: {
    Group, Cell, PopupPicker, XButton, Popup, Radio, CheckIcon
  },
  data () {
    return {
      category: [],
      categoryList: [[{
        name: '老师群',
        value: 'TEACHER'
      }, {
        name: '学生群（必须绑定班级）',
        value: 'STUDENT'
      }, {
        name: '单个班级家长群（必须绑定班级）',
        value: 'PARENT'
      }, {
        name: '多个班级家长群',
        value: 'PARENT_MORE'
      }]],
      school: [],
      schoolSelectList: [[{}]],
      schoolList: [],
      isShowError: false,
      orgInfo: {},
      classList: [],
      selectClass: '',
      selectClassInfo: {},
      showPopu: false,
      classOptions: [],
      scrollerHeight: 0,
      bindOrgList: [],
      buttonText: '开通群',
      errorText: '',
      agreement: true,
      currentSchool: {},
      isShowClassList: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    this.scrollerHeight = window.innerHeight * 0.7 - 50
    nonpayApi.getOpenorg({randomId: this.$route.params.randomId}, (data) => {
      this.orgInfo = data
      this.getMySchoolList()
    }, (error) => {
      this.isShowError = true
      if (error.toUser) {
        this.errorText = error.message
      } else {
        this.errorText = '群开通链接已超时'
      }
    })
  },
  methods: {
    getMySchoolList () {
      this.schoolSelectList = [[]]
      schoolApi.getMySchoolList((data) => {
        data.forEach(element => {
          if ((element.memberType.indexOf('MASTER') !== -1 || element.memberType.indexOf('TEACHER') !== -1) && element.schoolStatus === 1) {
            this.schoolSelectList[0].push({
              name: element.schoolName + (element.schoolModel === 2 ? '（教师版）' : ''),
              value: element.schoolId + ''
            })
            this.schoolList.push(element)
          }
        })
        if (this.schoolList.length === 0) {
          this.isShowError = true
          this.errorText = '您没有开通学校群的权限, 请联系学校管理员'
        }
      })
    },
    categoryHide (closeType) {
      this.selectClass = ''
      this.selectClassInfo = {}
      if (closeType === true) { // 完成
        if (this.category[0] === 'TEACHER') {
          this.buttonText = '开通老师群'
        } else if (this.category[0] === 'STUDENT') {
          this.buttonText = '开通学生群'
        } else if (this.category[0] === 'PARENT' || this.category[0] === 'PARENT_MORE') {
          this.buttonText = '开通家长群'
        }
        this.checkCreateSchoolOrg()
      }
    },
    schoolHide (closeType) {
      if (closeType === true) { // 完成
        this.category = []
        this.selectClass = ''
        this.selectClassInfo = {}
        this.isShowClassList = false
        this.checkCreateSchoolOrg()
      }
    },
    checkCreateSchoolOrg () {
      this.classOptions = []
      this.bindOrgList = []
      if (this.school.length > 0 && this.category.length > 0) {
        if (this.category[0] !== 'STUDENT' && this.category[0] !== 'PARENT') {
          this.isShowClassList = false
          return
        }
        schoolApi.checkCreateSchoolOrg({schoolId: this.school[0] + '', type: this.category[0] + ''}, (data) => {
          if (this.currentSchool.schoolModel === 2 && data.length > 0) {
            // 个人版本默认选中班级
            this.isShowClassList = false
            this.selectClassInfo = data[0]
          } else {
            // 学校版需要选择班级
            this.isShowClassList = true
            data.forEach(element => {
              if (this.category[0] === 'STUDENT' && element.orgId !== null) {
                // 已绑定的学生群
                this.bindOrgList.push({ title: element.className })
              } else if (this.category[0] === 'PARENT' && element.parentOrgId !== null) {
                // 已经绑定的家长群
                this.bindOrgList.push({ title: element.className })
              } else {
                this.classOptions.push({ key: JSON.stringify(element), value: element.className })
              }
            })
          }
        }, (error) => {
          if (error.toUser) {
            this.tools.warnToast(error.message, '170px')
          }
        })
      }
    },
    createSchoolOrg () {
      if (!this.agreement) {
        return
      }
      if (this.school.length === 0) {
        this.tools.warnToast('请选择群所属学校', '160px')
        return
      }
      if (this.category.length === 0) {
        this.tools.warnToast('请选择群类型')
        return
      }
      if ((this.category[0] !== 'TEACHER' && this.category[0] !== 'PARENT_MORE') && this.tools.isNull(this.selectClassInfo.classId)) {
        this.tools.warnToast('请选择群对应班级', '150px')
        return
      }
      var category = null
      if (this.category[0] === 'PARENT' || this.category[0] === 'PARENT_MORE') {
        category = 'PARENT' // 多班家长和单班家长
      } else {
        category = this.category[0]
      }
      schoolApi.createSchoolOrg({schoolId: this.school[0] + '', type: category, randomId: this.$route.params.randomId, classId: this.selectClassInfo.classId}, (data) => {
        this.tools.successToast('开通成功！')
        this.$router.replace({name: 'schoolIndex', params: {schoolId: this.school[0]}})
      }, (error) => {
        if (error.toUser) {
          this.tools.warnToast(error.message, '160px')
        } else {
          this.tools.warnToast('开通失败！')
        }
      })
    },
    confirm() {
      this.showPopu = false
      if (this.tools.isNull(this.selectClass)) {
        this.selectClassInfo = {}
      } else {
        this.selectClassInfo = JSON.parse(this.selectClass)
      }
    },
    onChangeSchool (val) {
      this.schoolList.forEach(element => {
        if (parseInt(element.schoolId) === parseInt(val)) {
          this.currentSchool = element
        }
      })
      if (this.currentSchool !== null && this.currentSchool.schoolModel === 2) {
        this.categoryList = [[{
          name: '学生群',
          value: 'STUDENT'
        }, {
          name: '家长群',
          value: 'PARENT'
        }]]
      } else {
        this.categoryList = [[{
          name: '老师群',
          value: 'TEACHER'
        }, {
          name: '学生群（必须绑定班级）',
          value: 'STUDENT'
        }, {
          name: '单个班级家长群（必须绑定班级）',
          value: 'PARENT'
        }, {
          name: '多个班级家长群',
          value: 'PARENT_MORE'
        }]]
      }
    }
  }
}
</script>

<style>
.open_org_user_icon{
  width: 54px;
  height: 54px;
  display: inline-block;
  border-radius: 5px;
  margin: 3em auto 0.3em;
  background-position: center center;
  background-size: cover;
  border-style: none;
  border-width: 0;
}
#agreement_id span {
  color: #a2a2a2
}
</style>

<template>
  <div style="font-size: 14px;">
    <group title="基本信息设置" label-width="5em" label-margin-right="1em">
      <selector title="类型" :options="voteTypes" v-model="data.base.voteType" placeholder="请选择"></selector>
      <x-input title="标题" v-model="data.base.voteName" placeholder="必填"></x-input>
      <cell title="封面图片" @click.native="chooseImg()" is-link value-align="left">
        <div>
          <img v-if="imgPath" :src="tools.cdn(imgPath+'?imageView2/1/w/100/h/100')" class="cell-cover-img">
          <div v-else class="cell-cover-img"></div>
          <p style="fontSize: 14px;marginTop: 3px">建议上传宽高比为2:1的图片</p>
        </div>
      </cell>
      <selector v-if="showRange" title="发布范围" :options="voteUsers" v-model="data.base.voteScope" @on-change="voteRange" placeholder="请选择"></selector>
      <cell v-if="data.base.voteScope == '2' " title="指定教师群" is-link @click.native="showOrgList=true" 
        :value="orgIds.length!=0?'已选择'+orgIds.length+'个群':'请选择'"></cell>
      <cell v-if="data.base.voteScope == '3'" title="指定班级" is-link @click.native="showClassList=true" 
        :value="classIds.length != 0 ? '已选择'+classIds.length+'个班级':'请选择'"></cell>
      <x-switch title="是否允许校外人员投票" v-model="data.base.isAnyoneVote">
        <p slot="inline-desc">选择之后校外用户可投票</p>
      </x-switch>
      <datetime-range title="开始时间" :start-date="startTime" :end-date="endTime" v-model="startDate" placeholder="请选择"></datetime-range>
      <datetime-range title="结束时间" :start-date="startTime" :end-date="endTime" v-model="endDate" placeholder="请选择"></datetime-range>
      <x-textarea title="描述" v-model="data.base.voteDesc" placeholder="描述文字"></x-textarea>
    </group>
    <group title="报名及高级选项设置">
      <cell title="报名及其它高级设置" is-link @click.native="skipAdvanceSetting"></cell>
    </group>
    <group title="投票规则设置" label-width="14em" label-margin-right="0.5em" label-align="left">
      <x-switch title="已投票用户次日可重复投票" v-model="data.role.isAllowNextDay"></x-switch>
      <x-input title="每人每日可投票数" v-model="data.role.dayNum"></x-input>
      <x-input title="每人每日对同一选项可投票数" v-model="data.role.dayItemNum"></x-input>
    </group>
    <detail-tabbar :actionLink="next" :actions="actions"></detail-tabbar>
    <!-- 选择群/班级 -->
    <!-- 选择班级 -->
    <popup v-model="showClassList" height="80%">
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller>
          <checklist style="margin-top:-1px" :options="classList" v-model="selectTempKey"></checklist>
        </scroller>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showClassList = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmClass()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
    <!-- 选择教师群 -->
    <popup v-model="showOrgList" height="80%">
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller>
          <checklist style="margin-top:-1px" :options="orgList" v-model="selectTempKey"></checklist>
        </scroller>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showOrgList = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmClass()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import api from '../api.js'
import eduApi from '@/feature/education/api'
import {Group, Cell, Selector, XInput, DatetimeRange, XTextarea, XNumber, XSwitch, Checklist, Popup, LoadingPlugin} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import { mapGetters } from 'vuex'
import Vue from 'vue'
Vue.use(LoadingPlugin)

export default {
  components: {
    Group, Cell, Selector, XInput, DatetimeRange, XTextarea, XNumber, XSwitch, Checklist, Popup, DetailTabbar
  },
  data() {
    return {
      voteTypes: [
        {key: 'TEXT', value: '普通文字投票'},
        {key: 'IMAGE', value: '普通图片投票'},
        {key: 'TEACHER', value: '教师图片投票'},
        {key: 'STUDENT', value: '学生图片投票'}
      ],
      voteUsers: [
        {key: '1', value: '全体师生'},
        {key: '2', value: '教师'},
        {key: '3', value: '班级'}
      ],
      actions: [{name: '保存并提交'}],
      classIds: [],
      orgIds: [],
      startDate: [],
      endDate: [],
      data: {
        base: {
          voteType: null,
          voteName: null,
          startDate: [],
          endDate: [],
          // voteScope: null,
          voteDesc: null
        },
        role: {
          isAllowNextDay: false,
          dayNum: 1,
          dayItemNum: 1
        }
      },
      scrollerHeight: 0,
      showClassList: false,
      classList: [],
      selectTempKey: [],
      showOrgList: false,
      orgList: [],
      showRange: false,
      imgPath: null,
      isFirstLoad: false
    }
  },
  computed: {
    startTime() {
      return this.tools.formateTime(new Date(), 'YYYY-MM-DD')
    },
    endTime() {
      let d = new Date()
      d.setFullYear(d.getFullYear() + 1)
      return this.tools.formateTime(d, 'YYYY-MM-DD')
    },
    ...mapGetters(
      {wechatConfig: 'wechatConfig', userInfo: 'userInfo'}
    ),
    voteId() {
      return this.$route.params.voteId
    },
    schoolId() {
      return this.$route.params.schoolId
    }
  },
  mounted() {
    this.$store.commit('setData', null)
    this.$store.commit('setApplyStatus', false)
    this.$store.commit('setVoteInfo', null)
    this.scrollerHeight = window.innerHeight * 0.8 - 50
    if (this.voteId) {
      api.getVoteInfo({schoolId: this.schoolId, voteId: this.voteId}, data => {
        this.data.base = JSON.parse(JSON.stringify(data.base))
        this.data.role = JSON.parse(JSON.stringify(data.role))
        this.imgPath = data.base.voteLogo
        this.startDate = [this.tools.formateTime(data.base.startDate, 'YYYY-MM-DD'), this.tools.formateTime(data.base.startDate, 'HH'), this.tools.formateTime(data.base.startDate, 'mm')]
        this.endDate = [this.tools.formateTime(data.base.endDate, 'YYYY-MM-DD'), this.tools.formateTime(data.base.endDate, 'HH'), this.tools.formateTime(data.base.endDate, 'mm')]
        if (data.orgIds.length > 0) {
          this.orgIds = data.orgIds.map((x) => { return String(x) })
          this.selectTempKey = data.orgIds.map((x) => { return String(x) })
        }
        if (data.classIds.length > 0) {
          // setTimeout(() => {
          //   this.classIds = data.classIds.map((x) => { return String(x) })
          //   this.selectTempKey = data.classIds.map((x) => { return String(x) })
          // }, 1000)
          this.classIds = data.classIds.map((x) => { return String(x) })
          this.selectTempKey = data.classIds.map((x) => { return String(x) })
          console.log(this.classIds)
        }
        this.$store.commit('setVoteInfo', data)
      }, er => { this.toast(er, '获取详情失败') })
    }
    if (this.userInfo && String(this.userInfo.schoolModel) === '2') {
      this.data.base.voteScope = '1'
      this.voteTypes.splice(2, 1)
      this.showRange = false
      return
    }
    this.localStorage.getFeatureManageStatus({schoolId: this.$route.params.schoolId}, (data) => {
      if (data.schoolVoteStatus) { // 全校投票管理权限
        this.showRange = true
        // 所有班级
        eduApi.getClassList({ schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999 }, (data) => {
          this.classList = []
          data.forEach((element) => {
            var item = {key: element.classId + '', value: element.className}
            this.classList.push(item)
          }, this)
        }, (er) => {})
        eduApi.queryRelationOrg({schoolId: this.$route.params.schoolId, orgType: 1, rowStart: 0, rowCount: 100}, (data) => {
          this.orgList = []
          data.forEach((element) => {
            var item = {key: element.orgId + '', value: element.orgName}
            this.orgList.push(item)
          }, this)
        }, (er) => {})
      } else { // 班级投票管理权限
        this.voteTypes.splice(2, 1)
        this.showRange = false
        this.data.base.voteScope = '3'
        // 有权限的班级
        eduApi.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'TOUPIAO_BANJI'}, (data) => {
          this.classList = []
          data.forEach((element) => {
            var item = {key: element.classId + '', value: element.className}
            this.classList.push(item)
          }, this)
        }, () => {})
      }
    }, () => {})
  },
  methods: {
    next() {
      let settings = this.$store.getters.getSettings
      if (settings) {
        Object.assign(this.data, settings)
      }
      if (!this.data.base.voteType) {
        this.toast({}, '请选择类型')
        return
      }
      if (!this.data.base.voteName || this.data.base.voteName === '') {
        this.toast({}, '请填写标题')
        return
      }
      if (!this.data.base.voteLogo) {
        this.toast({}, '请上传封面图片')
        return
      }
      if (!this.data.base.voteScope) {
        this.toast({}, '请选择发布范围')
        return
      } else {
        if (String(this.data.base.voteScope) === '2' && this.orgIds.length === 0) {
          this.toast({}, '请指定教师群')
          return
        }
        if (String(this.data.base.voteScope) === '3' && this.classIds.length === 0) {
          this.toast({}, '请指定班级')
          return
        }
      }
      if (this.startDate.length === 3) {
        this.data.base.startDate = this.startDate[0] + ' ' + this.startDate[1] + ':' + this.startDate[2]
      } else {
        this.toast({}, '请选择开始时间')
        return
      }
      if (this.endDate.length === 3) {
        this.data.base.endDate = this.endDate[0] + ' ' + this.endDate[1] + ':' + this.endDate[2]
      } else {
        this.toast({}, '请选择结束时间')
        return
      }
      if (!this.data.base.voteDesc) {
        this.toast({}, '请填写描述')
        return
      }
      console.log(this.data)
      api.saveVote({schoolId: this.$route.params.schoolId, voteId: this.voteId, classIds: this.classIds, orgIds: this.orgIds, params: this.data}, (data) => {
        let voteType = this.data.base.voteType
        let type = 1
        if (voteType !== 'TEXT') {
          type = 2
        }
        this.$router.replace({name: 'educationVoteItemList', params: {voteId: data.voteId, type: type}})
      }, (er) => {
        this.toast(er, '创建失败')
      })
    },
    toast(er, hint = '') {
      if (er.toUser) {
        hint = er.message
      }
      this.tools.warnToast(hint)
    },
    confirmClass() {
      if (this.data.base.voteScope === '2') {
        this.orgIds = this.selectTempKey
        this.showOrgList = false
      } else {
        this.classIds = this.selectTempKey
        this.showClassList = false
      }
    },
    voteRange(val) {
      console.log('----------' + val)
      if (this.isFirstLoad) {
        this.classIds = []
        this.orgIds = []
        this.selectTempKey = []
        console.log('aaaaaaa')
      }
      this.isFirstLoad = true
    },
    chooseImg() {
      this.$wechat.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.$vux.loading.show({
            text: '图片上传中'
          })
          var localIds = res.localIds
          this.$wechat.uploadImage({
            localId: localIds[0],
            isShowProgressTips: 0,
            success: (res) => {
              this.uploadApi.uploadMpImage({type: 'SCHOOL_VOTE', args: [this.$route.params.schoolId], mediaId: res.serverId}, (data) => {
                this.data.base.voteLogo = data.result.path
                this.imgPath = data.result.path
                this.$vux.loading.hide()
              }, () => {
                this.tools.warnToast('图片上传失败')
                this.$vux.loading.hide()
              })
            }
          })
        }
      })
    },
    skipAdvanceSetting() {
      let type = this.data.base.voteType
      if (type) {
        if (type === 'TEACHER' || type === 'STUDENT') {
          this.$store.commit('setApplyStatus', true)
        }
        if (this.voteId) {
          this.$router.push({name: 'educationAdvanceSettingForManage'})
          return
        }
        this.$router.push({name: 'educationAdvanceSetting'})
        return
      }
      this.tools.warnToast('请选择类型')
    }
  }
}
</script>

<style lang="less" scoped>
.cell-cover-img{
  border-radius: 5px;
  width: 130px;
  height: 65px;
  display: block;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  background-image: url(../../../assets/logo.png)
}
</style>


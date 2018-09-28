<template>
  <div>
    <group label-width="5em" label-margin-right="1em">
      <x-input title="主办方" v-model="data.sponsor.masterName" placeholder="填写"></x-input>
      <x-input title="承办方" v-model="data.sponsor.organizerName" placeholder="填写"></x-input>
      <!-- <x-input title="赞助商" v-model="data.sponsor.sponsorName"></x-input>
      <x-input title="赞助商链接" v-model="data.sponsor.sponsorUrl"></x-input> -->
    </group>
    <group title="报名设置" label-width="7em" label-margin-right="1em" v-if="showApply">
      <x-switch title="是否开启报名" v-model="data.apply.isOpen"></x-switch>
      <selector v-if="showRange && data.apply.isOpen" title="报名范围" :options="applyRange" v-model="data.apply.applyScope" @on-change="rangeChange" placeholder="请选择"></selector>
      <cell v-if="String(data.apply.applyScope) == '2' && data.apply.isOpen " title="指定教师群" is-link @click.native="showOrgList=true" 
        :value="orgIds.length!=0?'已选择'+orgIds.length+'个群':'请选择'"></cell>
      <cell v-if="String(data.apply.applyScope) == '3' && data.apply.isOpen" title="指定班级" is-link @click.native="showClassList=true" 
        :value="classIds.length != 0 ? '已选择'+classIds.length+'个班级':'请选择'"></cell>
      <datetime-range v-if="data.apply.isOpen" title="开始时间" :start-date="startTime" :end-date="endTime" v-model="startDate" placeholder="请选择"></datetime-range>
      <datetime-range v-if="data.apply.isOpen" title="结束时间" :start-date="startTime" :end-date="endTime" v-model="endDate" placeholder="请选择"></datetime-range>
      <x-input v-if="data.apply.isOpen" title="报名人数限制" v-model="data.apply.maxNum" placeholder="填写人数"></x-input>
      <x-switch v-if="data.apply.isOpen" title="报名是否审核" v-model="data.apply.isAudit"></x-switch>
    </group>
    <detail-tabbar :actionLink="save" :actions="actions"></detail-tabbar>
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
import eduApi from '@/feature/education/api'
import {Group, Cell, XInput, XSwitch, DatetimeRange, Selector, Checklist, Popup} from 'vux'
import { mapGetters } from 'vuex'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    Group, Cell, XInput, XSwitch, DatetimeRange, Selector, Checklist, Popup, DetailTabbar
  },
  data() {
    return {
      actions: [{name: '保存'}],
      startDate: [],
      endDate: [],
      applyRange: [
        {key: '1', value: '全体师生'},
        {key: '2', value: '教师'},
        {key: '3', value: '班级'}
      ],
      data: {
        sponsor: {
          masterName: null,
          organizerName: null
          // sponsorName: null,
          // sponsorUrl: null
        },
        apply: {
          isOpen: false,
          isAudit: false,
          maxNum: null,
          applyScope: null
        }
      },
      showRange: false,
      orgIds: [],
      classIds: [],
      showOrgList: false,
      showClassList: false,
      scrollerHeight: 0,
      orgList: [],
      classList: [],
      selectTempKey: [],
      isFirstLoad: false
    }
  },
  computed: {
    startTime() {
      return this.tools.formateTime(new Date(), 'YYYY-MM-DD')
    },
    endTime() {
      let t = new Date()
      t.setFullYear(t.getFullYear() + 1)
      return this.tools.formateTime(t, 'YYYY-MM-DD')
    },
    showApply() {
      return this.$store.getters.getApplyStatus
    },
    voteInfo() {
      return this.$store.getters.getVoteInfo
    },
    setting() {
      return this.$store.getters.getSettings
    },
    ...mapGetters({userInfo: 'userInfo'})
  },
  mounted() {
    this.scrollerHeight = window.innerHeight * 0.8 - 50
    if (this.voteInfo && !this.setting) {
      // console.log(this.voteInfo)
      this.data.sponsor = JSON.parse(JSON.stringify(this.voteInfo.sponsor))
      this.data.apply = JSON.parse(JSON.stringify(this.voteInfo.apply))
      // if (this.data.apply.scopeOrg) {
      //   this.orgIds = this.data.apply.scopeOrg.split(',')
      //   this.selectTempKey = this.data.apply.scopeOrg.split(',')
      // }
      // if (this.data.apply.scopeClass) {
      //   this.classIds = this.data.apply.scopeClass.split(',')
      //   this.selectTempKey = this.data.apply.scopeClass.split(',')
      // }
      if (this.data.apply.startDate) {
        this.startDate = [this.tools.formateTime(this.data.apply.startDate, 'YYYY-MM-DD'), this.tools.formateTime(this.data.apply.startDate, 'HH'), this.tools.formateTime(this.data.apply.startDate, 'mm')]
      }
      if (this.data.apply.endDate) {
        this.endDate = [this.tools.formateTime(this.data.apply.endDate, 'YYYY-MM-DD'), this.tools.formateTime(this.data.apply.endDate, 'HH'), this.tools.formateTime(this.data.apply.endDate, 'mm')]
      }
    }
    if (this.setting) {
      this.data = JSON.parse(JSON.stringify(this.setting))
      if (this.data.apply.startDate) {
        let start = (this.data.apply.startDate + ':00').replace(/-/g, '/')
        console.log(start)
        this.startDate = [this.tools.formateTime(new Date(start), 'YYYY-MM-DD'), this.tools.formateTime(new Date(start), 'HH'), this.tools.formateTime(new Date(start), 'mm')]
      }
      if (this.data.apply.endDate) {
        let end = (this.data.apply.endDate + ':00').replace(/-/g, '/')
        console.log(end)
        this.endDate = [this.tools.formateTime(new Date(end), 'YYYY-MM-DD'), this.tools.formateTime(new Date(end), 'HH'), this.tools.formateTime(new Date(end), 'mm')]
      }
    }
    if (this.data.apply.scopeOrg) {
      this.orgIds = this.data.apply.scopeOrg.split(',')
      this.selectTempKey = this.data.apply.scopeOrg.split(',')
    }
    if (this.data.apply.scopeClass) {
      this.classIds = this.data.apply.scopeClass.split(',')
      this.selectTempKey = this.data.apply.scopeClass.split(',')
    }
    if (this.userInfo && String(this.userInfo.schoolModel) === '2') {
      this.data.apply.applyScope = '1'
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
        this.showRange = false
        this.data.apply.applyScope = '3'
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
    save() {
      if (this.orgIds.length > 0) {
        this.data.apply.scopeOrg = this.orgIds.join(',')
      }
      if (this.classIds.length > 0) {
        this.data.apply.scopeClass = this.classIds.join(',')
      }
      if (this.data.apply.isOpen) {
        if (!this.data.apply.applyScope) {
          this.toast('请选择发布范围')
          return
        } else {
          if (String(this.data.apply.applyScope) === '2' && this.orgIds.length === 0) {
            this.toast('请指定教师群')
            return
          }
          if (String(this.data.apply.applyScope) === '3' && this.classIds.length === 0) {
            this.toast('请指定班级')
            return
          }
        }
        if (this.startDate.length === 3) {
          this.data.apply.startDate = this.startDate[0] + ' ' + this.startDate[1] + ':' + this.startDate[2]
        } else {
          this.toast('请选择开始时间')
          return
        }
        if (this.endDate.length === 3) {
          this.data.apply.endDate = this.endDate[0] + ' ' + this.endDate[1] + ':' + this.endDate[2]
        } else {
          this.toast('请选择结束时间')
          return
        }
        if (!this.data.apply.maxNum) {
          this.toast('请填写报名人数限制')
          return
        }
      }
      this.$store.commit('setData', this.data)
      this.$router.go(-1)
    },
    rangeChange() {
      if (this.isFirstLoad) {
        this.classIds = []
        this.orgIds = []
        this.selectTempKey = []
      }
      this.isFirstLoad = true
    },
    confirmClass() {
      let voteScope = String(this.data.apply.applyScope)
      console.log(this.selectTempKey)
      if (voteScope === '2') {
        this.orgIds = this.selectTempKey
        this.showOrgList = false
      } else if (voteScope === '3') {
        this.classIds = this.selectTempKey
        this.showClassList = false
      }
    },
    toast(hint) {
      this.tools.warnToast(hint)
    }
  }
}
</script>

<style>

</style>

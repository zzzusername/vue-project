<template>
  <div>
    <group gutter="0" v-if="isShow" label-width="6em" label-margin-right="0.8em" label-align="left">
      <x-input title="公告标题" placeholder="必填" v-model="noticeTitle" @on-change="val => {if(val !== ''){showTitleHint = false} else {showTitleHint = true}}"></x-input>
      <selector v-show="tools.isNull(this.$route.params.noticeId) && schoolNoticeStatus == true && userInfo.schoolModel != 2" title="公告类型" :options="noticeTypeOptions" v-model="selectedOptions"></selector>
      <cell v-if="tools.isNull(this.$route.params.noticeId) && (isAllowSelectClass || schoolNoticeStatus == false) && userInfo.schoolModel != 2" title="选择班级" :value="selectedName" is-link @click.native="onShowClassList" value-align="left"></cell>
      <cell v-if="tools.isNull(this.$route.params.noticeId) && isAllowSelectTeacherOrg && userInfo.schoolModel != 2" title="选择教师群" :value="selectedName" is-link @click.native="onShowOrgList" value-align="left"></cell>
      <!-- <x-switch title="是否需要阅读反馈" v-model="readFeedBack"></x-switch> -->
      <selector v-show="tools.isNull(this.$route.params.noticeId) && isAllowSelectClass && readFeedBack" title="用户阅读范围" :options="userReadRange" v-model="readScope"></selector>
      <datetime-range value-text-align="left" title="过期时间" format="YYYY年MM月DD日" :start-date="startDate" :end-date="endDate" v-model="dateValue"></datetime-range>
      <x-textarea title="公告说明" placeholder="必填" :rows="6" v-model="noticeBody" @on-change="val => {if(val !== ''){showContentHint = false} else {showContentHint = true}}"></x-textarea>
      <p style="color: #999;padding: 0 15px;font-size: 14px;">电脑登录 edu.qunxiaozhu.com，可上传附件(word、excel、pdf)</p>
      <media-upload :imageData="contentImgPathList" :args="mediaArgs" :imageType="mediaImageType" :callBack="mediaCallBack"></media-upload>
    </group>
    <!-- 选择班级 -->
    <popup v-model="showClassList" height="80%">
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller>
          <!-- <p style="margin:3px 7px;font-size:16px;">班级全选</p> -->
          <checklist style="margin-top:-1px" :options="classList" v-model="selectClassTempKey"></checklist>
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
          <!-- <p style="margin:3px 7px;font-size:16px;">教师群全选</p> -->
          <checklist style="margin-top:-1px" :options="orgList" v-model="selectOrgTempKey"></checklist>
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
    <!-- 删除菜单 -->
    <detail-tabbar :actionLink="onPublish" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
  import { Group, XTextarea, XInput, DatetimeRange, Actionsheet, dateFormat, Selector, Checklist, Popup, Cell, XSwitch } from 'vux'
  import { mapGetters } from 'vuex'
  import api from '@/feature/notice/api'
  import eduApi from '@/feature/education/api'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import MediaUpload from '@/components/MediaUpload.vue'
  export default {
    components: {
      Group, XTextarea, XInput, DatetimeRange, Actionsheet, Selector, Checklist, DetailTabbar, Popup, Cell, MediaUpload, XSwitch
    },
    data () {
      return {
        isShow: false,
        imgData: null,
        imgBinaryData: null,
        noticeTitle: '',
        noticeBody: '',
        dateValue: [],
        noticeTypeOptions: [{
          key: '1',
          value: '全校公告'
        }, {
          key: '2',
          value: '教师公告'
        }, {
          key: '3',
          value: '班级公告'
        }],
        actions: [],
        selectedOptions: '',
        selectClassKey: [],
        selectClassTempKey: [],
        selectOrgKey: [],
        selectOrgTempKey: [],
        showClassList: false,
        classList: [],
        selectedName: '',
        isAllowSelectClass: false,
        isAllowSelectTeacherOrg: false,
        schoolNoticeStatus: false,
        showOrgList: false,
        orgList: [],
        scrollerHeight: 0,
        mediaArgs: [],
        mediaImageType: 'SCHOOL_NOTICE',
        contentImgPathList: [],
        readFeedBack: true,
        userInfo: {},
        userReadRange: [{key: '1', value: '无限制'}, {key: '2', value: '只允许学生'}, {key: '3', value: '只允许家长'}],
        readScope: null,
        localParams: {}
      }
    },
    watch: {
      isShow (newValue, oldValue) {
        if (newValue === true && !this.tools.isNull(this.$route.params.noticeId)) {
          this.actions = [{
            name: '修改',
            code: 'modify'
          }]
          api.getNoticeInfo({schoolId: this.$route.params.schoolId, noticeId: this.$route.params.noticeId}, (data) => {
            this.noticeBody = data.noticeBody
            this.noticeTitle = data.noticeTitle
            data.noticeReadFeedback === 1 ? this.readFeedBack = false : this.readFeedBack = true
            this.dateValue = this.tools.isNull(data.publishEndDate) ? [] : [dateFormat(data.publishEndDate, 'YYYY-MM-DD'), dateFormat(data.publishEndDate, 'HH'), dateFormat(data.publishEndDate, 'mm')]
            this.selectedOptions = String(data.noticeType)
            data.noticeImg.split(',').forEach((element) => {
              this.contentImgPathList.push(element)
            }, this)
          }, (data) => {
            this.isShow = false
            if (data.toUser) {
              this.tools.warnToast(data.message, '170px')
            } else {
              this.tools.warnToast('无法修改，请重试', '170px')
            }
          })
        } else {
          this.actions = [{
            name: '发布',
            code: 'publish'
          }]
          let tempLocalParams = window.localStorage.getItem('publish_notice_cache' + this.$route.params.schoolId)
          if (tempLocalParams) {
            this.localParams = JSON.parse(tempLocalParams)
            if (!this.tools.isNull(this.localParams.selectClassKey) && this.localParams.selectClassKey.length > 0) {
              this.selectClassKey = this.localParams.selectClassKey
              this.selectClassTempKey.push(...this.selectClassKey)
            }
            if (!this.tools.isNull(this.localParams.selectOrgKey) && this.localParams.selectOrgKey.length > 0) {
              this.selectOrgKey = this.localParams.selectOrgKey
              this.selectOrgTempKey.push(...this.selectOrgKey)
            }
            this.isAllowSelectTeacherOrg = this.localParams.isAllowSelectTeacherOrg
            this.selectedOptions = this.localParams.selectedOptions
            setTimeout(() => {
              if (!this.tools.isNull(this.localParams.contentImgPathList)) {
                this.contentImgPathList.push(...this.localParams.contentImgPathList)
              }
            }, 200)
            this.noticeTitle = this.localParams.noticeTitle
            this.noticeBody = this.localParams.noticeBody
            this.dateValue = this.localParams.dateValue
            this.readScope = this.localParams.readScope
            this.selectedName = this.localParams.selectedName
          }
        }
      },
      selectedOptions (newValue, oldValue) {
        this.isAllowSelectClass = false
        this.isAllowSelectTeacherOrg = false
        if (parseInt(newValue) === 3) {
          this.isAllowSelectTeacherOrg = false
          this.isAllowSelectClass = true
        } else if (parseInt(newValue) === 2) {
          this.isAllowSelectClass = false
          this.isAllowSelectTeacherOrg = true
        }
        this.localParams.selectedOptions = newValue
        this.setParamsCache()
        console.log('localParams', this.localParams)
      },
      selectOrgKey (newValue, oldValue) {
        this.localParams.selectOrgKey = newValue
        this.setParamsCache()
        console.log('selectOrgKey', newValue)
      },
      selectClassKey (newValue, oldValue) {
        this.localParams.selectClassKey = newValue
        this.setParamsCache()
        console.log('selectClassKey', newValue)
      },
      isAllowSelectTeacherOrg (newValue, oldValue) {
        this.localParams.isAllowSelectTeacherOrg = newValue
        if (newValue) {
          this.setSelectedOrgName(this.selectOrgKey)
        } else {
          this.setSelectedClassName(this.selectClassKey)
        }
        this.setParamsCache()
        console.log('isAllowSelectTeacherOrg', newValue)
      },
      contentImgPathList (newValue, oldValue) {
        this.localParams.contentImgPathList = newValue
        this.setParamsCache()
        console.log('contentImgPathList', newValue)
      },
      noticeTitle (newValue, oldValue) {
        this.localParams.noticeTitle = newValue
        this.setParamsCache()
        console.log('noticeTitle', newValue)
      },
      noticeBody (newValue, oldValue) {
        this.localParams.noticeBody = newValue
        this.setParamsCache()
        console.log('noticeBody', newValue)
      },
      dateValue (newValue, oldValue) {
        this.localParams.dateValue = newValue
        this.setParamsCache()
        console.log('dateValue', newValue)
      },
      readScope (newValue, oldValue) {
        this.localParams.readScope = newValue
        this.setParamsCache()
        console.log('readScope', newValue)
      },
      selectedName (newValue, oldValue) {
        this.localParams.selectedName = newValue
        this.setParamsCache()
        console.log('selectedName', newValue)
      }
    },
    computed: {
      ...mapGetters({
        wechatConfig: 'wechatConfig'
      }),
      startDate () {
        var date = new Date()
        date.setDate(date.getDate() + 1)
        return dateFormat(date, 'YYYY-MM-DD')
      },
      endDate () {
        var date = new Date()
        date.setFullYear(date.getFullYear() + 1)
        return dateFormat(date, 'YYYY-MM-DD')
      }
    },
    mounted () {
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.userInfo = data
        this.selectedOptions = '1'
      }, () => {})
      this.mediaArgs = [
        this.$route.params.schoolId
      ]
      this.scrollerHeight = window.innerHeight * 0.8 - 50
      this.localStorage.getFeatureManageStatus({schoolId: this.$route.params.schoolId}, (data) => {
        this.schoolNoticeStatus = data.schoolNoticeStatus
        this.isShow = true
        if (this.schoolNoticeStatus === false) {
          this.selectedOptions = '3'
        }
      }, () => {
        this.isShow = true
        this.selectedOptions = '3'
      })
    },
    methods: {
      // 发布
      onPublish () {
        if (this.tools.isNull(this.noticeTitle)) {
          this.tools.warnToast('公告标题不能为空', '160px')
          return
        }
        if (this.tools.isNull(this.$route.params.noticeId)) {
          if (this.tools.isNull(this.selectedOptions)) {
            this.tools.warnToast('请选择公告类型', '160px')
            return
          }
          if (parseInt(this.selectedOptions) === 2 && this.selectOrgKey.length === 0) {
            this.tools.warnToast('请选择接收公告的教师群', '170px')
            return
          }
          if (parseInt(this.selectedOptions) === 3 && this.selectClassKey.length === 0) {
            this.tools.warnToast('请选择接收公告的班级', '170px')
            return
          }
        }
        if (this.tools.isNull(this.dateValue) || this.dateValue.length === 0) {
          this.tools.warnToast('请选择过期时间', '160px')
          return
        }
        if (this.tools.isNull(this.noticeBody)) {
          this.tools.warnToast('公告内容不能为空', '160px')
          return
        }
        var noticeImg = this.tools.isNull(this.contentImgPathList) ? null : this.contentImgPathList.toString()
        var expireDate = this.dateValue[0] + ' ' + this.dateValue[1] + ':' + this.dateValue[2]
        api.publishNotice({schoolId: this.$route.params.schoolId, noticeId: this.$route.params.noticeId, classIds: this.isAllowSelectTeacherOrg === false ? this.selectClassKey : null, orgIds: this.isAllowSelectTeacherOrg === true ? this.selectOrgKey : null, noticeImg, noticeType: this.selectedOptions, noticeTitle: this.noticeTitle, noticeBody: this.noticeBody, expireDate, noticeReadFeedback: 2, readScope: this.readScope}, (data) => {
          this.clearParamsCache()
          this.$router.go(-1)
          this.tools.successToast('发布成功')
        }, (data) => {
          this.tools.warnToast('发布失败')
        })
      },
      // 显示班级选择菜单
      onShowClassList () {
        this.showClassList = true
        if (this.schoolNoticeStatus === true) {
          // 所有班级
          eduApi.getClassList({ schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999 }, (data) => {
            this.classList = []
            data.forEach((element) => {
              var item = {key: element.classId + '', value: element.className}
              this.classList.push(item)
            }, this)
          }, (er) => {})
        } else {
          // 有权限的班级
          eduApi.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'GONGGAO_BANJI'}, (data) => {
            this.classList = []
            data.forEach((element) => {
              var item = {key: element.classId + '', value: element.className}
              this.classList.push(item)
            }, this)
          }, () => {})
        }
      },
      // 确认选择的班级
      confirmClass () {
        if (this.isAllowSelectTeacherOrg === true) {
          this.selectOrgKey = []
          this.selectOrgKey.push(...this.selectOrgTempKey)
          this.setSelectedOrgName(this.selectOrgKey)
          this.showOrgList = false
        } else {
          this.selectClassKey = []
          this.selectClassKey.push(...this.selectClassTempKey)
          this.setSelectedClassName(this.selectClassKey)
          this.showClassList = false
        }
      },
      setSelectedOrgName (key) {
        if (this.tools.isNull(key)) {
          return
        }
        if (key.length > 1) {
          this.selectedName = '已选择' + key.length + '个教师群'
        } else if (key.length === 1) {
          this.orgList.forEach(element => {
            if (parseInt(element.key) === parseInt(key[0])) {
              this.selectedName = String(element.value)
            }
          })
        } else {
          this.selectedName = ''
        }
      },
      setSelectedClassName (key) {
        if (this.tools.isNull(key)) {
          return
        }
        if (key.length > 1) {
          this.selectedName = '已选择' + key.length + '个班级'
        } else if (key.length === 1) {
          this.classList.forEach(element => {
            if (parseInt(element.key) === parseInt(key[0])) {
              this.selectedName = String(element.value)
            }
          })
        } else {
          this.selectedName = ''
        }
      },
      onShowOrgList () {
        this.showOrgList = true
        eduApi.queryRelationOrg({schoolId: this.$route.params.schoolId, orgType: 1, rowStart: 0, rowCount: 100}, (data) => {
          this.orgList = []
          data.forEach((element) => {
            var item = {key: element.orgId + '', value: element.orgName}
            this.orgList.push(item)
          }, this)
        }, (er) => {
        })
      },
      mediaCallBack ({imageData}) {
        this.contentImgPathList = imageData
      },
      setParamsCache () {
        if (this.tools.isNull(this.$route.params.noticeId)) {
          window.localStorage.setItem('publish_notice_cache' + this.$route.params.schoolId, JSON.stringify(this.localParams))
        }
      },
      clearParamsCache () {
        window.localStorage.removeItem('publish_notice_cache' + this.$route.params.schoolId)
      }
    }
  }
</script>

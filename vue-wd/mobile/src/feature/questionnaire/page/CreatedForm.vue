<template>
  <div>
    <group gutter="0" label-width="5em" label-margin-right="0.5em" label-align="left">
      <x-input title="问卷标题" v-model="questionTitle" placeholder="请输入问卷标题"></x-input>
      <cell title="问卷封面" @click.native='chooseImg("image")' is-link>
        <img slot="default" :src="tools.cdn(questionLogo,'logo.png', 128)" class="adminssion-cell-cover-img"/>
        <p slot="inline-desc" style="fontSize: 14px;marginTop: 3px">建议上传宽高比为2:1的图片</p>
      </cell>
      <datetime-range value-text-align="left" title="截止时间" format="YYYY年MM月DD日" :start-date="startDate" :end-date="endDateStop" v-model="dateValue" placeholder="请选择截止时间"></datetime-range>
      <selector title="问卷范围" v-if="isShow && userInfo.schoolModel != 2" :options="list" v-model="questionType" @on-change="onChange" placeholder="请选择问卷范围"></selector>
      <cell title="选择班级" v-if="showClassOrg && userInfo.schoolModel != 2" value-align="left" :value="selectedName" @click.native="onShowClassList" is-link></cell>
      <cell title="选择教师群" v-if="showTeacherOrg && userInfo.schoolModel != 2" value-align="left" :value="selectedName" @click.native="onShowOrgList" is-link></cell>
      <!-- <cell title="问卷范围" v-if="userInfo.schoolModel == 2" value-align="left">全校学生问卷</cell> -->
      <selector title="可答卷用户" v-show="showUser" :options="listUser" v-model="answerUserType"></selector>
      <x-switch title="是否匿名" v-model="isAnonymous"></x-switch>
      <x-textarea title="问卷描述" v-model="questionDes" placeholder="请输入问卷描述" :rows="5"></x-textarea>
    </group>
    <detail-tabbar :actionLink="nextFun" :actions="actions"></detail-tabbar>
    <popup v-model="showClassList" height="80%">
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller>
          <checklist style="margin-top:-1px" :options="classList" v-model="selectTempKey" v-if="classList.length > 0"></checklist>
          <p v-else style="font-size: 16px;text-align: center;line-height: 40px;">没有相关班级，请先创建班级</p>
        </scroller>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showClassList = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmClass">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
    <!-- 选择教师群 -->
    <popup v-model="showOrgList" height="80%">
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller>
          <checklist style="margin-top:-1px" :options="orgList" v-model="selectTempKey" v-if="orgList.length > 0"></checklist>
          <p v-else style="font-size: 16px;text-align: center;line-height: 40px;">没有相关教师群，请先创建教师群</p>
        </scroller>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showOrgList = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmClass">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
  </div>
</template>
<script>
  import { Group, Cell, XInput, Datetime, XSwitch, XTextarea, PopupPicker, dateFormat, Selector, Popup, Checklist, DatetimeRange, LoadingPlugin } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import eduApi from '@/feature/education/api'
  import api from '../api'
  import Vue from 'vue'
  Vue.use(LoadingPlugin)

  export default {
    components: {
      Group, Cell, XInput, DetailTabbar, Datetime, XSwitch, XTextarea, PopupPicker, dateFormat, Selector, Popup, Checklist, DatetimeRange
    },
    data() {
      return {
        selectedName: '',
        classList: [],
        selectTempKey: [],
        orgList: [],
        showClassList: false,
        showOrgList: false,
        questionTitle: null,
        endDate: null,
        questionDes: null,
        isAnonymous: false,
        showUser: false,
        actions: [{name: '下一步'}],
        list: [{value: '全校学生问卷', key: '1'}, {value: '教师问卷', key: '2'}, {value: '班级问卷', key: '3'}],
        questionType: null,
        answerUserType: '1',
        listUser: [{value: '无限制', key: '1'}, {value: '只允许家长', key: '3'}, {value: '只允许学生', key: '2'}],
        questionLogo: null,
        scrollerHeight: 0,
        dateValue: [],
        mediaArgs: [],
        mediaImageType: 'SCHOOL_QUESTION',
        isShow: false,
        schoolQuestionStatus: false,
        showTeacherOrg: false,
        showClassOrg: false,
        userInfo: {}
      }
    },
    mounted () {
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.userInfo = data
        this.questionType = '1'
      }, () => {})
      this.localStorage.getFeatureManageStatus({schoolId: this.$route.params.schoolId}, (data) => {
        this.schoolQuestionStatus = data.schoolQuestionStatus
        if (data.schoolQuestionStatus) {
          this.isShow = true
        } else {
          this.isShow = false
          this.showClassOrg = true
          this.questionType = '3'
        }
      }, () => {})
      this.mediaArgs = [
        this.$route.params.schoolId
      ]
      this.scrollerHeight = window.innerHeight * 0.8 - 50
      if (this.$route.params.questionId) {
        this.actions = [{name: '保存'}]
        api.questionSimplenessInfo({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId}, (data) => {
          this.questionType = data.questionType.toString()
          this.questionTitle = data.questionTitle
          this.questionLogo = data.questionImage
          this.questionDes = data.questionDes
          this.isAnonymous = data.isAnonymous
          var dateStart = dateFormat(data.endDate, 'YYYY-MM-DD/HH/mm').split('/')
          this.dateValue.push(dateStart[0])
          this.dateValue.push(dateStart[1])
          this.dateValue.push(dateStart[2])
          setTimeout(() => {
            this.answerUserType = data.answerUserType.toString()
            if (this.questionType === '3') {
              for (let i = 0; i < data.classIds.length; i++) {
                data.classIds[i] = data.classIds[i].toString()
              }
              this.selectedName = '已选择' + data.classIds.length + '个班级'
              this.selectTempKey = data.classIds
            } else if (this.questionType === '2') {
              for (let i = 0; i < data.orgIds.length; i++) {
                data.orgIds[i] = data.orgIds[i].toString()
              }
              this.selectedName = '已选择' + data.orgIds.length + '个教师群'
              this.selectTempKey = data.orgIds
            }
          }, 50)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      }
    },
    computed: {
      startDate () {
        var date = new Date()
        date.setDate(date.getDate() + 1)
        return dateFormat(date, 'YYYY-MM-DD')
      },
      endDateStop () {
        var date = new Date()
        date.setFullYear(date.getFullYear() + 1)
        return dateFormat(date, 'YYYY-MM-DD')
      }
    },
    watch: {
      questionType (newRange, old) {
        if (newRange === '3' || newRange === '1') {
          this.showUser = true
        } else {
          this.showUser = false
        }
      }
    },
    methods: {
      onChange () {
        this.selectedName = ''
        this.selectTempKey = []
        this.answerUserType = '1'
        if (this.questionType === '2') {
          this.showTeacherOrg = true
          this.showClassOrg = false
        } else if (this.questionType === '3') {
          this.showTeacherOrg = false
          this.showClassOrg = true
        } else {
          this.showTeacherOrg = false
          this.showClassOrg = false
        }
      },
      confirmClass () {
        if (this.selectTempKey.length === 0) {
          this.showClassList = false
          this.showOrgList = false
          this.selectedName = ''
          return
        }
        if (this.questionType === '2') {
          if (this.selectTempKey.length <= 0) {
            this.showOrgList = false
            return
          }
          this.selectedName = '已选择' + this.selectTempKey.length + '个教师群'
          this.showOrgList = false
        } else if (this.questionType === '3') {
          if (this.selectTempKey.length <= 0) {
            this.showClassList = false
            return
          }
          this.selectedName = '已选择' + this.selectTempKey.length + '个班级'
          this.showClassList = false
        } else {
          this.selectedName = ''
        }
      },
      onShowClassList () {
        this.showClassList = true
        if (this.schoolQuestionStatus === true) {
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
          eduApi.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'WENJUAN_BANJI'}, (data) => {
            this.classList = []
            data.forEach((element) => {
              var item = {key: element.classId + '', value: element.className}
              this.classList.push(item)
            }, this)
          }, () => {})
        }
      },
      onShowOrgList () {
        eduApi.queryRelationOrg({schoolId: this.$route.params.schoolId, orgType: 1, rowStart: 0, rowCount: 100}, (data) => {
          this.showOrgList = true
          this.orgList = []
          data.forEach((element) => {
            var item = {key: element.orgId + '', value: element.orgName}
            this.orgList.push(item)
          }, this)
        }, (er) => {
        })
      },
      chooseImg (type) {
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
                this.uploadApi.uploadMpImage({type: this.mediaImageType, args: this.mediaArgs, mediaId: res.serverId}, (data) => {
                  this.questionLogo = data.result.path
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
      nextFun () {
        if (parseInt(this.userInfo.schoolModel) === 2) {
          this.questionType = 1
        }
        if (!this.questionTitle) {
          this.tools.warnToast('请填写问卷标题', '160px')
          return
        }
        if (this.dateValue.length === 0) {
          this.tools.warnToast('请选择截止时间', '160px')
          return
        }
        if (!this.questionType) {
          this.tools.warnToast('请选择问卷范围', '160px')
          return
        } else {
          if (this.questionType === '1') {
            if (!this.answerUserType) {
              this.tools.warnToast('请选择可答卷用户', '160px')
              return
            }
          } else if (this.questionType === '2') {
            if (this.selectTempKey.length <= 0) {
              this.tools.warnToast('请选择教师群', '160px')
              return
            }
          } else if (this.questionType === '3') {
            if (this.selectTempKey.length <= 0) {
              this.tools.warnToast('请选择班级群', '160px')
              return
            }
            if (!this.answerUserType) {
              this.tools.warnToast('请选择可答卷用户', '160px')
              return
            }
          }
        }
        if (!this.questionDes) {
          this.tools.warnToast('请填写问卷描述', '160px')
          return
        }
        this.save()
      },
      save () {
        var isEdit
        var questionData = {
          questionType: this.questionType,
          questionTitle: this.questionTitle,
          questionDes: this.questionDes,
          isAnonymous: this.isAnonymous,
          endDate: this.dateValue[0] + ' ' + this.dateValue[1] + ':' + this.dateValue[2],
          questionImage: this.questionLogo
        }
        if (this.$route.params.questionId) {
          isEdit = 'yes'
          questionData.questionId = this.$route.params.questionId
        } else {
          isEdit = 'no'
        }
        if (this.showUser) {
          questionData.answerUserType = this.answerUserType
        } else {
          questionData.answerUserType = null
        }
        api.addQuestion({schoolId: this.$route.params.schoolId, questionData: questionData, isEdit, classIds: this.questionType === '3' ? this.selectTempKey : null, orgIds: this.questionType === '2' ? this.selectTempKey : null}, (data) => {
          if (this.$route.params.questionId) {
            this.$router.go(-1)
          } else {
            this.$router.replace({name: 'questionSubjectList', params: {questionId: data.result}})
          }
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('保存失败！')
          }
        })
      }
    }
  }
</script>
<style>
.adminssion-cell-cover-img{
  display:block;
  border-radius: 5px;
  width: 130px;
  height: 65px;
  margin-right:10px;
}
</style>


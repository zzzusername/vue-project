<template>
  <div>
    <group gutter="0" label-width="6em" label-margin-right="0.8em" label-align="left">
      <selector v-if="showSelector" title="留言类型" :options="types" v-model="userStatus"></selector>
      <cell v-if="userStatus == 1" title="目标班级" value-align="left" :value="selectClass.name" @click.native="showClassPopu = !showClassPopu" is-link></cell>
      <cell v-if="userStatus == 2 || userStatus == 3 || userStatus == 4" title="选择教师" value-align="left" is-link @click.native="selectUser(1)" :value="selectUserIds.length>0?'已选择' + selectUserIds.length + '名教师':''"></cell>
      <cell v-if="userStatus == 1" title="选择学生" value-align="left" is-link @click.native="selectUser(2)" :value="selectUserIds.length>0?'已选择' + selectUserIds.length + '名学生':''"></cell>
      <x-switch v-if="userStatus == 1" title="是否需要阅读反馈" v-model="returnReceipt"></x-switch>
      <x-switch v-if="userStatus == 1" title="是否只允许家长接收" v-model="isOnlyParents"></x-switch>
      <x-textarea title="留言内容" placeholder="必填" :rows="8" v-model="messageBody"></x-textarea>
      <media-upload :imageData="contentImgPathList" :args="mediaArgs" :imageType="mediaImageType" :callBack="mediaCallBack"></media-upload>
    </group>
    <class-popu-picker v-if="userStatus == 1" :show="showClassPopu" @confirm="selectClassPicker" feature-code="LIUYAN"></class-popu-picker>
    <popup v-model="showUserList" height="80%">
      <search v-if="userStatus == 4" v-model="searchValue" position="absolute" auto-scroll-to-top top="0" @on-focus="onFocus" @on-cancel="onCancel" @on-submit="onSubmit" ref="search"></search>
      <div v-if="isFocus" style="height: 44px;"></div>
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller>
          <checklist style="margin-top:-1px" :options="optionsUserList" v-model="selectTempUserKey"></checklist>
        </scroller>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showUserList = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmUser()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
    <detail-tabbar :actionLink="onSend" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
  import { Group, XTextarea, Selector, Cell, XSwitch, Popup, Checklist, Search } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import MediaUpload from '@/components/MediaUpload.vue'
  import ClassPopuPicker from '@/feature/education/components/ClassPopuPicker'
  import api from '../api'
  import eduApi from '@/feature/education/api'
  export default {
    components: {
      Group, XTextarea, Selector, DetailTabbar, Cell, MediaUpload, XSwitch, ClassPopuPicker, Popup, Checklist, Search
    },
    data () {
      return {
        childrenOptions: [],
        readFeedBack: false,
        isOnlyParents: false,
        messageBody: '',
        scrollerHeight: 0,
        mediaArgs: [],
        mediaImageType: 'SCHOOL_MESSAGE',
        contentImgPathList: [],
        showClassPopu: false,
        selectClass: '',
        actions: [{
          name: '发送',
          code: 'send'
        }],
        userInfo: {},
        userStatus: 0, // 用户的状态 1、教师 2、学生 3、家长
        showUserList: false,
        optionsUserList: [],
        selectTempUserKey: [],
        selectUserIds: [],
        allowScope: 1,  // 默认全部接收
        returnReceipt: false, // 默认不回执
        types: [
          {key: 1, value: '学生留言'},
          {key: 4, value: '教师留言'}
        ],
        messageType: null,
        showSelector: false,
        searchValue: null,
        isFocus: false
      }
    },
    watch: {
      isOnlyParents (newVal, oldVal) {
        if (newVal === true) {
          this.allowScope = 2
        } else {
          this.allowScope = 1
        }
      },
      userStatus(nval, oval) {
        if (nval === 4) {
          this.initData()
          this.scrollerHeight = window.innerHeight * 0.8 - 50 - 44
        }
      }
    },
    mounted () {
      this.mediaArgs = [
        this.$route.params.schoolId
      ]
      this.scrollerHeight = window.innerHeight * 0.8 - 50
      // 1、判断是家长发布 还是教师发布
      // 2、家长根据班级 查询教师， 教师根据班级查询学生
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.userInfo = data
        if (data.isMaster || data.isTeacher) {
          this.showSelector = true
        } else if (data.isStudent) {
          this.userStatus = 2
        } else if (data.isParent) {
          this.userStatus = 3
        }
        // if (this.tools.isNull(this.$route.params.studentId)) {
        //   if (this.userInfo.isStudent === true) {
        //     this.userStatus = 2
        //   } else {
        //     this.userStatus = 1
        //   }
        // } else {
        //   this.userStatus = 3
        // }
        this.initData()
      }, () => {
        this.initData()
      })
    },
    methods: {
      initData () {
        console.log('initdata＝＝＝', this.userStatus)
        if (this.userStatus === 2 || this.userStatus === 3) {
          api.queryClassesTeacherList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, featureCode: 'LIUYAN'}, (data) => {
            this.optionsUserList = []
            data.forEach((element) => {
              var item = {key: element.teacherId + '', value: element.teacherName}
              this.optionsUserList.push(item)
            }, this)
          }, () => {})
        } else if (this.userStatus === 4) {
          eduApi.getTeacherList({schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999}, (data) => {
            this.optionsUserList = []
            data.forEach((element) => {
              var item = {key: element.teacherId + '', value: element.teacherName}
              this.optionsUserList.push(item)
            }, this)
          }, er => {})
        }
      },
      selectClassPicker(val) {
        this.selectClass = val
        if (!this.tools.isNull(this.selectClass.value)) {
          eduApi.getFeaturesStudents({schoolId: this.$route.params.schoolId, classId: this.selectClass.value, featureCode: 'LIUYAN', rowStart: 0, rowCount: 9999}, (data) => {
            this.optionsUserList = []
            data.forEach((element) => {
              var item = {key: element.studentId + '', value: element.studentName}
              this.optionsUserList.push(item)
            }, this)
          }, () => {})
        }
      },
      // 发送
      onSend () {
        // 验证数据合法性
        if (this.userStatus === 0) {
          this.tools.warnToast('请选择留言类型')
          return
        }
        if (this.selectUserIds.length === 0) {
          if (this.userStatus === 1) {
            this.tools.warnToast('请先选择学生', '160px')
          } else {
            this.tools.warnToast('请先选择教师', '160px')
          }
          return
        }
        if (this.tools.isNull(this.messageBody)) {
          this.tools.warnToast('留言内容不能为空', '160px')
          return
        }
        var messageImg = null
        if (this.contentImgPathList.toString() !== 'null') {
          messageImg = this.contentImgPathList.toString()
        }
        let data = {
          messageType: this.userStatus
        }
        let obj = {}
        if (this.userStatus === 1) {
          obj = {
            allowScope: this.allowScope,
            returnReceipt: this.returnReceipt,
            studentIds: this.selectUserIds
          }
        } else if (this.userStatus === 2 || this.userStatus === 4) {
          obj = {
            teacherIds: this.selectUserIds
          }
        } else if (this.userStatus === 3) {
          obj = {
            studentId: this.$route.params.studentId,
            teacherIds: this.selectUserIds
          }
        }
        Object.assign(data, obj)
        api.addMessage({schoolId: this.$route.params.schoolId, message: this.messageBody, messageImg, data}, () => {
          this.tools.successToast('留言发送成功！')
          this.$router.back()
        }, (err) => {
          if (err.toUser) {
            this.tools.warnToast(err.message, '180px')
          } else {
            this.tools.warnToast('留言发送失败')
          }
        })
      },
      mediaCallBack ({imageData}) {
        this.contentImgPathList = imageData
      },
      confirmUser () {
        this.showUserList = false
        this.selectUserIds = []
        this.selectUserIds.push(...this.selectTempUserKey)
      },
      selectUser (type) {
        if (type === 2 && this.tools.isNull(this.selectClass.value)) {
          // 先选择班级
          this.tools.warnToast('请先选择班级')
          return
        }
        this.selectTempUserKey = this.selectUserIds
        this.showUserList = true
      },
      onFocus() {
        this.isFocus = true
      },
      onCancel() {
        this.isFocus = false
        this.searchValue = null
        this.getTeacherList()
      },
      onSubmit() {
        this.getTeacherList()
      },
      getTeacherList() {
        eduApi.getTeacherList({schoolId: this.$route.params.schoolId, teacherName: this.searchValue, rowStart: 0, rowCount: 9999}, (data) => {
          this.optionsUserList = []
          data.forEach((element) => {
            var item = {key: element.teacherId + '', value: element.teacherName}
            this.optionsUserList.push(item)
          }, this)
        }, er => {})
      }
    }
  }
</script>

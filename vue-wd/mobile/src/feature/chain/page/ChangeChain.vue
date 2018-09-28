<template>
  <div>
    <group gutter="10px" label-width="6em" label-margin-right="0.8em">
      <cell title="接龙标题" :value="chainInfo.info.chainTitle"></cell>
      <cell title="目标班级" v-if="chainInfo.info.chainType == '3'" :value="chainInfo.info.className"></cell>
      <cell v-if="chainInfo.info.chainType == '3'" title="高级设置" :link="{name: 'educationChainAdvanced'}" value="修改设置" is-link></cell>
      <cell v-if="chainInfo.info.chainType == '2'" title="选择教师" :value="selectedTeacherName" is-link @click.native="onShowTeacherList" value-align="left"></cell>
      <datetime-range value-text-align="left" title="结束时间" format="YYYY年MM月DD日" :start-date="startDate" :end-date="endDate" v-model="chainInfo.info.endDate" placeholder="请选择结束时间"></datetime-range>
      <x-textarea title="任务描述" placeholder="必填" :rows="6" v-model="chainInfo.info.chainDesc" @on-change="val => {if(val !== ''){showContentHint = false} else {showContentHint = true}}"></x-textarea>
      <media-upload :imageData="contentImgPathList" :args="mediaArgs" :imageType="mediaImageType" :callBack="mediaCallBack"></media-upload>
    </group>
    <detail-tabbar :actionLink="onPublish" :actions="actions"></detail-tabbar>
    <!-- 选择老师 -->
    <popup v-model="showTeacherList" height="90%">
      <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
        <scroller v-if="chainInfo.info.chainType == '2'" ref="manage_scroller" no-data-text="没有更多教师～">
          <checklist :options="teacherList" v-model="teacherIds"></checklist>
        </scroller>
        <p v-if="teacherList.length <= 0" style="padding: 15px;text-align: center;color: #999;font-size: 16px;">暂无老师，请先创建老师</p>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;background: rgb(230, 230, 230)" @click="showTeacherList = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="showTeacherList = false">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
  import { Group, Confirm, DatetimeRange, XInput, XTextarea, Actionsheet, Selector, Popup, Cell, TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import MediaUpload from '@/components/MediaUpload.vue'
  import Checklist from '@/components/checklist/Index.vue'
  import eduApi from '@/feature/education/api'
  import api from '../api.js'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Group, XInput, XTextarea, Confirm, DatetimeRange, Actionsheet, Selector, Checklist, DetailTabbar, Popup, Cell, MediaUpload
    },
    data () {
      return {
        scrollerHeight: 0,
        userInfo: {},
        actions: [
          {name: '修改', code: 'edit'}
        ],
        contentImgPathList: [],
        mediaArgs: [],
        mediaImageType: 'SCHOOL_CHAIN',
        showTeacher: false,
        selectedTeacherName: null,
        teacherList: [],
        teacherIds: [],
        showTeacherList: false,
        chainInfo: {
          info: {},
          userList: []
        }
      }
    },
    computed: {
      startDate () {
        var date = new Date()
        date.setDate(date.getDate() + 1)
        return this.tools.formateTime(date, 'YYYY-MM-DD')
      },
      endDate () {
        var date = new Date()
        date.setFullYear(date.getFullYear() + 1)
        return this.tools.formateTime(date, 'YYYY-MM-DD')
      }
    },
    watch: {
      teacherIds: {
        handler (newTeacherIds, old) {
          if (this.teacherIds.length > 0) {
            this.selectedTeacherName = '已选择' + this.teacherIds.length + '名老师'
          } else {
            this.selectedTeacherName = null
          }
        },
        immediate: true
      }
    },
    mounted () {
      this.mediaArgs = [
        this.$route.params.schoolId
      ]
      this.scrollerHeight = window.innerHeight * 0.9 - 50
      this.$store.commit('setStudentHomeworkSetting', null)
      this.$store.commit('setSelectClassList', null)
      api.getInfo({schoolId: this.$route.params.schoolId, chainId: this.$route.params.chainId}, (data) => {
        this.chainInfo = data
        if (parseInt(this.chainInfo.info.chainType) === 3) {
          this.$store.commit('setSelectClassList', [{key: this.chainInfo.info.classId, value: this.chainInfo.info.className}])
          if (this.chainInfo.userList.length > 0) {
            this.$store.commit('setStudentHomeworkSetting', this.chainInfo.userList)
          }
        }
        this.chainInfo.info.endDate = this.tools.formateTime(this.chainInfo.info.endDate, 'YYYY-MM-DD HH:mm')
        let editDate = []
        let editStr = this.chainInfo.info.endDate.split(' ')
        editDate[0] = editStr[0]
        editDate[1] = editStr[1].split(':')[0]
        editDate[2] = editStr[1].split(':')[1]
        this.chainInfo.info.endDate = editDate
        if (!this.tools.isNull(this.chainInfo.info.chainImage)) {
          this.chainInfo.info.chainImage.split(',').forEach((element) => {
            this.contentImgPathList.push(element)
          })
        }
        if (this.chainInfo.userList.length > 0 && parseInt(this.chainInfo.info.chainType) === 2) {
          this.chainInfo.userList.forEach((item) => {
            this.teacherIds.push(item.teacherId.toString())
          })
        }
      }, (er) => {})
    },
    methods: {
      onPublish (code) {
        let message = this.chainInfo.info
        if (message.chainType === '2') {
          if (this.teacherIds.length <= 0) {
            this.tools.warnToast('请选择老师')
            return
          }
        }
        if (message.chainDesc || this.contentImgPathList.length > 0) {
        } else {
          this.tools.warnToast('请填写任务描述', '150px')
          return
        }
        var imgs = null
        if (this.contentImgPathList.toString() !== 'null' && this.contentImgPathList.length > 0) {
          imgs = this.contentImgPathList.toString()
        }
        let newDate
        if (message.endDate.length === 0) {
          newDate = null
        } else {
          newDate = message.endDate[0] + ' ' + message.endDate[1] + ':' + message.endDate[2]
        }
        let students = this.$store.getters.getClassStudents
        let classes = []
        const element = this.chainInfo.info.classId
        let obj = {classId: element, student: []}
        if (students !== null && students[element] !== undefined && students[element].length > 0) {
          students[element].forEach(student => {
            if (student.check.indexOf(2) >= 0) {
              obj.student.push({studentId: student.studentId})
            }
          })
        } else {
          this.chainInfo.userList.forEach(element => {
            obj.student.push({studentId: element.studentId})
          })
        }
        classes.push(obj)
        api.addChain({
          schoolId: this.$route.params.schoolId,
          chainId: this.$route.params.chainId,
          chainType: message.chainType,
          chainTitle: message.chainTitle,
          chainImage: imgs,
          chainDesc: message.chainDesc,
          endDate: newDate,
          teacherIds: this.teacherIds,
          classes: classes,
          isEdit: true
        }, (data) => {
          this.tools.successToast('修改成功')
          this.$router.go(-1)
          this.$store.commit('setClassStudents', null)
          this.$store.commit('setSelectClassList', null)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message, '180px')
          } else {
            this.tools.warnToast('修改失败')
          }
        })
      },
      onShowTeacherList () {
        this.teacherListLoadData((data) => {
          this.teacherList = []
          data.forEach((element) => {
            let item = {
              icon: this.tools.cdn(element.userIcon, 'head.png', 128),
              key: element.teacherId.toString(),
              value: element.teacherName
            }
            this.teacherList.push(item)
          })
          this.showTeacherList = true
        })
      },
      teacherListLoadData(cb) {
        eduApi.getTeacherList({ schoolId: this.$route.params.schoolId, teacherName: null, rowStart: 0, rowCount: 10000 }, (data) => {
          cb(data)
        }, (er) => {})
      },
      mediaCallBack ({imageData}) {
        this.contentImgPathList = imageData
      }
    }
  }
</script>

<style scoped>

</style>

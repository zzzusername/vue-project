<template>
  <div>
    <Group label-width="6em" label-margin-right="0.5em" label-align="left">
      <cell title="作业名称" :value="workInfo.workName"></cell>
      <cell title="目标班级" :value="workInfo.className"></cell>
      <cell title="高级设置" value="修改设置" is-link :link="{name: 'educationHomeworkAdvanced'}"></cell>
      <!-- <datetime title="截止提交时间" format="YYYY-MM-DD HH:mm" :min-hour=9 :max-hour=18 :min-year="1917" v-model="workInfo.endDate"></datetime> -->
      <datetime-range title="截止提交时间" :start-date="currentTime" :end-date="endTime" format="YYYY年MM月DD日" v-model="workInfo.endDate"></datetime-range>
      <x-textarea title="作业内容" v-model="workInfo.workContent" placeholder="作业描述" :autosize="true"></x-textarea>
      <media-upload :imageData="contentImgPathList" :audioData="contentAudioPathList" :videoData="contentVideoPathList" :args="mediaArgs" :imageType="mediaImageType" :audioType="mediaAudioType" :videoType="mediaVideoType" :callBack="mediaCallBack"></media-upload>
    </Group>
    <detail-tabbar :actionLink="editFun" :actions="actions"></detail-tabbar>
  </div>
</template>
<script>
  import { DatetimeRange, Actionsheet, dateFormat, Datetime, Group, XInput, XTextarea, Cell } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import MediaUpload from '@/components/MediaUpload.vue'
  import api from '../../api'
  export default{
    components: {DatetimeRange, Actionsheet, Datetime, Group, XInput, XTextarea, DetailTabbar, Cell, MediaUpload},
    data () {
      return {
        actions: [
          { name: '保存并提交', code: 'save' }
        ],
        workInfo: {},
        mediaArgs: [],
        mediaImageType: 'SCHOOL_CLASS_WORK',
        mediaAudioType: 'SCHOOL_CLASS_WORK_VOICE',
        mediaVideoType: 'SCHOOL_WORK_VIDEO',
        contentImgPathList: [],
        contentAudioPathList: [],
        contentVideoPathList: [],
        studentList: []
      }
    },
    computed: {
      currentTime() {
        return this.tools.formateTime(new Date(), 'YYYY-MM-DD')
      },
      endTime() {
        const date = new Date()
        date.setFullYear(date.getFullYear() + 1)
        return this.tools.formateTime(date, 'YYYY-MM-DD')
      }
    },
    mounted () {
      this.$store.commit('setStudentHomeworkSetting', null)
      this.$store.commit('setSelectClassList', null)
      this.mediaArgs = [this.$route.params.schoolId]
      api.queryTeacherWorkInfo({schoolId: this.$route.params.schoolId, workId: this.$route.params.workId}, (data) => {
        data.work.endDate = dateFormat(data.work.endDate, 'YYYY-MM-DD HH:mm')
        this.workInfo = data.work
        let editDate = []
        let editStr = this.workInfo.endDate.split(' ')
        editDate[0] = editStr[0]
        editDate[1] = editStr[1].split(':')[0]
        editDate[2] = editStr[1].split(':')[1]
        this.workInfo.endDate = editDate
        this.studentList = data.list
        this.$store.commit('setSelectClassList', [{key: data.work.classId, value: data.work.className}])
        if (data.list.length > 0) {
          this.$store.commit('setStudentHomeworkSetting', data.list)
        }
        if (!this.tools.isNull(data.work.workImg)) {
          data.work.workImg.split(',').forEach((element) => {
            this.contentImgPathList.push(element)
          }, this)
        }
        if (!this.tools.isNull(data.work.workVoice)) {
          data.work.workVoice.split(',').forEach((element) => {
            this.contentAudioPathList.push(element)
          }, this)
        }
        if (!this.tools.isNull(data.work.workVideo)) {
          data.work.workVideo.split(',').forEach((element) => {
            this.contentVideoPathList.push(element)
          }, this)
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取失败')
        }
      })
    },
    methods: {
      editFun () {
        if (this.workInfo.endDate === undefined || this.workInfo.endDate === null) {
          this.tools.warnToast('请选择截止提交时间')
          return
        }
        if (this.workInfo.workContent !== undefined && this.workInfo.workContent !== null && this.workInfo.workContent !== '' || this.contentImgPathList.length > 0 || this.contentAudioPathList.length > 0 || this.contentVideoPathList.length > 0) {
        } else {
          this.tools.warnToast('请填写作业内容', '150px')
          return
        }
        let newDate = null
        if (this.workInfo.endDate.length !== 0) {
          newDate = this.workInfo.endDate[0] + ' ' + this.workInfo.endDate[1] + ':' + this.workInfo.endDate[2]
        }
        var imgs = null
        if (this.contentImgPathList.toString() !== 'null') {
          imgs = this.contentImgPathList.toString()
        }
        var workVoice = null
        if (this.contentAudioPathList.toString() !== 'null') {
          workVoice = this.contentAudioPathList.toString()
        }
        var workVideo = null
        if (this.contentVideoPathList.toString() !== 'null') {
          workVideo = this.contentVideoPathList.toString()
        }
        console.log(this.workInfo.classId)
        let students = this.$store.getters.getClassStudents
        let classes = []
        let classId = this.workInfo.classId
        let obj = {classId: classId, student: []}
        if (students !== null && students[classId] !== undefined && students[classId].length > 0) {
          students[classId].forEach(student => {
            if (student.check.indexOf(2) >= 0) {
              if (student.check.indexOf(1) >= 0) {
                obj.student.push({studentId: student.studentId, isRequire: true})
              } else {
                obj.student.push({studentId: student.studentId, isRequire: false})
              }
            }
          })
        } else {
          this.studentList.forEach(element => {
            obj.student.push({studentId: element.studentId, isRequire: element.isRequire})
          })
        }
        classes.push(obj)

        api.teacherEditHomework({schoolId: this.$route.params.schoolId, classes, workId: this.workInfo.workId, endDate: newDate, workContent: this.workInfo.workContent, workImg: imgs, workVoice, workVideo}, (data) => {
          this.tools.successToast('修改成功')
          this.$router.go(-1)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('修改失败')
          }
        })
      },
      mediaCallBack ({imageData, audioData}) {
        this.contentImgPathList = imageData
        this.contentAudioPathList = audioData
      }
    }
  }
</script>
<style>
/* .weui-cell__ft{
  text-align: left !important;
} */
</style>


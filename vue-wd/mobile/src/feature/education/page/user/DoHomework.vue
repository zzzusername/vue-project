<template>
  <div>
    <Group label-width="5em" label-margin-right="0.5em" label-align="left">
      <cell type="text" title="作业名称" label-align="left">
        <p style="text-align: left; color: #000;">{{workName}}</p>
      </cell>
      <x-input type="text" title="发布教师" disabled v-model="teacherName"></x-input>
      <x-textarea title="作业内容" v-model="workContent" placeholder="请填写作业内容" :autosize="true"></x-textarea>
      <media-upload :imageData="contentImgPathList" :audioData="contentAudioPathList" :videoData="contentVideoPathList" :args="mediaArgs" :imageType="mediaImageType" :audioType="mediaAudioType" :videoType="mediaVideoType" :callBack="mediaCallBack"></media-upload>
    </Group>
    <detail-tabbar :actionLink="confirmWork" :actions="actions"></detail-tabbar>
  </div>
</template>
<script>
  import { Group, Cell, XInput, XTextarea, Actionsheet } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import MediaUpload from '@/components/MediaUpload.vue'
  import api from '../../api'
  export default{
    components: {Group, Cell, XInput, XTextarea, DetailTabbar, Actionsheet, MediaUpload},
    data () {
      return {
        workName: null,
        teacherName: null,
        workContent: null,
        studentWorkId: null,
        classId: null,
        actions: [
          {
            name: '提交作业'
          }
        ],
        mediaArgs: [],
        mediaImageType: 'SCHOOL_CLASS_WORK',
        mediaAudioType: 'SCHOOL_CLASS_WORK_VOICE',
        mediaVideoType: 'SCHOOL_WORK_VIDEO',
        contentImgPathList: [],
        contentAudioPathList: [],
        contentVideoPathList: []
      }
    },
    mounted () {
      this.mediaArgs = [
        this.$route.params.schoolId
      ]
      api.studentWorkInfo({schoolId: this.$route.params.schoolId, studentWorkId: this.$route.params.student}, (data) => {
        this.workName = data.teacherWork.workName
        this.teacherName = data.teacherWork.teacherName
        this.classId = data.teacherWork.classId
        if (data.studentWork.workContent !== null && data.studentWork.workContent !== undefined) {
          this.workContent = data.studentWork.workContent
        }
        if (!this.tools.isNull(data.studentWork.workImg)) {
          data.studentWork.workImg.split(',').forEach((element) => {
            this.contentImgPathList.push(element)
          })
        }
        if (!this.tools.isNull(data.studentWork.workVoice)) {
          data.studentWork.workVoice.split(',').forEach((element) => {
            this.contentAudioPathList.push(element)
          })
        }
        if (!this.tools.isNull(data.studentWork.workVideo)) {
          data.studentWork.workVideo.split(',').forEach((element) => {
            this.contentVideoPathList.push(element)
          })
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取信息失败')
        }
      })
    },
    methods: {
      confirmWork () {
        if (!this.workContent && this.contentImgPathList.length === 0 && this.contentAudioPathList.length === 0 && this.contentVideoPathList.length === 0) {
          this.tools.warnToast('请先填写作业内容')
          return
        }
        var workImg = null
        if (this.contentImgPathList.toString() !== 'null') {
          workImg = this.contentImgPathList.toString()
        }
        var workVoice = null
        if (this.contentAudioPathList.toString() !== 'null') {
          workVoice = this.contentAudioPathList.toString()
        }
        var workVideo = null
        if (this.contentVideoPathList.toString() !== 'null') {
          workVideo = this.contentVideoPathList.toString()
        }
        console.log(workImg)
        console.log(workVoice)
        if (this.$route.params.studentId) {
          api.parentSubmitHomework({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, studentWorkId: this.$route.params.student, workContent: this.workContent, workImg, workVoice, workVideo}, (data) => {
            this.tools.successToast('提交成功')
            this.$router.go(-1)
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('提交失败')
            }
          })
          return
        }
        api.submitWork({schoolId: this.$route.params.schoolId, studentWorkId: this.$route.params.student, workContent: this.workContent, workImg, workVoice, workVideo}, (data) => {
          this.tools.successToast('提交成功')
          this.$router.go(-1)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('提交失败')
          }
        })
      },
      mediaCallBack ({imageData, audioData, videoData}) {
        this.contentImgPathList = imageData
        this.contentAudioPathList = audioData
        this.contentVideoPathList = videoData
      }
    }
  }
</script>
<style>

</style>


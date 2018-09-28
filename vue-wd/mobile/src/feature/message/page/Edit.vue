<template>
  <div>
    <group gutter="0" label-width="6em" label-margin-right="0.8em" label-align="left">
      <x-switch title="再次推送留言" v-model="pushState"></x-switch>
      <x-textarea title="留言内容" placeholder="必填" :rows="8" v-model="messageBody"></x-textarea>
      <media-upload :imageData="contentImgPathList" :args="mediaArgs" :imageType="mediaImageType" :callBack="mediaCallBack"></media-upload>
    </group>
    <detail-tabbar :actionLink="update" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Group, XTextarea, Cell, XSwitch } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import MediaUpload from '@/components/MediaUpload.vue'
import api from '../api'
export default {
  components: {
    Group, XTextarea, Cell, DetailTabbar, MediaUpload, XSwitch
  },
  data () {
    return {
      messageBody: '',
      scrollerHeight: 0,
      mediaArgs: [],
      mediaImageType: 'SCHOOL_MESSAGE',
      contentImgPathList: [],
      actions: [{
        name: '保存并提交',
        code: 'save'
      }],
      pushState: false
    }
  },
  mounted () {
    // 查询详情并展示，允许修改内容及图片，增加一个是否推送的开关
    api.getMessageInfo({schoolId: this.$route.params.schoolId, messageId: this.$route.params.messageId}, (data) => {
      this.messageBody = data.message
      if (!this.tools.isNull(data.messageImg)) {
        data.messageImg.split(',').forEach((element) => {
          this.contentImgPathList.push(element)
        }, this)
      }
    }, () => {})
  },
  methods: {
    update () {
      if (this.tools.isNull(this.messageBody)) {
        this.tools.warnToast('留言内容不能为空', '160px')
        return
      }
      var messageImg = null
      if (this.contentImgPathList.toString() !== 'null') {
        messageImg = this.contentImgPathList.toString()
      }
      api.updateMessage({schoolId: this.$route.params.schoolId, messageId: this.$route.params.messageId, message: this.messageBody, messageImg, pushState: this.pushState, studentId: this.$route.params.studentId}, () => {
        this.tools.successToast('修改成功')
        this.$router.back()
      }, (err) => {
        if (err.toUser) {
          this.tools.warnToast(err.message, '180px')
        } else {
          this.tools.warnToast('修改失败')
        }
      })
    },
    mediaCallBack ({imageData}) {
      this.contentImgPathList = imageData
    }
  }
}
</script>

<style>

</style>

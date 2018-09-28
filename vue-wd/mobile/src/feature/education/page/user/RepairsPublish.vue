<template>
  <div>
    <group gutter="10px" label-width="4.5em" label-margin-right="2em" label-align="left">
      <x-input title="报修标题" v-model="title" placeholder="请输入报修标题"></x-input>
      <popup-picker title="报修类型" :data="types" v-model="selectType" show-name placeholder="请选择报修类型" value-text-align="left"></popup-picker>
      <x-textarea title="报修内容" v-model="content" :rows="5" placeholder="请填写具体报修内容"></x-textarea>
      <media-upload :imageData="contentImgPathList" :args="mediaArgs" :imageType="mediaImageType" :callBack="mediaCallBack"></media-upload>
    </group>
    <detail-tabbar :actionLink="publish" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Group, XInput, PopupPicker, XTextarea } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import MediaUpload from '@/components/MediaUpload.vue'
import { mapGetters } from 'vuex'
import api from '../../api'
export default {
  components: {
    Group, XInput, PopupPicker, XTextarea, DetailTabbar, MediaUpload
  },
  data() {
    return {
      actions: [{ name: '发布' }],
      title: '',
      types: [[{ name: '水电', value: '1' }, { name: '宿舍', value: '2' }, { name: '教学器材', value: '3' }]],
      selectType: [],
      content: '',
      mediaArgs: [],
      mediaImageType: 'SCHOOL_REPAIR',
      contentImgPathList: []
    }
  },
  computed: {
    ...mapGetters({
      wechatConfig: 'wechatConfig'
    })
  },
  mounted () {
    this.mediaArgs = [
      this.$route.params.schoolId
    ]
  },
  methods: {
    publish() {
      if (this.title === '') {
        this.tools.warnToast('标题不能为空')
        return
      }
      if (this.selectType.length === 0) {
        this.tools.warnToast('类型不能为空')
        return
      }
      if (this.tools.isNull(this.content) && this.contentImgPathList.length === 0) {
        this.tools.warnToast(' 请填写保修内容')
        return
      }
      var imgs = this.contentImgPathList
      api.addRepair({ schoolId: this.$route.params.schoolId, contentText: this.content, imgs, repairTitle: this.title, repairType: this.selectType[0] }, (data) => {
        this.$router.go(-1)
        this.tools.successToast('提交成功')
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
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

<template>
  <div>
    <group gutter="10px">
      <x-textarea title="修理内容" v-model="content" :rows="5" placeholder="请填写修理内容"></x-textarea>
      <media-upload :args="mediaArgs" :imageType="mediaImageType" :callBack="mediaCallBack"></media-upload>
    </group>
    <detail-tabbar :actionLink="publish" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Group, XTextarea } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import MediaUpload from '@/components/MediaUpload.vue'
import api from '../../api'
import { mapGetters } from 'vuex'
export default {
  components: {
    Group, XTextarea, DetailTabbar, MediaUpload
  },
  data() {
    return {
      actions: [{ name: '完成' }],
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
      if (this.tools.isNull(this.content)) {
        this.tools.warnToast('修理内容不能为空')
        return
      }
      api.repairComplete({ schoolId: this.$route.params.schoolId, repairId: this.$route.params.repairId, repairText: this.content, imgs: this.contentImgPathList }, (data) => {
        this.$router.go(-1)
        this.tools.successToast('报修处理完成')
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

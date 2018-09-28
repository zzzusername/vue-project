<template>
  <div>
    <Group gutter="0" label-width="5em" label-margin-right="0.5em" label-align="left">
      <x-input type="text" title="学校名称" required placeholder="必填" v-model="schoolMsg.schoolName"></x-input>
      <x-input type="text" title="班级名称" required placeholder="必填" v-model="schoolMsg.className"></x-input>
      <cell title="封面" @click.native='chooseImg()' is-link>
        <img slot="default" :src="tools.cdn(schoolMsg.schoolLogo,'logo.png', 128)" class="adminssion-cell-cover-img">
        <p slot="inline-desc">宽高：640 x 224</p>
      </cell>
      <selector title="班级类型" :options="natureList" v-model="schoolMsg.schoolType" placeholder="必选"></selector>
      <x-input type="text" title="班级联系人" required placeholder="必填" v-model="schoolMsg.schoolPrincipal"></x-input>
      <x-input type="tel" title="联系人电话" placeholder="选填" v-model="schoolMsg.schoolTelephone"></x-input>
    </Group>
    <detail-tabbar :actionLink="saveSchool" :actions="actions" :isHideMe="true"></detail-tabbar>
  </div>
</template>
<script>
  import { Group, Cell, XInput, XTextarea, Selector, LoadingPlugin } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import MediaUpload from '@/components/MediaUpload.vue'
  import apiPersonal from '../../personalApi.js'
  import Vue from 'vue'
  Vue.use(LoadingPlugin)

  export default{
    components: { Group, Cell, XInput, XTextarea, DetailTabbar, Selector, MediaUpload },
    data () {
      return {
        schoolMsg: {},
        actions: [{
          name: '保存并提交',
          code: 'save'
        }],
        natureList: ['幼儿园', '小学', '初中学校', '九年制学校（1-9年级）', '高中学校', '完全中学（含初高中）', '十二年一贯制学校', '婴幼儿培训机构', '中小学生培训机构', '职业教育培训机构', '其它教育培训机构'],
        mediaArgs: [],
        contentImgPathList: []
      }
    },
    mounted () {
      this.mediaArgs = [
        this.$route.params.schoolId
      ]
      apiPersonal.personalInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.schoolMsg = data
      }, (er) => {
        if (er.toUser && er.toUser !== undefined) {
          this.tools.warnToast(er.message)
        }
      })
    },
    methods: {
      chooseImg () {
        this.$wechat.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'],      // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            this.$vux.loading.show({
              text: '图片上传中'
            })
            var localIds = res.localIds
            this.$wechat.uploadImage({
              localId: localIds[0],
              isShowProgressTips: 0,
              success: (res) => {
                this.uploadApi.uploadMpImage({type: 'SCHOOL_INFO_COVER', args: this.mediaArgs, mediaId: res.serverId}, (data) => {
                  this.schoolMsg.schoolLogo = data.result.path
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
      saveSchool (code) {
        if (this.schoolMsg !== null && this.schoolMsg !== undefined) {
          if (this.schoolMsg.schoolName === null || this.schoolMsg.schoolName === undefined || this.schoolMsg.schoolName === '') {
            this.tools.warnToast('请填写学校名称', '160px')
            return
          }
          if (this.schoolMsg.className === null || this.schoolMsg.className === undefined || this.schoolMsg.className === '') {
            this.tools.warnToast('请填写班级名称', '160px')
            return
          }
          if (this.schoolMsg.schoolType === null || this.schoolMsg.schoolType === undefined || this.schoolMsg.schoolType === '') {
            this.tools.warnToast('请选择班级类型', '160px')
            return
          }
          if (this.schoolMsg.schoolPrincipal === null || this.schoolMsg.schoolPrincipal === undefined || this.schoolMsg.schoolPrincipal === '') {
            this.tools.warnToast('请填写班级联系人', '160px')
            return
          }
        }
        this.save()
      },
      save () {
        this.schoolMsg.schoolDescImg = this.contentImgPathList.toString()
        apiPersonal.addPersonal({schoolId: this.$route.params.schoolId, data: this.schoolMsg, type: 'edit'}, (data) => {
          this.tools.successToast('保存成功')
          this.$router.back()
        }, (er) => {
          if (er.toUser) {
            this.tools.warnToast(er.message, '170px')
          } else {
            this.tools.warnToast('保存失败')
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
  width: 90px;
  height: 35px;
  margin-right:10px;
}
</style>

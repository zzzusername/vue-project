<template>
  <div>
    <!-- <div :style="{'height': listHeight + 'px', 'position': 'relative'}">
      <scroller> -->
    <Group gutter="0" label-width="5em" label-margin-right="0.5em" label-align="left">
      <x-input type="text" title="学校名称" required placeholder="必填" v-model="schoolMsg.schoolName"></x-input>
      <cell title="封面" @click.native='chooseImg()' is-link>
        <img slot="default" :src="tools.cdn(schoolMsg.schoolLogo,'logo.png', 128)" class="adminssion-cell-cover-img"></img>
        <p slot="inline-desc">宽高：640 x 224</p>
      </cell>
      <selector title="学校类型" :options="natureList" v-model="schoolMsg.schoolType" placeholder="必选"></selector>
      <x-input type="text" title="学校联系人" required placeholder="必填" v-model="schoolMsg.schoolPrincipal"></x-input>
      <x-input type="tel" title="联系人电话" required placeholder="必填" ref="mobilePhone" keyboard="number" is-type="china-mobile" v-model="schoolMsg.schoolPrincipalTelephone" :disabled="tools.isNull(schoolMsg.schoolPrincipalTelephone)?false:true"></x-input>
      <x-input type="tel" title="学校电话" placeholder="选填" v-model="schoolMsg.schoolTelephone"></x-input>
      <x-textarea title="学校地址" placeholder="必填" :show-counter="false" v-model="schoolMsg.schoolAddress"></x-textarea>
      <x-textarea title="学校简介" placeholder="选填" :show-counter="false" :rows="4" v-model="schoolMsg.schoolDesc"></x-textarea>
      <media-upload :imageData="contentImgPathList" :args="mediaArgs" :imageType="mediaImageType" :callBack="mediaCallBack"></media-upload>
    </Group>
      <!-- </scroller> -->
    <!-- </div> -->
    <detail-tabbar :actionLink="saveSchool" :actions="actions" :isHideMe="true"></detail-tabbar>
  </div>
</template>
<script>
  import { Group, Cell, XInput, XTextarea, Selector, LoadingPlugin } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import MediaUpload from '@/components/MediaUpload.vue'
  import api from '../api'
  import Vue from 'vue'
  Vue.use(LoadingPlugin)

  export default{
    components: { Group, Cell, XInput, XTextarea, DetailTabbar, Selector, MediaUpload },
    data () {
      return {
        listHeight: 0,
        toastText: '',
        schoolMsg: {},
        actions: [{
          name: '保存并提交',
          code: 'save'
        }],
        natureList: ['幼儿园', '小学', '初中学校', '九年制学校（1-9年级）', '高中学校', '完全中学（含初高中）', '十二年一贯制学校', '婴幼儿培训机构', '中小学生培训机构', '职业教育培训机构', '其它教育培训机构'],
        mediaArgs: [],
        mediaImageType: 'SCHOOL_INFO_DESC_IMG',
        contentImgPathList: []
      }
    },
    mounted () {
      this.mediaArgs = [
        this.$route.params.schoolId
      ]
      this.listHeight = window.innerHeight - 50
      api.getSchoolInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.schoolMsg = data
        if (!this.tools.isNull(this.schoolMsg.schoolDescImg)) {
          this.schoolMsg.schoolDescImg.split(',').forEach((element) => {
            this.contentImgPathList.push(element)
          }, this)
        }
      }, () => {})
    },
    methods: {
      chooseImg () {
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
        if (!this.$refs.mobilePhone.valid) {
          this.tools.warnToast('请填写正确的联系人电话', '180px')
          return
        }
        if (!this.tools.isNull(this.schoolMsg.schoolDesc) && this.schoolMsg.schoolDesc.length > 200) {
          this.tools.warnToast('学校简介不能超过200个字', '180px')
          return
        }
        if (this.schoolMsg !== null && this.schoolMsg.schoolName && this.schoolMsg.schoolAddress && this.schoolMsg.schoolType && this.schoolMsg.schoolPrincipal && this.schoolMsg.schoolPrincipalTelephone) {
          // 保存
          this.save()
        } else {
          this.tools.warnToast('请完善信息')
        }
      },
      save () {
        this.schoolMsg.schoolDescImg = this.contentImgPathList.toString()
        api.editSchoolInfo({schoolId: this.$route.params.schoolId, data: this.schoolMsg}, () => {
          this.tools.successToast('保存成功')
          this.$router.back()
        }, (data) => {
          if (data.toUser) {
            this.tools.warnToast(data.message, '170px')
          } else {
            this.tools.warnToast('保存失败')
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
.adminssion-cell-cover-img{
  display:block;
  border-radius: 5px;
  width: 90px;
  height: 35px;
  margin-right:10px;
}
</style>


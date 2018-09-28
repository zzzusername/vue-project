<template>
  <div>
    <Group label-width="6em" label-margin-right="0.5em" label-align="left">
      <selector title="选择菜谱类型" :options="list1" v-model="mealType"></selector>
      <!-- <selector title="选择对象" :options="list2" v-model="groupType"></selector> -->
      <datetime title="用餐时间" format="YYYY-MM-DD" year-row="{value}年" month-row="{value}月" day-row="{value}日" :min-year="1917" v-model="menuDate"></datetime>
      <x-textarea title="菜谱内容" v-model="contentText" placeholder="请输入菜谱内容"></x-textarea>
      <media-upload :imageData="contentImgPathList" :args="mediaArgs" :imageType="mediaImageType" :callBack="mediaCallBack"></media-upload>
    </Group>
    <detail-tabbar :actionLink="publishNow" :actions="actions"></detail-tabbar>
  </div>
</template>
<script>
  import { Datetime, Actionsheet, XTextarea, dateFormat, Group, Cell, Selector } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import MediaUpload from '@/components/MediaUpload.vue'
  import api from '../../api'
  export default{
    components: {Datetime, Actionsheet, XTextarea, dateFormat, Group, Cell, Selector, DetailTabbar, MediaUpload},
    data () {
      return {
        canteenMenuId: null,            // 菜谱id
        actions: [{ name: '完成发布' }],
        mealType: null,
        groupType: null,
        contentText: null,
        menuDate: '',
        list1: [{key: 1, value: '早餐'}, {key: 2, value: '午餐'}, {key: 3, value: '晚餐'}, {key: 4, value: '夜宵'}],
        list2: [{key: 0, value: '全部'}, {key: 1, value: '老师'}, {key: 2, value: '学生'}],
        mediaArgs: [],
        mediaImageType: 'SCHOOL_CANTEEN_MENU',
        contentImgPathList: []
      }
    },
    mounted () {
      this.mediaArgs = [
        this.$route.params.schoolId
      ]
      if (this.$route.params.canteenMenuId) {
        this.actions = [{ name: '完成修改' }]
        api.getCanteenInfo({schoolId: this.$route.params.schoolId, canteenMenuId: this.$route.params.canteenMenuId}, (data) => {
          this.mealType = data.mealType
          this.groupType = data.groupType
          this.contentText = data.contentText
          this.menuDate = dateFormat(data.menuDate, 'YYYY-MM-DD HH:mm')
          if (!this.tools.isNull(data.contentImg)) {
            data.contentImg.split(',').forEach((element) => {
              this.contentImgPathList.push(element)
            }, this)
          }
        }, (er) => {})
      }
    },
    methods: {
      publishNow () {
        if (this.mealType === null || this.mealType === undefined || this.mealType === '') {
          this.tools.warnToast('请选择菜谱类型', '150px')
          return
        }
        if (this.menuDate === null || this.menuDate === undefined || this.menuDate === '') {
          this.tools.warnToast('请选择用餐时间', '150px')
          return
        }
        if (!this.contentText && this.contentImgPathList.length === 0) {
          this.tools.warnToast('请填写菜谱内容', '150px')
          return
        }
        var imgs = null
        if (this.contentImgPathList.toString() !== 'null') {
          imgs = this.contentImgPathList.toString()
        }
        var data = {
          canteenMenuId: this.$route.params.canteenMenuId,
          // groupType: this.groupType,
          mealType: this.mealType,
          contentText: this.contentText,
          menuDate: this.menuDate + ' ' + '00:00',
          contentImg: imgs
        }
        api.saveCanteenMenu({schoolId: this.$route.params.schoolId, data: data}, (data) => {
          if (this.$route.params.canteenMenuId) {
            this.tools.successToast('修改成功！')
          } else {
            this.tools.successToast('发布成功！')
          }
          this.$router.go(-1)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message, '180px')
          } else {
            if (this.$route.params.canteenMenuId) {
              this.tools.warnToast('修改失败')
            } else {
              this.tools.warnToast('发布失败')
            }
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
.weui-cell__ft{
  text-align: left !important;
}
</style>


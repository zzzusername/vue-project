<template>
  <div>
    <group gutter="0">
      <p style="padding: 5px 15px 0;fontSize: 18px;">
        <span :style="{'color': detail.isComplete ? '#A2D268': '#FF6D56'}">[{{detail.isComplete ? '已维修' : '待维修'}}] </span>{{detail.repairTitle}}</p>
      <cell class="repairs_cell">
        <div slot="icon" class="repairs_user_icon" :style="{'background-image':'url('+tools.cdn(detail.teacherUserIcon == null ? detail.studentUserIcon:detail.teacherUserIcon, 'head.png', 128)+')'}"></div>
        <p slot="title">{{detail.teacherName == null ? detail.studentName : detail.teacherName}}</p>
        <p slot="inline-desc">{{formateTime(detail.repairDate)}}</p>
      </cell>
      <p style="padding: 0px 15px 10px">{{detail.contentText}}</p>
      <div style="margin:0 15px;" v-if="imgs.length > 0">
        <img style="width: 100%;" v-for="(item, index) in imgs" :key="index" :src="tools.cdn(item)">
      </div>
      <div style="margin:0 15px;fontSize: 14px;" v-if="detail.repairTeacherId != null">
        <divider>处理内容</divider>
      </div>
      <div style="padding: 0 15px" v-if="detail.repairTeacherId != null">
        <p>处理人：{{detail.repairTeacherName}}</p>
        <p>{{detail.repairText}}</p>
        <div>
          <img style="width: 100%;" v-for="(item, index) in repairImgs" :key="index" :src="tools.cdn(item)">
        </div>
      </div>
    </group>
    <detail-tabbar v-if="String($route.params.isManage) == 'true'" :actionLink="process" :actions="actions"></detail-tabbar>
    <detail-tabbar v-else></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, Divider, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Group, Cell, Divider, DetailTabbar
  },
  data() {
    return {
      detail: {},
      imgs: [],
      actions: [{ name: '处理' }],
      repairImgs: []
    }
  },
  mounted() {
    api.repairDetail({ schoolId: this.$route.params.schoolId, repairId: this.$route.params.repairId, isManage: this.$route.params.isManage }, (data) => {
      this.detail = data
      if (data.isComplete) {
        this.actions = [{ name: '已处理', color: '#999' }]
      } else {
        this.actions = [{ name: '处理' }]
      }
      this.imgs = data.contentImg.split(',')
      this.repairImgs = data.repairImg.split(',')
    }, (er) => {
      if (er.toUser !== undefined && er.toUser) {
        this.tools.warnToast(er.message)
      }
    })
  },
  methods: {
    process() {
      if (this.detail.isComplete) {
        return
      }
      this.$router.push({ name: 'educationRepairProcess', params: { repairId: this.$route.params.repairId } })
      // api.repairComplete({ schoolId: this.$route.params.schoolId, repairId: this.$route.params.repairId }, (data) => {
      //   this.$router.go(-1)
      //   this.tools.successToast('报修处理完成')
      // }, (er) => {
      //   if (er.toUser !== undefined && er.toUser) {
      //     this.tools.warnToast(er.message)
      //   }
      // })
    },
    formateTime(time) {
      return dateFormat(time, 'YYYY-MM-DD HH:mm')
    }
  }
}
</script>

<style>
.repairs_cell::before {
  border-top: none !important
}

.repairs_user_icon {
  width: 44px;
  height: 44px;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style: none;
  border-width: 0;
}
</style>

<template>
  <div v-if="detail !== null">
    <group gutter="0">
      <cell style="fontSize:16px;" :title="detail.activityName" :inline-desc="'时间：' + getFormateTime(detail.startDate)" is-link @click.native="onActivityDetail">
        <div slot="icon" style="width: 65px;height:50px;marginRight:5px;" class="activity_cover">
          <div :style="{'background-image':'url('+tools.cdn(detail.activityImg, 'logo.png', 128)+')'}"></div>
        </div>
      </cell>
    </group>
    <group gutter="10px" >
      <cell style="fontSize:16px;" title="报名状态">
        <p :style="{color: (detail.checkStatus === 1 || detail.checkStatus === 2) ? 'rgb(243, 109, 33)' : 'rgb(162, 210, 104)'}">{{getReviewStatus(detail.checkStatus)}}</p>
      </cell>
    </group>
    <group gutter="10px" v-if="detail.verificationCode !== null">
      <cell style="fontSize:16px;" :title="'核销码：' + detail.verificationCode">
        <p :style="{color: detail.isVerification ? 'rgb(162, 210, 104)' : 'rgb(243, 109, 33)'}">{{detail.isVerification ? '已核销' : '未核销'}}</p>
      </cell>
      <div style="text-align:center;padding:10px;" class="jhy-1px-t">
        <qrcode :value="detail.verificationCode" type="canvas" :size="120"></qrcode>
      </div>
    </group>
    <group title="报名信息">
      <cell style="fontSize:16px;" title="报名人数" :value="detail.userNum"></cell>      
      <cell style="fontSize:16px;" title="姓名" :value="detail.signName"></cell>
      <cell style="fontSize:16px;" title="手机号" :value="detail.signPhoneNum"></cell>
      <cell v-if="detail.userLinkData !== null" v-for="(item, index) in JSON.parse(detail.userLinkData)" :key="index" style="fontSize:16px;" :title="item.key" :value="item.value"></cell>
    </group>
    <detail-tabbar v-if="detail.checkStatus === 1" :actionLink="cancelSignUp" :actions="actions" isHideMe=true></detail-tabbar>
    <detail-tabbar v-else></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, Qrcode, dateFormat } from 'vux'
import api from '@/feature/activity/api'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    Group, Cell, Qrcode, DetailTabbar
  },
  data() {
    return {
      detail: null,
      actions: [
        {
          name: '取消报名',
          code: 'cancel'
        }
      ]
    }
  },
  mounted() {
    api.getParticipateDetail({ schoolId: this.$route.params.schoolId, activityId: this.$route.params.activityId, studentId: this.$route.params.studentId }, (detail) => {
      this.detail = detail
    }, (data) => {
      if (data.toUser) {
        this.tools.warnToast(data.message, '160px')
      } else {
        this.tools.warnToast('页面展示失败')
      }
    })
  },
  methods: {
    getFormateTime(time) {
      return dateFormat(time, 'YYYY/MM/DD')
    },
    getReviewStatus (val) {
      var status = ''
      switch (val) {
        case 1:
          status = '审核中'
          break
        case 2:
          status = '审核未通过'
          break
        case 3:
          status = '报名成功'
          break
      }
      return status
    },
    cancelSignUp () {
      // 取消报名
      api.cancelSignActivity({studentId: this.$route.params.studentId, activitySignId: this.detail.activitySignId}, (val) => {
        if (val.rs === 1 && val.message === 'ok') {
          this.$router.go(-1)
          this.tools.toast('取消报名成功')
        }
        if (val.toUser !== null && val.toUser) {
          this.tools.toast(val.message)
        }
      }, (val) => {
        if (val.toUser) {
          this.tools.toast(val.message)
        }
      })
    },
    onActivityDetail () {
      let activityId = this.$route.params.activityId
      let studentId = this.$route.params.studentId
      if (this.tools.isNull(this.$route.params.studentId)) {
        this.$router.push({name: 'educationActivityDetail', params: {activityId}})
      } else {
        this.$router.push({name: 'educationActivityDetailForParents', params: {activityId, studentId}})
      }
    }
  }
}
</script>

<style>
.activity_cover div {
  width: 100%;
  height: 100%;
  background-position: center center;
  background-size: cover;
}
</style>

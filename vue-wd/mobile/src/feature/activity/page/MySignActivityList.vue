<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多活动～" ref="manage_scroller">
        <p style="height:10px;" v-if="previewList.length == 0"></p>
        <cell v-for="(item, index) in previewList" :key="index" @click.native="skipDetail(item)" style="background:#fff">
          <span slot="title">{{item.activityName}}</span>
          <div slot="icon" class="activity_list_img" :style="{'background-image':'url('+tools.cdn(item.activityImg, 'logo.png', 128)+')'}"></div>
          <span slot="inline-desc" class="jhy-link-muted">开始时间： {{getFormateTime(item.startDate)}}</span>
          <span v-if="item.checkStatus == 1" slot style="font-size:14px">未审核</span>
          <span v-else-if="item.checkStatus == 2" slot style="font-size:14px;color:#FF6D56">已拒绝</span>
          <span v-else-if="item.checkStatus == 3" slot style="font-size:14px;color:#A2D268">已通过</span>
        </cell>
      </scroller>
    </div>
    <!--底部导航-->
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, dateFormat } from 'vux'
import api from '@/feature/activity/api'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data () {
    return {
      previewList: [],
      scrollerHeight: 0
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50
  },
  methods: {
    infinite(done) {
      this.getMyActivityList(this.previewList.length, (data) => {
        this.previewList = this.previewList.concat(data)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      })
    },
    getMyActivityList (rowStart, callback) {
      var rowCount = 20
      api.getMySignUpActivityList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, rowStart, rowCount}, (data) => {
        callback(data)
      }, () => {})
    },
    getFormateTime (time) {
      return dateFormat(time, 'YYYY/MM/DD')
    },
    skipDetail (val) {
      if (this.tools.isNull(this.$route.params.studentId)) {
        this.$router.push({name: 'educationActivityParticipateDetail', params: {activityId: val.activityId}})
      } else {
        this.$router.push({name: 'educationActivityParticipateDetailForParents', params: {activityId: val.activityId, studentId: this.$route.params.studentId}})
      }
    }
  }
}
</script>

<style>
.activity_list_img {
  width: 18vw;
  height:13vw;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
</style>

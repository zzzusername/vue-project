<template>
  <div>
    <div :style="{'position': 'relative', 'height': scollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多报名用户了～" ref="scroller">
        <div style="height: 10px" v-if="previewList.length == 0"></div>
        <cell :id="index==0?'topitem':''" style="background-color: #fff" v-for="(item, index) in previewList" :key="index" is-link @click.native="skipReviewPage(item)">
          <p slot="title" style="fontSize: 17px;">{{item.signName}}</p>
          <div slot="icon" class="review-user-icon" :style="{'background-image':'url('+tools.cdn(item.studentUserIcon!=null?item.studentUserIcon:item.teacherUserIcon!=null?item.teacherUserIcon:'', 'head.png', 128)+')'}"></div>
          <p slot="inline-desc" style="width:80%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"><span class="jhy-link-muted" style="font-size:14px;marginTop:20px;">{{tools.getDateDiff(item.signDate)}}</span></p>
        </cell>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import { Cell } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/activity/api'
  export default {
    components: {
      Cell, DetailTabbar
    },
    data () {
      return {
        previewList: [],
        scollerHeight: 0
      }
    },
    mounted () {
      this.scollerHeight = window.innerHeight - 50
    },
    methods: {
      getSignUpUserList(rowStart, callback) {
        var schoolId = this.$route.params.schoolId
        var activityId = this.$route.params.activityId
        var rowCount = 100
        api.getSignUpUserList({schoolId, activityId, rowStart, rowCount}, (userList) => {
          callback(userList)
        }, () => {})
      },
      infinite (done) {
        this.getSignUpUserList(this.previewList.length, (list) => {
          this.previewList = this.previewList.concat(list)
          if (list.length < 100) {
            done(true)
          } else {
            done()
          }
        })
      },
      skipReviewPage(item) {
        this.$router.push({name: 'educationActivityReviewInfo', params: {activityId: item.activityId, activitySignId: item.activitySignId}})
      }
    }
  }
</script>
<style scoped>
#topitem::before{
    border-top: 0
  }
.review-user-icon{
  width: 50px;
  height: 50px;
  display: block;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
}
</style>

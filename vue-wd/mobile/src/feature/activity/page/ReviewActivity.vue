<template>
  <div>
    <tab custom-bar-width="5em">
      <tab-item selected @on-item-click="tabSelect">未审核</tab-item>
      <tab-item @on-item-click="tabSelect">已审核</tab-item>
      <tab-item @on-item-click="tabSelect">已拒绝</tab-item>
    </tab>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" :on-refresh="refresh" no-data-text="没有更多活动～" ref="review_scroller">
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
import { Tab, TabItem, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Tab, TabItem, Cell, DetailTabbar
  },
  data() {
    return {
      scrollerHeight: 0,
      previewList: [],
      selectTab: 0,
      unReviewList: [],
      auditedList: [],
      refuseList: []
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 94
  },
  methods: {
    tabSelect(index) {
      console.log(index)
      this.selectTab = index
      this.previewList.splice(0, this.previewList.length)
      this.$refs.review_scroller.finishInfinite()
    },
    infinite(done) {
      switch (this.selectTab) {
        case 0:
          this.getReviewList(1, this.unReviewList.length, (data) => {
            this.unReviewList = this.unReviewList.concat(data)
            this.previewList = this.unReviewList
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
          break
        case 1:
          this.getReviewList(3, this.auditedList.length, (data) => {
            this.auditedList = this.auditedList.concat(data)
            this.previewList = this.auditedList
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
          break
        case 2:
          this.getReviewList(2, this.refuseList.length, (data) => {
            this.refuseList = this.refuseList.concat(data)
            this.previewList = this.refuseList
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
          break
      }
    },
    refresh(done) {
      switch (this.selectTab) {
        case 0:
          this.getReviewList(1, 0, (data) => {
            this.unReviewList = data
            this.previewList = this.unReviewList
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
          break
        case 1:
          this.getReviewList(3, 0, (data) => {
            this.auditedList = data
            this.previewList = this.auditedList
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
          break
        case 2:
          this.getReviewList(2, this.refuseList.length, (data) => {
            this.refuseList = data
            this.previewList = this.refuseList
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
          break
      }
    },
    getReviewList(checkStatus, rowStart, callback) {
      let routeParams = this.$route.params
      api.getManageReviewList({schoolId: routeParams.schoolId, activityId: routeParams.activityId, checkStatus: checkStatus, rowStart, rowCount: 20}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    skipReviewPage(item) {
      // if (this.selectTab !== 0) {
      //   return
      // }
      this.$router.push({name: 'educationActivityReviewInfo', params: {activityId: item.activityId, activitySignId: item.activitySignId}})
    }
  }
}
</script>

<style>
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

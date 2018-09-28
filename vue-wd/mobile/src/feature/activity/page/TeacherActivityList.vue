<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多活动～" ref="manage_scroller">
        <div>
          <group gutter="0">
            <div class="activity_list_item" v-for="item in teacherActivityList" @click="skipDetail(item.activityId)">
              <masker style="border-radius: 2px;">
                <div class="activity_img" :style="{backgroundImage: 'url(' + tools.cdn(item.activityImg, 'logo.png') + ')'}"></div>
                <div slot="content" class="activity_title">{{item.activityName}}</div>
              </masker>
              <div style="position:relative;marginTop:10px;">
                <p class="activity_location">活动地点：{{item.activityAddress}}</p>
                <p class="activity_time">活动时间：{{getFormateDate(item.startDate)}}</p>
                <x-button v-if="item.activityStatus == 1" style="backgroundColor: rgb(181, 181, 181)" class="activity_apply_btn jhy-text-xs" type="primary" text="未开始" :mini="true" action-type="button" @click.native="skipDetail(item.activityId)"></x-button>
                <x-button v-else-if="item.activityStatus == 2 && item.signStatus" class="activity_apply_btn jhy-text-xs" type="primary" text="立即报名" :mini="true" action-type="button" @click.native="skipDetail(item.activityId)"></x-button>
                <x-button v-else-if="item.activityStatus == 2 && item.signStatus==false" style="backgroundColor: rgb(181, 181, 181)" class="activity_apply_btn jhy-text-xs" type="primary" text="报名结束" :mini="true" action-type="button" @click.native="skipDetail(item.activityId)"></x-button>
                <x-button v-else style="backgroundColor: rgb(181, 181, 181)" class="activity_apply_btn jhy-text-xs" type="primary" text="已结束" :mini="true" action-type="button" @click.native="skipDetail(item.activityId)"></x-button>
              </div>
            </div>
          </group>
        </div>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/activity/api'
import { Masker, Group, XButton, Cell, dateFormat } from 'vux'
export default {
  components: {
    DetailTabbar, Masker, Group, XButton, Cell
  },
  data () {
    return {
      teacherActivityList: [],
      scrollerHeight: 0
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50
  },
  methods: {
    // refresh(done) {
    //   if (this.teacherActivityList.length > 0 && this.teacherActivityList.length < 10) {
    //     done(true)
    //     return
    //   }
    //   this.teacherActivityList.splice(0, this.teacherActivityList.length)
    //   this.getTeacherActivityList(this.teacherActivityList.length, (data) => {
    //     this.teacherActivityList = this.teacherActivityList.concat(data)
    //     done(true)
    //   })
    // },
    infinite(done) {
      this.getTeacherActivityList(this.teacherActivityList.length, (data) => {
        this.teacherActivityList = this.teacherActivityList.concat(data)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      })
    },
    getTeacherActivityList (rowStart, callback) {
      var rowCount = 20
      api.getActivityList({schoolId: this.$route.params.schoolId, isTeacher: true, listType: 1, rowStart, rowCount}, (data) => {
        callback(data)
      }, () => {})
    },
    getFormateDate (time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    skipDetail (activityId) {
      this.$router.push({name: 'educationActivityDetail', params: {activityId}})
    }
  }
}
</script>

<style>
.activity_list_item {
  overflow: hidden;
  position: relative;
  padding: 10px;
  background: #fff;
  border-bottom: #D9D9D9 1px solid;
}
.activity_img {
  padding-bottom: 50%;
  display: block;
  position: relative;
  max-width: 100%;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  border-radius: 2px;
}
.activity_title {
  color: #fff;
  width: 100%;
  text-shadow: 0 0 2px rgba(0, 0, 0, .5);
  font-weight: 500;
  font-size: 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  margin-left: 10px;
}
.activity_location {
  color: #646464;
  width: 70vw;
  font-size:16px;
}
.activity_time {
  color: #666;
  width: 70vw;
  font-size: 12px;
}
.activity_apply_btn {
  position: absolute !important;
  top: 0;
  right: 0;
  padding: 0 0.6em !important;
  width: 70px !important;
  margin-top: 7px;
}
</style>

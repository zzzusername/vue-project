<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px', 'margin-top': '-1px'}">
      <scroller :on-infinite="infinite" :on-refresh="refresh" no-data-text="没有更多公告～" ref="manage_scroller">
        <div>
          <group>
            <cell v-for="(item, index) in teacherNoticeList" :title="item.noticeTitle.length>25?item.noticeTitle.substring(0,25)+'...':item.noticeTitle" :key="index" @click.native="skipDetail(item.noticeId)">
              <div slot="icon" class="notic_list_img" :style="{'background-image':'url('+tools.cdn(item.noticeImg === null ? '' :item.noticeImg.split(',')[0], 'logo.png')+')'}" src="">
                <!-- <p v-if="item.noticeReadFeedback==2" style="font-size: 10px;color:#fff;background-color:red;width: 2em;height:12px;padding: 2px;text-align:center;line-height:12px;">重要</p> -->
              </div>
              <p slot="after-title" style="color:#666;fontSize:14px;">{{tools.getDateDiff(item.createDate)}} &nbsp;<span v-if="item.readerNum">{{item.readerNum}}阅读</span><span v-else-if="item.viewNum">{{item.viewNum}}浏览</span></p>
            </cell>
          </group>
        </div>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/notice/api'
import { Group, Cell, dateFormat } from 'vux'
export default {
  components: {
    DetailTabbar, Group, Cell
  },
  data () {
    return {
      teacherNoticeList: [],
      scrollerHeight: 0
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50
  },
  methods: {
    refresh(done) {
      if (this.teacherNoticeList.length > 0 && this.teacherNoticeList.length < 10) {
        done(true)
        return
      }
      this.teacherNoticeList.splice(0, this.teacherNoticeList.length)
      this.getTeacherNoticeList(this.teacherNoticeList.length, (data) => {
        this.teacherNoticeList = this.teacherNoticeList.concat(data)
        done(true)
      })
    },
    infinite(done) {
      this.getTeacherNoticeList(this.teacherNoticeList.length, (data) => {
        this.teacherNoticeList = this.teacherNoticeList.concat(data)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      })
    },
    getTeacherNoticeList (rowStart, callback) {
      var rowCount = 20
      api.getNoticeList({schoolId: this.$route.params.schoolId, isTeacher: true, rowStart, rowCount}, (data) => {
        callback(data)
      }, () => {})
    },
    getFormateDate (time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    skipDetail (id) {
      this.$router.push({name: 'educationNoticeDetail', params: {noticeId: id}})
    }
  }
}
</script>

<style>
.notic_list_img {
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

<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多公告～" ref="manage_scroller">
        <div style="height: 10px" v-if="noticeList.length==0&&publishNoticeList.length==0"></div>
        <div>
          <group v-if="noticeList.length>0" title="我收到的公告">
            <cell v-for="(item, index) in noticeList" v-if="index<3" :title="item.noticeTitle.length>25?item.noticeTitle.substring(0,25)+'...':item.noticeTitle" :key="index" @click.native="skipDetail(item.noticeId)" is-link>
              <div slot="icon" class="notic_list_img" :style="{'background-image':'url('+tools.cdn(item.noticeImg === null ? '' :item.noticeImg.split(',')[0], 'notice.png', 128)+')'}" src="">
                <!-- <p v-if="item.noticeReadFeedback==2" style="font-size: 10px;color:#fff;background-color:red;width: 2em;height:12px;padding: 2px;text-align:center;line-height: 12px;">重要</p> -->
              </div>
              <p slot="inline-desc" style="color:#666;fontSize:14px;">{{tools.getDateDiff(item.createDate)}} &nbsp;<span v-if="item.readerNum">{{item.readerNum}}阅读</span><span v-else-if="item.viewNum">{{item.viewNum}}浏览</span></p>
            </cell>
          </group>
          <p v-if="noticeList.length>3" style="background:#fff;padding:5px 10px;text-align:center;color:#2E84D4;font-size:15px;" @click="more">查看更多</p>
          <group v-if="publishNoticeList.length>0" title="我发布的公告">
            <cell v-for="(item, index) in publishNoticeList" :title="item.noticeTitle.length>25?item.noticeTitle.substring(0,25)+'...':item.noticeTitle" :key="index" @click.native="skipDetail(item.noticeId)" is-link>
              <div slot="icon" class="notic_list_img" :style="{'background-image':'url('+tools.cdn(item.noticeImg === null ? '' :item.noticeImg.split(',')[0], 'notice.png', 128)+')'}" src="">
                <!-- <p v-if="item.noticeReadFeedback==2" style="font-size: 10px;color:#fff;background-color:red;width: 2em;height:12px;padding: 2px;text-align:center;text-align:center;line-height: 12px;">重要</p> -->
              </div>
              <p slot="inline-desc" style="color:#666;fontSize:14px;">{{tools.getDateDiff(item.createDate)}} &nbsp;<span v-if="item.readerNum">{{item.readerNum}}阅读</span><span v-else-if="item.viewNum">{{item.viewNum}}浏览</span></p>
            </cell>
          </group>
        </div>
      </scroller>
    </div>
    <detail-tabbar :actionLink="actionLink" :actions="actions"></detail-tabbar>
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
      noticeList: [],
      publishNoticeList: [],
      scrollerHeight: 0,
      userInfo: {},
      actions: []
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50
    api.getNoticeList({schoolId: this.$route.params.schoolId, isTeacher: true, rowStart: 0, rowCount: 5}, (noticedata) => {
      this.noticeList = noticedata
    }, () => {})
    this.localStorage.getTeacherFeature({schoolId: this.$route.params.schoolId}, (data) => {
      data.forEach(element => {
        if (element.featureCode === 'GONGGAOGUANLI') {
          this.actions = [{
            name: '发布公告'
          }]
        }
      })
    }, () => {})
  },
  methods: {
    actionLink () {
      this.$router.push({name: 'educationNoticePublish'})
    },
    infinite(done) {
      // 我发布的
      this.getPublishNoticeList(this.publishNoticeList.length, (data) => {
        this.publishNoticeList = this.publishNoticeList.concat(data)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      })
    },
    getPublishNoticeList (rowStart, callback) {
      var rowCount = 20
      api.selectOneselfNoticeList({schoolId: this.$route.params.schoolId, rowStart, rowCount}, (data) => {
        callback(data)
      }, () => {})
    },
    getFormateDate (time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    skipDetail (id) {
      this.$router.push({name: 'educationNoticeDetail', params: {noticeId: id}})
    },
    more () {
      this.$router.push({name: 'educationNoticeTeacherList'})
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
.triangle-topleft {
  width: 0;
  height: 0;
  border-top: 10px solid white;
  border-bottom: 10px solid white;
  border-left: 5px solid #68C339;
}
</style>

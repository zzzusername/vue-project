<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px', 'margin-top': '-1px'}">
      <scroller :on-infinite="infinite" :on-refresh="refresh" no-data-text="没有更多资讯～" ref="manage_scroller">
        <div>
          <group>
            <cell v-for="(item, index) in teacherNewsList" :title="item.newsTitle.length>25?item.newsTitle.substring(0,25)+'...':item.newsTitle" :key="index" @click.native="skipDetail(item)">
              <p slot="inline-desc" style="overflow:hidden;font-size:12px;margin: 15px 0px 0 0;">
                <span style="float:left;">来自{{userInfo.teacherId == item.teacherId ? '我' : item.teacherName}}的分享</span>
                <span style="float:right;">{{tools.formateTime(item.publishStartDate, 'YYYY-MM-DD')}}</span>
              </p>
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
import api from '@/feature/news/api'
import { Group, Cell, dateFormat } from 'vux'
export default {
  components: {
    DetailTabbar, Group, Cell
  },
  data () {
    return {
      teacherNewsList: [],
      scrollerHeight: 0,
      windowWidth: 0,
      userInfo: {}
    }
  },
  mounted () {
    this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (user) => {
      this.userInfo = user
    }, () => {})
    this.scrollerHeight = window.innerHeight - 50
    this.windowWidth = window.innerWidth - 50
  },
  methods: {
    refresh(done) {
      if (this.teacherNewsList.length > 0 && this.teacherNewsList.length < 10) {
        done(true)
        return
      }
      this.teacherNewsList.splice(0, this.teacherNewsList.length)
      this.getTeacherNewsList(this.teacherNewsList.length, (data) => {
        this.teacherNewsList = this.teacherNewsList.concat(data)
        done(true)
      })
    },
    infinite(done) {
      this.getTeacherNewsList(this.teacherNewsList.length, (data) => {
        this.teacherNewsList = this.teacherNewsList.concat(data)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      })
    },
    getTeacherNewsList (rowStart, callback) {
      var rowCount = 20
      api.selectNewsListToTeacher({schoolId: this.$route.params.schoolId, isTeacher: true, type: 1, rowStart, rowCount}, (data) => {
        callback(data)
      }, () => {})
    },
    getFormateDate (time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    skipDetail (item) {
      this.$router.push({name: 'educationNewsDispatch', params: {newsId: item.newsId}})
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

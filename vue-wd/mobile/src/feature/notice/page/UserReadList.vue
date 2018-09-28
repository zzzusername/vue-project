<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多人阅读～" ref="manage_scroller">
        <cell v-for="(item, index) in readers" :key="index" style="background:#fff">
          <p slot="title"><span>{{(item.studentId == null || item.studentId == 0) && (item.teacherId != null || item.teacherId != 0)?item.teacherName:item.studentName}}</span></p>
          <div slot="icon" class="comment_readers_head_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png')+')'}"></div>
          <p slot="inline-desc"><span v-if="item.className != ''">{{item.className}}&nbsp;</span><span>{{(item.studentId == null || item.studentId == 0) && (item.teacherId != null || item.teacherId != 0)?'教师':'学生'}}</span></p>
        </cell>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import api from '../api'
import DetailTabbar from '@/components/DetailTabbar.vue'
import { Group, Cell, Tab, TabItem } from 'vux'
export default {
  components: {
    DetailTabbar, Group, Cell, Tab, TabItem
  },
  data () {
    return {
      scrollerHeight: 0,
      readers: []
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50
  },
  methods: {
    infinite(done) {
      this.getReaderList(this.readers.length, (data) => {
        this.readers = this.readers.concat(data)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      })
    },
    getReaderList (rowStart, callback) {
      var rowCount = 20
      api.getReaderList({schoolId: this.$route.params.schoolId, noticeId: this.$route.params.noticeId, readStatus: 1, rowStart: rowStart, rowCount: rowCount}, (data) => {
        callback(data)
      }, (er) => {
        this.tools.warnToast(er.message)
      })
    }
  }
}
</script>

<style>
.comment_readers_head_icon {
  width: 50px;
  height:50px;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
</style>

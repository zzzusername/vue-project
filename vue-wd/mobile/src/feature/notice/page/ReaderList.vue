<template>
  <div>
    <tab custom-bar-width="3em">
      <tab-item selected @on-item-click="tabSelect(1)">已阅<span v-if="readerNum.readCount">({{readerNum.readCount}}人)</span></tab-item>
      <tab-item @on-item-click="tabSelect(2)">未阅<span v-if="readerNum.unreadCount">({{readerNum.unreadCount}}人)</span></tab-item>
    </tab>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" :no-data-text="selectIndex == 1 ? '没有更多人阅读～' : '没有更多人未阅～'" ref="manage_scroller">
        <div style="height: 10px" v-if="readers.length==0"></div>
        <cell v-for="(item, index) in readers" :key="index" style="background:#fff">
          <p slot="title"><span>{{(item.studentId == null || item.studentId == 0) && (item.teacherId != null || item.teacherId != 0)?item.teacherName:item.studentName}}</span></p>
          <div slot="icon" class="comment_readers_head_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png')+')'}"></div>
          <p slot="inline-desc"><span v-if="item.className != ''">{{item.className}}&nbsp;</span><span>{{(item.studentId == null || item.studentId == 0) && (item.teacherId != null || item.teacherId != 0)?'教师':'学生'}}</span></p>
        </cell>
      </scroller>
    </div>
    <detail-tabbar :actionLink="push" :actions="actions"></detail-tabbar>
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
      readers: [],
      selectIndex: 1,
      reads: [],
      unreads: [],
      actions: [],
      readerNum: {}
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 94
    api.isNoticeJurisdiction({schoolId: this.$route.params.schoolId, noticeId: this.$route.params.noticeId}, (data) => {
      if (data.result === true) {
        this.actions = [{name: '提醒未阅用户'}]
      }
    }, () => {})
    api.getReaderNum({schoolId: this.$route.params.schoolId, noticeId: this.$route.params.noticeId}, (data) => {
      this.readerNum = data
    }, () => {})
  },
  methods: {
    tabSelect(index) {
      // if (index === 1) {
      //   this.actions = []
      // } else {
      //   // this.actions = [{name: '提示未阅用户'}]
      // }
      this.selectIndex = index
      this.readers.splice(0, this.readers.length)
      this.$refs.manage_scroller.finishInfinite()
    },
    push() {
      api.pushToUnReader({schoolId: this.$route.params.schoolId, noticeId: this.$route.params.noticeId}, (data) => {
        this.tools.successToast('推送成功')
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    infinite(done) {
      this.getReaderList(this.readers.length, (data) => {
        if (this.selectIndex === 1) {
          this.reads = this.reads.concat(data)
          this.readers = this.reads
        } else {
          this.unreads = this.unreads.concat(data)
          // if (this.unreads.length > 0) {
          //   this.actions = [{name: '提醒未阅用户'}]
          // }
          this.readers = this.unreads
        }
        // this.readers = this.readers.concat(data.readers)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      })
    },
    getReaderList (rowStart, callback) {
      var rowCount = 20
      api.getReaderList({schoolId: this.$route.params.schoolId, noticeId: this.$route.params.noticeId, readStatus: this.selectIndex, rowStart: rowStart, rowCount: rowCount}, (data) => {
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

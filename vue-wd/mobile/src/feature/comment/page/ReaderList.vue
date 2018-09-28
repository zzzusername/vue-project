<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多人阅读～" ref="manage_scroller">
        <cell v-for="(item, index) in readers" :title="item.userName" :key="index" style="background:#fff">
          <div slot="icon" class="comment_readers_head_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png')+')'}"></div>
          <p slot="after-title" style="color:#666;fontSize:14px;margin-top:5px;">{{getFormateDate(item.date)}}</p>
        </cell>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import api from '../api'
import DetailTabbar from '@/components/DetailTabbar.vue'
import { Group, Cell, dateFormat } from 'vux'
export default {
  components: {
    DetailTabbar, Group, Cell
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
        this.readers = this.readers.concat(data.readers)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      })
    },
    getReaderList (rowStart, callback) {
      var rowCount = 20
      api.getReaderList({schoolId: this.$route.params.schoolId, bsId: this.$route.params.commentBsId, type: this.$route.params.commentType, skip: rowStart, limit: rowCount}, (data) => {
        callback(data)
      }, () => {})
    },
    getFormateDate (time) {
      return dateFormat(time, 'YYYY-MM-DD')
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

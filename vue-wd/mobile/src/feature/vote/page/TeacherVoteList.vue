<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多投票～" ref="manage_scroller">
        <div style="height: 10px" v-if="voteList.length==0&&voteList.length==0"></div>
        <div>
          <group v-if="voteList.length>0">
            <cell v-for="(item, index) in voteList" :key="index" @click.native="skipDetail(item)">
              <p slot="title" style="font-size:16px;padding-right:5px;overflow:hidden;text-overflow:ellipsis;word-break:break-all;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">{{item.voteName}}</p>
              <div slot="icon" class="notic_list_img" :style="{'background-image':'url('+tools.cdn(item.voteLogo, 'logo.png', 128)+')'}" src="">
                <!-- <p v-if="item.voteStatus==2" style="font-size: 10px;color:#fff;background-color:#46A0FC;width: 3em;height:12px;padding: 2px;text-align:center;text-align:center;line-height: 12px;">进行中</p> -->
              </div>
              <p slot="inline-desc" style="margin-top:7px;font-size:13px;">
                <span>{{item.voteTypeTitle}}</span>
                <span style="margin-left:10px;">{{getFormateDate(item.startDate)}}</span>
                <span :style="{'float':'right', 'color': item.voteStatusColor}">{{item.voteStatusTitle}}</span>
              </p>
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
import api from '@/feature/vote/api'
import { Group, Cell, dateFormat } from 'vux'
export default {
  components: {
    DetailTabbar, Group, Cell
  },
  data () {
    return {
      voteList: [],
      scrollerHeight: 0,
      actions: []
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50
    this.localStorage.getTeacherFeature({schoolId: this.$route.params.schoolId}, (data) => {
      data.forEach(element => {
        if (element.featureCode === 'TOUPIAOGUANLI') {
          this.actions = [{
            name: '投票管理'
          }]
        }
      })
    }, () => {})
  },
  methods: {
    infinite(done) {
      this.getTeacherVoteList(this.voteList.length, (data) => {
        this.voteList = this.voteList.concat(data)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      })
    },
    getTeacherVoteList (rowStart, callback) {
      var rowCount = 20
      api.getTeacherVoteList({schoolId: this.$route.params.schoolId, rowStart, rowCount}, (data) => {
        for (var i = 0; i < data.length; i++) {
          let item = data[i]
          if (item.voteType === 'TEXT') {
            item.voteTypeTitle = '普通文字'
          } else if (item.voteType === 'IMAGE') {
            item.voteTypeTitle = '普通图片'
          } else if (item.voteType === 'TEACHER') {
            item.voteTypeTitle = '教师图片'
          } else if (item.voteType === 'STUDENT') {
            item.voteTypeTitle = '学生图片'
          }
          if (item.voteStatus === 3) {
            item.voteStatusTitle = '已结束'
            item.voteStatusColor = '#75757B'
          } else if (item.voteStatus === 2 || item.voteStatus === 1) {
            item.voteStatusTitle = '进行中'
            item.voteStatusColor = '#51C332'
          }
        }
        callback(data)
      }, () => {})
    },
    skipDetail (item) {
      if (item.voteType === 'TEXT') {
        this.$router.push({name: 'educationWordsVoteDetail', params: {schoolId: this.$route.params.schoolId, voteId: item.voteId}})
      } else {
        this.$router.push({name: 'educationPictureVoteDetail', params: {schoolId: this.$route.params.schoolId, voteId: item.voteId}})
      }
    },
    getFormateDate (time) {
      return dateFormat(time, 'YYYY/MM/DD')
    },
    actionLink () {
      this.$router.push({name: 'educationVoteManage'})
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

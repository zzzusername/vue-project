<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多报名信息～" ref="manage_scroller">
        <div style="height: 10px" v-if="signUpList.length==0&&signUpList.length==0"></div>
        <div>
          <group v-if="signUpList.length>0">
            <cell v-for="(item, index) in signUpList" :key="index" @click.native="skipDetail(item)">
              <p slot="title" style="font-size:16px;padding-right:5px;overflow:hidden;text-overflow:ellipsis;word-break:break-all;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">{{item.title}}</p>
              <div slot="icon" class="notic_list_img" :style="{'background-image':'url('+tools.cdn(item.itemLogo, 'logo.png', 128)+')'}" src=""></div>
              <p slot="inline-desc" style="margin-top:7px;font-size:13px;">
                <span>{{getFormateDate(item.applyTime)}}</span>
                <span :style="{'float':'right', 'color': item.statusColor}">{{item.statusTitle}}</span>
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
import api from '@/feature/vote/api'
import { Group, Cell, dateFormat } from 'vux'
export default {
  components: {
    DetailTabbar, Group, Cell
  },
  data () {
    return {
      signUpList: [],
      scrollerHeight: 0,
      actions: []
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50
  },
  methods: {
    infinite(done) {
      this.getApplyList(this.signUpList.length, (data) => {
        this.signUpList = this.signUpList.concat(data)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      })
    },
    getApplyList (rowStart, callback) {
      var rowCount = 20
      api.getApplyList({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId, rowStart, rowCount}, (data) => {
        data.forEach(element => {
          if (!this.tools.isNull(element.itemName)) {
            element.title = element.itemName
          } else if (!this.tools.isNull(element.studentName)) {
            element.title = element.studentName + '的报名申请'
          } else if (!this.tools.isNull(element.teacherName)) {
            element.title = element.teacherName + '的报名申请'
          }
          if (element.isAgree === 0) {
            element.statusTitle = '待审核'
            element.statusColor = '#46A0FC'
          } else if (element.isAgree === 1) {
            element.statusTitle = '已通过'
            element.statusColor = '#8FBE58'
          } else if (element.isAgree === 2) {
            element.statusTitle = '已拒绝'
          }
        })
        callback(data)
      }, () => {})
    },
    skipDetail (item) {
      this.$router.push({name: 'educationSignUpReviewDetail', params: {schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId, applyId: item.applyId}})
    },
    getFormateDate (time) {
      return dateFormat(time, 'YYYY-MM-DD HH:mm')
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

<template>
  <div>
    <scroller lock-x height="-50" use-pullup :pullup-config="pullUpConfig" @on-pullup-loading="loadMore" ref="scroller">
      <div>
        <org-hand :title="$route.meta.title" featureCode="ZHAOSHENG"></org-hand>
        <group v-if="list.length>0" >
          <cell v-for="(item, index) in list" :key="index" :title="item.guideTitle" @click.native="skipDetail(item)">
            <div slot="icon" class="admission_list_img" :style="{'background-image':'url('+tools.cdn(item.guideImg, 'logo.png')+')'}" src=""></div>
            <p slot="inline-desc" style="color:#666;fontSize:14px;margin-top:2.5vw"><span>{{tools.getDateDiff(item.createDate)}}</span><span style="margin-left:10px">{{item.applyCount}}人报名</span> <label :style="'float:right;color:#fff;font-size:12px;padding:1px 3px 1px 3px;border-radius: 5px;background:'+item.statusBackground">{{item.statusTitle}}</label></p>
          </cell>
        </group>
        <p v-if="list.length==0" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">没有任何招生信息～</p>
      </div>
    </scroller>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import OrgHand from '@/feature/org/components/OrgHand.vue'
import { Group, Cell, Scroller, dateFormat } from 'vux'
import api from '@/feature/admission/api'
export default {
  components: {
    DetailTabbar, OrgHand, Scroller, Group, Cell, dateFormat
  },
  data () {
    return {
      list: [],
      pullUpConfig: {
        content: '',
        downContent: '松开进行加载',
        upContent: '上拉加载更多',
        loadingContent: '加载中...'
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    getFormateDate (time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    skipDetail (item) {
      this.$router.push({name: 'admissionDetail', params: {admissionId: item.guideId}})
    },
    loadData () {
      api.getAdmissionList({orgId: this.$route.params.orgId, rowStart: this.list.length, rowCount: 20}, (data) => {
        data.forEach((element) => {
          if (element.guideStatus === 1) {
            element.statusBackground = '#a2d268'
            element.statusTitle = '进行中'
          } else if (element.guideStatus === 2) {
            element.statusBackground = '#eee'
            element.statusTitle = '已结束'
          }
        }, this)
        this.list.push(...data)
        this.$nextTick(() => {
          this.$refs.scroller.reset()
        })
        if (data.length === 0 || data.length < 20) {
          this.$refs.scroller.disablePullup()
        } else {
          this.$refs.scroller.donePullup()
        }
      }, () => {})
    },
    loadMore () {
      this.loadData()
    }
  }
}
</script>

<style>
.admission_list_img {
  width: 19vw;
  height:14vw;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
</style>


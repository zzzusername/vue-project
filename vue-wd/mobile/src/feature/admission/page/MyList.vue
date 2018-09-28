<template>
  <div> 
    <tab custom-bar-width="120px">
      <tab-item selected @on-item-click="onItemClick">我已报名</tab-item>
      <tab-item @on-item-click="onItemClick">我是招生形象大使</tab-item>
    </tab>
    <scroller v-show="tabIndex==0" lock-x height="-100" use-pullup :pullup-config="pullUpConfig" @on-pullup-loading="loadMore" ref="scroller">
      <div>
        <group v-if="applyList.length>0" gutter="-1px">
          <cell v-for="(item, index) in applyList" :key="index" :title="item.guideTitle" @click.native="skipAdmissionDetail(item)">
            <div slot="icon" class="admission_mylist_img" :style="{'background-image':'url('+tools.cdn(item.guideImg, 'logo.png')+')'}" src=""></div>
            <p slot="inline-desc" style="color:#666;fontSize:14px;margin-top:2.5vw">报名时间：{{getFormateTime(item.signDate)}} <label :style="'float:right;background:'+item.statusBackground+';color:#fff;font-size:12px;padding:1px 3px 1px 3px;border-radius: 5px;'">{{item.statusTitle}}</label></p>
          </cell>
        </group>
        <p v-if="applyList.length==0" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">没有参与任何招生～</p>
      </div>
    </scroller>
    <scroller v-show="tabIndex==1" lock-x height="-100" use-pullup :pullup-config="pullUpConfig" @on-pullup-loading="loadMore" ref="scroller2">
      <div>
        <group v-if="shareList.length>0" gutter="-1px">
          <cell v-for="(item, index) in shareList" :key="index" :title="item.guideTitle" @click.native="skipDetail(item)">
            <div slot="icon" class="admission_mylist_img" :style="{'background-image':'url('+tools.cdn(item.guideImg, 'logo.png')+')'}" src=""></div>
            <p slot="inline-desc" style="color:#666;fontSize:14px;margin-top:2.5vw"><span>{{item.applyNum}}人报名</span><span style="margin-left:10px">{{item.subDeputyNum}}个下级</span></p>
          </cell>
        </group>
        <p v-if="shareList.length==0" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">没有参与任何招生～</p>
      </div>
    </scroller>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import {Tab, TabItem, Scroller, Cell, Group, dateFormat} from 'vux'
import api from '@/feature/admission/api'
export default {
  components: {
    Tab, TabItem, DetailTabbar, Scroller, Cell, Group, dateFormat
  },
  data () {
    return {
      applyList: [],
      shareList: [],
      pullUpConfig: {
        content: '',
        downContent: '松开进行加载',
        upContent: '上拉加载更多',
        loadingContent: '加载中...'
      },
      tabIndex: 0,
      statusBackground: '#a2d268',
      statusTitle: ''
    }
  },
  mounted () {
    this.loadMore()
  },
  methods: {
    getFormateTime (time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    loadMore () {
      if (this.tabIndex === 0) {
        this.loadApplyList()
      } else if (this.tabIndex === 1) {
        this.loadShareList()
      }
    },
    loadApplyList () {
      api.getMyApplyGuide({rowStart: this.applyList.length, rowCount: 20}, (data) => {
        data.forEach((element) => {
          if (element.checkStatus === 1) {
            element.statusBackground = '#2E84D4'
            element.statusTitle = '未审核'
          } else if (element.checkStatus === 2) {
            element.statusBackground = '#FF6D56'
            element.statusTitle = '已拒绝'
          } else if (element.checkStatus === 3) {
            element.statusBackground = '#a2d268'
            element.statusTitle = '已通过'
          }
        }, this)
        this.applyList.push(...data)
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
    loadShareList () {
      api.getMyDeputy({rowStart: this.shareList.length, rowCount: 20}, (data) => {
        this.shareList.push(...data)
        this.$nextTick(() => {
          this.$refs.scroller2.reset()
        })
        if (data.length === 0 || data.length < 20) {
          this.$refs.scroller2.disablePullup()
        } else {
          this.$refs.scroller2.donePullup()
        }
      }, () => {})
    },
    onItemClick (index) {
      this.applyList = []
      this.shareList = []
      this.tabIndex = index
      this.loadMore()
    },
    skipDetail (item) {
      // inviteDeputyId
      this.$router.push({name: 'admissionMyCount', params: {myOrgId: item.orgId, admissionId: item.guideId}})
    },
    skipAdmissionDetail (item) {
      this.$router.push({name: 'admissionMyDetail', params: {myOrgId: item.orgId, admissionId: item.guideId}})
    }
  }
}
</script>
<style>
.admission_mylist_img {
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

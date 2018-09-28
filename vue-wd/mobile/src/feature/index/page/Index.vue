<template>
  <div>
    <org-hand :title="$route.meta.title" featureCode="HOME"></org-hand>
     <group v-if="featureList.length>0">
        <cell title="群空间" style="text-align:center">
          <div slot="value">
            <span class="jhy-card-title-more jhy-text-xs" style="font-size:14px!important" v-on:click="skipSpace">更多 &gt;</span>
          </div>
        </cell>
        <flexbox :gutter="0" wrap="wrap" style="margin-bottom:10px">
          <flexbox-item v-for="(item, index) in featureList" v-if="index<8" :key="index" :span="1/4" @click.native="onFeatureItemClick(item.fUserUrl)">
            <div class="flex-demo jhy-flex-demo">
              <span class="new-icon-circle iconfont " v-bind:class="item.fIcon" v-bind:style="{ color:item.fColor}" ></span>
              <span style="font-size:14px">{{item.fName}}</span>
            </div>
          </flexbox-item>
        </flexbox>
      </group>
      <group v-if="noticeList.length>0">
        <cell title="群公告" style="text-align:center">
          <div slot="value">
            <span class="jhy-card-title-more jhy-text-xs" style="font-size:14px!important" v-on:click="skipNotice">更多 &gt;</span>
          </div>
        </cell>
        <div>
        <cell v-for="(item, index) in noticeList" :key="index" :title="item.noticeTitle.length>19?item.noticeTitle.substring(0,19)+'...':item.noticeTitle" :inline-desc="getTime(item.createDate) + ' ｜ ' +(item.readerNum>999?'999+':item.readerNum)+'阅读'" @click.native="onNoticeItemClick(item)">
          <div slot="value">
            <span><badge text="进行中" class="jhy-background-success"></badge></span>
          </div>
          <x-img slot="icon" :src="tools.cdn(item.noticeImg, 'logo.png', 128)" class="jhy-cell-img" style="width:16vw; height:13vw"></x-img>
        </cell>
        </div>
      </group>
      <group v-show="activityList.length>0">
        <div class="jhy-card jhy-icon-card">
          <p slot="content" class="card-padding">
            <cell title="群活动" style="text-align:center;margin-top:-10px">
              <div slot="value">
                <span class="jhy-card-title-more jhy-text-xs" style="font-size:14px!important" v-on:click="skipActivity">更多 &gt;</span>
              </div>
            </cell>
            <scroller lock-y :scrollbar-x='false' ref="scroller">
              <div class="box1" :style="scrollerStyle">
                <div v-for="(item,index) in activityList" :key="index" class="box1-item" v-on:click="onActivityItemClick(item)">
                  <div style="position: relative;">
                    <div class="jhy-img-bg" :style="{'background-image': 'url('+tools.cdn(item.activityImg?(item.activityImg+'?imageView2/1/w/512/h/512'):null, 'logo.png')+')', width:'70vw', height:'45vw'}"></div>
                    <div style="position: absolute;bottom:15px; width: 100%">
                      <span class="jhy-margin-left-xs jhy-active-button jhy-text-xs" style="float:left;">{{item.userSignCount}}人参加</span>
                      <span class="jhy-margin-right-xs jhy-active-button jhy-text-xs" style="float:right;">{{item.activityCost===0?'免费':('¥ '+item.activityCost)}}</span>
                    </div>
                  </div>
                  <span style="position: relative;top:3px;" class="jhy-index-text">{{item.activityName}}</span>
                  <div class="vux-label-desc" style="position: relative;top:3px">{{item.activityStatus===2?('截止时间：'+getTime(item.endDate)):('开始时间：'+getTime(item.startDate))}}<badge :text="item.activityStatus===2?'进行中':'未开始'" class="jhy-background-success" style="float:right"></badge></div>
                </div>
              </div>
            </scroller>
          </p>
        </div>
      </group>
      <!--<group>
        <cell title="群资讯" style="text-align:center">
          <div slot="value">
            <span class="jhy-card-title-more jhy-text-xs">更多 &gt;</span>
          </div>
        </cell>
        <cell title="我是标题" inline-desc='2017-01-29  1837人阅读'>
          <div slot="icon" class="jhy-index-zixun">
            <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1707550039,4257151933&fm=11&gp=0.jpg" >
          </div>
        </cell>
        <cell title="我是标题" inline-desc='2017-01-29  1837人阅读'>
          <div slot="icon" class="jhy-index-zixun">
            <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=58849576,1472146788&fm=23&gp=0.jpg" >
          </div>
        </cell>
      </group>-->
      <!--<group>
        <div class="jhy-card jhy-icon-card">
          <p slot="content" class="card-padding">
            <span class="jhy-card-title jhy-text-bg">
              群相册
            <span class="jhy-card-title-more jhy-margin-right-xs jhy-text-xs">更多 &gt;</span>
            </span>
            <div class="jhy-index-photo">
              <div class="jhy-index-photo-item">
                <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3179404296,897859243&fm=11&gp=0.jpg" class="jhy-index-photo-item-photoimg"/>
                <div class="jhy-index-photo-item-float jhy-text-xs">
                  <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1017795711,3656003924&fm=11&gp=0.jpg" />
                  <span>香蕉你个布呐呐</span>
                </div>
              </div>

              <div class="jhy-index-photo-item">
                <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=785610095,2402278722&fm=117&gp=0.jpg" class="jhy-index-photo-item-photoimg"/>
                <div class="jhy-index-photo-item-float jhy-text-xs">
                  <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2134199672,4092309305&fm=23&gp=0.jpg" />
                  <span>香蕉你个布呐呐</span>
                </div>
              </div>

              <div class="jhy-index-photo-item">
                <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3460133264,511728280&fm=23&gp=0.jpg" class="jhy-index-photo-item-photoimg"/>
                <div class="jhy-index-photo-item-float jhy-text-xs">
                  <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1308780610,2720728346&fm=23&gp=0.jpg" />
                  <span>香蕉你个布呐呐</span>
                </div>
              </div>
            </div>
          </p>
        </div>
      </group>-->
    <!--<a href="/app/1/index">1</a>
    <a href="/app/2/index">2</a>
    <a href="/app/3/index">3</a><br>

    <router-link :to="{ name: 'index', params: { orgId: 1 }}">1</router-link>
    <router-link :to="{ name: 'index', params: { orgId: 2 }}">2</router-link>
    <router-link :to="{ name: 'index', params: { orgId: 3 }}">3</router-link><br>-->


    <!--我是首页<br>-->
    <!-- 字符串 -->
    <!--<router-link to="index">index</router-link><br>-->
    <!-- 渲染结果 -->
    <!--<a href="index">index</a><br>-->

    <!-- 使用 v-bind 的 JS 表达式 -->
    <!--<router-link v-bind:to="'index'">index</router-link><br>-->

    <!-- 不写 v-bind 也可以，就像绑定别的属性一样 -->
    <!--<router-link :to="'index'">index</router-link><br>-->

    <!-- 同上 -->
    <!--<router-link :to="{ path: 'live' }">live</router-link><br>-->

    <!-- 命名的路由 -->
    <!--<router-link :to="{ name: 'index', params: { userId: 123 }}">index</router-link><br>-->

    <!-- 带查询参数，下面的结果为 /register?plan=private -->
    <!--<router-link :to="{ path: 'index', query: { plan: 'private' }}">index</router-link><br>-->

    <index-tabbar :showHome="true"></index-tabbar>
  </div>
</template>

<script>
import { Scroller, Badge, Flexbox, FlexboxItem, Divider, Card, Cell, Group, dateFormat, XImg } from 'vux'
import { mapGetters } from 'vuex'
import OrgHand from '@/feature/org/components/OrgHand.vue'
import IndexTabbar from '@/components/IndexTabbar.vue'
import ListTabbar from '@/components/ListTabbar.vue'
import DetailTabbar from '@/components/DetailTabbar.vue'
import noticeApi from '@/feature/notice/api'
import activityApi from '@/feature/activity/api'
import api from '../api'

export default {
  data () {
    return {
      activityList: [],
      noticeList: [],
      scrollerStyle: {width: '200vw'},
      featureList: []
    }
  },
  computed: {
    ...mapGetters({
      orgInfo: 'orgInfo'
    })
  },
  mounted () {
    if (this.tools.isNull(this.$route.params.orgId)) {
      this.$router.replace({name: '/'})
      return
    }
    api.getIndexFeatures({orgId: this.$route.params.orgId}, (data) => {
      this.featureList = data
      if (data.length === 0) {
        this.$router.replace({name: 'spaceIndex'})
      }
    }, () => {
      this.$router.replace({name: 'spaceIndex'})
    })
    this.getActivityList()
    this.getNoticeList()
  },
  methods: {
    getActivityList () {
      var size = 10
      activityApi.getActivityList({orgId: this.$route.params.orgId, activityStatus: 2, rowStart: 0, rowCount: size}, (data) => {
        this.activityList = data
        if (this.activityList.length < 10) {
          activityApi.getActivityList({orgId: this.$route.params.orgId, activityStatus: 1, rowStart: 0, rowCount: (size - this.activityList.length)}, (data2) => {
            this.activityList.push(...data2)
            this.scrollerStyle = {width: (70 * this.activityList.length + 3 * 2 + 2 * (this.activityList.length - 1)) + 'vw'}
            this.$nextTick(() => {
              this.$refs.scroller.reset()
            })
          }, () => {
            this.scrollerStyle = {width: (70 * this.activityList.length + 3 * 2 + 3 * (this.activityList.length - 1)) + 'vw'}
            this.$nextTick(() => {
              this.$refs.scroller.reset()
            })
          })
        }
      }, () => {})
    },
    getNoticeList () {
      noticeApi.getNoticeList({orgId: this.$route.params.orgId, rowStart: 0, rowCount: 10}, (data) => {
        data.forEach(function(element) {
          if (new Date().getTime() < element.expireDate) {
            this.noticeList.push(element)
          }
        }, this)
      }, () => {})
    },
    onFeatureItemClick (name) {
      this.$router.push(JSON.parse(name))
    },
    onNoticeItemClick (item) {
      this.$router.push({name: 'noticeDetail', params: {noticeId: item.noticeId}})
    },
    onActivityItemClick (item) {
      this.$router.push({name: 'activityDetail', params: {activityId: item.activityId}})
    },
    skipSpace () {
      this.$router.push({name: 'spaceIndex'})
    },
    skipNotice () {
      this.$router.push({name: 'noticeList'})
    },
    skipActivity () {
      this.$router.push({name: 'activityList'})
    },
    getTime (date) {
      if (screen.width <= 320) {
        return dateFormat(date, 'YYYY-MM-DD')
      } else {
        return dateFormat(date, 'YYYY-MM-DD HH:mm')
      }
    }
  },
  components: {
    OrgHand,
    IndexTabbar,
    ListTabbar,
    DetailTabbar,
    Flexbox,
    FlexboxItem,
    Divider,
    Card,
    Group,
    Cell,
    Badge,
    Scroller,
    dateFormat,
    XImg
  }
}

</script>
<style>
.jhy-active-button {
  background: #fff;
  color: #f37b1d;
  border-radius: 3px;
  padding: 1px 5px;
}
.new-icon-circle {
	display: block;
	margin: auto;
	width: 2.5rem;
	height: 2.5rem;
	text-align: center;
	line-height: 3.0rem;
	font-size: 1.7rem;
	color: #fff;
}
.jhy-flex-demo{
  text-align:center;
}
.jhy-card{
  margin-top:0!important;
  margin-bottom:10px
}
.jhy-icon-card{
  padding: 10px 0;
}
.jhy-card-title{
  display:block;
  text-align:center;
  line-height:30px;
}
.jhy-card-title-more{
  color: black;
  position:absolute;
  right:10px; 
  top:12px
}
.box1 {
  display: inline-block;
  white-space: nowrap;
}
.box1-item {
  width: 70vw;
  display:inline-block;
  margin-left: 2vw;
}
.box1-item:first-child {
  margin-left: 3vw;
}
.box1-item:last-child {
  margin-right: 3vw;
}
.box1-item img{
  width: 70vw;
  height: 45vw;
}
.jhy-index-zixun{
  width: 30vw;
  height: 20vw;
  left: 25px;
  margin-right: 15px;
  overflow: hidden;
}
.jhy-index-zixun img{
  width: 100%;
}
.jhy-index-photo {
  width: 100vw;
  display: inline-block;
  white-space: nowrap;
  text-align: center;
}
.jhy-index-photo-item {
  width: 30vw;
  display: inline-block;
  position: relative;
}
.jhy-index-photo-item-photoimg {
  width: 100%;
  vertical-align: middle;
}
.jhy-index-photo-item-float {
  background-color: rgba(0, 0, 0, 0.5);
  width:100%;
  position: absolute;
  bottom:0;
  display:block;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  color: #fff;
  text-align: center;
}
.jhy-index-photo-item-float img{
  position:relative;
  width: 20%;
  border-radius: 10rem;
  vertical-align: middle;
  border:1px solid #fff;
  margin-left: 5px;
}
.jhy-index-text {
  width:100%;
  display:block;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
</style>

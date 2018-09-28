<template>
  <div>
    <!--<group style='margin-top:-21px'>
      <flexbox style='height:50px' :gutter="0">
        <flexbox-item :span="159/320" @click.native="onTabClick(0)"><div :class="tab1class">我创建的联盟</div></flexbox-item>
        <flexbox-item style="minWidth: 1px;"><div class="tab-divider"></div></flexbox-item>
        <flexbox-item :span="160/320" @click.native="onTabClick(1)"><div :class="tab2class">其它开放的联盟</div></flexbox-item>
      </flexbox>
    </group>-->
    <scroller use-pullup lock-x :height="scrollerHeight+''" ref="scroller" @on-pullup-loading="loadMore" v-model="status"
      :pullup-config="{content:'加载更多',downContent:'松开加载更多',upContent:'加载更多',loadingContent:'努力加载中...'}">
      <div>
        <group :title="list.length>0?'我创建的联盟':'您没有可用的联盟'" v-if="tabItem===0">
          <cell v-for="item in list" :key="item.leagueId" :title="item.leagueName" :inline-desc="item.desc" :link="{name:'leagueAuthFeature',params:{leagueOrgId: $route.params.leagueOrgId, leagueId:item.leagueId}}" >
            <span class="jhy-text-xs">立即加入</span>
            <x-img slot="icon" :src="tools.cdn(item.leagueLogo, 'logo.png', 128)" class="jhy-cell-img"></x-img>
          </cell>
        </group>
        <!--<group style="margin-top:-21px" v-if="tabItem===1">
          <cell v-for="(item, index) in orgList" :key="index" :title="item.orgName" :inline-desc="item.desc" @click.native="" >
            <span class="jhy-text-xs">{{item.a}}</span>
            <x-img slot="icon" :src="tools.cdn(item.orgLogo+'?imageView2/1/w/128/h/128')" class="cell-img" error-class="cell-img-error"></x-img>
          </cell>
        </group>-->
      </div>
      <div slot="pullup" style="position: absolute; width: 100%; height: 40px; text-align: center; font-size:16px;">
        <span v-show="status.pullupStatus === 'default'">{{ pullupStatusText }}</span>
        <span v-show="status.pullupStatus === 'loading'">加载中...</span>
      </div>
    </scroller>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, XImg, Scroller, Flexbox, FlexboxItem, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/league/api'

export default {
  components: {
    DetailTabbar,
    Group,
    Cell,
    XImg,
    Scroller,
    Flexbox,
    FlexboxItem,
    dateFormat
  },
  data () {
    return {
      tabItem: 0,
      tab1class: 'tab-item-sel',
      tab2class: 'tab-item',
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      pullupStatusText: '',
      getBarWidth: function (index) {
        if (index === 0) {
          return 6 * 14 + 'px'
        } else if (index === 1) {
          return 7 * 14 + 'px'
        }
      },
      list: [],
      orgList: [],
      scrollerHeight: -200,
      addedList: []
    }
  },
  mounted () {
    this.scrollerHeight = -50
    // this.scrollerHeight = -(50 + 50)
    api.getLeagueByOrgId({orgId: this.$route.params.leagueOrgId}, (data) => {
      data.forEach((element) => {
        this.addedList.push(element.leagueId)
      })
      console.log('this.addedList', this.addedList)
      this.getLeagueList()
    }, () => {})
  },
  methods: {
    getLeagueList () {
      api.getLeagueList({rowStart: this.list.length, rowCount: 20}, (data) => {
        var _list = []
        data.forEach((element) => {
          if (this.addedList.indexOf(element.leagueId) === -1) {
            // 没有重复的
            var o = {...element}
            o.desc = element.isPublic === false ? '自用联盟' : '公开联盟 ｜ 到期时间 ' + dateFormat(element.expiryDate || new Date(), 'YYYY/MM/DD')
            _list.push(o)
          }
        })
        this.list.push(..._list)
        if (data.length === 0) {
          this.pullupStatusText = '没有更多了'
        }
        this.$nextTick(() => {
          this.$refs.scroller.donePullup()
          this.$refs.scroller.reset()
        })
      }, () => {})
    },
    loadMore () {
      this.getLeagueList()
    },
    onItemClick (index) {
      // this.tabItem = index
      // if (index === 0 && this.list.length === 0) {
      //   this.getLeagueList()
      // } else if (index === 1) {
      //   this.getMyOrgListForLeagueCount()
      // } else {
      //   this.$nextTick(() => {
      //     this.$refs.scroller.donePullup()
      //     this.$refs.scroller.reset({top: 0})
      //   })
      // }
    },
    onTabClick (tabIndex) {
      this.tabItem = tabIndex
      if (tabIndex === 0) {
        this.tab1class = 'tab-item-sel'
        this.tab2class = 'tab-item'
      } else if (tabIndex === 1) {
        this.tab1class = 'tab-item'
        this.tab2class = 'tab-item-sel'
      }
    }
  }
}
</script>

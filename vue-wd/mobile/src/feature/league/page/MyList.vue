<template>
  <div>
    <flexbox style='height:50px;background:#fff;border-bottom: 1px solid #EDEDED' :gutter="0" >
      <flexbox-item :span="159/320"><div class="tab-item-sel">我创建的联盟</div></flexbox-item>
      <flexbox-item style="minWidth: 1px;"><div class="tab-divider"></div></flexbox-item>
      <flexbox-item :span="160/320" @click.native="selectManageLeagueTab()"><div class="tab-item">我管理的联盟</div></flexbox-item>
    </flexbox>
    <flexbox style="background:#fff" orient="vertical" :gutter="0" ref="headGroup">
      <flexbox-item>
        <flexbox style='align-items:flex-start'>
          <flexbox-item :span="30/320" style='text-align:center;'>
            <img :src="tools.cdn(null,'league_icon.png')" style='width:25px;margin-top:10px;margin-right:-10px'></img>
          </flexbox-item>
          <flexbox-item style='font-size:14px;margin:10px;'>
            群联盟可以帮您轻松方便的同时管理成千上百个成员群。管理员只需要在联盟管理中发起活动、直播等操作，同时成员群也开通该功能的情况下，该联盟中的所有成员群都会收到消息通知然后参与活动。
          </flexbox-item>
        </flexbox>
      </flexbox-item>
      <flexbox-item style='height:50px'>
        <x-button class="btn-item2" plain type="primary" @click.native="createLeague()">创建新联盟</x-button>
      </flexbox-item>
    </flexbox>
    <group style="margin-top:0px;background-color:#fff;">
      <tab :line-width="3" :custom-bar-width="getBarWidth" style='width:210px;margin-top:1px;margin-bottom:-1px'>
        <tab-item :selected="tabItem == 0" @on-item-click="onItemClick">我创建的联盟</tab-item>
        <tab-item :selected="tabItem == 1"@on-item-click="onItemClick">我加入联盟的群</tab-item>
      </tab>
    </group>
    <scroller style="background:#fff" use-pullup lock-x :height="scrollerHeight+''" ref="scroller" @on-pullup-loading="loadMore" v-model="status"
      :pullup-config="{content:'加载更多',downContent:'松开加载更多',upContent:'加载更多',loadingContent:'努力加载中...'}">
      <div>
        <cell v-if="tabItem===0" v-for="item in list" :key="item.leagueId" :title="item.leagueName" :inline-desc="item.desc" :link="{name:'leagueLeagueManagement',params:{leagueId:item.leagueId}}" >
          <span class="jhy-text-xs">管理</span>
          <x-img slot="icon" :src="tools.cdn(item.leagueLogo, 'logo.png', 128)" class="jhy-cell-img" error-class="org-cell-img-error"></x-img>
        </cell>
        <cell v-if="tabItem===1" v-for="(item, index) in orgList" :key="index" :title="item.orgName" :inline-desc="item.desc" @click.native="onOrgItemClick(index)" >
          <span class="jhy-text-xs">{{item.a}}</span>
          <x-img slot="icon" :src="tools.cdn(item.orgLogo, 'logo.png', 128)" class="jhy-cell-img" error-class="org-cell-img-error"></x-img>
        </cell>
      </div>
      <div slot="pullup" style="position: absolute; width: 100%; height: 40px; text-align: center; font-size:14px;margin-top:10px;color:#a2a2a2">
        <span v-show="status.pullupStatus === 'default'">{{ pullupStatusText }}</span>
        <span v-show="status.pullupStatus === 'loading'">加载中...</span>
      </div>
    </scroller>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, XButton, Flexbox, FlexboxItem, XImg, Tab, TabItem, Scroller, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/league/api'

export default {
  components: {
    Cell, Group, DetailTabbar, XButton, Flexbox, FlexboxItem, XImg, Tab, TabItem, Scroller, dateFormat
  },
  data () {
    return {
      tabItem: 0,
      index: 0,
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
      scrollerHeight: -200
    }
  },
  mounted () {
    this.scrollerHeight = -(this.$refs.headGroup.$el.clientHeight + 50 + 50 + 20)
    this.onItemClick(window.localStorage.getItem('leagueListIndex'))
  },
  methods: {
    createLeague () {
      this.$router.push({name: 'leagueCreateLeague'})
    },
    selectManageLeagueTab () {
      this.$router.replace({name: 'leagueManageList'})
    },
    onItemClick (index) {
      if (index === null) {
        index = 0
      }
      window.localStorage.setItem('leagueListIndex', index)
      this.tabItem = parseInt(index)
      if (this.tabItem === 0 && this.list.length === 0) {
        this.getLeagueList()
      } else if (this.tabItem === 1) {
        this.getMyOrgListForLeagueCount()
      } else {
        this.$nextTick(() => {
          this.$refs.scroller.donePullup()
          this.$refs.scroller.reset({top: 0})
        })
      }
    },
    loadMore () {
      this.getLeagueList()
    },
    getLeagueList () {
      api.getLeagueList({rowStart: this.list.length, rowCount: 20}, (data) => {
        var _list = []
        data.forEach((element) => {
          var o = {...element}
          o.desc = element.isPublic === false ? '自用联盟' : '公开联盟 ｜ 有效期：' + this.tools.computingDate(new Date().getTime(), o.expiryDate)
          _list.push(o)
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
    getMyOrgListForLeagueCount () {
      api.getMyOrgListForLeagueCount((data) => {
        data.forEach(function (element) {
          if (element.leagueNum > 0) {
            element.desc = '已加入' + element.leagueNum + '个联盟'
            element.a = '查看详情'
          } else {
            element.desc = '未加入群联盟'
            element.a = '立即加入联盟'
          }
        })
        data.sort((a, b) => b.leagueNum - a.leagueNum)
        this.orgList = data
        this.$nextTick(() => {
          this.$refs.scroller.donePullup()
          this.$refs.scroller.reset()
        })
      }, () => {})
    },
    onOrgItemClick (index) {
      var item = this.orgList[index]
      if (item.leagueNum > 0) {
        this.$router.push({name: 'leagueOrgLeagueList', params: {leagueOrgId: item.orgId}})
      } else {
        this.$router.push({name: 'leagueJoinLeague', params: {leagueOrgId: item.orgId}})
      }
    }
  }
}
</script>

<style>

.tab-item-sel {
  text-align: center;
  color: #A2D268;
  font-size: 16px;
}
.tab-item {
  text-align: center;
  color: #000;
  font-size: 16px;
}
.tab-divider {
  text-align: center;
  margin: 0 auto;
  background-color: #e5e5e5;
  width: 1px;
  height: 30px;
}
.btn-item2{
  width:130px !important; 
  height:36px; 
  line-height:36px;
  font-size: 15px;
  color: #8ebf52;
  border: 1px solid #8ebf52;
}
.org-cell-img-error {
  background-color: yellow;
  background:url("../../../assets/logo.png") center no-repeat;
}
</style>

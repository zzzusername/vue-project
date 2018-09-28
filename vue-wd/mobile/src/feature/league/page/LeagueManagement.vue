<template>
  <div>
    <group v-if="isMaster" title="联盟基础管理">
      <cell title="修改联盟信息" is-link :link="{name:'leagueModifyLeague'}"></cell>
      <cell title="功能设置" is-link :link="{name:'leagueFeatureSetting'}"></cell>
      <cell title="管理员设置" is-link :link="{name:'leagueAdminList'}"></cell>
      <cell title="联盟成员管理" is-link @click.native="onInvite"></cell>
    </group>
    <group title="联盟功能管理">
      <cell v-for="item in list" :title="item.fName" is-link :key="item" @click.native="onItemClick(item)">
        <span class="jhy-text-xs">{{item.text}}</span>
        <span slot="icon" class="league-icon-circle iconfont " v-bind:class="item.fIcon" v-bind:style="{ background:item.fColor}" style='margin-right:5px;'></span>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import { Cell, Group } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/league/api'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      Cell, Group, DetailTabbar
    },
    data () {
      return {
        list: [],
        leagueInfo: {},
        isAllowInvite: false
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      }),
      isMaster() {
        if (typeof (this.userInfo.userId) === 'undefined' || this.leagueInfo === null || typeof (this.leagueInfo.masterId) === 'undefined') {
          return false
        } else if (this.userInfo.userId === this.leagueInfo.masterId) {
          return true
        }
      }
    },
    mounted () {
      var leagueId = this.$route.params.leagueId
      api.getLeagueInfo({leagueId}, (info) => {
        this.leagueInfo = info
        api.getMyFeatureList({leagueId}, (data) => {
          if (this.leagueInfo.isPublic) {
            for (var i = data.length - 1; i >= 0; i--) {
              var element = data[i]
              if (element.fCode === 'JIFENSHANGCHENG') {
                data.splice(i, 1)
                continue
              }
              if (element.isExist) {
                element.text = '管理'
                this.isAllowInvite = true
              } else {
                element.text = '免费开启'
              }
            }
          } else {
            data.forEach((element) => {
              if (element.isExist) {
                element.text = '管理'
                this.isAllowInvite = true
              } else {
                element.text = '免费开启'
              }
            }, this)
          }
          this.list = data
        }, () => {})
      }, () => {})
    },
    methods: {
      onItemClick (item) {
        if (item.isExist) {
          // 进入管理
          var obj = JSON.parse(item.fManagerLeagueUrl)
          obj.params = {
            leagueId: this.$route.params.leagueId
          }
          console.log('leagueNoticeManage', obj)
          this.$router.push(obj)
          // this.$router.push({name: 'leagueActivityManage', params: {leagueId: this.$route.params.leagueId}})
        } else {
          // 开启功能
          this.$router.push({name: 'leagueFeatureSetting'})
        }
      },
      onInvite () {
        if (this.isAllowInvite) {
          this.$router.push({name: 'leagueMemberList'})
        } else {
          this.tools.warnToast('请先开启联盟功能', '160px')
        }
      }
    }
  }
</script>

<style>
.league-icon-circle {
	display: block;
	margin: auto;
	margin-bottom: 0.0rem;
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 5rem;
	text-align: center;
	line-height: 2.7rem;
	font-size: 1.4rem;
	color: #fff;
}
</style>


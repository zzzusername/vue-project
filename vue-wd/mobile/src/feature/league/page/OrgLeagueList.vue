<template>
  <div>
    <group>
      <cell title="加入更多联盟" is-link :link="{name: 'leagueJoinLeague'}"></cell>
    </group>
    <group :title="'已加入' + list.length +'个联盟'" >
      <cell v-for="(item, index) in list" :key="index" :title="item.leagueName" :inline-desc="item.desc" is-link @click.native="onItemClick(index)" >
        <span class="jhy-text-xs">已授权 {{item.featureCount}} 个功能</span>
        <x-img slot="icon" :src="tools.cdn(item.leagueLogo, 'logo.png', 128)" class="jhy-cell-img" error-class="league-cell-img-error"></x-img>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, XImg } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/league/api'

export default {
  components: {
    DetailTabbar,
    Group,
    Cell,
    XImg
  },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    var orgId = this.$route.params.leagueOrgId
    api.getLeagueByOrgId({orgId}, (data) => {
      this.list = data
      data.forEach(function (element) {
        // var type = element.isPublic ? '    开放联盟' : '    自用联盟'
        element.desc = '创建者：' + element.masterName
      })
    }, () => {})
  },
  methods: {
    onItemClick (index) {
      var leagueId = this.list[index].leagueId
      var leagueOrgId = this.$route.params.leagueOrgId
      this.$router.push({name: 'leagueAuthFeatureModify', params: {leagueOrgId, leagueId}})
    }
  }
}
</script>

<style>
.league-cell-img-error {
  background-image: url("../../../assets/logo.png") no-repeat;
  background-size: 100% 100% !important;
}
</style>

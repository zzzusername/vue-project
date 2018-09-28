<template>
  <div>
    <group :title="list.length>0?'请选择需要加入联盟的群':'您没有可加入联盟的群'">
      <cell v-for="(item,index) in list" :key="index" :title="item.orgName" @click.native="authFeature(item)">
        <span class="jhy-text-xs">加入联盟</span>
        <x-img slot="icon" :src="tools.cdn(item.orgLogo, 'logo.png', 128)" class="jhy-cell-img"></x-img>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import {Group, Cell, XImg} from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/league/api'

  export default {
    components: {
      Group,
      Cell,
      XImg,
      DetailTabbar
    },
    data () {
      return {
        list: []
      }
    },
    mounted () {
      api.getMyOrgListForLeagueId({leagueId: this.$route.params.leagueId}, (data) => {
        data.forEach((element) => {
          if (!element.isExist) {
            this.list.push(element)
          }
        })
      }, () => {})
    },
    methods: {
      authFeature (item) {
        this.$router.replace({name: 'leagueAuthFeature', params: {leagueOrgId: item.orgId, leagueId: this.$route.params.leagueId}})
      }
    }
  }
</script>

<template>
  <div>
    <flexbox v-show="$route.params.showTab!=1" style='height:50px; background:#fff; border-bottom:1px solid #ededed' :gutter="0">
      <flexbox-item :span="159/320" @click.native="selectMyLeagueTab()"><div class="tab-item">我创建的联盟</div></flexbox-item>
      <flexbox-item style="minWidth: 1px;"><div class="tab-divider"></div></flexbox-item>
      <flexbox-item :span="160/320"><div class="tab-item-sel">我管理的联盟</div></flexbox-item>
    </flexbox>
    <group>
      <cell v-for="item in list" :key="item.leagueId" :title="item.leagueName" :link="{name:'leagueLeagueManagement',params:{leagueId:item.leagueId}}" >
        <span class="jhy-text-xs">管理联盟</span>
        <x-img slot="icon" :src="tools.cdn(item.leagueLogo, 'logo.png', 128)" class="jhy-cell-img"></x-img>
      </cell>
    </group>
    <p v-if="list.length==0" style="textAlign:center;marginTop:10px;color:#999;font-size:14px">没有管理的联盟～</p>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, Flexbox, FlexboxItem, XImg } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/league/api'

export default {
  components: {
    Cell, Group, DetailTabbar, Flexbox, FlexboxItem, XImg
  },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    api.myManageLeagueList((data) => {
      this.list = data
    }, () => {})
  },
  methods: {
    selectMyLeagueTab () {
      this.$router.replace({name: 'leagueMyList'})
    }
  }
}
</script>

<style>

.tab-item-sel {
  text-align: center;
  color: #A2D268;
}
.tab-item {
  text-align: center;
  color: #000;
}
.tab-divider {
  text-align: center;
  margin: 0 auto;
  background-color: #e5e5e5;
  width: 1px;
  height: 30px;
}
</style>

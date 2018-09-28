<template>
  <div>
    <group :title="title">
      <x-switch v-for="item in authorizeList" :key="item.featureId" :title="item.fName" :inline-desc="item.desc" v-model="item.isExist"></x-switch>
    </group>
    <tabbar v-transfer-dom style="position:fixed">
      <tabbar-item @on-item-click="onBack()">
        <span slot="label" >返回</span>
      </tabbar-item>
      <tabbar-item @on-item-click="submitAuthorize()" style="background-color:#8ebf52">
        <span slot="label" style="color:#fff">修改</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import {Group, Cell, XImg, XSwitch, TransferDomDirective as TransferDom, Tabbar, TabbarItem} from 'vux'
  import api from '@/feature/league/api'
  import orgApi from '@/feature/org/api'

  export default {
    components: {
      Group,
      Cell,
      XImg,
      XSwitch,
      Tabbar,
      TabbarItem
    },
    data () {
      return {
        authorizeList: [],
        submitText: '',
        title: '选择群功能授权给群联盟'
      }
    },
    mounted () {
      orgApi.getOrgInfo({orgId: this.$route.params.leagueOrgId}, (data) => {
        this.title = '修改“' + data.orgName + '”的功能授权'
      }, () => {})
      api.getMemberFeatureList({orgId: this.$route.params.leagueOrgId, leagueId: this.$route.params.leagueId}, (data) => {
        this.authorizeList = data
      }, () => {})
    },
    methods: {
      submitAuthorize () {
        api.saveMemberAuth({leagueId: this.$route.params.leagueId, orgId: this.$route.params.leagueOrgId, data: this.authorizeList}, (responseData) => {
          if (responseData.rs === 1) {
            this.tools.successToast('修改成功')
            this.$router.back(-1)
          }
        }, () => {})
      },
      onBack () {
        this.$router.back()
      }
    },
    directives: {
      TransferDom
    }
  }
</script>

<style>
  .cell-img{
    display:block;
    margin-right:8px; 
    border-radius: 25px;
    width: 50px;
  }
</style>

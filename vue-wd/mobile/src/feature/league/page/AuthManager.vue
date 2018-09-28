<template>
  <div>
    <checklist style="marginBottom:42px;" label-position="left" :options="authorizeCheckList" v-model="selectAuthorizeList" @on-change="checkChange"></checklist>
    <!--<x-button style="position:fixed;left:0;bottom:0;border-radius:0;" type="primary" text="修改" @click.native="submitAuthorize"></x-button>-->
    <detail-tabbar :actionLink="submitAuthorize" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
  import { Checklist, XButton, Tabbar, TabbarItem, TransferDomDirective as TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/league/api'

  export default {
    components: {
      Checklist, XButton, Tabbar, TabbarItem, DetailTabbar
    },
    data () {
      return {
        authorizeCheckList: [],
        authorizeList: [],
        userId: this.$route.params.userId,
        selectAuthorizeList: [],
        checkAuthorizeList: [],
        submitBtnText: '添加',
        leagueId: 0,
        managerId: 0,
        actions: [{
          name: '修改权限',
          code: 'modify'
        }]
      }
    },
    mounted () {
      this.leagueId = this.$route.params.leagueId
      this.managerId = this.$route.params.leagueManagerId
      api.getAdminFeatureList({leagueId: this.leagueId, managerId: this.managerId}, (authorizeList) => {
        this.authorizeList = authorizeList
        for (var i = 0; i < authorizeList.length; i++) {
          var obj = {key: i, value: authorizeList[i].fName}
          this.authorizeCheckList.push(obj)
          if (authorizeList[i].isExist) {
            this.selectAuthorizeList.push(i)
          }
        }
      }, () => {})
    },
    methods: {
      checkChange (val) {
        this.checkAuthorizeList = val
      },
      submitAuthorize () {
        var data = this.authorizeList
        for (var i = 0; i < data.length; i++) {
          data[i].isExist = false
          for (var j = 0; j < this.checkAuthorizeList.length; j++) {
            if (i === this.checkAuthorizeList[j]) {
              data[i].isExist = true
            }
          }
        }
        console.log('data', data)
        api.saveAuth({leagueId: this.leagueId, managerId: this.managerId, data}, (responseData) => {
          if (responseData.rs === 1) {
            this.$router.back(-1)
          }
        }, () => {})
      },
      onBack () {
        this.$router.push({name: 'leagueAdminList'})
      }
    },
    directives: {
      TransferDom
    }
  }
</script>

<style>
  .authorize_list_li {
    height: 44px;
  }
  .authorize_list_name {
  }
</style>

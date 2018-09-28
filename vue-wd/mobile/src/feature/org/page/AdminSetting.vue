<template>
  <div>
    <group>
      <cell title="添加管理员" is-link :link="{name: 'orgAddAdmin'}"></cell>
    </group>
    <group v-if="manageList !== null && manageList.length > 0" title="管理员">
      <cell v-for="item in manageList" :key="item.userId" :title="item.userName" :inline-desc="item.levelName" :link="{name: 'orgAuthorizeManage', params: {userId: item.userId}}">
        <img slot="icon" width="40" style="display:block;margin-right:5px;" :src="tools.cdn(item.userIcon)">
      </cell>
    </group>
    <detail-tabbar ></detail-tabbar>
  </div>
</template>

<script>
  import { Cell, Group } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/org/api'
  export default {
    components: {
      Cell, Group, DetailTabbar
    },
    data () {
      return {
        manageList: null
      }
    },
    mounted () {
      var orgId = this.$route.params.orgManagementId
      api.getManageList({orgId}, (manageList) => {
        this.manageList = manageList
        console.log('adminsetting', manageList)
      }, () => {})
    }
  }
</script>

<style>

</style>

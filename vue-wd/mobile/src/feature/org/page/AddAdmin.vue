<template>
  <div>
    <user-list :org-id="$route.params.orgManagementId" btn-value="添加" ignoreManager="true" @item-btn-click="itemBtnClick"></user-list>
    <detail-tabbar ></detail-tabbar>
  </div>
</template>

<script>
  import UserList from '../components/UserList'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  export default {
    components: {
      UserList,
      DetailTabbar
    },
    data () {
      return {
      }
    },
    methods: {
      itemBtnClick (val) {
        console.log('btnclick', val)
        this.$router.push({name: 'orgAuthorizeManage', params: { userId: val.userId }})
      }
    }
  }
</script>

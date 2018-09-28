<template>
  <div>
    <group>
      <cell v-for="(item, index) in userManageList" :title="item.name" is-link :key="index" :link="item.skipRouter"></cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import { Cell, Group } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  export default {
    components: {
      Cell, Group, DetailTabbar
    },
    data () {
      return {
        userManageList: [
          {
            name: '用户成长等级设置',
            skipRouter: {name: 'orgSetLevel'}
          },
          {
            name: 'VIP设置',
            skipRouter: {name: 'orgVipSetting'}
          },
          {
            name: '管理员设置',
            skipRouter: {name: 'orgAdminSetting'}
          },
          {
            name: '积分规则设置',
            skipRouter: {name: 'orgIntegralRules'}
          },
          {
            name: '手动修改积分',
            skipRouter: {name: 'orgModifyUserIntegral'}
          }]
      }
    }
  }
</script>

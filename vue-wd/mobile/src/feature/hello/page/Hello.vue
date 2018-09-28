<template>
    <div>
      <org-hand></org-hand>
      <keep-alive>
      <router-view></router-view>
      </keep-alive>
      <router-link to="/app/1/hello">home</router-link>
      <router-link to="/app/1/hello/list">list</router-link>
      <router-link to="/app/2/hello/list1">list1</router-link>
      <router-link to="/app/2/hello/list2">list2</router-link>
      <router-link to="/app/3/hello/edit">edit</router-link>
      <br>
      
   </div>
</template>

<script>
import OrgHand from '@/feature/org/components/OrgHand.vue'

export default {
  name: 'hello',
  watch: {
    '$route' (to, from) {
      console.log('组件内检测路由' + to.paht)
    }
  },
  components: {
    OrgHand
  }
}
</script>
<style>

</style>
